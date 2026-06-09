"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Plus, Save, Trash2, ClipboardCheck, CheckCircle2, History, AlertTriangle } from "lucide-react";

// Poka-yoke device registration type
interface PokaYokeDevice {
  id: number;
  deviceNo: string; // 장치번호
  registrationDate: string; // 등록일
  processName: string; // 공정명
  equipment: string; // 설비
  deviceName: string; // 장치명
  deviceType: "sensor" | "jig" | "guide" | "other"; // 장치유형 (센서/지그/가이드/기타)
  defectTarget: string; // 검출대상 불량
  operationMethod: "stop" | "alarm" | "sort"; // 작동방식 (정지/경보/분류)
}

// Inspection management type
interface InspectionRecord {
  id: number;
  deviceId: number;
  deviceNo: string;
  inspectionCycle: string; // 점검주기
  inspectionMethod: string; // 점검방법
  inspectionDate: string; // 점검일
  inspectionResult: "pass" | "fail" | "conditional"; // 점검결과
  inspector: string; // 점검자
  abnormalAction: string; // 이상 시 조치
  remarks: string; // 비고
}

// Validation record type
interface ValidationRecord {
  id: number;
  deviceId: number;
  deviceNo: string;
  validationDate: string; // 검증일
  validationMethod: string; // 검증방법 (마스터 샘플 테스트)
  validationResult: string; // 검증결과
  passFailStatus: "pass" | "fail"; // 합격/불합격
  validator: string; // 검증자
  nextValidationDate: string; // 다음 검증예정일
  remarks: string; // 비고
}

// History record type
interface HistoryRecord {
  id: number;
  deviceId: number;
  deviceNo: string;
  recordDate: string; // 기록일
  recordType: "registration" | "inspection" | "validation" | "modification" | "repair" | "disposal"; // 기록유형
  description: string; // 내용
  performedBy: string; // 수행자
  remarks: string; // 비고
}

// Device type labels
const deviceTypeLabels: Record<string, string> = {
  sensor: "센서",
  jig: "지그",
  guide: "가이드",
  other: "기타",
};

// Operation method labels
const operationMethodLabels: Record<string, string> = {
  stop: "정지",
  alarm: "경보",
  sort: "분류",
};

// Record type labels
const recordTypeLabels: Record<string, string> = {
  registration: "등록",
  inspection: "점검",
  validation: "검증",
  modification: "수정",
  repair: "수리",
  disposal: "폐기",
};

// Sample initial data
const initialDevices: PokaYokeDevice[] = [
  {
    id: 1,
    deviceNo: "PY-2026-001",
    registrationDate: "2026-01-15",
    processName: "사출 성형",
    equipment: "INJ-001",
    deviceName: "부품 유무 센서",
    deviceType: "sensor",
    defectTarget: "부품 미삽입",
    operationMethod: "stop",
  },
  {
    id: 2,
    deviceNo: "PY-2026-002",
    registrationDate: "2026-02-20",
    processName: "조립",
    equipment: "ASS-003",
    deviceName: "조립 위치 가이드",
    deviceType: "guide",
    defectTarget: "역조립, 오조립",
    operationMethod: "stop",
  },
  {
    id: 3,
    deviceNo: "PY-2026-003",
    registrationDate: "2026-03-10",
    processName: "검사",
    equipment: "INS-002",
    deviceName: "치수 검사 지그",
    deviceType: "jig",
    defectTarget: "치수 불량",
    operationMethod: "sort",
  },
  {
    id: 4,
    deviceNo: "PY-2026-004",
    registrationDate: "2026-04-05",
    processName: "용접",
    equipment: "WLD-001",
    deviceName: "용접 위치 센서",
    deviceType: "sensor",
    defectTarget: "용접 위치 이탈",
    operationMethod: "alarm",
  },
];

