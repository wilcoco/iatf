"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ruler, Plus, Save, CheckCircle, XCircle } from "lucide-react";
import { getJigs, type Jig } from "@/lib/master-data";

interface JigCheck {
  id: number;
  checkDate: string;
  jigCode: string;
  jigName: string;
  jigType: string;
  processName: string;
  location: string;
  shift: string;
  checkItems: { item: string; result: string }[];
  overallResult: string;
  findings: string;
  actionTaken: string;
}

interface JigOption {
  code: string;
  name: string;
  type: string;
  processName: string;
  location: string;
  lastInspectionDate: string;
  nextInspectionDate: string;
  status: string;
}

const checkItemsList = [
  "외관 상태 (파손/균열)",
  "고정부 체결 상태",
  "위치결정 핀 상태",
  "클램프 작동 상태",
  "마모/손상 여부",
  "청결 상태",
  "식별표시 상태",
];

export default function JigCheckPage() {
  const [checks, setChecks] = useState<JigCheck[]>([]);
  const [jigOptions, setJigOptions] = useState<JigOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split("T")[0],
    jigCode: "",
    jigName: "",
    jigType: "",
    processName: "",
    location: "",
    shift: "",
    checkItems: checkItemsList.map((item) => ({ item, result: "" })),
    findings: "",
    actionTaken: "",
  });

  useEffect(() => {
    // Load jigs from master data
    const masterJigs = getJigs();
    const options: JigOption[] = masterJigs.map((jig: Jig) => ({
      code: jig.code,
      name: jig.name,
      type: jig.type,
      processName: jig.processName,
      location: jig.location,
      lastInspectionDate: jig.lastInspectionDate,
      nextInspectionDate: jig.nextInspectionDate,
      status: jig.status,
    }));
    setJigOptions(options);
    setLoading(false);
  }, []);

  const handleJigSelect = (jigCode: string) => {
    const selectedJig = jigOptions.find(j => j.code === jigCode);
    if (selectedJig) {
      setFormData({
        ...formData,
        jigCode: selectedJig.code,
        jigName: selectedJig.name,
        jigType: selectedJig.type,
        processName: selectedJig.processName,
        location: selectedJig.location,
      });
    }
  };

  const handleCheckItemChange = (index: number, result: string) => {
    const newCheckItems = [...formData.checkItems];
    newCheckItems[index].result = result;
    setFormData({ ...formData, checkItems: newCheckItems });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const overallResult = formData.checkItems.every((i) => i.result === "OK") ? "정상" : "이상";
    const newCheck: JigCheck = {
      id: Date.now(),
      checkDate: formData.checkDate,
      jigCode: formData.jigCode,
      jigName: formData.jigName,
      jigType: formData.jigType,
      processName: formData.processName,
      location: formData.location,
      shift: formData.shift,
      checkItems: formData.checkItems,
      overallResult,
      findings: formData.findings,
      actionTaken: formData.actionTaken,
    };
    setChecks([newCheck, ...checks]);
    setShowForm(false);
    setFormData({
      checkDate: new Date().toISOString().split("T")[0],
      jigCode: "",
      jigName: "",
      jigType: "",
      processName: "",
      location: "",
      shift: "",
      checkItems: checkItemsList.map((item) => ({ item, result: "" })),
      findings: "",
      actionTaken: "",
    });
    alert("지그점검 기록이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">지그 점검</h1>
          <p className="text-muted-foreground">지그 일상점검 및 정도검증 관리</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          점검 기록
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>지그 점검 기록</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>점검일자</Label>
                  <Input
                    type="date"
                    value={formData.checkDate}
                    onChange={(e) => setFormData({ ...formData, checkDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>지그 선택</Label>
                  <Select value={formData.jigCode} onValueChange={handleJigSelect}>
                    <SelectTrigger><SelectValue placeholder="지그 선택" /></SelectTrigger>
                    <SelectContent>
                      {jigOptions.map((jig) => (
                        <SelectItem key={jig.code} value={jig.code}>
                          {jig.code} - {jig.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>지그명</Label>
                  <Input
                    value={formData.jigName}
                    disabled
                    placeholder="지그 선택 시 자동 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>유형</Label>
                  <Input
                    value={formData.jigType}
                    disabled
                    placeholder="지그 선택 시 자동 입력"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>공정명</Label>
                  <Input
                    value={formData.processName}
                    disabled
                    placeholder="지그 선택 시 자동 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>위치</Label>
                  <Input
                    value={formData.location}
                    disabled
                    placeholder="지그 선택 시 자동 입력"
                  />
                </div>
                <div className="space-y-2">
                  <Label>조/교대</Label>
                  <Select value={formData.shift} onValueChange={(v) => setFormData({ ...formData, shift: v })}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A조</SelectItem>
                      <SelectItem value="B">B조</SelectItem>
                      <SelectItem value="C">C조</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>점검 항목</Label>
                <div className="border rounded-lg divide-y">
                  {formData.checkItems.map((check, index) => (
                    <div key={index} className="flex items-center justify-between p-3">
                      <span className="text-sm">{check.item}</span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={check.result === "OK" ? "default" : "outline"}
                          onClick={() => handleCheckItemChange(index, "OK")}
                          className={check.result === "OK" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> OK
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={check.result === "NG" ? "destructive" : "outline"}
                          onClick={() => handleCheckItemChange(index, "NG")}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> NG
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>발견사항</Label>
                  <Textarea
                    value={formData.findings}
                    onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                    placeholder="이상 발견시 상세 내용 기록"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>조치사항</Label>
                  <Textarea
                    value={formData.actionTaken}
                    onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                    placeholder="조치 내용 기록"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>취소</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" />저장</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            지그 점검 이력
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>로딩 중...</p>
          ) : checks.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">점검 기록이 없습니다.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>점검일자</TableHead>
                  <TableHead>지그코드</TableHead>
                  <TableHead>지그명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>공정명</TableHead>
                  <TableHead>위치</TableHead>
                  <TableHead>조</TableHead>
                  <TableHead>판정</TableHead>
                  <TableHead>발견사항</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((check) => (
                  <TableRow key={check.id}>
                    <TableCell>{check.checkDate}</TableCell>
                    <TableCell className="font-mono">{check.jigCode}</TableCell>
                    <TableCell>{check.jigName}</TableCell>
                    <TableCell>{check.jigType}</TableCell>
                    <TableCell>{check.processName}</TableCell>
                    <TableCell>{check.location}</TableCell>
                    <TableCell>{check.shift}</TableCell>
                    <TableCell>
                      <Badge variant={check.overallResult === "정상" ? "success" : "destructive"}>
                        {check.overallResult}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{check.findings || "-"}</TableCell>
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
