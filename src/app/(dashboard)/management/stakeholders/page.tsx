"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Save, Trash2, Search, AlertTriangle, Building2, FileText } from "lucide-react";

// Types
type StakeholderCategory = "내부" | "고객사" | "공급자" | "관공서";
type SeverityLevel = "상" | "중" | "하";

interface Stakeholder {
  id: number;
  category: StakeholderCategory;
  name: string;
  needs: string;
  document: string;
  department: string;
  remarks: string;
}

interface RiskMonitoring {
  id: number;
  processName: string;
  risk: string;
  currentAction: string;
  severity: SeverityLevel;
  recommendation: string;
  department: string;
  result: string;
}

const CATEGORIES: StakeholderCategory[] = ["내부", "고객사", "공급자", "관공서"];
const SEVERITIES: SeverityLevel[] = ["상", "중", "하"];

// Sample data
const initialStakeholders: Stakeholder[] = [
  {
    id: 1,
    category: "내부",
    name: "주주 및 이사진",
    needs: "회사 자산/제품가치 유지",
    document: "이사회의사록",
    department: "영업관리팀",
    remarks: "",
  },
  {
    id: 2,
    category: "내부",
    name: "내부직원",
    needs: "복지향상/안정적 급여",
    document: "자금관리프로세스",
    department: "경영관리팀",
    remarks: "",
  },
  {
    id: 3,
    category: "고객사",
    name: "공통",
    needs: "납기준수",
    document: "영업관리프로세스",
    department: "생산팀",
    remarks: "",
  },
  {
    id: 4,
    category: "공급자",
    name: "공통",
    needs: "신규아이템 배정/안정적 자금결제",
    document: "구매관리프로세스",
    department: "상생협력팀",
    remarks: "",
  },
  {
    id: 5,
    category: "관공서",
    name: "세무서",
    needs: "성실 세납",
    document: "세무법규",
    department: "경영관리팀",
    remarks: "",
  },
  {
    id: 6,
    category: "관공서",
    name: "환경부",
    needs: "환경법규 준수",
    document: "환경법규",
    department: "생산기술팀",
    remarks: "",
  },
];

const initialRisks: RiskMonitoring[] = [
  {
    id: 1,
    processName: "영업관리프로세스",
    risk: "납기 지연으로 고객 신뢰 하락",
    currentAction: "주간 생산계획 점검 및 진척 관리",
    severity: "상",
    recommendation: "납기 모니터링 시스템 도입",
    department: "생산팀",
    result: "지연율 2% 이내 유지",
  },
  {
    id: 2,
    processName: "구매관리프로세스",
    risk: "공급자 자금난에 따른 공급 중단",
    currentAction: "협력사 재무 상태 정기 점검",
    severity: "중",
    recommendation: "복수 공급선 확보",
    department: "상생협력팀",
    result: "이중화 80% 완료",
  },
  {
    id: 3,
    processName: "환경관리프로세스",
    risk: "환경법규 위반 시 행정처분",
    currentAction: "환경법규 변경사항 분기 검토",
    severity: "하",
    recommendation: "법규 모니터링 담당자 지정",
    department: "생산기술팀",
    result: "위반 사례 없음",
  },
];

// Badge helpers
function categoryBadge(category: StakeholderCategory) {
  const map: Record<StakeholderCategory, string> = {
    내부: "bg-blue-100 text-blue-800",
    고객사: "bg-green-100 text-green-800",
    공급자: "bg-purple-100 text-purple-800",
    관공서: "bg-orange-100 text-orange-800",
  };
  return <Badge className={map[category]}>{category}</Badge>;
}

function severityBadge(severity: SeverityLevel) {
  const map: Record<SeverityLevel, string> = {
    상: "bg-red-100 text-red-800",
    중: "bg-yellow-100 text-yellow-800",
    하: "bg-green-100 text-green-800",
  };
  return <Badge className={map[severity]}>{severity}</Badge>;
}