const initialInspections: InspectionRecord[] = [
  {
    id: 1,
    deviceId: 1,
    deviceNo: "PY-2026-001",
    inspectionCycle: "일간",
    inspectionMethod: "작동 테스트",
    inspectionDate: "2026-06-10",
    inspectionResult: "pass",
    inspector: "김철수",
    abnormalAction: "-",
    remarks: "정상 작동",
  },
  {
    id: 2,
    deviceId: 2,
    deviceNo: "PY-2026-002",
    inspectionCycle: "주간",
    inspectionMethod: "육안 검사 및 작동 확인",
    inspectionDate: "2026-06-08",
    inspectionResult: "pass",
    inspector: "이영희",
    abnormalAction: "-",
    remarks: "가이드 마모 상태 양호",
  },
  {
    id: 3,
    deviceId: 3,
    deviceNo: "PY-2026-003",
    inspectionCycle: "주간",
    inspectionMethod: "마스터 게이지 확인",
    inspectionDate: "2026-06-05",
    inspectionResult: "conditional",
    inspector: "박민준",
    abnormalAction: "지그 미세 조정 실시",
    remarks: "조정 후 재검사 필요",
  },
];

const initialValidations: ValidationRecord[] = [
  {
    id: 1,
    deviceId: 1,
    deviceNo: "PY-2026-001",
    validationDate: "2026-05-15",
    validationMethod: "마스터 샘플 테스트 (OK/NG 샘플)",
    validationResult: "OK/NG 샘플 모두 정확히 검출",
    passFailStatus: "pass",
    validator: "품질팀 김과장",
    nextValidationDate: "2026-08-15",
    remarks: "3개월 주기 검증",
  },
  {
    id: 2,
    deviceId: 2,
    deviceNo: "PY-2026-002",
    validationDate: "2026-04-20",
    validationMethod: "마스터 샘플 테스트",
    validationResult: "역조립 검출 100%",
    passFailStatus: "pass",
    validator: "품질팀 이대리",
    nextValidationDate: "2026-07-20",
    remarks: "",
  },
];

const initialHistory: HistoryRecord[] = [
  {
    id: 1,
    deviceId: 1,
    deviceNo: "PY-2026-001",
    recordDate: "2026-01-15",
    recordType: "registration",
    description: "신규 폴리요케 장치 등록",
    performedBy: "생산기술팀",
    remarks: "사출 공정 부품 유무 검출용",
  },
  {
    id: 2,
    deviceId: 1,
    deviceNo: "PY-2026-001",
    recordDate: "2026-03-20",
    recordType: "repair",
    description: "센서 교체 (감도 저하)",
    performedBy: "설비팀",
    remarks: "동일 모델로 교체",
  },
  {
    id: 3,
    deviceId: 2,
    deviceNo: "PY-2026-002",
    recordDate: "2026-02-20",
    recordType: "registration",
    description: "신규 폴리요케 장치 등록",
    performedBy: "생산기술팀",
    remarks: "조립 공정 역조립 방지용",
  },
  {
    id: 4,
    deviceId: 3,
    deviceNo: "PY-2026-003",
    recordDate: "2026-06-05",
    recordType: "modification",
    description: "지그 미세 조정",
    performedBy: "품질팀",
    remarks: "점검 시 발견된 편차 조정",
  },
];

