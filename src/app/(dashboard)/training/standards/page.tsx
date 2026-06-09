"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Clock,
} from "lucide-react";

// Header information type
interface HeaderInfo {
  departmentName: string;
  createdDate: string;
  createdBy: string;
}

// Qualification certification record type
interface CertificationRecord {
  id: number;
  no: number;
  name: string;
  qualificationType: "내부심사원" | "품질검사원" | "생산현장";
  certificationDate: string;
  validUntil: string;
  evaluationResult: "합격" | "불합격";
  remarks: string;
}

// Qualification standards type
interface QualificationStandard {
  id: number;
  qualificationType: "내부심사원" | "품질검사원" | "생산현장";
  requiredTraining: string;
  requiredExperience: string;
  evaluationCriteria: string;
  passingScore: number;
  validityMonths: number;
}

// Sample data for standards
const initialStandards: QualificationStandard[] = [
  {
    id: 1,
    qualificationType: "내부심사원",
    requiredTraining: "ISO 9001 내부심사원 과정 (16시간)",
    requiredExperience: "품질관리 업무 2년 이상",
    evaluationCriteria: "필기시험 + 실기평가",
    passingScore: 80,
    validityMonths: 24,
  },
  {
    id: 2,
    qualificationType: "품질검사원",
    requiredTraining: "품질검사 기본과정 (8시간)",
    requiredExperience: "제조업 경력 1년 이상",
    evaluationCriteria: "실기시험",
    passingScore: 70,
    validityMonths: 12,
  },
  {
    id: 3,
    qualificationType: "생산현장",
    requiredTraining: "안전교육 + 공정교육 (4시간)",
    requiredExperience: "신규입사자 가능",
    evaluationCriteria: "OJT 평가",
    passingScore: 60,
    validityMonths: 12,
  },
];

// Sample data for certified personnel
const initialCertifications: CertificationRecord[] = [
  {
    id: 1,
    no: 1,
    name: "김철수",
    qualificationType: "내부심사원",
    certificationDate: "2025-06-01",
    validUntil: "2027-06-01",
    evaluationResult: "합격",
    remarks: "",
  },
  {
    id: 2,
    no: 2,
    name: "이영희",
    qualificationType: "품질검사원",
    certificationDate: "2025-09-15",
    validUntil: "2026-09-15",
    evaluationResult: "합격",
    remarks: "",
  },
  {
    id: 3,
    no: 3,
    name: "박민수",
    qualificationType: "생산현장",
    certificationDate: "2026-01-10",
    validUntil: "2027-01-10",
    evaluationResult: "합격",
    remarks: "신입사원",
  },
  {
    id: 4,
    no: 4,
    name: "최지연",
    qualificationType: "품질검사원",
    certificationDate: "2025-07-20",
    validUntil: "2026-07-20",
    evaluationResult: "합격",
    remarks: "갱신 예정",
  },
  {
    id: 5,
    no: 5,
    name: "정대호",
    qualificationType: "내부심사원",
    certificationDate: "2024-08-01",
    validUntil: "2026-08-01",
    evaluationResult: "합격",
    remarks: "",
  },
];

