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
import { FileText, Plus, Save, Trash2, ArrowDown, ArrowRight } from "lucide-react";

// Header info state type
interface HeaderInfo {
  documentNo: string;
  revisionNo: string;
  revisionDate: string;
  productName: string;
  partNo: string;
  vehicleType: string;
  approver: string;
}

// Process flow item type
interface ProcessFlowItem {
  id: number;
  processOrder: number;
  processName: string;
  workDescription: string;
}

// Control item type
interface ControlItem {
  id: number;
  controlItemName: string;
  controlCharacteristic: "일반" | "중요" | "특별";
  productProcessCharacteristic: string;
  specUpper: string;
  specLower: string;
  measurementMethod: string;
  sampleSize: string;
  sampleFrequency: string;
  controlMethod: string;
  responseAction: string;
  responsible: string;
}

// Revision history item type
interface RevisionHistoryItem {
  id: number;
  revisionNo: string;
  revisionDate: string;
  changeDescription: string;
  changedBy: string;
}

export default function ControlPlanPage() {
  const [activeTab, setActiveTab] = useState("basic-info");

  // Header info state
  const [headerInfo, setHeaderInfo] = useState<HeaderInfo>({
    documentNo: "",
    revisionNo: "",
    revisionDate: "",
    productName: "",
    partNo: "",
    vehicleType: "",
    approver: "",
  });

  // Process flow state
  const [processFlowItems, setProcessFlowItems] = useState<ProcessFlowItem[]>([
    { id: 1, processOrder: 1, processName: "", workDescription: "" },
  ]);

  // Control items state
  const [controlItems, setControlItems] = useState<ControlItem[]>([
    {
      id: 1,
      controlItemName: "",
      controlCharacteristic: "일반",
      productProcessCharacteristic: "",
      specUpper: "",
      specLower: "",
      measurementMethod: "",
      sampleSize: "",
      sampleFrequency: "",
      controlMethod: "",
      responseAction: "",
      responsible: "",
    },
  ]);

  // Revision history state
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryItem[]>([]);
  const [newRevision, setNewRevision] = useState<Omit<RevisionHistoryItem, "id">>({
    revisionNo: "",
    revisionDate: "",
    changeDescription: "",
    changedBy: "",
  });

  // Process flow handlers
  const addProcessFlowItem = () => {
    const newOrder = processFlowItems.length + 1;
    setProcessFlowItems([
      ...processFlowItems,
      { id: Date.now(), processOrder: newOrder, processName: "", workDescription: "" },
    ]);
  };

  const removeProcessFlowItem = (id: number) => {
    if (processFlowItems.length <= 1) return;
    const filtered = processFlowItems.filter((item) => item.id !== id);
    // Reorder
    const reordered = filtered.map((item, index) => ({
      ...item,
      processOrder: index + 1,
    }));
    setProcessFlowItems(reordered);
  };

  const updateProcessFlowItem = (id: number, field: keyof ProcessFlowItem, value: string | number) => {
    setProcessFlowItems(
      processFlowItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Control items handlers
  const addControlItem = () => {
    setControlItems([
      ...controlItems,
      {
        id: Date.now(),
        controlItemName: "",
        controlCharacteristic: "일반",
        productProcessCharacteristic: "",
        specUpper: "",
        specLower: "",
        measurementMethod: "",
        sampleSize: "",
        sampleFrequency: "",
        controlMethod: "",
        responseAction: "",
        responsible: "",
      },
    ]);
  };

  const removeControlItem = (id: number) => {
    if (controlItems.length <= 1) return;
    setControlItems(controlItems.filter((item) => item.id !== id));
  };

  const updateControlItem = (id: number, field: keyof ControlItem, value: string) => {
    setControlItems(
      controlItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Revision history handlers
  const addRevisionHistory = () => {
    if (!newRevision.revisionNo || !newRevision.revisionDate) {
      alert("개정번호와 개정일을 입력해주세요.");
      return;
    }
    setRevisionHistory([
      { id: Date.now(), ...newRevision },
      ...revisionHistory,
    ]);
    setNewRevision({
      revisionNo: "",
      revisionDate: "",
      changeDescription: "",
      changedBy: "",
    });
  };

  const removeRevisionHistory = (id: number) => {
    setRevisionHistory(revisionHistory.filter((item) => item.id !== id));
  };

  // Save all data
  const handleSaveAll = () => {
    // Validation
    if (!headerInfo.documentNo || !headerInfo.productName) {
      alert("문서번호와 제품명은 필수 입력 항목입니다.");
      setActiveTab("basic-info");
      return;
    }
    // In real app, this would save to backend
    console.log("Saving control plan:", {
      headerInfo,
      processFlowItems,
      controlItems,
      revisionHistory,
    });
    alert("관리계획서가 저장되었습니다.");
  };

  const getCharacteristicBadgeVariant = (characteristic: string) => {
    switch (characteristic) {
      case "특별":
        return "destructive" as const;
      case "중요":
        return "warning" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리계획서 (Control Plan)</h1>
          <p className="text-muted-foreground">제품 및 공정 관리계획 문서 작성</p>
        </div>
        <Button onClick={handleSaveAll}>
          <Save className="mr-2 h-4 w-4" />
          전체 저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic-info">기본정보</TabsTrigger>
          <TabsTrigger value="process-flow">공정흐름도</TabsTrigger>
          <TabsTrigger value="control-items">관리항목</TabsTrigger>
          <TabsTrigger value="revision-history">변경이력</TabsTrigger>
        </TabsList>

        {/* Tab 1: 기본정보 (Header Info) */}
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                기본정보 (Header)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="documentNo">문서번호 *</Label>
                  <Input
                    id="documentNo"
                    value={headerInfo.documentNo}
                    onChange={(e) =>
                      setHeaderInfo({ ...headerInfo, documentNo: e.target.value })
                    }
                    placeholder="CP-2026-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revisionNo">개정번호 *</Label>
                  <Input
                    id="revisionNo"
                    value={headerInfo.revisionNo}
                    onChange={(e) =>
                      setHeaderInfo({ ...headerInfo, revisionNo: e.target.value })
                    }
                    placeholder="Rev.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revisionDate">개정일 *</Label>
                  <Input
                    id="revisionDate"
                    type="date"
                    value={headerInfo.revisionDate}
                    onChange={(e) =>
                      setHeaderInfo({ ...headerInfo, revisionDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productName">제품명 *</Label>
                  <Input
                    id="productName"
                    value={headerInfo.productName}
                    onChange={(e) =>
                      setHeaderInfo({ ...headerInfo, productName: e.target.value })
                    }
                    placeholder="제품명을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partNo">품번</Label>
                  <Input
                    id="partNo"
                    value={headerInfo.partNo}
                    onChange={(e) =>
                      setHeaderInfo({ ...headerInfo, partNo: e.target.value })
                    }
                    placeholder="품번을 입력하세요"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">차종</Label>
                  <Input
                    id="vehicleType"
                    value={headerInfo.vehicleType}
                    onChange={(e) =>
                      setHeaderInfo({ ...headerInfo, vehicleType: e.target.value })
                    }
                    placeholder="차종을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approver">승인자</Label>
                  <Input
                    id="approver"
                    value={headerInfo.approver}
                    onChange={(e) =>
                      setHeaderInfo({ ...headerInfo, approver: e.target.value })
                    }
                    placeholder="승인자명"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 공정흐름도 (Process Flow) */}
        <TabsContent value="process-flow">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  공정흐름도
                </span>
                <Button onClick={addProcessFlowItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  공정 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processFlowItems.map((item, index) => (
                  <div key={item.id} className="relative">
                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="grid gap-4 md:grid-cols-12">
                          <div className="md:col-span-1">
                            <Label>순서</Label>
                            <div className="flex h-10 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
                              {item.processOrder}
                            </div>
                          </div>
                          <div className="md:col-span-3 space-y-2">
                            <Label>공정명 *</Label>
                            <Input
                              value={item.processName}
                              onChange={(e) =>
                                updateProcessFlowItem(item.id, "processName", e.target.value)
                              }
                              placeholder="공정명"
                            />
                          </div>
                          <div className="md:col-span-7 space-y-2">
                            <Label>작업내용</Label>
                            <Textarea
                              value={item.workDescription}
                              onChange={(e) =>
                                updateProcessFlowItem(item.id, "workDescription", e.target.value)
                              }
                              placeholder="작업 내용을 상세히 입력하세요"
                              rows={2}
                            />
                          </div>
                          <div className="md:col-span-1 flex items-end">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeProcessFlowItem(item.id)}
                              disabled={processFlowItems.length <= 1}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < processFlowItems.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 관리항목 (Control Items) */}
        <TabsContent value="control-items">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>관리항목</span>
                <Button onClick={addControlItem} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  항목 추가
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">관리항목명</TableHead>
                      <TableHead className="min-w-[100px]">관리특성</TableHead>
                      <TableHead className="min-w-[120px]">제품/공정 특성</TableHead>
                      <TableHead className="min-w-[80px]">상한</TableHead>
                      <TableHead className="min-w-[80px]">하한</TableHead>
                      <TableHead className="min-w-[120px]">측정방법</TableHead>
                      <TableHead className="min-w-[80px]">샘플크기</TableHead>
                      <TableHead className="min-w-[80px]">샘플주기</TableHead>
                      <TableHead className="min-w-[120px]">관리방법</TableHead>
                      <TableHead className="min-w-[120px]">대응조치</TableHead>
                      <TableHead className="min-w-[80px]">담당</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {controlItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.controlItemName}
                            onChange={(e) =>
                              updateControlItem(item.id, "controlItemName", e.target.value)
                            }
                            placeholder="항목명"
                            className="min-w-[100px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={item.controlCharacteristic}
                            onValueChange={(v) =>
                              updateControlItem(item.id, "controlCharacteristic", v)
                            }
                          >
                            <SelectTrigger className="min-w-[90px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="일반">
                                <Badge variant="secondary">일반</Badge>
                              </SelectItem>
                              <SelectItem value="중요">
                                <Badge variant="warning">중요</Badge>
                              </SelectItem>
                              <SelectItem value="특별">
                                <Badge variant="destructive">특별</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.productProcessCharacteristic}
                            onChange={(e) =>
                              updateControlItem(
                                item.id,
                                "productProcessCharacteristic",
                                e.target.value
                              )
                            }
                            placeholder="특성"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.specUpper}
                            onChange={(e) =>
                              updateControlItem(item.id, "specUpper", e.target.value)
                            }
                            placeholder="상한"
                            className="min-w-[70px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.specLower}
                            onChange={(e) =>
                              updateControlItem(item.id, "specLower", e.target.value)
                            }
                            placeholder="하한"
                            className="min-w-[70px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.measurementMethod}
                            onChange={(e) =>
                              updateControlItem(item.id, "measurementMethod", e.target.value)
                            }
                            placeholder="측정방법"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.sampleSize}
                            onChange={(e) =>
                              updateControlItem(item.id, "sampleSize", e.target.value)
                            }
                            placeholder="크기"
                            className="min-w-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.sampleFrequency}
                            onChange={(e) =>
                              updateControlItem(item.id, "sampleFrequency", e.target.value)
                            }
                            placeholder="주기"
                            className="min-w-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.controlMethod}
                            onChange={(e) =>
                              updateControlItem(item.id, "controlMethod", e.target.value)
                            }
                            placeholder="관리방법"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.responseAction}
                            onChange={(e) =>
                              updateControlItem(item.id, "responseAction", e.target.value)
                            }
                            placeholder="대응조치"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.responsible}
                            onChange={(e) =>
                              updateControlItem(item.id, "responsible", e.target.value)
                            }
                            placeholder="담당"
                            className="min-w-[60px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeControlItem(item.id)}
                            disabled={controlItems.length <= 1}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Badge variant="secondary">일반</Badge> 일반 관리항목
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="warning">중요</Badge> 중요 관리항목
                </span>
                <span className="flex items-center gap-1">
                  <Badge variant="destructive">특별</Badge> 특별 관리항목 (SPC 필수)
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 변경이력 (Revision History) */}
        <TabsContent value="revision-history">
          <Card>
            <CardHeader>
              <CardTitle>변경이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add new revision form */}
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="space-y-2">
                      <Label>개정번호 *</Label>
                      <Input
                        value={newRevision.revisionNo}
                        onChange={(e) =>
                          setNewRevision({ ...newRevision, revisionNo: e.target.value })
                        }
                        placeholder="Rev.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>개정일 *</Label>
                      <Input
                        type="date"
                        value={newRevision.revisionDate}
                        onChange={(e) =>
                          setNewRevision({ ...newRevision, revisionDate: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>변경내용</Label>
                      <Input
                        value={newRevision.changeDescription}
                        onChange={(e) =>
                          setNewRevision({ ...newRevision, changeDescription: e.target.value })
                        }
                        placeholder="변경 사유 및 내용"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>변경자</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newRevision.changedBy}
                          onChange={(e) =>
                            setNewRevision({ ...newRevision, changedBy: e.target.value })
                          }
                          placeholder="담당자명"
                        />
                        <Button onClick={addRevisionHistory}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revision history table */}
              {revisionHistory.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">
                  등록된 변경이력이 없습니다.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>개정번호</TableHead>
                      <TableHead>개정일</TableHead>
                      <TableHead>변경내용</TableHead>
                      <TableHead>변경자</TableHead>
                      <TableHead className="w-[60px]">삭제</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revisionHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono">{item.revisionNo}</TableCell>
                        <TableCell>{item.revisionDate}</TableCell>
                        <TableCell>{item.changeDescription}</TableCell>
                        <TableCell>{item.changedBy}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeRevisionHistory(item.id)}
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
      </Tabs>
    </div>
  );
}