export default function PokaYokePage() {
  const [activeTab, setActiveTab] = useState("registration");

  // Device registration state
  const [devices, setDevices] = useState<PokaYokeDevice[]>(initialDevices);
  const [newDevice, setNewDevice] = useState<Omit<PokaYokeDevice, "id">>({
    deviceNo: "",
    registrationDate: "",
    processName: "",
    equipment: "",
    deviceName: "",
    deviceType: "sensor",
    defectTarget: "",
    operationMethod: "stop",
  });

  // Inspection records state
  const [inspections, setInspections] = useState<InspectionRecord[]>(initialInspections);
  const [newInspection, setNewInspection] = useState<Omit<InspectionRecord, "id">>({
    deviceId: 0,
    deviceNo: "",
    inspectionCycle: "",
    inspectionMethod: "",
    inspectionDate: "",
    inspectionResult: "pass",
    inspector: "",
    abnormalAction: "",
    remarks: "",
  });

  // Validation records state
  const [validations, setValidations] = useState<ValidationRecord[]>(initialValidations);
  const [newValidation, setNewValidation] = useState<Omit<ValidationRecord, "id">>({
    deviceId: 0,
    deviceNo: "",
    validationDate: "",
    validationMethod: "마스터 샘플 테스트",
    validationResult: "",
    passFailStatus: "pass",
    validator: "",
    nextValidationDate: "",
    remarks: "",
  });

  // History records state
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(initialHistory);

  // Statistics
  const stats = useMemo(() => {
    const totalDevices = devices.length;
    const byType = {
      sensor: devices.filter((d) => d.deviceType === "sensor").length,
      jig: devices.filter((d) => d.deviceType === "jig").length,
      guide: devices.filter((d) => d.deviceType === "guide").length,
      other: devices.filter((d) => d.deviceType === "other").length,
    };
    const recentInspections = inspections.filter((i) => {
      const inspDate = new Date(i.inspectionDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return inspDate >= thirtyDaysAgo;
    }).length;
    const failedInspections = inspections.filter((i) => i.inspectionResult === "fail").length;
    const passedValidations = validations.filter((v) => v.passFailStatus === "pass").length;
    const failedValidations = validations.filter((v) => v.passFailStatus === "fail").length;

    return {
      totalDevices,
      byType,
      recentInspections,
      failedInspections,
      passedValidations,
      failedValidations,
      validationRate: validations.length > 0 ? Math.round((passedValidations / validations.length) * 100) : 0,
    };
  }, [devices, inspections, validations]);

  // Device handlers
  const addDevice = () => {
    if (!newDevice.deviceNo || !newDevice.deviceName) {
      alert("장치번호와 장치명은 필수 입력 항목입니다.");
      return;
    }
    const device: PokaYokeDevice = {
      id: Date.now(),
      ...newDevice,
    };
    setDevices([...devices, device]);

    // Add to history
    const historyRecord: HistoryRecord = {
      id: Date.now() + 1,
      deviceId: device.id,
      deviceNo: device.deviceNo,
      recordDate: device.registrationDate || new Date().toISOString().split("T")[0],
      recordType: "registration",
      description: `신규 폴리요케 장치 등록 - ${device.deviceName}`,
      performedBy: "",
      remarks: `공정: ${device.processName}, 설비: ${device.equipment}`,
    };
    setHistoryRecords([historyRecord, ...historyRecords]);

    setNewDevice({
      deviceNo: "",
      registrationDate: "",
      processName: "",
      equipment: "",
      deviceName: "",
      deviceType: "sensor",
      defectTarget: "",
      operationMethod: "stop",
    });
  };

  const removeDevice = (id: number) => {
    if (!confirm("이 폴리요케 장치를 삭제하시겠습니까?")) return;
    setDevices(devices.filter((d) => d.id !== id));
  };

  // Inspection handlers
  const addInspection = () => {
    if (!newInspection.deviceNo || !newInspection.inspectionDate) {
      alert("장치번호와 점검일은 필수 입력 항목입니다.");
      return;
    }
    const device = devices.find((d) => d.deviceNo === newInspection.deviceNo);
    const inspection: InspectionRecord = {
      id: Date.now(),
      ...newInspection,
      deviceId: device?.id || 0,
    };
    setInspections([inspection, ...inspections]);

    // Add to history
    const historyRecord: HistoryRecord = {
      id: Date.now() + 1,
      deviceId: inspection.deviceId,
      deviceNo: inspection.deviceNo,
      recordDate: inspection.inspectionDate,
      recordType: "inspection",
      description: `점검 실시 - 결과: ${inspection.inspectionResult === "pass" ? "합격" : inspection.inspectionResult === "fail" ? "불합격" : "조건부"}`,
      performedBy: inspection.inspector,
      remarks: inspection.abnormalAction !== "-" ? `조치: ${inspection.abnormalAction}` : "",
    };
    setHistoryRecords([historyRecord, ...historyRecords]);

    setNewInspection({
      deviceId: 0,
      deviceNo: "",
      inspectionCycle: "",
      inspectionMethod: "",
      inspectionDate: "",
      inspectionResult: "pass",
      inspector: "",
      abnormalAction: "",
      remarks: "",
    });
  };

  const removeInspection = (id: number) => {
    setInspections(inspections.filter((i) => i.id !== id));
  };

  // Validation handlers
  const addValidation = () => {
    if (!newValidation.deviceNo || !newValidation.validationDate) {
      alert("장치번호와 검증일은 필수 입력 항목입니다.");
      return;
    }
    const device = devices.find((d) => d.deviceNo === newValidation.deviceNo);
    const validation: ValidationRecord = {
      id: Date.now(),
      ...newValidation,
      deviceId: device?.id || 0,
    };
    setValidations([validation, ...validations]);

    // Add to history
    const historyRecord: HistoryRecord = {
      id: Date.now() + 1,
      deviceId: validation.deviceId,
      deviceNo: validation.deviceNo,
      recordDate: validation.validationDate,
      recordType: "validation",
      description: `유효성 검증 실시 - 결과: ${validation.passFailStatus === "pass" ? "합격" : "불합격"}`,
      performedBy: validation.validator,
      remarks: validation.validationResult,
    };
    setHistoryRecords([historyRecord, ...historyRecords]);

    setNewValidation({
      deviceId: 0,
      deviceNo: "",
      validationDate: "",
      validationMethod: "마스터 샘플 테스트",
      validationResult: "",
      passFailStatus: "pass",
      validator: "",
      nextValidationDate: "",
      remarks: "",
    });
  };

  const removeValidation = (id: number) => {
    setValidations(validations.filter((v) => v.id !== id));
  };

  // Get badge variants
  const getInspectionResultBadge = (result: string) => {
    switch (result) {
      case "pass":
        return <Badge variant="success">합격</Badge>;
      case "fail":
        return <Badge variant="error">불합격</Badge>;
      case "conditional":
        return <Badge variant="warning">조건부</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getValidationStatusBadge = (status: string) => {
    return status === "pass" ? (
      <Badge variant="success">합격</Badge>
    ) : (
      <Badge variant="error">불합격</Badge>
    );
  };

  const getRecordTypeBadge = (type: string) => {
    switch (type) {
      case "registration":
        return <Badge variant="outline">등록</Badge>;
      case "inspection":
        return <Badge variant="secondary">점검</Badge>;
      case "validation":
        return <Badge variant="success">검증</Badge>;
      case "modification":
        return <Badge variant="warning">수정</Badge>;
      case "repair":
        return <Badge variant="warning">수리</Badge>;
      case "disposal":
        return <Badge variant="error">폐기</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getDeviceTypeBadge = (type: string) => {
    switch (type) {
      case "sensor":
        return <Badge variant="outline">센서</Badge>;
      case "jig":
        return <Badge variant="secondary">지그</Badge>;
      case "guide":
        return <Badge>가이드</Badge>;
      case "other":
        return <Badge variant="outline">기타</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getOperationMethodBadge = (method: string) => {
    switch (method) {
      case "stop":
        return <Badge variant="error">정지</Badge>;
      case "alarm":
        return <Badge variant="warning">경보</Badge>;
      case "sort":
        return <Badge variant="success">분류</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  // Save all handler
  const handleSaveAll = () => {
    console.log("Saving poka-yoke data:", {
      devices,
      inspections,
      validations,
      historyRecords,
    });
    alert("폴리요케 데이터가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            폴리요케 관리 (Poka-Yoke)
          </h1>
          <p className="text-muted-foreground">
            IATF 16949 실수방지장치 등록, 점검, 유효성 검증 관리
          </p>
        </div>
        <Button onClick={handleSaveAll}>
          <Save className="mr-2 h-4 w-4" />
          전체 저장
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">등록 장치</p>
                <p className="text-2xl font-bold">{stats.totalDevices}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">센서/지그/가이드</p>
                <p className="text-2xl font-bold">
                  {stats.byType.sensor}/{stats.byType.jig}/{stats.byType.guide}
                </p>
              </div>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">센서</Badge>
                <Badge variant="secondary" className="text-xs">지그</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">최근 점검 (30일)</p>
                <p className="text-2xl font-bold">{stats.recentInspections}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">검증 합격률</p>
                <p className="text-2xl font-bold text-green-600">{stats.validationRate}%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">점검 이상</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedInspections}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">
            <Shield className="mr-2 h-4 w-4" />
            폴리요케 등록
          </TabsTrigger>
          <TabsTrigger value="inspection">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            점검 관리
          </TabsTrigger>
          <TabsTrigger value="validation">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            유효성 검증
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            폴리요케 이력
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Poka-yoke Registration */}
        <TabsContent value="registration" className="space-y-6">
          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                신규 폴리요케 등록
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>장치번호 *</Label>
                  <Input
                    value={newDevice.deviceNo}
                    onChange={(e) => setNewDevice({ ...newDevice, deviceNo: e.target.value })}
                    placeholder="PY-2026-005"
                  />
                </div>
                <div className="space-y-2">
                  <Label>등록일</Label>
                  <Input
                    type="date"
                    value={newDevice.registrationDate}
                    onChange={(e) => setNewDevice({ ...newDevice, registrationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>공정명</Label>
                  <Input
                    value={newDevice.processName}
                    onChange={(e) => setNewDevice({ ...newDevice, processName: e.target.value })}
                    placeholder="사출 성형"
                  />
                </div>
                <div className="space-y-2">
                  <Label>설비</Label>
                  <Input
                    value={newDevice.equipment}
                    onChange={(e) => setNewDevice({ ...newDevice, equipment: e.target.value })}
                    placeholder="INJ-001"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4 mt-4">
                <div className="space-y-2">
                  <Label>장치명 *</Label>
                  <Input
                    value={newDevice.deviceName}
                    onChange={(e) => setNewDevice({ ...newDevice, deviceName: e.target.value })}
                    placeholder="부품 유무 센서"
                  />
                </div>
                <div className="space-y-2">
                  <Label>장치유형</Label>
                  <Select
                    value={newDevice.deviceType}
                    onValueChange={(v) => setNewDevice({ ...newDevice, deviceType: v as PokaYokeDevice["deviceType"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sensor">센서</SelectItem>
                      <SelectItem value="jig">지그</SelectItem>
                      <SelectItem value="guide">가이드</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검출대상 불량</Label>
                  <Input
                    value={newDevice.defectTarget}
                    onChange={(e) => setNewDevice({ ...newDevice, defectTarget: e.target.value })}
                    placeholder="부품 미삽입"
                  />
                </div>
                <div className="space-y-2">
                  <Label>작동방식</Label>
                  <Select
                    value={newDevice.operationMethod}
                    onValueChange={(v) => setNewDevice({ ...newDevice, operationMethod: v as PokaYokeDevice["operationMethod"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stop">정지</SelectItem>
                      <SelectItem value="alarm">경보</SelectItem>
                      <SelectItem value="sort">분류</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={addDevice}>
                  <Plus className="mr-2 h-4 w-4" />
                  등록
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Device List */}
          <Card>
            <CardHeader>
              <CardTitle>등록된 폴리요케 목록 ({devices.length}건)</CardTitle>
            </CardHeader>
            <CardContent>
              {devices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 폴리요케 장치가 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>장치번호</TableHead>
                      <TableHead>등록일</TableHead>
                      <TableHead>공정명</TableHead>
                      <TableHead>설비</TableHead>
                      <TableHead>장치명</TableHead>
                      <TableHead>장치유형</TableHead>
                      <TableHead>검출대상 불량</TableHead>
                      <TableHead>작동방식</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-mono font-medium">{device.deviceNo}</TableCell>
                        <TableCell>{device.registrationDate}</TableCell>
                        <TableCell>{device.processName}</TableCell>
                        <TableCell>{device.equipment}</TableCell>
                        <TableCell>{device.deviceName}</TableCell>
                        <TableCell>{getDeviceTypeBadge(device.deviceType)}</TableCell>
                        <TableCell>{device.defectTarget}</TableCell>
                        <TableCell>{getOperationMethodBadge(device.operationMethod)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeDevice(device.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Inspection Management */}
        <TabsContent value="inspection" className="space-y-6">
          {/* Inspection Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                점검 기록 추가
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>장치번호 *</Label>
                  <Select
                    value={newInspection.deviceNo}
                    onValueChange={(v) => setNewInspection({ ...newInspection, deviceNo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="장치 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((d) => (
                        <SelectItem key={d.id} value={d.deviceNo}>
                          {d.deviceNo} - {d.deviceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검주기</Label>
                  <Select
                    value={newInspection.inspectionCycle}
                    onValueChange={(v) => setNewInspection({ ...newInspection, inspectionCycle: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="주기 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="일간">일간</SelectItem>
                      <SelectItem value="주간">주간</SelectItem>
                      <SelectItem value="월간">월간</SelectItem>
                      <SelectItem value="분기">분기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>점검일 *</Label>
                  <Input
                    type="date"
                    value={newInspection.inspectionDate}
                    onChange={(e) => setNewInspection({ ...newInspection, inspectionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검자</Label>
                  <Input
                    value={newInspection.inspector}
                    onChange={(e) => setNewInspection({ ...newInspection, inspector: e.target.value })}
                    placeholder="점검자명"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4 mt-4">
                <div className="space-y-2">
                  <Label>점검방법</Label>
                  <Input
                    value={newInspection.inspectionMethod}
                    onChange={(e) => setNewInspection({ ...newInspection, inspectionMethod: e.target.value })}
                    placeholder="작동 테스트"
                  />
                </div>
                <div className="space-y-2">
                  <Label>점검결과</Label>
                  <Select
                    value={newInspection.inspectionResult}
                    onValueChange={(v) => setNewInspection({ ...newInspection, inspectionResult: v as InspectionRecord["inspectionResult"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pass">합격</SelectItem>
                      <SelectItem value="fail">불합격</SelectItem>
                      <SelectItem value="conditional">조건부</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>이상 시 조치</Label>
                  <Input
                    value={newInspection.abnormalAction}
                    onChange={(e) => setNewInspection({ ...newInspection, abnormalAction: e.target.value })}
                    placeholder="조치 내용"
                  />
                </div>
                <div className="space-y-2">
                  <Label>비고</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newInspection.remarks}
                      onChange={(e) => setNewInspection({ ...newInspection, remarks: e.target.value })}
                      placeholder="비고"
                    />
                    <Button onClick={addInspection}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inspection Records List */}
          <Card>
            <CardHeader>
              <CardTitle>점검 기록 ({inspections.length}건)</CardTitle>
            </CardHeader>
            <CardContent>
              {inspections.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 점검 기록이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>장치번호</TableHead>
                      <TableHead>점검주기</TableHead>
                      <TableHead>점검방법</TableHead>
                      <TableHead>점검일</TableHead>
                      <TableHead>점검결과</TableHead>
                      <TableHead>점검자</TableHead>
                      <TableHead>이상 시 조치</TableHead>
                      <TableHead>비고</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inspections.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.deviceNo}</TableCell>
                        <TableCell>{record.inspectionCycle}</TableCell>
                        <TableCell>{record.inspectionMethod}</TableCell>
                        <TableCell>{record.inspectionDate}</TableCell>
                        <TableCell>{getInspectionResultBadge(record.inspectionResult)}</TableCell>
                        <TableCell>{record.inspector}</TableCell>
                        <TableCell>{record.abnormalAction}</TableCell>
                        <TableCell>{record.remarks}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeInspection(record.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Validation */}
        <TabsContent value="validation" className="space-y-6">
          {/* Validation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                유효성 검증 기록 추가
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>장치번호 *</Label>
                  <Select
                    value={newValidation.deviceNo}
                    onValueChange={(v) => setNewValidation({ ...newValidation, deviceNo: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="장치 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.map((d) => (
                        <SelectItem key={d.id} value={d.deviceNo}>
                          {d.deviceNo} - {d.deviceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검증일 *</Label>
                  <Input
                    type="date"
                    value={newValidation.validationDate}
                    onChange={(e) => setNewValidation({ ...newValidation, validationDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>검증방법</Label>
                  <Select
                    value={newValidation.validationMethod}
                    onValueChange={(v) => setNewValidation({ ...newValidation, validationMethod: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="마스터 샘플 테스트">마스터 샘플 테스트</SelectItem>
                      <SelectItem value="OK/NG 샘플 테스트">OK/NG 샘플 테스트</SelectItem>
                      <SelectItem value="경계 샘플 테스트">경계 샘플 테스트</SelectItem>
                      <SelectItem value="기능 테스트">기능 테스트</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>검증자</Label>
                  <Input
                    value={newValidation.validator}
                    onChange={(e) => setNewValidation({ ...newValidation, validator: e.target.value })}
                    placeholder="검증자명"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4 mt-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>검증결과</Label>
                  <Textarea
                    value={newValidation.validationResult}
                    onChange={(e) => setNewValidation({ ...newValidation, validationResult: e.target.value })}
                    placeholder="OK/NG 샘플 모두 정확히 검출"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>합격/불합격</Label>
                  <Select
                    value={newValidation.passFailStatus}
                    onValueChange={(v) => setNewValidation({ ...newValidation, passFailStatus: v as ValidationRecord["passFailStatus"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pass">합격</SelectItem>
                      <SelectItem value="fail">불합격</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>다음 검증예정일</Label>
                  <Input
                    type="date"
                    value={newValidation.nextValidationDate}
                    onChange={(e) => setNewValidation({ ...newValidation, nextValidationDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={addValidation}>
                  <Plus className="mr-2 h-4 w-4" />
                  등록
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Validation Records List */}
          <Card>
            <CardHeader>
              <CardTitle>유효성 검증 기록 ({validations.length}건)</CardTitle>
            </CardHeader>
            <CardContent>
              {validations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 유효성 검증 기록이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>장치번호</TableHead>
                      <TableHead>검증일</TableHead>
                      <TableHead>검증방법</TableHead>
                      <TableHead>검증결과</TableHead>
                      <TableHead>합격/불합격</TableHead>
                      <TableHead>검증자</TableHead>
                      <TableHead>다음 검증예정일</TableHead>
                      <TableHead>비고</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validations.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.deviceNo}</TableCell>
                        <TableCell>{record.validationDate}</TableCell>
                        <TableCell>{record.validationMethod}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.validationResult}</TableCell>
                        <TableCell>{getValidationStatusBadge(record.passFailStatus)}</TableCell>
                        <TableCell>{record.validator}</TableCell>
                        <TableCell>{record.nextValidationDate}</TableCell>
                        <TableCell>{record.remarks}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeValidation(record.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Validation Guide */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm">IATF 16949 폴리요케 유효성 검증 가이드</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>1. 마스터 샘플 테스트: OK 샘플과 NG 샘플을 사용하여 폴리요케 장치의 검출 능력을 검증합니다.</p>
              <p>2. 검증 주기: 일반적으로 분기별 또는 중요도에 따라 월간 검증을 실시합니다.</p>
              <p>3. 불합격 시 조치: 장치 조정, 수리, 또는 교체 후 재검증을 실시합니다.</p>
              <p>4. 기록 보관: 모든 검증 기록은 최소 3년간 보관해야 합니다.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: History */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                폴리요케 이력 ({historyRecords.length}건)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>등록된 이력이 없습니다.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>기록일</TableHead>
                      <TableHead>장치번호</TableHead>
                      <TableHead>기록유형</TableHead>
                      <TableHead>내용</TableHead>
                      <TableHead>수행자</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRecords
                      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime())
                      .map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.recordDate}</TableCell>
                          <TableCell className="font-mono">{record.deviceNo}</TableCell>
                          <TableCell>{getRecordTypeBadge(record.recordType)}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell>{record.performedBy || "-"}</TableCell>
                          <TableCell>{record.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* History Summary by Device */}
          <Card>
            <CardHeader>
              <CardTitle>장치별 이력 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {devices.map((device) => {
                  const deviceHistory = historyRecords.filter((h) => h.deviceNo === device.deviceNo);
                  const lastInspection = inspections
                    .filter((i) => i.deviceNo === device.deviceNo)
                    .sort((a, b) => new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime())[0];
                  const lastValidation = validations
                    .filter((v) => v.deviceNo === device.deviceNo)
                    .sort((a, b) => new Date(b.validationDate).getTime() - new Date(a.validationDate).getTime())[0];

                  return (
                    <Card key={device.id} className="border">
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-medium">{device.deviceNo}</span>
                          {getDeviceTypeBadge(device.deviceType)}
                        </div>
                        <p className="text-sm text-muted-foreground">{device.deviceName}</p>
                        <div className="text-xs space-y-1 pt-2 border-t">
                          <p>
                            <span className="text-muted-foreground">이력 건수:</span> {deviceHistory.length}건
                          </p>
                          <p>
                            <span className="text-muted-foreground">최근 점검:</span>{" "}
                            {lastInspection ? lastInspection.inspectionDate : "-"}
                          </p>
                          <p>
                            <span className="text-muted-foreground">최근 검증:</span>{" "}
                            {lastValidation ? lastValidation.validationDate : "-"}
                          </p>
                          {lastValidation && (
                            <p>
                              <span className="text-muted-foreground">검증상태:</span>{" "}
                              {getValidationStatusBadge(lastValidation.passFailStatus)}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
