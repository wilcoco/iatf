"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Thermometer,
  Droplets,
  Sun,
  Volume2,
  Wind,
  AlertTriangle,
  Plus,
  Save,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Settings,
  History
} from "lucide-react";

// Interfaces
interface EnvironmentMeasurement {
  id: number;
  measurementDate: string;
  measurementTime: string;
  location: string;
  temperature: number;
  humidity: number;
  illumination: number;
  noise: number;
  dust: number;
  harmfulGas: number;
  measuredBy: string;
  status: "정상" | "이상";
}

interface EnvironmentStandard {
  id: number;
  item: string;
  unit: string;
  legalStandard: string;
  internalStandard: string;
  measurementCycle: string;
  notes: string;
}

interface AbnormalityRecord {
  id: number;
  measurementId: number;
  detectedDate: string;
  location: string;
  item: string;
  measuredValue: string;
  standardValue: string;
  actionTaken: string;
  actionDate: string;
  actionBy: string;
  improvementStatus: "조치중" | "완료" | "미조치";
}

// Sample data
const initialMeasurements: EnvironmentMeasurement[] = [
  {
    id: 1,
    measurementDate: "2026-06-10",
    measurementTime: "09:00",
    location: "작업장 A",
    temperature: 23.5,
    humidity: 55,
    illumination: 450,
    noise: 72,
    dust: 0.08,
    harmfulGas: 0.02,
    measuredBy: "김환경",
    status: "정상",
  },
  {
    id: 2,
    measurementDate: "2026-06-10",
    measurementTime: "09:00",
    location: "작업장 B",
    temperature: 26.8,
    humidity: 68,
    illumination: 380,
    noise: 85,
    dust: 0.12,
    harmfulGas: 0.03,
    measuredBy: "김환경",
    status: "이상",
  },
  {
    id: 3,
    measurementDate: "2026-06-09",
    measurementTime: "14:00",
    location: "작업장 A",
    temperature: 24.2,
    humidity: 52,
    illumination: 500,
    noise: 70,
    dust: 0.06,
    harmfulGas: 0.01,
    measuredBy: "박측정",
    status: "정상",
  },
  {
    id: 4,
    measurementDate: "2026-06-09",
    measurementTime: "14:00",
    location: "창고",
    temperature: 22.0,
    humidity: 45,
    illumination: 200,
    noise: 55,
    dust: 0.04,
    harmfulGas: 0.01,
    measuredBy: "박측정",
    status: "정상",
  },
  {
    id: 5,
    measurementDate: "2026-06-08",
    measurementTime: "09:00",
    location: "작업장 C",
    temperature: 28.5,
    humidity: 72,
    illumination: 320,
    noise: 88,
    dust: 0.15,
    harmfulGas: 0.05,
    measuredBy: "김환경",
    status: "이상",
  },
];

const initialStandards: EnvironmentStandard[] = [
  {
    id: 1,
    item: "온도",
    unit: "°C",
    legalStandard: "18~28",
    internalStandard: "20~26",
    measurementCycle: "매일 2회",
    notes: "작업장 온도 관리",
  },
  {
    id: 2,
    item: "습도",
    unit: "%",
    legalStandard: "40~70",
    internalStandard: "45~65",
    measurementCycle: "매일 2회",
    notes: "습도 관리로 제품 품질 확보",
  },
  {
    id: 3,
    item: "조도",
    unit: "Lux",
    legalStandard: "300 이상",
    internalStandard: "400 이상",
    measurementCycle: "매일 1회",
    notes: "작업자 시력 보호",
  },
  {
    id: 4,
    item: "소음",
    unit: "dB",
    legalStandard: "90 이하",
    internalStandard: "80 이하",
    measurementCycle: "매일 1회",
    notes: "청력 보호를 위한 소음 관리",
  },
  {
    id: 5,
    item: "분진",
    unit: "mg/m³",
    legalStandard: "0.15 이하",
    internalStandard: "0.10 이하",
    measurementCycle: "주 1회",
    notes: "호흡기 보호",
  },
  {
    id: 6,
    item: "유해가스",
    unit: "ppm",
    legalStandard: "0.1 이하",
    internalStandard: "0.05 이하",
    measurementCycle: "주 1회",
    notes: "화학물질 취급 구역",
  },
];

