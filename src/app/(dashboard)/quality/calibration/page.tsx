"use client";

import { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Gauge,
  Plus,
  Search,
  Save,
  Calendar,
  ClipboardCheck,
  Bell,
  FileText,
  Upload,
  Trash2,
  Edit,
} from "lucide-react";
import { getInstruments, type Instrument as MasterInstrument } from "@/lib/master-data";

// Types
interface Instrument {
  id: number;
  code: string;
  name: string;
  specification: string;
  manufacturer: string;
  model: string;
  calibrationCycle: number; // months
  department: string;
  responsiblePerson: string;
  initialCalibrationDate: string;
  status: "active" | "inactive" | "disposed";
}

interface CalibrationRecord {
  id: number;
  instrumentId: number;
  instrumentCode: string;
  instrumentName: string;
  calibrationDate: string;
  calibrationOrg: string;
  result: "pass" | "fail" | "conditional";
  nextCalibrationDate: string;
  certificateFile?: string;
  remarks?: string;
}

interface CalibrationPlan {
  instrumentId: number;
  instrumentCode: string;
  instrumentName: string;
  department: string;
  lastCalibrationDate: string;
  nextCalibrationDate: string;
  plannedMonth: number;
}

// Helper function to convert master data instruments to local format
function convertMasterInstruments(masterInstruments: MasterInstrument[]): Instrument[] {
  const statusMap: Record<MasterInstrument["status"], Instrument["status"]> = {
    "사용중": "active",
    "검교정중": "active", // Treat as active for planning purposes
    "보관": "inactive",
    "폐기": "disposed",
  };

  return masterInstruments.map((inst) => ({
    id: inst.id,
    code: inst.code,
    name: inst.name,
    specification: inst.spec,
    manufacturer: inst.manufacturer,
    model: inst.model,
    calibrationCycle: inst.calibrationCycle,
    department: inst.location, // Use location as department
    responsiblePerson: "", // Not available in master data
    initialCalibrationDate: inst.lastCalibrationDate,
    status: statusMap[inst.status] || "active",
  }));
}

// Get initial instruments from master data
const masterInstrumentData = getInstruments();
const sampleInstruments: Instrument[] = convertMasterInstruments(masterInstrumentData);

const sampleRecords: CalibrationRecord[] = [
  {
    id: 1,
    instrumentId: 1,
    instrumentCode: "CAL-001",
    instrumentName: "버니어캘리퍼스",
    calibrationDate: "2025-01-15",
    calibrationOrg: "한국계량측정협회",
    result: "pass",
    nextCalibrationDate: "2026-01-15",
    certificateFile: "cert_CAL001_2025.pdf",
    remarks: "",
  },
  {
    id: 2,
    instrumentId: 2,
    instrumentCode: "CAL-002",
    instrumentName: "마이크로미터",
    calibrationDate: "2025-02-20",
    calibrationOrg: "한국계량측정협회",
    result: "pass",
    nextCalibrationDate: "2026-02-20",
    certificateFile: "cert_CAL002_2025.pdf",
    remarks: "",
  },
  {
    id: 3,
    instrumentId: 3,
    instrumentCode: "CAL-003",
    instrumentName: "디지털온도계",
    calibrationDate: "2025-03-10",
    calibrationOrg: "한국표준과학연구원",
    result: "conditional",
    nextCalibrationDate: "2025-09-10",
    certificateFile: "cert_CAL003_2025.pdf",
    remarks: "온도편차 0.3도 조정",
  },
  {
    id: 4,
    instrumentId: 4,
    instrumentCode: "CAL-004",
    instrumentName: "토크렌치",
    calibrationDate: "2025-04-05",
    calibrationOrg: "한국기계연구원",
    result: "pass",
    nextCalibrationDate: "2025-10-05",
    certificateFile: "cert_CAL004_2025.pdf",
    remarks: "",
  },
];

// Initial form state
const initialInstrumentForm: Omit<Instrument, "id"> = {
  code: "",
  name: "",
  specification: "",
  manufacturer: "",
  model: "",
  calibrationCycle: 12,
  department: "",
  responsiblePerson: "",
  initialCalibrationDate: "",
  status: "active",
};

