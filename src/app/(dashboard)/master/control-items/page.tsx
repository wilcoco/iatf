"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";

// 118개 관리항목 중 일부 샘플 데이터
const controlItems = [
  {
    id: 1,
    itemNo: 1,
    process: "IATF16949",
    name: "IATF_SIs, IAOB_letter_반영_Checklist",
    frequency: "발생시",
    targetDept: "전부서",
    responsibleDept: "박상병이사",
    notes: "IATF16949 변경사항 점검",
  },
  {
    id: 2,
    itemNo: 2,
    process: "고객지정요구사항(CSR) 변경 이행점검",
    name: "고객 요구사항(CSR) 업데이트 또는 개정 관리",
    frequency: "발생시",
    targetDept: "개발품질팀",
    responsibleDept: "개발품질팀",
    notes: "품질5스타, SQ 평가기준 변경시 반영확인",
  },
  {
    id: 3,
    itemNo: 3,
    process: "사업계획운영프로세스",
    name: "사업계획 수립(부서/전사)",
    frequency: "년",
    targetDept: "전부서",
    responsibleDept: "영업관리팀",
    notes: "년 1회 사업계획 수립 보고",
  },
  {
    id: 4,
    itemNo: 9,
    process: "경영검토절차서",
    name: "경영검토 보고서",
    frequency: "년",
    targetDept: "전부서",
    responsibleDept: "개발품질팀",
    notes: "",
  },
  {
    id: 5,
    itemNo: 14,
    process: "지속적개선 프로세스",
    name: "프로세스별 성과지표",
    frequency: "월",
    targetDept: "전부서",
    responsibleDept: "박상병이사",
    notes: "매월 KPI 성과지표 작성",
  },
  {
    id: 6,
    itemNo: 40,
    process: "생산관리프로세스",
    name: "F/PROOF 장비검증(사출 호퍼, 인터록)",
    frequency: "월",
    targetDept: "생산팀/생산기술팀",
    responsibleDept: "생산팀",
    notes: "월단위 F/PROOF 장비 점검",
  },
  {
    id: 7,
    itemNo: 45,
    process: "설비보전관리프로세스",
    name: "설비일상점검표",
    frequency: "일",
    targetDept: "생산기술팀",
    responsibleDept: "생산기술팀",
    notes: "전산관리(팀즈)",
  },
  {
    id: 8,
    itemNo: 50,
    process: "설비보전관리프로세스",
    name: "MTBF/MTTR 분석표",
    frequency: "월",
    targetDept: "생산기술팀",
    responsibleDept: "생산기술팀",
    notes: "",
  },
  {
    id: 9,
    itemNo: 85,
    process: "검사업무프로세스",
    name: "색차 관리",
    frequency: "LOT",
    targetDept: "개발품질팀",
    responsibleDept: "개발품질팀",
    notes: "LOT 별 색차측정관리",
  },
  {
    id: 10,
    itemNo: 101,
    process: "계측 및 시험관리절차서",
    name: "게이지 R&R 평가(계수형/계량형)",
    frequency: "년",
    targetDept: "개발품질팀",
    responsibleDept: "개발품질팀",
    notes: "현장 검사원 게이지 R&R 평가",
  },
];

function FrequencyBadge({ frequency }: { frequency: string }) {
  const colors: Record<string, string> = {
    일: "bg-red-100 text-red-800",
    주: "bg-orange-100 text-orange-800",
    월: "bg-yellow-100 text-yellow-800",
    분기: "bg-blue-100 text-blue-800",
    반기: "bg-indigo-100 text-indigo-800",
    년: "bg-green-100 text-green-800",
    발생시: "bg-gray-100 text-gray-800",
    LOT: "bg-purple-100 text-purple-800",
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[frequency] || colors["발생시"]}`}>{frequency}</span>;
}

export default function ControlItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = controlItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.responsibleDept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리항목</h1>
          <p className="text-muted-foreground">IATF 16949 118개 관리항목 (샘플 데이터)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            엑셀 가져오기
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            항목 추가
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>관리항목 목록</CardTitle>
              <CardDescription>총 {filteredItems.length}개 항목</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">NO</TableHead>
                <TableHead className="w-48">프로세스</TableHead>
                <TableHead>관리항목</TableHead>
                <TableHead className="w-24">관리주기</TableHead>
                <TableHead className="w-32">대상부서</TableHead>
                <TableHead className="w-32">주관부서</TableHead>
                <TableHead className="w-24">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.itemNo}</TableCell>
                  <TableCell className="text-sm">{item.process}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.notes && <p className="text-sm text-muted-foreground truncate max-w-md">{item.notes}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <FrequencyBadge frequency={item.frequency} />
                  </TableCell>
                  <TableCell className="text-sm">{item.targetDept}</TableCell>
                  <TableCell className="text-sm">{item.responsibleDept}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      기록
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
