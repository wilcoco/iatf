"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gauge,
  Plus,
  Save,
  Search,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";
import { getInstruments, type Instrument as MasterInstrument } from "@/lib/master-data";

// Types
interface Equipment {
  id: number;
  managementNo: string; // 관리번호
  equipmentName: string; // 계측기명
  model: string; // 모델
  manufacturer: string; // 제조사
  purchaseDate: string; // 구입일
  measurementRange: string; // 계측범위
  accuracy: string; // 정밀도
  department: string; // 사용부서
  storageLocation: string; // 보관위치
  calibrationCycle: number; // 교정주기 (개월)
  lastCalibrationDate: string; // 최종교정일
  nextCalibrationDate: string; // 차기교정예정일
  calibrationAgency: string; // 교정기관
  certificateNo: string; // 교정성적서 번호
  status: "사용중" | "교정중" | "폐기" | "수리중"; // 계측기 상태
}

interface CalibrationHistory {
  id: number;
  equipmentId: number;
  calibrationDate: string; // 교정일
  result: "합격" | "불합격" | "조정후합격"; // 교정결과
  certificateNo: string; // 교정성적서
  remarks: string; // 비고
}

// Helper function to convert master data instruments to local Equipment format
function convertMasterInstrumentsToEquipments(masterInstruments: MasterInstrument[]): Equipment[] {
  const statusMap: Record<MasterInstrument["status"], Equipment["status"]> = {
    "사용중": "사용중",
    "검교정중": "교정중",
    "보관": "사용중", // Treat as available
    "폐기": "폐기",
  };

  return masterInstruments.map((inst) => ({
    id: inst.id,
    managementNo: inst.code,
    equipmentName: inst.name,
    model: inst.model,
    manufacturer: inst.manufacturer,
    purchaseDate: "", // Not available in master data
    measurementRange: inst.spec,
    accuracy: "", // Not available in master data (could parse from spec)
    department: inst.location,
    storageLocation: inst.location,
    calibrationCycle: inst.calibrationCycle,
    lastCalibrationDate: inst.lastCalibrationDate,
    nextCalibrationDate: inst.nextCalibrationDate,
    calibrationAgency: "사외", // Default value
    certificateNo: "", // Not available in master data
    status: statusMap[inst.status] || "사용중",
  }));
}

// Get initial equipments from master data
const masterInstrumentData = getInstruments();
const initialEquipments: Equipment[] = convertMasterInstrumentsToEquipments(masterInstrumentData);

const initialHistories: CalibrationHistory[] = [
  {
    id: 1,
    equipmentId: 1,
    calibrationDate: "2026-01-15",
    result: "합격",
    certificateNo: "CAL-2026-001",
    remarks: "정상 교정 완료",
  },
  {
    id: 2,
    equipmentId: 1,
    calibrationDate: "2025-01-15",
    result: "합격",
    certificateNo: "CAL-2025-001",
    remarks: "",
  },
  {
    id: 3,
    equipmentId: 2,
    calibrationDate: "2026-02-20",
    result: "조정후합격",
    certificateNo: "CAL-2026-002",
    remarks: "영점 조정 후 합격",
  },
  {
    id: 4,
    equipmentId: 3,
    calibrationDate: "2026-03-10",
    result: "합격",
    certificateNo: "CAL-2026-003",
    remarks: "",
  },
  {
    id: 5,
    equipmentId: 4,
    calibrationDate: "2025-12-01",
    result: "합격",
    certificateNo: "CAL-2025-012",
    remarks: "연간 정기 교정",
  },
];