const initialAbnormalities: AbnormalityRecord[] = [
  {
    id: 1,
    measurementId: 2,
    detectedDate: "2026-06-10",
    location: "작업장 B",
    item: "소음",
    measuredValue: "85 dB",
    standardValue: "80 dB 이하",
    actionTaken: "소음 발생원 점검 및 방음 패널 설치 예정",
    actionDate: "2026-06-12",
    actionBy: "이관리",
    improvementStatus: "조치중",
  },
  {
    id: 2,
    measurementId: 2,
    detectedDate: "2026-06-10",
    location: "작업장 B",
    item: "습도",
    measuredValue: "68%",
    standardValue: "65% 이하",
    actionTaken: "제습기 추가 가동",
    actionDate: "2026-06-10",
    actionBy: "이관리",
    improvementStatus: "완료",
  },
  {
    id: 3,
    measurementId: 5,
    detectedDate: "2026-06-08",
    location: "작업장 C",
    item: "온도",
    measuredValue: "28.5°C",
    standardValue: "26°C 이하",
    actionTaken: "에어컨 점검 및 수리 완료",
    actionDate: "2026-06-09",
    actionBy: "박정비",
    improvementStatus: "완료",
  },
  {
    id: 4,
    measurementId: 5,
    detectedDate: "2026-06-08",
    location: "작업장 C",
    item: "분진",
    measuredValue: "0.15 mg/m³",
    standardValue: "0.10 mg/m³ 이하",
    actionTaken: "집진기 필터 교체 및 환기 시스템 점검",
    actionDate: "2026-06-09",
    actionBy: "박정비",
    improvementStatus: "완료",
  },
  {
    id: 5,
    measurementId: 5,
    detectedDate: "2026-06-08",
    location: "작업장 C",
    item: "소음",
    measuredValue: "88 dB",
    standardValue: "80 dB 이하",
    actionTaken: "설비 점검 예정",
    actionDate: "",
    actionBy: "",
    improvementStatus: "미조치",
  },
];

const locations = ["작업장 A", "작업장 B", "작업장 C", "창고", "검사실", "조립라인"];

