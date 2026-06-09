"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ClipboardList, BarChart3 } from "lucide-react";

interface CustomerSatisfaction {
  id: number;
  surveyDate: string;
  surveyType: string;
  customer: string;
  surveyItems: string;
  score: number;
  targetScore: number;
  result: string;
  improvements: string;
  nextSurveyDate: string;
}

const initialData: CustomerSatisfaction[] = [
  {
    id: 1,
    surveyDate: "2026-01-15",
    surveyType: "정기",
    customer: "현대자동차",
    surveyItems: "품질, 납기, 서비스, 가격경쟁력",
    score: 85,
    targetScore: 80,
    result: "달성",
    improvements: "납기 준수율 향상 필요",
    nextSurveyDate: "2026-07-15",
  },
  {
    id: 2,
    surveyDate: "2026-03-20",
    surveyType: "수시",
    customer: "기아자동차",
    surveyItems: "품질, 기술대응력, 의사소통",
    score: 72,
    targetScore: 80,
    result: "미달성",
    improvements: "기술대응력 개선 계획 수립",
    nextSurveyDate: "2026-06-20",
  },
];

const surveyTypeOptions = ["정기", "수시"];
const resultOptions = ["달성", "미달성"];

export default function CustomerSatisfactionPage() {
  const [surveys, setSurveys] = useState<CustomerSatisfaction[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    surveyDate: "",
    surveyType: "정기",
    customer: "",
    surveyItems: "",
    score: "",
    targetScore: "",
    result: "달성",
    improvements: "",
    nextSurveyDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSurvey: CustomerSatisfaction = {
      id: surveys.length + 1,
      surveyDate: formData.surveyDate,
      surveyType: formData.surveyType,
      customer: formData.customer,
      surveyItems: formData.surveyItems,
      score: Number(formData.score),
      targetScore: Number(formData.targetScore),
      result: formData.result,
      improvements: formData.improvements,
      nextSurveyDate: formData.nextSurveyDate,
    };
    setSurveys([...surveys, newSurvey]);
    setShowForm(false);
    setFormData({
      surveyDate: "",
      surveyType: "정기",
      customer: "",
      surveyItems: "",
      score: "",
      targetScore: "",
      result: "달성",
      improvements: "",
      nextSurveyDate: "",
    });
  };

  const getResultBadge = (result: string) => {
    const variants: Record<string, "success" | "destructive"> = {
      달성: "success",
      미달성: "destructive",
    };
    return <Badge variant={variants[result] || "secondary"}>{result}</Badge>;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">고객만족도 조사</h1>
          <p className="text-muted-foreground">고객만족도 조사 계획 및 결과 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          조사 등록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              고객만족도 조사 등록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="surveyDate">조사일자</Label>
                  <Input
                    id="surveyDate"
                    type="date"
                    value={formData.surveyDate}
                    onChange={(e) =>
                      setFormData({ ...formData, surveyDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surveyType">조사유형</Label>
                  <Select
                    value={formData.surveyType}
                    onValueChange={(value) => setFormData({ ...formData, surveyType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {surveyTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">고객사</Label>
                  <Input
                    id="customer"
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                    placeholder="예: 현대자동차"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="surveyItems">조사항목</Label>
                <Textarea
                  id="surveyItems"
                  value={formData.surveyItems}
                  onChange={(e) =>
                    setFormData({ ...formData, surveyItems: e.target.value })
                  }
                  placeholder="예: 품질, 납기, 서비스, 가격경쟁력"
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">점수</Label>
                  <Input
                    id="score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) =>
                      setFormData({ ...formData, score: e.target.value })
                    }
                    placeholder="0-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetScore">목표점수</Label>
                  <Input
                    id="targetScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.targetScore}
                    onChange={(e) =>
                      setFormData({ ...formData, targetScore: e.target.value })
                    }
                    placeholder="0-100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="result">결과</Label>
                  <Select
                    value={formData.result}
                    onValueChange={(value) => setFormData({ ...formData, result: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="결과 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {resultOptions.map((result) => (
                        <SelectItem key={result} value={result}>
                          {result}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="improvements">개선사항</Label>
                <Textarea
                  id="improvements"
                  value={formData.improvements}
                  onChange={(e) =>
                    setFormData({ ...formData, improvements: e.target.value })
                  }
                  placeholder="개선이 필요한 사항을 입력하세요"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextSurveyDate">차기 조사일</Label>
                <Input
                  id="nextSurveyDate"
                  type="date"
                  value={formData.nextSurveyDate}
                  onChange={(e) =>
                    setFormData({ ...formData, nextSurveyDate: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  취소
                </Button>
                <Button type="submit">등록</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            고객만족도 조사 목록
          </CardTitle>
        </CardHeader>
        <CardContent>
          {surveys.length === 0 ? (
            <p className="text-muted-foreground">등록된 조사가 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>조사일자</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>고객사</TableHead>
                  <TableHead>조사항목</TableHead>
                  <TableHead>점수</TableHead>
                  <TableHead>목표</TableHead>
                  <TableHead>결과</TableHead>
                  <TableHead>차기 조사일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {surveys.map((survey) => (
                  <TableRow key={survey.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {formatDate(survey.surveyDate)}
                    </TableCell>
                    <TableCell>{survey.surveyType}</TableCell>
                    <TableCell>{survey.customer}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {survey.surveyItems}
                    </TableCell>
                    <TableCell>{survey.score}점</TableCell>
                    <TableCell>{survey.targetScore}점</TableCell>
                    <TableCell>{getResultBadge(survey.result)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(survey.nextSurveyDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