export default function QualificationCertificationPage() {
  const [activeTab, setActiveTab] = useState("standards");

  // Header state
  const [header, setHeader] = useState<HeaderInfo>({
    departmentName: "품질관리팀",
    createdDate: new Date().toISOString().split("T")[0],
    createdBy: "",
  });

  // Standards state
  const [standards] = useState<QualificationStandard[]>(initialStandards);

  // Certifications state
  const [certifications, setCertifications] =
    useState<CertificationRecord[]>(initialCertifications);

  // Form state for new certification
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    qualificationType: "" as
      | ""
      | "내부심사원"
      | "품질검사원"
      | "생산현장",
    certificationDate: "",
    validUntil: "",
    evaluationResult: "" as "" | "합격" | "불합격",
    remarks: "",
  });

  // Calculate expiring certifications (within 90 days)
  const getExpiringCertifications = () => {
    const today = new Date();
    const ninetyDaysFromNow = new Date(
      today.getTime() + 90 * 24 * 60 * 60 * 1000
    );

    return certifications
      .filter((cert) => {
        const validUntil = new Date(cert.validUntil);
        return (
          validUntil >= today &&
          validUntil <= ninetyDaysFromNow &&
          cert.evaluationResult === "합격"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime()
      );
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (validUntil: string) => {
    const today = new Date();
    const expDate = new Date(validUntil);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle new certification submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.qualificationType ||
      !formData.certificationDate ||
      !formData.validUntil ||
      !formData.evaluationResult
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const newCertification: CertificationRecord = {
      id: Date.now(),
      no: certifications.length + 1,
      name: formData.name,
      qualificationType: formData.qualificationType as
        | "내부심사원"
        | "품질검사원"
        | "생산현장",
      certificationDate: formData.certificationDate,
      validUntil: formData.validUntil,
      evaluationResult: formData.evaluationResult as "합격" | "불합격",
      remarks: formData.remarks,
    };

    setCertifications([...certifications, newCertification]);
    setShowForm(false);
    setFormData({
      name: "",
      qualificationType: "",
      certificationDate: "",
      validUntil: "",
      evaluationResult: "",
      remarks: "",
    });
    alert("자격인증 정보가 등록되었습니다.");
  };

  const expiringCertifications = getExpiringCertifications();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">자격인증 관리대장</h1>
          <p className="text-muted-foreground">
            직무별 자격인증 현황 및 관리
          </p>
        </div>
      </div>

      {/* Header Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>부서명</Label>
              <Input
                value={header.departmentName}
                onChange={(e) =>
                  setHeader({ ...header, departmentName: e.target.value })
                }
                placeholder="부서명 입력"
              />
            </div>
            <div className="space-y-2">
              <Label>작성일</Label>
              <Input
                type="date"
                value={header.createdDate}
                onChange={(e) =>
                  setHeader({ ...header, createdDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>작성자</Label>
              <Input
                value={header.createdBy}
                onChange={(e) =>
                  setHeader({ ...header, createdBy: e.target.value })
                }
                placeholder="작성자명 입력"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="standards" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            자격인증 기준
          </TabsTrigger>
          <TabsTrigger value="personnel" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            인증자 목록
          </TabsTrigger>
          <TabsTrigger value="expiring" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            만료예정 알림
            {expiringCertifications.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {expiringCertifications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Qualification Standards */}
        <TabsContent value="standards">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                자격유형별 인증 기준
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>자격유형</TableHead>
                    <TableHead>필수교육</TableHead>
                    <TableHead>필요경력</TableHead>
                    <TableHead>평가기준</TableHead>
                    <TableHead className="text-center">합격점수</TableHead>
                    <TableHead className="text-center">유효기간</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standards.map((std) => (
                    <TableRow key={std.id}>
                      <TableCell>
                        <Badge
                          variant={
                            std.qualificationType === "내부심사원"
                              ? "default"
                              : std.qualificationType === "품질검사원"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {std.qualificationType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {std.requiredTraining}
                      </TableCell>
                      <TableCell className="text-sm">
                        {std.requiredExperience}
                      </TableCell>
                      <TableCell className="text-sm">
                        {std.evaluationCriteria}
                      </TableCell>
                      <TableCell className="text-center">
                        {std.passingScore}점 이상
                      </TableCell>
                      <TableCell className="text-center">
                        {std.validityMonths}개월
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Certified Personnel List */}
        <TabsContent value="personnel">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                인증자 목록
              </CardTitle>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="mr-2 h-4 w-4" />
                인증자 등록
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showForm && (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>성명 *</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="이름 입력"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>자격유형 *</Label>
                          <Select
                            value={formData.qualificationType}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                qualificationType: value as
                                  | "내부심사원"
                                  | "품질검사원"
                                  | "생산현장",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="자격유형 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="내부심사원">
                                내부심사원
                              </SelectItem>
                              <SelectItem value="품질검사원">
                                품질검사원
                              </SelectItem>
                              <SelectItem value="생산현장">생산현장</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>평가결과 *</Label>
                          <Select
                            value={formData.evaluationResult}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                evaluationResult: value as "합격" | "불합격",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="평가결과 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="합격">합격</SelectItem>
                              <SelectItem value="불합격">불합격</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>인증일자 *</Label>
                          <Input
                            type="date"
                            value={formData.certificationDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                certificationDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>유효기간 *</Label>
                          <Input
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                validUntil: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>비고</Label>
                          <Input
                            value={formData.remarks}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                remarks: e.target.value,
                              })
                            }
                            placeholder="비고 입력"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowForm(false)}
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

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">NO</TableHead>
                    <TableHead>성명</TableHead>
                    <TableHead>자격유형</TableHead>
                    <TableHead className="text-center">인증일자</TableHead>
                    <TableHead className="text-center">유효기간</TableHead>
                    <TableHead className="text-center">평가결과</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certifications.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-muted-foreground py-8 text-center"
                      >
                        등록된 인증자가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    certifications.map((cert) => (
                      <TableRow key={cert.id}>
                        <TableCell className="text-center font-medium">
                          {cert.no}
                        </TableCell>
                        <TableCell className="font-medium">
                          {cert.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              cert.qualificationType === "내부심사원"
                                ? "default"
                                : cert.qualificationType === "품질검사원"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {cert.qualificationType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {cert.certificationDate}
                        </TableCell>
                        <TableCell className="text-center">
                          {cert.validUntil}
                        </TableCell>
                        <TableCell className="text-center">
                          {cert.evaluationResult === "합격" ? (
                            <Badge
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              합격
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="mr-1 h-3 w-3" />
                              불합격
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {cert.remarks || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Expiring Certifications */}
        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                만료예정 자격인증 (90일 이내)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expiringCertifications.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center">
                  <CheckCircle className="mx-auto mb-2 h-12 w-12 text-green-500" />
                  <p>90일 이내 만료 예정인 자격인증이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <AlertTriangle className="mr-2 inline h-4 w-4" />
                      아래 인원들의 자격인증이 곧 만료됩니다. 갱신 절차를
                      진행해 주세요.
                    </p>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>성명</TableHead>
                        <TableHead>자격유형</TableHead>
                        <TableHead className="text-center">
                          만료일자
                        </TableHead>
                        <TableHead className="text-center">
                          남은 일수
                        </TableHead>
                        <TableHead className="text-center">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expiringCertifications.map((cert) => {
                        const daysLeft = getDaysUntilExpiration(cert.validUntil);
                        return (
                          <TableRow key={cert.id}>
                            <TableCell className="font-medium">
                              {cert.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  cert.qualificationType === "내부심사원"
                                    ? "default"
                                    : cert.qualificationType === "품질검사원"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {cert.qualificationType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {cert.validUntil}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`font-semibold ${
                                  daysLeft <= 30
                                    ? "text-red-600"
                                    : daysLeft <= 60
                                      ? "text-amber-600"
                                      : "text-green-600"
                                }`}
                              >
                                {daysLeft}일
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {daysLeft <= 30 ? (
                                <Badge variant="destructive">긴급</Badge>
                              ) : daysLeft <= 60 ? (
                                <Badge
                                  variant="default"
                                  className="bg-amber-500 hover:bg-amber-600"
                                >
                                  주의
                                </Badge>
                              ) : (
                                <Badge variant="secondary">예정</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