const initialRecordForm: Omit<CalibrationRecord, "id"> = {
  instrumentId: 0,
  instrumentCode: "",
  instrumentName: "",
  calibrationDate: "",
  calibrationOrg: "",
  result: "pass",
  nextCalibrationDate: "",
  certificateFile: "",
  remarks: "",
};

const resultColors: Record<string, string> = {
  pass: "bg-green-100 text-green-800",
  fail: "bg-red-100 text-red-800",
  conditional: "bg-yellow-100 text-yellow-800",
};

const resultLabels: Record<string, string> = {
  pass: "합격",
  fail: "불합격",
  conditional: "조건부합격",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  disposed: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  active: "사용중",
  inactive: "미사용",
  disposed: "폐기",
};

const months = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

export default function CalibrationPage() {
  const [activeTab, setActiveTab] = useState("registration");
  const [instruments, setInstruments] = useState<Instrument[]>(sampleInstruments);
  const [records, setRecords] = useState<CalibrationRecord[]>(sampleRecords);
  const [instrumentForm, setInstrumentForm] = useState(initialInstrumentForm);
  const [recordForm, setRecordForm] = useState(initialRecordForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingInstrumentId, setEditingInstrumentId] = useState<number | null>(null);

  // Helper functions
  const generateInstrumentCode = () => {
    const nextNum = instruments.length + 1;
    return `CAL-${String(nextNum).padStart(3, "0")}`;
  };

  const updateInstrumentField = <K extends keyof Omit<Instrument, "id">>(
    field: K,
    value: Omit<Instrument, "id">[K]
  ) => {
    setInstrumentForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateRecordField = <K extends keyof Omit<CalibrationRecord, "id">>(
    field: K,
    value: Omit<CalibrationRecord, "id">[K]
  ) => {
    setRecordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveInstrument = () => {
    if (!instrumentForm.code || !instrumentForm.name) {
      alert("계측기번호와 계측기명은 필수입니다.");
      return;
    }

    if (editingInstrumentId) {
      setInstruments((prev) =>
        prev.map((inst) =>
          inst.id === editingInstrumentId
            ? { ...instrumentForm, id: editingInstrumentId }
            : inst
        )
      );
      setEditingInstrumentId(null);
    } else {
      const newInstrument: Instrument = {
        ...instrumentForm,
        id: Math.max(...instruments.map((i) => i.id), 0) + 1,
      };
      setInstruments((prev) => [...prev, newInstrument]);
    }
    setInstrumentForm(initialInstrumentForm);
    alert("계측기가 저장되었습니다.");
  };

  const handleEditInstrument = (instrument: Instrument) => {
    setEditingInstrumentId(instrument.id);
    setInstrumentForm({
      code: instrument.code,
      name: instrument.name,
      specification: instrument.specification,
      manufacturer: instrument.manufacturer,
      model: instrument.model,
      calibrationCycle: instrument.calibrationCycle,
      department: instrument.department,
      responsiblePerson: instrument.responsiblePerson,
      initialCalibrationDate: instrument.initialCalibrationDate,
      status: instrument.status,
    });
  };

  const handleDeleteInstrument = (id: number) => {
    if (confirm("정말로 이 계측기를 삭제하시겠습니까?")) {
      setInstruments((prev) => prev.filter((inst) => inst.id !== id));
    }
  };

  const handleSaveRecord = () => {
    if (!recordForm.instrumentCode || !recordForm.calibrationDate) {
      alert("계측기와 검교정일은 필수입니다.");
      return;
    }

    const newRecord: CalibrationRecord = {
      ...recordForm,
      id: Math.max(...records.map((r) => r.id), 0) + 1,
    };
    setRecords((prev) => [...prev, newRecord]);
    setRecordForm(initialRecordForm);
    alert("검교정 실적이 저장되었습니다.");
  };

  const handleInstrumentSelect = (instrumentId: string) => {
    const instrument = instruments.find((i) => i.id === parseInt(instrumentId));
    if (instrument) {
      setRecordForm((prev) => ({
        ...prev,
        instrumentId: instrument.id,
        instrumentCode: instrument.code,
        instrumentName: instrument.name,
      }));
    }
  };

  const calculateNextCalibrationDate = () => {
    if (recordForm.calibrationDate && recordForm.instrumentId) {
      const instrument = instruments.find((i) => i.id === recordForm.instrumentId);
      if (instrument) {
        const calibDate = new Date(recordForm.calibrationDate);
        calibDate.setMonth(calibDate.getMonth() + instrument.calibrationCycle);
        setRecordForm((prev) => ({
          ...prev,
          nextCalibrationDate: calibDate.toISOString().split("T")[0],
        }));
      }
    }
  };

  // Generate yearly calibration plan
  const generateYearlyPlan = (): CalibrationPlan[] => {
    const plans: CalibrationPlan[] = [];

    instruments.forEach((instrument) => {
      if (instrument.status !== "active") return;

      // Find the most recent calibration record
      const instrumentRecords = records
        .filter((r) => r.instrumentId === instrument.id)
        .sort(
          (a, b) =>
            new Date(b.calibrationDate).getTime() -
            new Date(a.calibrationDate).getTime()
        );

      let lastCalibDate = instrumentRecords[0]?.calibrationDate || instrument.initialCalibrationDate;
      let nextCalibDate = instrumentRecords[0]?.nextCalibrationDate;

      if (!nextCalibDate && lastCalibDate) {
        const nextDate = new Date(lastCalibDate);
        nextDate.setMonth(nextDate.getMonth() + instrument.calibrationCycle);
        nextCalibDate = nextDate.toISOString().split("T")[0];
      }

      if (nextCalibDate) {
        const nextDate = new Date(nextCalibDate);
        if (nextDate.getFullYear() === selectedYear) {
          plans.push({
            instrumentId: instrument.id,
            instrumentCode: instrument.code,
            instrumentName: instrument.name,
            department: instrument.department,
            lastCalibrationDate: lastCalibDate,
            nextCalibrationDate: nextCalibDate,
            plannedMonth: nextDate.getMonth() + 1,
          });
        }
      }
    });

    return plans.sort((a, b) => a.plannedMonth - b.plannedMonth);
  };

  // Get instruments with upcoming/overdue calibration
  const getExpiringCalibrations = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const expiring: {
      instrument: Instrument;
      nextCalibrationDate: string;
      daysUntilDue: number;
      status: "overdue" | "urgent" | "upcoming";
    }[] = [];

    instruments.forEach((instrument) => {
      if (instrument.status !== "active") return;

      const instrumentRecords = records
        .filter((r) => r.instrumentId === instrument.id)
        .sort(
          (a, b) =>
            new Date(b.calibrationDate).getTime() -
            new Date(a.calibrationDate).getTime()
        );

      let nextCalibDate = instrumentRecords[0]?.nextCalibrationDate;

      if (!nextCalibDate && instrument.initialCalibrationDate) {
        const nextDate = new Date(instrument.initialCalibrationDate);
        nextDate.setMonth(nextDate.getMonth() + instrument.calibrationCycle);
        nextCalibDate = nextDate.toISOString().split("T")[0];
      }

      if (nextCalibDate) {
        const nextDate = new Date(nextCalibDate);
        const diffTime = nextDate.getTime() - today.getTime();
        const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysUntilDue <= 30) {
          let status: "overdue" | "urgent" | "upcoming";
          if (daysUntilDue < 0) {
            status = "overdue";
          } else if (daysUntilDue <= 7) {
            status = "urgent";
          } else {
            status = "upcoming";
          }

          expiring.push({
            instrument,
            nextCalibrationDate: nextCalibDate,
            daysUntilDue,
            status,
          });
        }
      }
    });

    return expiring.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  };

  const filteredInstruments = instruments.filter(
    (inst) =>
      inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const yearlyPlan = generateYearlyPlan();
  const expiringCalibrations = getExpiringCalibrations();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">계측기 검교정 관리</h1>
          <p className="text-muted-foreground">
            계측기 등록, 검교정 계획 및 실적 관리
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">계측기 등록</TabsTrigger>
          <TabsTrigger value="plan">검교정 계획</TabsTrigger>
          <TabsTrigger value="records">검교정 실적</TabsTrigger>
          <TabsTrigger value="alerts">
            기한 도래 알림
            {expiringCalibrations.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                {expiringCalibrations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: 계측기 등록 */}
        <TabsContent value="registration">
          <div className="space-y-6">
            {/* Registration Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  {editingInstrumentId ? "계측기 수정" : "계측기 등록"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instrumentCode">계측기번호</Label>
                    <div className="flex gap-2">
                      <Input
                        id="instrumentCode"
                        value={instrumentForm.code}
                        onChange={(e) => updateInstrumentField("code", e.target.value)}
                        placeholder="CAL-XXX"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateInstrumentField("code", generateInstrumentCode())
                        }
                        className="shrink-0"
                      >
                        자동생성
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instrumentName">계측기명</Label>
                    <Input
                      id="instrumentName"
                      value={instrumentForm.name}
                      onChange={(e) => updateInstrumentField("name", e.target.value)}
                      placeholder="계측기명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specification">규격</Label>
                    <Input
                      id="specification"
                      value={instrumentForm.specification}
                      onChange={(e) =>
                        updateInstrumentField("specification", e.target.value)
                      }
                      placeholder="측정범위, 분해능 등"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">제조사</Label>
                    <Input
                      id="manufacturer"
                      value={instrumentForm.manufacturer}
                      onChange={(e) =>
                        updateInstrumentField("manufacturer", e.target.value)
                      }
                      placeholder="제조사명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">모델</Label>
                    <Input
                      id="model"
                      value={instrumentForm.model}
                      onChange={(e) => updateInstrumentField("model", e.target.value)}
                      placeholder="모델번호 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calibrationCycle">검교정 주기 (개월)</Label>
                    <Select
                      value={String(instrumentForm.calibrationCycle)}
                      onValueChange={(value) =>
                        updateInstrumentField("calibrationCycle", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="주기 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3개월</SelectItem>
                        <SelectItem value="6">6개월</SelectItem>
                        <SelectItem value="12">12개월</SelectItem>
                        <SelectItem value="24">24개월</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">사용부서</Label>
                    <Input
                      id="department"
                      value={instrumentForm.department}
                      onChange={(e) =>
                        updateInstrumentField("department", e.target.value)
                      }
                      placeholder="사용부서 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsiblePerson">담당자</Label>
                    <Input
                      id="responsiblePerson"
                      value={instrumentForm.responsiblePerson}
                      onChange={(e) =>
                        updateInstrumentField("responsiblePerson", e.target.value)
                      }
                      placeholder="담당자명 입력"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialCalibrationDate">최초 검교정일</Label>
                    <Input
                      id="initialCalibrationDate"
                      type="date"
                      value={instrumentForm.initialCalibrationDate}
                      onChange={(e) =>
                        updateInstrumentField("initialCalibrationDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>상태</Label>
                    <Select
                      value={instrumentForm.status}
                      onValueChange={(value) =>
                        updateInstrumentField(
                          "status",
                          value as Instrument["status"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="상태 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">사용중</SelectItem>
                        <SelectItem value="inactive">미사용</SelectItem>
                        <SelectItem value="disposed">폐기</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveInstrument}>
                    <Save className="mr-2 h-4 w-4" />
                    {editingInstrumentId ? "수정" : "등록"}
                  </Button>
                  {editingInstrumentId && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingInstrumentId(null);
                        setInstrumentForm(initialInstrumentForm);
                      }}
                    >
                      취소
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instruments List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    등록된 계측기 목록
                  </span>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>계측기번호</TableHead>
                      <TableHead>계측기명</TableHead>
                      <TableHead>규격</TableHead>
                      <TableHead>제조사/모델</TableHead>
                      <TableHead>주기</TableHead>
                      <TableHead>사용부서</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstruments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                          등록된 계측기가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInstruments.map((inst) => (
                        <TableRow key={inst.id}>
                          <TableCell className="font-mono">{inst.code}</TableCell>
                          <TableCell>{inst.name}</TableCell>
                          <TableCell className="text-sm">{inst.specification}</TableCell>
                          <TableCell className="text-sm">
                            {inst.manufacturer} / {inst.model}
                          </TableCell>
                          <TableCell>{inst.calibrationCycle}개월</TableCell>
                          <TableCell>{inst.department}</TableCell>
                          <TableCell>{inst.responsiblePerson}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                statusColors[inst.status]
                              }`}
                            >
                              {statusLabels[inst.status]}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditInstrument(inst)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteInstrument(inst.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: 검교정 계획 */}
        <TabsContent value="plan">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {selectedYear}년 검교정 계획표
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedYear((prev) => prev - 1)}
                    >
                      이전년도
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedYear((prev) => prev + 1)}
                    >
                      다음년도
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background">계측기번호</TableHead>
                        <TableHead>계측기명</TableHead>
                        <TableHead>사용부서</TableHead>
                        {months.map((month) => (
                          <TableHead key={month} className="text-center min-w-[60px]">
                            {month}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {instruments
                        .filter((inst) => inst.status === "active")
                        .map((inst) => {
                          const plan = yearlyPlan.find(
                            (p) => p.instrumentId === inst.id
                          );
                          return (
                            <TableRow key={inst.id}>
                              <TableCell className="font-mono sticky left-0 bg-background">
                                {inst.code}
                              </TableCell>
                              <TableCell>{inst.name}</TableCell>
                              <TableCell>{inst.department}</TableCell>
                              {months.map((_, index) => {
                                const monthNum = index + 1;
                                const isPlanned = plan?.plannedMonth === monthNum;
                                return (
                                  <TableCell key={index} className="text-center">
                                    {isPlanned && (
                                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                                        O
                                      </span>
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>월별 검교정 대상 계측기</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {months.map((month, index) => {
                    const monthPlans = yearlyPlan.filter(
                      (p) => p.plannedMonth === index + 1
                    );
                    return (
                      <Card key={month} className="bg-muted/30">
                        <CardHeader className="py-3">
                          <CardTitle className="text-base flex items-center justify-between">
                            {month}
                            <span className="text-sm font-normal text-muted-foreground">
                              {monthPlans.length}건
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                          {monthPlans.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              해당 없음
                            </p>
                          ) : (
                            <ul className="space-y-1">
                              {monthPlans.map((plan) => (
                                <li
                                  key={plan.instrumentId}
                                  className="text-sm flex items-center gap-2"
                                >
                                  <span className="font-mono text-xs">
                                    {plan.instrumentCode}
                                  </span>
                                  <span>{plan.instrumentName}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: 검교정 실적 */}
        <TabsContent value="records">
          <div className="space-y-6">
            {/* Record Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  검교정 실적 등록
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>계측기 선택</Label>
                    <Select
                      value={recordForm.instrumentId ? String(recordForm.instrumentId) : ""}
                      onValueChange={handleInstrumentSelect}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="계측기 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {instruments
                          .filter((i) => i.status === "active")
                          .map((inst) => (
                            <SelectItem key={inst.id} value={String(inst.id)}>
                              {inst.code} - {inst.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calibrationDate">검교정일</Label>
                    <Input
                      id="calibrationDate"
                      type="date"
                      value={recordForm.calibrationDate}
                      onChange={(e) => {
                        updateRecordField("calibrationDate", e.target.value);
                      }}
                      onBlur={calculateNextCalibrationDate}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calibrationOrg">검교정기관</Label>
                    <Input
                      id="calibrationOrg"
                      value={recordForm.calibrationOrg}
                      onChange={(e) =>
                        updateRecordField("calibrationOrg", e.target.value)
                      }
                      placeholder="검교정 수행기관"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>결과</Label>
                    <Select
                      value={recordForm.result}
                      onValueChange={(value) =>
                        updateRecordField(
                          "result",
                          value as CalibrationRecord["result"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="결과 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pass">합격</SelectItem>
                        <SelectItem value="fail">불합격</SelectItem>
                        <SelectItem value="conditional">조건부합격</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextCalibrationDate">다음 검교정일</Label>
                    <Input
                      id="nextCalibrationDate"
                      type="date"
                      value={recordForm.nextCalibrationDate}
                      onChange={(e) =>
                        updateRecordField("nextCalibrationDate", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificateFile">성적서 파일</Label>
                    <div className="flex gap-2">
                      <Input
                        id="certificateFile"
                        value={recordForm.certificateFile}
                        onChange={(e) =>
                          updateRecordField("certificateFile", e.target.value)
                        }
                        placeholder="파일명"
                      />
                      <Button variant="outline" size="sm" className="shrink-0">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="remarks">비고</Label>
                    <Input
                      id="remarks"
                      value={recordForm.remarks}
                      onChange={(e) => updateRecordField("remarks", e.target.value)}
                      placeholder="특이사항 입력"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveRecord}>
                  <Save className="mr-2 h-4 w-4" />
                  실적 등록
                </Button>
              </CardContent>
            </Card>

            {/* Records List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  검교정 실적 목록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>계측기번호</TableHead>
                      <TableHead>계측기명</TableHead>
                      <TableHead>검교정일</TableHead>
                      <TableHead>검교정기관</TableHead>
                      <TableHead>결과</TableHead>
                      <TableHead>다음 검교정일</TableHead>
                      <TableHead>성적서</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          등록된 검교정 실적이 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-mono">
                            {record.instrumentCode}
                          </TableCell>
                          <TableCell>{record.instrumentName}</TableCell>
                          <TableCell>
                            {new Date(record.calibrationDate).toLocaleDateString(
                              "ko-KR"
                            )}
                          </TableCell>
                          <TableCell>{record.calibrationOrg}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                resultColors[record.result]
                              }`}
                            >
                              {resultLabels[record.result]}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(
                              record.nextCalibrationDate
                            ).toLocaleDateString("ko-KR")}
                          </TableCell>
                          <TableCell>
                            {record.certificateFile ? (
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                보기
                              </Button>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {record.remarks || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: 기한 도래 알림 */}
        <TabsContent value="alerts">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  검교정 기한 도래 알림
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expiringCalibrations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>30일 이내 검교정 기한 도래 계측기가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">
                              {
                                expiringCalibrations.filter(
                                  (e) => e.status === "overdue"
                                ).length
                              }
                            </p>
                            <p className="text-sm text-red-600">기한 초과</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-orange-50 border-orange-200">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">
                              {
                                expiringCalibrations.filter(
                                  (e) => e.status === "urgent"
                                ).length
                              }
                            </p>
                            <p className="text-sm text-orange-600">7일 이내</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                              {
                                expiringCalibrations.filter(
                                  (e) => e.status === "upcoming"
                                ).length
                              }
                            </p>
                            <p className="text-sm text-yellow-600">30일 이내</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Alerts Table */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>상태</TableHead>
                          <TableHead>계측기번호</TableHead>
                          <TableHead>계측기명</TableHead>
                          <TableHead>사용부서</TableHead>
                          <TableHead>담당자</TableHead>
                          <TableHead>검교정 기한</TableHead>
                          <TableHead>잔여일</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expiringCalibrations.map((item) => (
                          <TableRow key={item.instrument.id}>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : item.status === "urgent"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {item.status === "overdue"
                                  ? "기한초과"
                                  : item.status === "urgent"
                                  ? "긴급"
                                  : "주의"}
                              </span>
                            </TableCell>
                            <TableCell className="font-mono">
                              {item.instrument.code}
                            </TableCell>
                            <TableCell>{item.instrument.name}</TableCell>
                            <TableCell>{item.instrument.department}</TableCell>
                            <TableCell>{item.instrument.responsiblePerson}</TableCell>
                            <TableCell>
                              {new Date(
                                item.nextCalibrationDate
                              ).toLocaleDateString("ko-KR")}
                            </TableCell>
                            <TableCell
                              className={`font-bold ${
                                item.daysUntilDue < 0
                                  ? "text-red-600"
                                  : item.daysUntilDue <= 7
                                  ? "text-orange-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {item.daysUntilDue < 0
                                ? `${Math.abs(item.daysUntilDue)}일 초과`
                                : `${item.daysUntilDue}일`}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
