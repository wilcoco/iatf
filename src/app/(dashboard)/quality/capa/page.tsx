"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Search, Save } from "lucide-react";
import { getActiveDefectTypes } from "@/lib/master-data";

interface CAPAFormData {
  // Header
  capaNumber: string;
  registrationDate: string;
  capaType: "corrective" | "preventive" | "";
  department: string;
  responsiblePerson: string;

  // Problem Definition
  problemDate: string;
  discoveryPath: "internal-audit" | "customer-claim" | "process-inspection" | "shipping-inspection" | "other" | "";
  problemDescription: string;
  relatedProductProcess: string;

  // Root Cause Analysis (5Why)
  why1: string;
  why2: string;
  why3: string;
  why4: string;
  why5: string;
  fishboneResult: string;
  rootCauseConclusion: string;

  // Corrective Action
  immediateAction: string;
  permanentActionPlan: string;
  correctiveResponsible: string;
  correctiveCompletionDate: string;

  // Preventive Action
  horizontalDeploymentTarget: string;
  preventiveActionContent: string;

  // Verification
  verificationMethod: string;
  verificationDate: string;
  verificationResult: "effective" | "ineffective" | "";

  // Standardization
  revisedDocuments: string;
  trainingCompleted: boolean;
}

const initialFormData: CAPAFormData = {
  capaNumber: "",
  registrationDate: new Date().toISOString().split("T")[0],
  capaType: "",
  department: "",
  responsiblePerson: "",
  problemDate: "",
  discoveryPath: "",
  problemDescription: "",
  relatedProductProcess: "",
  why1: "",
  why2: "",
  why3: "",
  why4: "",
  why5: "",
  fishboneResult: "",
  rootCauseConclusion: "",
  immediateAction: "",
  permanentActionPlan: "",
  correctiveResponsible: "",
  correctiveCompletionDate: "",
  horizontalDeploymentTarget: "",
  preventiveActionContent: "",
  verificationMethod: "",
  verificationDate: "",
  verificationResult: "",
  revisedDocuments: "",
  trainingCompleted: false,
};

const discoveryPathLabels: Record<string, string> = {
  "internal-audit": "내부감사",
  "customer-claim": "고객클레임",
  "process-inspection": "공정검사",
  "shipping-inspection": "출하검사",
  "other": "기타",
};

const capaTypeLabels: Record<string, string> = {
  corrective: "시정조치",
  preventive: "예방조치",
};