export default function StakeholdersPage() {
  const [activeTab, setActiveTab] = useState("needs");
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialStakeholders);
  const [risks, setRisks] = useState<RiskMonitoring[]>(initialRisks);
  const [search, setSearch] = useState("");

  // Stakeholder form state
  const [shForm, setShForm] = useState<Omit<Stakeholder, "id">>({
    category: "내부",
    name: "",
    needs: "",
    document: "",
    department: "",
    remarks: "",
  });

  // Risk form state
  const [riskForm, setRiskForm] = useState<Omit<RiskMonitoring, "id">>({
    processName: "",
    risk: "",
    currentAction: "",
    severity: "중",
    recommendation: "",
    department: "",
    result: "",
  });

  const addStakeholder = () => {
    if (!shForm.name.trim() || !shForm.needs.trim()) {
      alert("이해관계자와 주요 요구사항을 입력하세요.");
      return;
    }
    const nextId = stakeholders.length > 0 ? Math.max(...stakeholders.map((s) => s.id)) + 1 : 1;
    setStakeholders([...stakeholders, { id: nextId, ...shForm }]);
    setShForm({ category: "내부", name: "", needs: "", document: "", department: "", remarks: "" });
  };

  const removeStakeholder = (id: number) => {
    setStakeholders(stakeholders.filter((s) => s.id !== id));
  };

  const addRisk = () => {
    if (!riskForm.processName.trim() || !riskForm.risk.trim()) {
      alert("프로세스명과 리스크 요약을 입력하세요.");
      return;
    }
    const nextId = risks.length > 0 ? Math.max(...risks.map((r) => r.id)) + 1 : 1;
    setRisks([...risks, { id: nextId, ...riskForm }]);
    setRiskForm({
      processName: "",
      risk: "",
      currentAction: "",
      severity: "중",
      recommendation: "",
      department: "",
      result: "",
    });
  };

  const removeRisk = (id: number) => {
    setRisks(risks.filter((r) => r.id !== id));
  };

  const filteredStakeholders = stakeholders.filter(
    (s) =>
      s.name.includes(search) ||
      s.needs.includes(search) ||
      s.department.includes(search) ||
      s.category.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">이해관계자 분석</h1>
        <p className="text-muted-foreground mt-1">
          구분별 이해관계자의 니즈를 파악하고, 관련 프로세스의 리스크를 모니터링합니다. (니즈 파악표)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            이해관계자 분석 (니즈 파악표)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="needs" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                니즈 파악표
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                리스크 모니터링
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: 니즈 파악표 */}
            <TabsContent value="needs" className="space-y-6">
              {/* Input form */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Plus className="h-4 w-4" />
                  이해관계자 추가
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>구분</Label>
                    <Select
                      value={shForm.category}
                      onValueChange={(v) => setShForm({ ...shForm, category: v as StakeholderCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="구분 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>이해관계자</Label>
                    <Input
                      value={shForm.name}
                      onChange={(e) => setShForm({ ...shForm, name: e.target.value })}
                      placeholder="예) 주주 및 이사진"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>관련부서</Label>
                    <Input
                      value={shForm.department}
                      onChange={(e) => setShForm({ ...shForm, department: e.target.value })}
                      placeholder="예) 영업관리팀"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>주요 요구사항 (니즈)</Label>
                    <Textarea
                      value={shForm.needs}
                      onChange={(e) => setShForm({ ...shForm, needs: e.target.value })}
                      placeholder="예) 회사 자산/제품가치 유지"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>관련문서/근거</Label>
                    <Input
                      value={shForm.document}
                      onChange={(e) => setShForm({ ...shForm, document: e.target.value })}
                      placeholder="예) 이사회의사록"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>비고</Label>
                    <Input
                      value={shForm.remarks}
                      onChange={(e) => setShForm({ ...shForm, remarks: e.target.value })}
                      placeholder="비고"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addStakeholder} className="w-full">
                      <Plus className="mr-1 h-4 w-4" />
                      추가
                    </Button>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="이해관계자/니즈/부서 검색"
                  className="pl-8"
                />
              </div>

              {/* Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">구분</TableHead>
                      <TableHead>이해관계자</TableHead>
                      <TableHead>주요 요구사항 (니즈)</TableHead>
                      <TableHead>관련문서/근거</TableHead>
                      <TableHead>관련부서</TableHead>
                      <TableHead>비고</TableHead>
                      <TableHead className="w-16 text-center">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStakeholders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          데이터가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStakeholders.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{categoryBadge(s.category)}</TableCell>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>{s.needs}</TableCell>
                          <TableCell>{s.document}</TableCell>
                          <TableCell>{s.department}</TableCell>
                          <TableCell className="text-muted-foreground">{s.remarks}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm" onClick={() => removeStakeholder(s.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Tab 2: 리스크 모니터링 */}
            <TabsContent value="risk" className="space-y-6">
              {/* Input form */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <Building2 className="h-4 w-4" />
                  리스크 모니터링 추가
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>프로세스명</Label>
                    <Input
                      value={riskForm.processName}
                      onChange={(e) => setRiskForm({ ...riskForm, processName: e.target.value })}
                      placeholder="예) 영업관리프로세스"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>심각도</Label>
                    <Select
                      value={riskForm.severity}
                      onValueChange={(v) => setRiskForm({ ...riskForm, severity: v as SeverityLevel })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="심각도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEVERITIES.map((sv) => (
                          <SelectItem key={sv} value={sv}>
                            {sv}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>관련부서</Label>
                    <Input
                      value={riskForm.department}
                      onChange={(e) => setRiskForm({ ...riskForm, department: e.target.value })}
                      placeholder="예) 생산팀"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label>리스크 요약</Label>
                    <Textarea
                      value={riskForm.risk}
                      onChange={(e) => setRiskForm({ ...riskForm, risk: e.target.value })}
                      placeholder="예) 납기 지연으로 고객 신뢰 하락"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label>현재 조치방법</Label>
                    <Textarea
                      value={riskForm.currentAction}
                      onChange={(e) => setRiskForm({ ...riskForm, currentAction: e.target.value })}
                      placeholder="예) 주간 생산계획 점검 및 진척 관리"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>권고 조치사항</Label>
                    <Input
                      value={riskForm.recommendation}
                      onChange={(e) => setRiskForm({ ...riskForm, recommendation: e.target.value })}
                      placeholder="예) 납기 모니터링 시스템 도입"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>모니터링 결과</Label>
                    <Input
                      value={riskForm.result}
                      onChange={(e) => setRiskForm({ ...riskForm, result: e.target.value })}
                      placeholder="예) 지연율 2% 이내 유지"
                    />
                  </div>
                  <div className="flex items-end md:col-span-3">
                    <Button onClick={addRisk} className="w-full md:w-auto">
                      <Save className="mr-1 h-4 w-4" />
                      저장
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>프로세스명</TableHead>
                      <TableHead>리스크 요약</TableHead>
                      <TableHead>현재 조치방법</TableHead>
                      <TableHead className="w-20 text-center">심각도</TableHead>
                      <TableHead>권고 조치사항</TableHead>
                      <TableHead>관련부서</TableHead>
                      <TableHead>모니터링 결과</TableHead>
                      <TableHead className="w-16 text-center">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {risks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground">
                          데이터가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      risks.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.processName}</TableCell>
                          <TableCell>{r.risk}</TableCell>
                          <TableCell>{r.currentAction}</TableCell>
                          <TableCell className="text-center">{severityBadge(r.severity)}</TableCell>
                          <TableCell>{r.recommendation}</TableCell>
                          <TableCell>{r.department}</TableCell>
                          <TableCell className="text-muted-foreground">{r.result}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm" onClick={() => removeRisk(r.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