export default function EnvironmentManagementPage() {
  const [activeTab, setActiveTab] = useState("measurement");
  const [measurements, setMeasurements] = useState<EnvironmentMeasurement[]>(initialMeasurements);
  const [standards, setStandards] = useState<EnvironmentStandard[]>(initialStandards);
  const [abnormalities, setAbnormalities] = useState<AbnormalityRecord[]>(initialAbnormalities);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [showStandardForm, setShowStandardForm] = useState(false);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Form states
  const [measurementForm, setMeasurementForm] = useState({
    measurementDate: new Date().toISOString().split("T")[0],
    measurementTime: "",
    location: "",
    temperature: "",
    humidity: "",
    illumination: "",
    noise: "",
    dust: "",
    harmfulGas: "",
    measuredBy: "",
  });

  const [standardForm, setStandardForm] = useState({
    item: "",
    unit: "",
    legalStandard: "",
    internalStandard: "",
    measurementCycle: "",
    notes: "",
  });

  // Filter measurements
  const filteredMeasurements = measurements.filter((m) => {
    const matchesLocation = locationFilter === "all" || m.location === locationFilter;
    const matchesDate = !dateFilter || m.measurementDate === dateFilter;
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesSearch =
      !search ||
      m.location.toLowerCase().includes(search.toLowerCase()) ||
      m.measuredBy.toLowerCase().includes(search.toLowerCase());
    return matchesLocation && matchesDate && matchesStatus && matchesSearch;
  });

  // Check if measurement values are within standards
  const checkStandard = (item: string, value: number): boolean => {
    const standard = standards.find((s) => s.item === item);
    if (!standard) return true;

    const internalStd = standard.internalStandard;
    if (internalStd.includes("~")) {
      const [min, max] = internalStd.split("~").map((s) => parseFloat(s));
      return value >= min && value <= max;
    } else if (internalStd.includes("이상")) {
      const minValue = parseFloat(internalStd);
      return value >= minValue;
    } else if (internalStd.includes("이하")) {
      const maxValue = parseFloat(internalStd);
      return value <= maxValue;
    }
    return true;
  };

  const handleMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const temp = parseFloat(measurementForm.temperature);
    const humid = parseFloat(measurementForm.humidity);
    const illum = parseFloat(measurementForm.illumination);
    const noiseVal = parseFloat(measurementForm.noise);
    const dustVal = parseFloat(measurementForm.dust);
    const gasVal = parseFloat(measurementForm.harmfulGas);

    const hasAbnormality =
      !checkStandard("온도", temp) ||
      !checkStandard("습도", humid) ||
      !checkStandard("조도", illum) ||
      !checkStandard("소음", noiseVal) ||
      !checkStandard("분진", dustVal) ||
      !checkStandard("유해가스", gasVal);

    const newMeasurement: EnvironmentMeasurement = {
      id: Date.now(),
      measurementDate: measurementForm.measurementDate,
      measurementTime: measurementForm.measurementTime,
      location: measurementForm.location,
      temperature: temp,
      humidity: humid,
      illumination: illum,
      noise: noiseVal,
      dust: dustVal,
      harmfulGas: gasVal,
      measuredBy: measurementForm.measuredBy,
      status: hasAbnormality ? "이상" : "정상",
    };

    setMeasurements([newMeasurement, ...measurements]);

    // Auto-create abnormality records if needed
    if (hasAbnormality) {
      const newAbnormalities: AbnormalityRecord[] = [];
      if (!checkStandard("온도", temp)) {
        newAbnormalities.push({
          id: Date.now() + 1,
          measurementId: newMeasurement.id,
          detectedDate: measurementForm.measurementDate,
          location: measurementForm.location,
          item: "온도",
          measuredValue: `${temp}°C`,
          standardValue: standards.find((s) => s.item === "온도")?.internalStandard || "",
          actionTaken: "",
          actionDate: "",
          actionBy: "",
          improvementStatus: "미조치",
        });
      }
      if (!checkStandard("습도", humid)) {
        newAbnormalities.push({
          id: Date.now() + 2,
          measurementId: newMeasurement.id,
          detectedDate: measurementForm.measurementDate,
          location: measurementForm.location,
          item: "습도",
          measuredValue: `${humid}%`,
          standardValue: standards.find((s) => s.item === "습도")?.internalStandard || "",
          actionTaken: "",
          actionDate: "",
          actionBy: "",
          improvementStatus: "미조치",
        });
      }
      if (!checkStandard("조도", illum)) {
        newAbnormalities.push({
          id: Date.now() + 3,
          measurementId: newMeasurement.id,
          detectedDate: measurementForm.measurementDate,
          location: measurementForm.location,
          item: "조도",
          measuredValue: `${illum} Lux`,
          standardValue: standards.find((s) => s.item === "조도")?.internalStandard || "",
          actionTaken: "",
          actionDate: "",
          actionBy: "",
          improvementStatus: "미조치",
        });
      }
      if (!checkStandard("소음", noiseVal)) {
        newAbnormalities.push({
          id: Date.now() + 4,
          measurementId: newMeasurement.id,
          detectedDate: measurementForm.measurementDate,
          location: measurementForm.location,
          item: "소음",
          measuredValue: `${noiseVal} dB`,
          standardValue: standards.find((s) => s.item === "소음")?.internalStandard || "",
          actionTaken: "",
          actionDate: "",
          actionBy: "",
          improvementStatus: "미조치",
        });
      }
      if (!checkStandard("분진", dustVal)) {
        newAbnormalities.push({
          id: Date.now() + 5,
          measurementId: newMeasurement.id,
          detectedDate: measurementForm.measurementDate,
          location: measurementForm.location,
          item: "분진",
          measuredValue: `${dustVal} mg/m³`,
          standardValue: standards.find((s) => s.item === "분진")?.internalStandard || "",
          actionTaken: "",
          actionDate: "",
          actionBy: "",
          improvementStatus: "미조치",
        });
      }
      if (!checkStandard("유해가스", gasVal)) {
        newAbnormalities.push({
          id: Date.now() + 6,
          measurementId: newMeasurement.id,
          detectedDate: measurementForm.measurementDate,
          location: measurementForm.location,
          item: "유해가스",
          measuredValue: `${gasVal} ppm`,
          standardValue: standards.find((s) => s.item === "유해가스")?.internalStandard || "",
          actionTaken: "",
          actionDate: "",
          actionBy: "",
          improvementStatus: "미조치",
        });
      }
      setAbnormalities([...newAbnormalities, ...abnormalities]);
    }

    setShowMeasurementForm(false);
    setMeasurementForm({
      measurementDate: new Date().toISOString().split("T")[0],
      measurementTime: "",
      location: "",
      temperature: "",
      humidity: "",
      illumination: "",
      noise: "",
      dust: "",
      harmfulGas: "",
      measuredBy: "",
    });
    alert("환경 측정 데이터가 등록되었습니다.");
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStandard: EnvironmentStandard = {
      id: Date.now(),
      ...standardForm,
    };
    setStandards([...standards, newStandard]);
    setShowStandardForm(false);
    setStandardForm({
      item: "",
      unit: "",
      legalStandard: "",
      internalStandard: "",
      measurementCycle: "",
      notes: "",
    });
    alert("환경 기준이 등록되었습니다.");
  };

  const handleActionUpdate = (abnormalityId: number, field: string, value: string) => {
    setAbnormalities(
      abnormalities.map((a) =>
        a.id === abnormalityId ? { ...a, [field]: value } : a
      )
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "완료":
        return "success" as const;
      case "조치중":
        return "warning" as const;
      case "미조치":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">환경관리</h1>
          <p className="text-muted-foreground">작업 환경 측정 및 관리 (IATF 16949)</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="measurement">환경 측정</TabsTrigger>
          <TabsTrigger value="standards">환경 기준 관리</TabsTrigger>
          <TabsTrigger value="abnormality">이상 현황</TabsTrigger>
          <TabsTrigger value="history">측정 이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: Environment Measurement */}
        <TabsContent value="measurement">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">환경 측정</h2>
              <Button onClick={() => setShowMeasurementForm(!showMeasurementForm)}>
                <Plus className="mr-2 h-4 w-4" />
                측정 등록
              </Button>
            </div>

            {showMeasurementForm && (
              <Card>
                <CardHeader>
                  <CardTitle>신규 측정 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMeasurementSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>측정일 *</Label>
                        <Input
                          type="date"
                          value={measurementForm.measurementDate}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, measurementDate: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정시간 *</Label>
                        <Input
                          type="time"
                          value={measurementForm.measurementTime}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, measurementTime: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정장소 *</Label>
                        <Select
                          value={measurementForm.location}
                          onValueChange={(v) => setMeasurementForm({ ...measurementForm, location: v })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((loc) => (
                              <SelectItem key={loc} value={loc}>
                                {loc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>측정자 *</Label>
                        <Input
                          value={measurementForm.measuredBy}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, measuredBy: e.target.value })
                          }
                          placeholder="측정자명"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-6">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Thermometer className="h-4 w-4" />
                          온도 (°C) *
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={measurementForm.temperature}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, temperature: e.target.value })
                          }
                          placeholder="23.5"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Droplets className="h-4 w-4" />
                          습도 (%) *
                        </Label>
                        <Input
                          type="number"
                          value={measurementForm.humidity}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, humidity: e.target.value })
                          }
                          placeholder="55"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Sun className="h-4 w-4" />
                          조도 (Lux) *
                        </Label>
                        <Input
                          type="number"
                          value={measurementForm.illumination}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, illumination: e.target.value })
                          }
                          placeholder="500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Volume2 className="h-4 w-4" />
                          소음 (dB) *
                        </Label>
                        <Input
                          type="number"
                          value={measurementForm.noise}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, noise: e.target.value })
                          }
                          placeholder="70"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Wind className="h-4 w-4" />
                          분진 (mg/m³) *
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={measurementForm.dust}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, dust: e.target.value })
                          }
                          placeholder="0.05"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          유해가스 (ppm) *
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={measurementForm.harmfulGas}
                          onChange={(e) =>
                            setMeasurementForm({ ...measurementForm, harmfulGas: e.target.value })
                          }
                          placeholder="0.02"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowMeasurementForm(false)}
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

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">오늘 측정</p>
                      <p className="text-2xl font-bold">
                        {measurements.filter((m) => m.measurementDate === "2026-06-10").length}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">정상</p>
                      <p className="text-2xl font-bold text-green-600">
                        {measurements.filter((m) => m.status === "정상").length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">이상</p>
                      <p className="text-2xl font-bold text-red-600">
                        {measurements.filter((m) => m.status === "이상").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">미조치 건</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {abnormalities.filter((a) => a.improvementStatus === "미조치").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Measurements */}
            <Card>
              <CardHeader>
                <CardTitle>최근 측정 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>측정일시</TableHead>
                      <TableHead>측정장소</TableHead>
                      <TableHead className="text-right">온도</TableHead>
                      <TableHead className="text-right">습도</TableHead>
                      <TableHead className="text-right">조도</TableHead>
                      <TableHead className="text-right">소음</TableHead>
                      <TableHead className="text-right">분진</TableHead>
                      <TableHead className="text-right">유해가스</TableHead>
                      <TableHead>측정자</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurements.slice(0, 5).map((measurement) => (
                      <TableRow key={measurement.id}>
                        <TableCell>
                          {measurement.measurementDate} {measurement.measurementTime}
                        </TableCell>
                        <TableCell className="font-medium">{measurement.location}</TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("온도", measurement.temperature) ? "text-red-600 font-bold" : ""
                          }`}
                        >
                          {measurement.temperature}°C
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("습도", measurement.humidity) ? "text-red-600 font-bold" : ""
                          }`}
                        >
                          {measurement.humidity}%
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("조도", measurement.illumination) ? "text-red-600 font-bold" : ""
                          }`}
                        >
                          {measurement.illumination} Lux
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("소음", measurement.noise) ? "text-red-600 font-bold" : ""
                          }`}
                        >
                          {measurement.noise} dB
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("분진", measurement.dust) ? "text-red-600 font-bold" : ""
                          }`}
                        >
                          {measurement.dust} mg/m³
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("유해가스", measurement.harmfulGas) ? "text-red-600 font-bold" : ""
                          }`}
                        >
                          {measurement.harmfulGas} ppm
                        </TableCell>
                        <TableCell>{measurement.measuredBy}</TableCell>
                        <TableCell>
                          <Badge
                            variant={measurement.status === "정상" ? "success" : "destructive"}
                          >
                            {measurement.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Environment Standards */}
        <TabsContent value="standards">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                환경 기준 관리
              </h2>
              <Button onClick={() => setShowStandardForm(!showStandardForm)}>
                <Plus className="mr-2 h-4 w-4" />
                기준 등록
              </Button>
            </div>

            {showStandardForm && (
              <Card>
                <CardHeader>
                  <CardTitle>신규 기준 등록</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStandardSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>측정 항목 *</Label>
                        <Input
                          value={standardForm.item}
                          onChange={(e) =>
                            setStandardForm({ ...standardForm, item: e.target.value })
                          }
                          placeholder="예: 온도"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>단위 *</Label>
                        <Input
                          value={standardForm.unit}
                          onChange={(e) =>
                            setStandardForm({ ...standardForm, unit: e.target.value })
                          }
                          placeholder="예: °C"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>측정주기 *</Label>
                        <Select
                          value={standardForm.measurementCycle}
                          onValueChange={(v) =>
                            setStandardForm({ ...standardForm, measurementCycle: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="매일 1회">매일 1회</SelectItem>
                            <SelectItem value="매일 2회">매일 2회</SelectItem>
                            <SelectItem value="주 1회">주 1회</SelectItem>
                            <SelectItem value="주 2회">주 2회</SelectItem>
                            <SelectItem value="월 1회">월 1회</SelectItem>
                            <SelectItem value="분기 1회">분기 1회</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>법적 기준 *</Label>
                        <Input
                          value={standardForm.legalStandard}
                          onChange={(e) =>
                            setStandardForm({ ...standardForm, legalStandard: e.target.value })
                          }
                          placeholder="예: 18~28"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>사내 기준 *</Label>
                        <Input
                          value={standardForm.internalStandard}
                          onChange={(e) =>
                            setStandardForm({ ...standardForm, internalStandard: e.target.value })
                          }
                          placeholder="예: 20~26"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>비고</Label>
                      <Textarea
                        value={standardForm.notes}
                        onChange={(e) =>
                          setStandardForm({ ...standardForm, notes: e.target.value })
                        }
                        placeholder="추가 설명이나 참고사항"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowStandardForm(false)}
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

            <Card>
              <CardHeader>
                <CardTitle>환경 관리 기준표</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>항목</TableHead>
                      <TableHead>단위</TableHead>
                      <TableHead>법적 기준</TableHead>
                      <TableHead>사내 기준</TableHead>
                      <TableHead>측정주기</TableHead>
                      <TableHead>비고</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standards.map((standard) => (
                      <TableRow key={standard.id}>
                        <TableCell className="font-medium">{standard.item}</TableCell>
                        <TableCell>{standard.unit}</TableCell>
                        <TableCell>{standard.legalStandard}</TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {standard.internalStandard}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{standard.measurementCycle}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{standard.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Abnormality Status */}
        <TabsContent value="abnormality">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              이상 현황
            </h2>

            {/* Summary by status */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700">미조치</p>
                      <p className="text-2xl font-bold text-red-700">
                        {abnormalities.filter((a) => a.improvementStatus === "미조치").length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-700">조치중</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {abnormalities.filter((a) => a.improvementStatus === "조치중").length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700">완료</p>
                      <p className="text-2xl font-bold text-green-700">
                        {abnormalities.filter((a) => a.improvementStatus === "완료").length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Abnormality list */}
            <Card>
              <CardHeader>
                <CardTitle>기준 초과 이력 및 조치 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>발생일</TableHead>
                      <TableHead>측정장소</TableHead>
                      <TableHead>항목</TableHead>
                      <TableHead>측정값</TableHead>
                      <TableHead>기준값</TableHead>
                      <TableHead>조치 내용</TableHead>
                      <TableHead>조치일</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abnormalities.map((abnormality) => (
                      <TableRow key={abnormality.id}>
                        <TableCell>{abnormality.detectedDate}</TableCell>
                        <TableCell className="font-medium">{abnormality.location}</TableCell>
                        <TableCell>{abnormality.item}</TableCell>
                        <TableCell className="text-red-600 font-bold">
                          {abnormality.measuredValue}
                        </TableCell>
                        <TableCell>{abnormality.standardValue}</TableCell>
                        <TableCell className="max-w-xs">
                          {abnormality.improvementStatus === "미조치" ? (
                            <Input
                              placeholder="조치 내용 입력"
                              value={abnormality.actionTaken}
                              onChange={(e) =>
                                handleActionUpdate(abnormality.id, "actionTaken", e.target.value)
                              }
                              className="text-sm"
                            />
                          ) : (
                            <span className="text-sm">{abnormality.actionTaken}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {abnormality.improvementStatus === "미조치" ? (
                            <Input
                              type="date"
                              value={abnormality.actionDate}
                              onChange={(e) =>
                                handleActionUpdate(abnormality.id, "actionDate", e.target.value)
                              }
                              className="text-sm w-36"
                            />
                          ) : (
                            abnormality.actionDate
                          )}
                        </TableCell>
                        <TableCell>
                          {abnormality.improvementStatus === "미조치" ? (
                            <Input
                              placeholder="담당자"
                              value={abnormality.actionBy}
                              onChange={(e) =>
                                handleActionUpdate(abnormality.id, "actionBy", e.target.value)
                              }
                              className="text-sm w-24"
                            />
                          ) : (
                            abnormality.actionBy
                          )}
                        </TableCell>
                        <TableCell>
                          {abnormality.improvementStatus === "미조치" ? (
                            <Select
                              value={abnormality.improvementStatus}
                              onValueChange={(v) =>
                                handleActionUpdate(abnormality.id, "improvementStatus", v)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="미조치">미조치</SelectItem>
                                <SelectItem value="조치중">조치중</SelectItem>
                                <SelectItem value="완료">완료</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant={getStatusBadgeVariant(abnormality.improvementStatus)}>
                              {abnormality.improvementStatus}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {abnormalities.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center">
                    이상 현황이 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Measurement History */}
        <TabsContent value="history">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              측정 이력
            </h2>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="space-y-2">
                    <Label>검색</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="장소, 측정자..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>측정장소</Label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>측정일</Label>
                    <Input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>상태</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="정상">정상</SelectItem>
                        <SelectItem value="이상">이상</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="invisible">초기화</Label>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch("");
                        setLocationFilter("all");
                        setDateFilter("");
                        setStatusFilter("all");
                      }}
                      className="w-full"
                    >
                      초기화
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* History Table */}
            <Card>
              <CardHeader>
                <CardTitle>전체 측정 이력 ({filteredMeasurements.length}건)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>측정일</TableHead>
                      <TableHead>측정시간</TableHead>
                      <TableHead>측정장소</TableHead>
                      <TableHead className="text-right">온도</TableHead>
                      <TableHead className="text-right">습도</TableHead>
                      <TableHead className="text-right">조도</TableHead>
                      <TableHead className="text-right">소음</TableHead>
                      <TableHead className="text-right">분진</TableHead>
                      <TableHead className="text-right">유해가스</TableHead>
                      <TableHead>측정자</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMeasurements.map((measurement) => (
                      <TableRow key={measurement.id}>
                        <TableCell>{measurement.measurementDate}</TableCell>
                        <TableCell>{measurement.measurementTime}</TableCell>
                        <TableCell className="font-medium">{measurement.location}</TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("온도", measurement.temperature)
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {measurement.temperature}°C
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("습도", measurement.humidity)
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {measurement.humidity}%
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("조도", measurement.illumination)
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {measurement.illumination} Lux
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("소음", measurement.noise)
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {measurement.noise} dB
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("분진", measurement.dust)
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {measurement.dust} mg/m³
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            !checkStandard("유해가스", measurement.harmfulGas)
                              ? "text-red-600 font-bold"
                              : ""
                          }`}
                        >
                          {measurement.harmfulGas} ppm
                        </TableCell>
                        <TableCell>{measurement.measuredBy}</TableCell>
                        <TableCell>
                          <Badge
                            variant={measurement.status === "정상" ? "success" : "destructive"}
                          >
                            {measurement.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredMeasurements.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center">
                    조회된 측정 이력이 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