export default function CalibrationPage() {
  const [activeTab, setActiveTab] = useState("info");
  const [equipments, setEquipments] = useState<Equipment[]>(initialEquipments);
  const [histories, setHistories] = useState<CalibrationHistory[]>(initialHistories);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    initialEquipments[0]
  );
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Equipment form state
  const [equipmentForm, setEquipmentForm] = useState<Omit<Equipment, "id">>({
    managementNo: "",
    equipmentName: "",
    model: "",
    manufacturer: "",
    purchaseDate: "",
    measurementRange: "",
    accuracy: "",
    department: "",
    storageLocation: "",
    calibrationCycle: 12,
    lastCalibrationDate: "",
    nextCalibrationDate: "",
    calibrationAgency: "사내",
    certificateNo: "",
    status: "사용중",
  });

  // History form state
  const [historyForm, setHistoryForm] = useState<Omit<CalibrationHistory, "id">>({
    equipmentId: 0,
    calibrationDate: new Date().toISOString().split("T")[0],
    result: "합격",
    certificateNo: "",
    remarks: "",
  });

  const handleEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEquipment: Equipment = {
      id: Date.now(),
      ...equipmentForm,
    };
    setEquipments([newEquipment, ...equipments]);
    setSelectedEquipment(newEquipment);
    setShowEquipmentForm(false);
    resetEquipmentForm();
    alert("계측기가 등록되었습니다.");
  };

  const handleHistorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    const newHistory: CalibrationHistory = {
      id: Date.now(),
      ...historyForm,
      equipmentId: selectedEquipment.id,
    };
    setHistories([newHistory, ...histories]);

    // Update equipment's last calibration date
    const updatedEquipments = equipments.map((eq) =>
      eq.id === selectedEquipment.id
        ? {
            ...eq,
            lastCalibrationDate: historyForm.calibrationDate,
            certificateNo: historyForm.certificateNo,
          }
        : eq
    );
    setEquipments(updatedEquipments);
    setSelectedEquipment({
      ...selectedEquipment,
      lastCalibrationDate: historyForm.calibrationDate,
      certificateNo: historyForm.certificateNo,
    });

    setShowHistoryForm(false);
    resetHistoryForm();
    alert("교정 이력이 등록되었습니다.");
  };

  const resetEquipmentForm = () => {
    setEquipmentForm({
      managementNo: "",
      equipmentName: "",
      model: "",
      manufacturer: "",
      purchaseDate: "",
      measurementRange: "",
      accuracy: "",
      department: "",
      storageLocation: "",
      calibrationCycle: 12,
      lastCalibrationDate: "",
      nextCalibrationDate: "",
      calibrationAgency: "사내",
      certificateNo: "",
      status: "사용중",
    });
  };

  const resetHistoryForm = () => {
    setHistoryForm({
      equipmentId: 0,
      calibrationDate: new Date().toISOString().split("T")[0],
      result: "합격",
      certificateNo: "",
      remarks: "",
    });
  };

  const getStatusBadge = (status: Equipment["status"]) => {
    const variants: Record<Equipment["status"], "success" | "warning" | "error" | "secondary"> = {
      사용중: "success",
      교정중: "warning",
      수리중: "warning",
      폐기: "error",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getResultBadge = (result: CalibrationHistory["result"]) => {
    const variants: Record<CalibrationHistory["result"], "success" | "warning" | "error"> = {
      합격: "success",
      불합격: "error",
      조정후합격: "warning",
    };
    return <Badge variant={variants[result]}>{result}</Badge>;
  };

  const filteredEquipments = equipments.filter(
    (eq) =>
      eq.managementNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEquipmentHistories = histories.filter(
    (h) => selectedEquipment && h.equipmentId === selectedEquipment.id
  );

  // Calculate days until next calibration
  const getDaysUntilCalibration = (nextDate: string) => {
    const today = new Date();
    const next = new Date(nextDate);
    const diffTime = next.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">계측기 관리/교정</h1>
          <p className="text-muted-foreground">
            계측기 정보 및 교정 관리 시스템
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowEquipmentForm(!showEquipmentForm)}
          >
            <Plus className="mr-2 h-4 w-4" />
            계측기 등록
          </Button>
        </div>
      </div>

      {/* Equipment Registration Form */}
      {showEquipmentForm && (
        <Card>
          <CardHeader>
            <CardTitle>계측기 등록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEquipmentSubmit} className="space-y-6">
              {/* Header Information */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-4">기본 정보</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>관리번호 *</Label>
                    <Input
                      value={equipmentForm.managementNo}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          managementNo: e.target.value,
                        })
                      }
                      placeholder="GA-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>계측기명 *</Label>
                    <Input
                      value={equipmentForm.equipmentName}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          equipmentName: e.target.value,
                        })
                      }
                      placeholder="버니어캘리퍼스"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>모델</Label>
                    <Input
                      value={equipmentForm.model}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          model: e.target.value,
                        })
                      }
                      placeholder="CD-15CPX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>제조사</Label>
                    <Input
                      value={equipmentForm.manufacturer}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          manufacturer: e.target.value,
                        })
                      }
                      placeholder="Mitutoyo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>구입일</Label>
                    <Input
                      type="date"
                      value={equipmentForm.purchaseDate}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          purchaseDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Equipment Info */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-4">계측기 정보</h4>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label>계측범위</Label>
                    <Input
                      value={equipmentForm.measurementRange}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          measurementRange: e.target.value,
                        })
                      }
                      placeholder="0-150mm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>정밀도</Label>
                    <Input
                      value={equipmentForm.accuracy}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          accuracy: e.target.value,
                        })
                      }
                      placeholder="0.02mm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>사용부서</Label>
                    <Input
                      value={equipmentForm.department}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          department: e.target.value,
                        })
                      }
                      placeholder="품질관리부"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>보관위치</Label>
                    <Input
                      value={equipmentForm.storageLocation}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          storageLocation: e.target.value,
                        })
                      }
                      placeholder="측정실 A-1"
                    />
                  </div>
                </div>
              </div>

              {/* Calibration Management */}
              <div className="border-b pb-4">
                <h4 className="font-medium mb-4">교정 관리</h4>
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>교정주기 (개월)</Label>
                    <Input
                      type="number"
                      value={equipmentForm.calibrationCycle}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          calibrationCycle: parseInt(e.target.value) || 12,
                        })
                      }
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>최종교정일</Label>
                    <Input
                      type="date"
                      value={equipmentForm.lastCalibrationDate}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          lastCalibrationDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>차기교정예정일</Label>
                    <Input
                      type="date"
                      value={equipmentForm.nextCalibrationDate}
                      onChange={(e) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          nextCalibrationDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>교정기관</Label>
                    <Select
                      value={equipmentForm.calibrationAgency}
                      onValueChange={(v) =>
                        setEquipmentForm({
                          ...equipmentForm,
                          calibrationAgency: v,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="사내">사내</SelectItem>
                        <SelectItem value="사외">사외</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>계측기 상태</Label>
                    <Select
                      value={equipmentForm.status}
                      onValueChange={(v) =>
                        setEquipmentForm({ ...equipmentForm, status: v as Equipment["status"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="사용중">사용중</SelectItem>
                        <SelectItem value="교정중">교정중</SelectItem>
                        <SelectItem value="수리중">수리중</SelectItem>
                        <SelectItem value="폐기">폐기</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEquipmentForm(false);
                    resetEquipmentForm();
                  }}
                >
                  취소
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  저장
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Equipment Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            계측기 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>계측기</Label>
              <Select
                value={selectedEquipment?.id.toString() || ""}
                onValueChange={(v) => {
                  const eq = equipments.find((e) => e.id.toString() === v);
                  setSelectedEquipment(eq || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="계측기를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {equipments.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id.toString()}>
                      {eq.managementNo} - {eq.equipmentName} ({eq.status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedEquipment && (
              <div className="flex gap-2">
                {getStatusBadge(selectedEquipment.status)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            계측기 정보
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            교정 계획
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            교정 이력
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            계측기 목록
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Equipment Info */}
        <TabsContent value="info">
          {selectedEquipment ? (
            <Card>
              <CardHeader>
                <CardTitle>계측기 상세 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Header Info */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-4 text-lg">기본 정보</h4>
                  <div className="grid gap-4 md:grid-cols-5">
                    <div>
                      <Label className="text-muted-foreground">관리번호</Label>
                      <p className="font-mono font-medium">
                        {selectedEquipment.managementNo}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">계측기명</Label>
                      <p className="font-medium">
                        {selectedEquipment.equipmentName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">모델</Label>
                      <p>{selectedEquipment.model || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">제조사</Label>
                      <p>{selectedEquipment.manufacturer || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">구입일</Label>
                      <p>{selectedEquipment.purchaseDate || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Equipment Details */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-4 text-lg">계측기 정보</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <Label className="text-muted-foreground">계측범위</Label>
                      <p>{selectedEquipment.measurementRange || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">정밀도</Label>
                      <p>{selectedEquipment.accuracy || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">사용부서</Label>
                      <p>{selectedEquipment.department || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">보관위치</Label>
                      <p>{selectedEquipment.storageLocation || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Calibration Management */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-4 text-lg">교정 관리</h4>
                  <div className="grid gap-4 md:grid-cols-5">
                    <div>
                      <Label className="text-muted-foreground">
                        교정주기 (개월)
                      </Label>
                      <p>{selectedEquipment.calibrationCycle}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">최종교정일</Label>
                      <p>{selectedEquipment.lastCalibrationDate || "-"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        차기교정예정일
                      </Label>
                      <p className="font-medium text-primary">
                        {selectedEquipment.nextCalibrationDate || "-"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">교정기관</Label>
                      <p>
                        <Badge variant="outline">
                          {selectedEquipment.calibrationAgency}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">
                        교정성적서 번호
                      </Label>
                      <p className="font-mono">
                        {selectedEquipment.certificateNo || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="font-medium mb-4 text-lg">계측기 상태</h4>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(selectedEquipment.status)}
                    {selectedEquipment.nextCalibrationDate && (
                      <span className="text-sm text-muted-foreground">
                        (차기 교정까지{" "}
                        {getDaysUntilCalibration(
                          selectedEquipment.nextCalibrationDate
                        )}
                        일 남음)
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                계측기를 선택하세요.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Calibration Schedule */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                교정 계획
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>관리번호</TableHead>
                    <TableHead>계측기명</TableHead>
                    <TableHead>교정주기</TableHead>
                    <TableHead>최종교정일</TableHead>
                    <TableHead>차기교정예정일</TableHead>
                    <TableHead>남은 일수</TableHead>
                    <TableHead>교정기관</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipments
                    .filter((eq) => eq.status !== "폐기")
                    .sort(
                      (a, b) =>
                        new Date(a.nextCalibrationDate).getTime() -
                        new Date(b.nextCalibrationDate).getTime()
                    )
                    .map((eq) => {
                      const daysLeft = getDaysUntilCalibration(
                        eq.nextCalibrationDate
                      );
                      return (
                        <TableRow
                          key={eq.id}
                          className={
                            daysLeft < 30
                              ? "bg-red-50"
                              : daysLeft < 60
                              ? "bg-yellow-50"
                              : ""
                          }
                        >
                          <TableCell className="font-mono">
                            {eq.managementNo}
                          </TableCell>
                          <TableCell>{eq.equipmentName}</TableCell>
                          <TableCell>{eq.calibrationCycle}개월</TableCell>
                          <TableCell>{eq.lastCalibrationDate}</TableCell>
                          <TableCell className="font-medium">
                            {eq.nextCalibrationDate}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                daysLeft < 30
                                  ? "error"
                                  : daysLeft < 60
                                  ? "warning"
                                  : "success"
                              }
                            >
                              {daysLeft}일
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {eq.calibrationAgency}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(eq.status)}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Calibration History */}
        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                교정 이력 - {selectedEquipment?.equipmentName || ""}
              </CardTitle>
              {selectedEquipment && (
                <Button
                  size="sm"
                  onClick={() => setShowHistoryForm(!showHistoryForm)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  이력 추가
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {showHistoryForm && selectedEquipment && (
                <div className="border rounded-lg p-4 bg-muted/30">
                  <form onSubmit={handleHistorySubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>교정일 *</Label>
                        <Input
                          type="date"
                          value={historyForm.calibrationDate}
                          onChange={(e) =>
                            setHistoryForm({
                              ...historyForm,
                              calibrationDate: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>교정결과 *</Label>
                        <Select
                          value={historyForm.result}
                          onValueChange={(v) =>
                            setHistoryForm({ ...historyForm, result: v as CalibrationHistory["result"] })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="합격">합격</SelectItem>
                            <SelectItem value="불합격">불합격</SelectItem>
                            <SelectItem value="조정후합격">조정후합격</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>교정성적서 번호</Label>
                        <Input
                          value={historyForm.certificateNo}
                          onChange={(e) =>
                            setHistoryForm({
                              ...historyForm,
                              certificateNo: e.target.value,
                            })
                          }
                          placeholder="CAL-2026-XXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>비고</Label>
                        <Input
                          value={historyForm.remarks}
                          onChange={(e) =>
                            setHistoryForm({
                              ...historyForm,
                              remarks: e.target.value,
                            })
                          }
                          placeholder="비고 사항"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowHistoryForm(false);
                          resetHistoryForm();
                        }}
                      >
                        취소
                      </Button>
                      <Button type="submit" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {selectedEquipment ? (
                selectedEquipmentHistories.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>교정일</TableHead>
                        <TableHead>교정결과</TableHead>
                        <TableHead>교정성적서</TableHead>
                        <TableHead>비고</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEquipmentHistories.map((history) => (
                        <TableRow key={history.id}>
                          <TableCell>{history.calibrationDate}</TableCell>
                          <TableCell>{getResultBadge(history.result)}</TableCell>
                          <TableCell className="font-mono">
                            {history.certificateNo || "-"}
                          </TableCell>
                          <TableCell>{history.remarks || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    교정 이력이 없습니다.
                  </p>
                )
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  계측기를 선택하세요.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Equipment List */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                계측기 목록
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="관리번호, 계측기명, 부서로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>관리번호</TableHead>
                    <TableHead>계측기명</TableHead>
                    <TableHead>모델</TableHead>
                    <TableHead>사용부서</TableHead>
                    <TableHead>차기교정예정일</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>선택</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipments.length > 0 ? (
                    filteredEquipments.map((eq) => (
                      <TableRow
                        key={eq.id}
                        className={
                          selectedEquipment?.id === eq.id ? "bg-muted" : ""
                        }
                      >
                        <TableCell className="font-mono">
                          {eq.managementNo}
                        </TableCell>
                        <TableCell>{eq.equipmentName}</TableCell>
                        <TableCell>{eq.model || "-"}</TableCell>
                        <TableCell>{eq.department || "-"}</TableCell>
                        <TableCell>
                          {eq.nextCalibrationDate && (
                            <span
                              className={
                                getDaysUntilCalibration(eq.nextCalibrationDate) <
                                30
                                  ? "text-red-600 font-medium"
                                  : ""
                              }
                            >
                              {eq.nextCalibrationDate}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(eq.status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={
                              selectedEquipment?.id === eq.id
                                ? "default"
                                : "outline"
                            }
                            onClick={() => {
                              setSelectedEquipment(eq);
                              setActiveTab("info");
                            }}
                          >
                            상세보기
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-8"
                      >
                        검색 결과가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