export default function CAPAPage() {
  const [activeTab, setActiveTab] = useState("problem");
  const [formData, setFormData] = useState<CAPAFormData>(initialFormData);

  const updateField = <K extends keyof CAPAFormData>(
    field: K,
    value: CAPAFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateCAPANumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    updateField("capaNumber", `CAPA-${year}${month}-${random}`);
  };

  const handleSave = () => {
    console.log("Saving CAPA data:", formData);
    alert("CAPA 데이터가 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CAPA 분석/관리</h1>
          <p className="text-muted-foreground">시정예방조치 분석 및 관리</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            CAPA 기본정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capaNumber">CAPA번호</Label>
              <div className="flex gap-2">
                <Input
                  id="capaNumber"
                  value={formData.capaNumber}
                  onChange={(e) => updateField("capaNumber", e.target.value)}
                  placeholder="CAPA-YYYYMM-XXX"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateCAPANumber}
                  className="shrink-0"
                >
                  자동생성
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDate">등록일</Label>
              <Input
                id="registrationDate"
                type="date"
                value={formData.registrationDate}
                onChange={(e) => updateField("registrationDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>유형</Label>
              <Select
                value={formData.capaType}
                onValueChange={(value) =>
                  updateField("capaType", value as CAPAFormData["capaType"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corrective">시정조치</SelectItem>
                  <SelectItem value="preventive">예방조치</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">발생부서</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => updateField("department", e.target.value)}
                placeholder="부서명 입력"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsiblePerson">담당자</Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={(e) => updateField("responsiblePerson", e.target.value)}
                placeholder="담당자명 입력"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="problem">문제정의 및 등록</TabsTrigger>
          <TabsTrigger value="analysis">원인분석 (5Why)</TabsTrigger>
        </TabsList>

        {/* Tab 1: Problem Definition */}
        <TabsContent value="problem">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                문제 정의 (Problem Definition)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="problemDate">문제 발생일</Label>
                  <Input
                    id="problemDate"
                    type="date"
                    value={formData.problemDate}
                    onChange={(e) => updateField("problemDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>발견경로</Label>
                  <Select
                    value={formData.discoveryPath}
                    onValueChange={(value) =>
                      updateField(
                        "discoveryPath",
                        value as CAPAFormData["discoveryPath"]
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="발견경로 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal-audit">내부감사</SelectItem>
                      <SelectItem value="customer-claim">고객클레임</SelectItem>
                      <SelectItem value="process-inspection">공정검사</SelectItem>
                      <SelectItem value="shipping-inspection">출하검사</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemDescription">문제 상세 내용</Label>
                <Textarea
                  id="problemDescription"
                  value={formData.problemDescription}
                  onChange={(e) =>
                    updateField("problemDescription", e.target.value)
                  }
                  placeholder="문제 상황을 상세하게 기술하세요"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedProductProcess">관련 제품/공정</Label>
                <Input
                  id="relatedProductProcess"
                  value={formData.relatedProductProcess}
                  onChange={(e) =>
                    updateField("relatedProductProcess", e.target.value)
                  }
                  placeholder="관련된 제품명 또는 공정명 입력"
                />
              </div>

              {/* Corrective Action Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  시정조치 (Corrective Action)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="immediateAction">즉시조치 내용</Label>
                    <Textarea
                      id="immediateAction"
                      value={formData.immediateAction}
                      onChange={(e) =>
                        updateField("immediateAction", e.target.value)
                      }
                      placeholder="즉시 수행한 조치 내용을 기술하세요"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permanentActionPlan">영구조치 계획</Label>
                    <Textarea
                      id="permanentActionPlan"
                      value={formData.permanentActionPlan}
                      onChange={(e) =>
                        updateField("permanentActionPlan", e.target.value)
                      }
                      placeholder="영구적인 조치 계획을 기술하세요"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="correctiveResponsible">담당자</Label>
                      <Input
                        id="correctiveResponsible"
                        value={formData.correctiveResponsible}
                        onChange={(e) =>
                          updateField("correctiveResponsible", e.target.value)
                        }
                        placeholder="시정조치 담당자"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="correctiveCompletionDate">완료일</Label>
                      <Input
                        id="correctiveCompletionDate"
                        type="date"
                        value={formData.correctiveCompletionDate}
                        onChange={(e) =>
                          updateField("correctiveCompletionDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preventive Action Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  예방조치 (Preventive Action)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="horizontalDeploymentTarget">
                      수평전개 대상
                    </Label>
                    <Input
                      id="horizontalDeploymentTarget"
                      value={formData.horizontalDeploymentTarget}
                      onChange={(e) =>
                        updateField("horizontalDeploymentTarget", e.target.value)
                      }
                      placeholder="수평전개 대상 부서/공정/제품 입력"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preventiveActionContent">예방조치 내용</Label>
                    <Textarea
                      id="preventiveActionContent"
                      value={formData.preventiveActionContent}
                      onChange={(e) =>
                        updateField("preventiveActionContent", e.target.value)
                      }
                      placeholder="예방조치 내용을 기술하세요"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Verification Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  효과검증 (Verification)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationMethod">검증방법</Label>
                    <Textarea
                      id="verificationMethod"
                      value={formData.verificationMethod}
                      onChange={(e) =>
                        updateField("verificationMethod", e.target.value)
                      }
                      placeholder="효과를 검증할 방법을 기술하세요"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="verificationDate">검증일자</Label>
                      <Input
                        id="verificationDate"
                        type="date"
                        value={formData.verificationDate}
                        onChange={(e) =>
                          updateField("verificationDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>검증결과</Label>
                      <Select
                        value={formData.verificationResult}
                        onValueChange={(value) =>
                          updateField(
                            "verificationResult",
                            value as CAPAFormData["verificationResult"]
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="검증결과 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="effective">효과적</SelectItem>
                          <SelectItem value="ineffective">비효과적</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standardization Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  표준화 (Standardization)
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="revisedDocuments">개정 문서 목록</Label>
                    <Textarea
                      id="revisedDocuments"
                      value={formData.revisedDocuments}
                      onChange={(e) =>
                        updateField("revisedDocuments", e.target.value)
                      }
                      placeholder="개정된 문서명을 나열하세요 (예: 작업표준서-001, 검사기준서-002)"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="trainingCompleted"
                      checked={formData.trainingCompleted}
                      onChange={(e) =>
                        updateField("trainingCompleted", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="trainingCompleted">교육 실시 완료</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Root Cause Analysis (5Why) */}
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>근본원인 분석 (Root Cause Analysis)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 5Why Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">5Why 분석</h3>
                <p className="text-sm text-muted-foreground">
                  문제의 근본 원인을 찾기 위해 "왜?"를 반복하여 질문합니다.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="why1">Why 1: 왜 문제가 발생했는가?</Label>
                      <Textarea
                        id="why1"
                        value={formData.why1}
                        onChange={(e) => updateField("why1", e.target.value)}
                        placeholder="첫 번째 원인을 기술하세요"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="why2">Why 2: 왜 그런 원인이 있었는가?</Label>
                      <Textarea
                        id="why2"
                        value={formData.why2}
                        onChange={(e) => updateField("why2", e.target.value)}
                        placeholder="두 번째 원인을 기술하세요"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="why3">Why 3: 왜 그런 상황이 발생했는가?</Label>
                      <Textarea
                        id="why3"
                        value={formData.why3}
                        onChange={(e) => updateField("why3", e.target.value)}
                        placeholder="세 번째 원인을 기술하세요"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="why4">Why 4: 왜 그런 조건이 존재했는가?</Label>
                      <Textarea
                        id="why4"
                        value={formData.why4}
                        onChange={(e) => updateField("why4", e.target.value)}
                        placeholder="네 번째 원인을 기술하세요"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      5
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="why5">Why 5: 근본 원인은 무엇인가?</Label>
                      <Textarea
                        id="why5"
                        value={formData.why5}
                        onChange={(e) => updateField("why5", e.target.value)}
                        placeholder="다섯 번째 원인 (근본 원인)을 기술하세요"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fishbone Result */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">특성요인도 (Fishbone) 결과</h3>
                <p className="text-sm text-muted-foreground">
                  4M (Man, Machine, Material, Method) 또는 6M 분석 결과를 기술하세요.
                </p>
                <Textarea
                  id="fishboneResult"
                  value={formData.fishboneResult}
                  onChange={(e) => updateField("fishboneResult", e.target.value)}
                  placeholder="특성요인도 분석 결과를 기술하세요.&#10;&#10;예시:&#10;- Man (인적 요인): 작업자 교육 부족&#10;- Machine (설비 요인): 설비 노후화&#10;- Material (재료 요인): 원자재 품질 변동&#10;- Method (방법 요인): 작업 표준 미흡"
                  rows={8}
                />
              </div>

              {/* Root Cause Conclusion */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">근본원인 결론</h3>
                <Textarea
                  id="rootCauseConclusion"
                  value={formData.rootCauseConclusion}
                  onChange={(e) =>
                    updateField("rootCauseConclusion", e.target.value)
                  }
                  placeholder="위 분석을 종합하여 도출된 근본원인을 명확하게 기술하세요"
                  rows={4}
                />
              </div>

              {/* Summary Card */}
              {(formData.why1 || formData.rootCauseConclusion) && (
                <div className="border-t pt-6">
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-base">분석 요약</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {formData.why1 && (
                          <p>
                            <span className="font-medium">1차 원인:</span>{" "}
                            {formData.why1}
                          </p>
                        )}
                        {formData.why5 && (
                          <p>
                            <span className="font-medium">근본 원인:</span>{" "}
                            {formData.why5}
                          </p>
                        )}
                        {formData.rootCauseConclusion && (
                          <p className="pt-2 border-t">
                            <span className="font-medium">결론:</span>{" "}
                            {formData.rootCauseConclusion}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
