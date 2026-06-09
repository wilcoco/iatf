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
import { Ruler, Weight, BarChart3, History, Plus, Save, Trash2, CheckCircle, XCircle, Search } from "lucide-react";

// Types
type VehicleType = "SP2" | "SP3" | "EV1";
type Position = "FR STD" | "FR LDT" | "RR";
type JudgmentResult = "Pass" | "Fail" | "";

interface DimensionPoint {
  id: number;
  pointName: string;
  specification: string;
  tolerance: string;
  measuredValue: string;
  result: JudgmentResult;
}

interface WeightItem {
  id: number;
  partName: string;
  targetWeight: string;
  actualWeight: string;
  deviation: string;
  result: JudgmentResult;
}

interface DimensionRecord {
  id: number;
  recordNo: string;
  inspectionDate: string;
  vehicleType: VehicleType;
  position: Position;
  inspector: string;
  dimensionPoints: DimensionPoint[];
  weightItems: WeightItem[];
  overallResult: JudgmentResult;
  remarks: string;
}

interface StatusSummary {
  position: Position;
  totalInspections: number;
  passCount: number;
  failCount: number;
  passRate: number;
}

// Generate record number
function generateRecordNo(): string {
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const seq = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `DIM-${date}-${seq}`;
}

// Sample measurement points based on Excel structure
const defaultDimensionPoints: Omit<DimensionPoint, "id" | "measuredValue" | "result">[] = [
  { pointName: "A Point", specification: "100.0", tolerance: "+/-0.5" },
  { pointName: "B Point", specification: "85.5", tolerance: "+/-0.3" },
  { pointName: "C Point", specification: "120.0", tolerance: "+/-0.5" },
  { pointName: "D Point", specification: "45.0", tolerance: "+/-0.2" },
  { pointName: "E Point", specification: "200.0", tolerance: "+/-1.0" },
];

const defaultWeightItems: Omit<WeightItem, "id" | "actualWeight" | "deviation" | "result">[] = [
  { partName: "Front Bumper Cover", targetWeight: "3500" },
  { partName: "Grille Assembly", targetWeight: "850" },
  { partName: "Lower Spoiler", targetWeight: "1200" },
];

export default function DimensionInspectionPage() {
  const [activeTab, setActiveTab] = useState("dimension");

  // Form state
  const [formData, setFormData] = useState({
    recordNo: generateRecordNo(),
    inspectionDate: new Date().toISOString().split("T")[0],
    vehicleType: "SP2" as VehicleType,
    position: "FR STD" as Position,
    inspector: "",
  });

  // Dimension points state
  const [dimensionPoints, setDimensionPoints] = useState<DimensionPoint[]>(
    defaultDimensionPoints.map((point, index) => ({
      ...point,
      id: index + 1,
      measuredValue: "",
      result: "" as JudgmentResult,
    }))
  );

  // Weight items state
  const [weightItems, setWeightItems] = useState<WeightItem[]>(
    defaultWeightItems.map((item, index) => ({
      ...item,
      id: index + 1,
      actualWeight: "",
      deviation: "",
      result: "" as JudgmentResult,
    }))
  );

  // History state
  const [inspectionHistory, setInspectionHistory] = useState<DimensionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVehicle, setFilterVehicle] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<string>("");

  // Remarks
  const [remarks, setRemarks] = useState("");

  // Add dimension point
  const addDimensionPoint = () => {
    const newId = Math.max(0, ...dimensionPoints.map((p) => p.id)) + 1;
    setDimensionPoints([
      ...dimensionPoints,
      { id: newId, pointName: "", specification: "", tolerance: "", measuredValue: "", result: "" },
    ]);
  };

  // Remove dimension point
  const removeDimensionPoint = (id: number) => {
    if (dimensionPoints.length > 1) {
      setDimensionPoints(dimensionPoints.filter((p) => p.id !== id));
    }
  };

  // Update dimension point
  const updateDimensionPoint = (id: number, field: keyof DimensionPoint, value: string) => {
    setDimensionPoints(
      dimensionPoints.map((point) => {
        if (point.id === id) {
          const updatedPoint = { ...point, [field]: value };

          // Auto-calculate result
          if (field === "measuredValue" || field === "specification" || field === "tolerance") {
            const spec = parseFloat(updatedPoint.specification);
            const measured = parseFloat(updatedPoint.measuredValue);
            const toleranceMatch = updatedPoint.tolerance.match(/[+-]?\/?(\d+\.?\d*)/);
            const tolerance = toleranceMatch ? parseFloat(toleranceMatch[1]) : 0;

            if (!isNaN(spec) && !isNaN(measured) && tolerance > 0) {
              const withinTolerance = Math.abs(measured - spec) <= tolerance;
              updatedPoint.result = withinTolerance ? "Pass" : "Fail";
            }
          }

          return updatedPoint;
        }
        return point;
      })
    );
  };

  // Add weight item
  const addWeightItem = () => {
    const newId = Math.max(0, ...weightItems.map((w) => w.id)) + 1;
    setWeightItems([
      ...weightItems,
      { id: newId, partName: "", targetWeight: "", actualWeight: "", deviation: "", result: "" },
    ]);
  };

  // Remove weight item
  const removeWeightItem = (id: number) => {
    if (weightItems.length > 1) {
      setWeightItems(weightItems.filter((w) => w.id !== id));
    }
  };

  // Update weight item
  const updateWeightItem = (id: number, field: keyof WeightItem, value: string) => {
    setWeightItems(
      weightItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate deviation and result
          if (field === "actualWeight" || field === "targetWeight") {
            const target = parseFloat(updatedItem.targetWeight);
            const actual = parseFloat(updatedItem.actualWeight);

            if (!isNaN(target) && !isNaN(actual)) {
              const deviation = actual - target;
              const deviationPercent = ((deviation / target) * 100).toFixed(2);
              updatedItem.deviation = `${deviation > 0 ? "+" : ""}${deviation.toFixed(1)}g (${deviationPercent}%)`;

              // Pass if within +/-5% tolerance
              const tolerancePercent = 5;
              updatedItem.result = Math.abs((deviation / target) * 100) <= tolerancePercent ? "Pass" : "Fail";
            }
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Calculate status summary
  const calculateStatusSummary = (): StatusSummary[] => {
    const positions: Position[] = ["FR STD", "FR LDT", "RR"];
    return positions.map((position) => {
      const records = inspectionHistory.filter((r) => r.position === position);
      const passCount = records.filter((r) => r.overallResult === "Pass").length;
      const failCount = records.filter((r) => r.overallResult === "Fail").length;
      return {
        position,
        totalInspections: records.length,
        passCount,
        failCount,
        passRate: records.length > 0 ? (passCount / records.length) * 100 : 0,
      };
    });
  };

  // Save record
  const handleSave = () => {
    if (!formData.inspector) {
      alert("Please enter inspector name.");
      return;
    }

    // Calculate overall result
    const dimensionFails = dimensionPoints.filter((p) => p.result === "Fail").length;
    const weightFails = weightItems.filter((w) => w.result === "Fail").length;
    const overallResult: JudgmentResult = dimensionFails + weightFails > 0 ? "Fail" : "Pass";

    const newRecord: DimensionRecord = {
      id: Date.now(),
      recordNo: formData.recordNo,
      inspectionDate: formData.inspectionDate,
      vehicleType: formData.vehicleType,
      position: formData.position,
      inspector: formData.inspector,
      dimensionPoints: [...dimensionPoints],
      weightItems: [...weightItems],
      overallResult,
      remarks,
    };

    setInspectionHistory([newRecord, ...inspectionHistory]);

    // Reset form
    setFormData({
      recordNo: generateRecordNo(),
      inspectionDate: new Date().toISOString().split("T")[0],
      vehicleType: "SP2",
      position: "FR STD",
      inspector: "",
    });
    setDimensionPoints(
      defaultDimensionPoints.map((point, index) => ({
        ...point,
        id: index + 1,
        measuredValue: "",
        result: "" as JudgmentResult,
      }))
    );
    setWeightItems(
      defaultWeightItems.map((item, index) => ({
        ...item,
        id: index + 1,
        actualWeight: "",
        deviation: "",
        result: "" as JudgmentResult,
      }))
    );
    setRemarks("");

    alert("Record saved successfully.");
    setActiveTab("history");
  };

  // Filter history
  const filteredHistory = inspectionHistory.filter((record) => {
    const matchesSearch =
      record.recordNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.inspector.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVehicle = !filterVehicle || record.vehicleType === filterVehicle;
    const matchesPosition = !filterPosition || record.position === filterPosition;
    return matchesSearch && matchesVehicle && matchesPosition;
  });

  // Get result badge
  const getResultBadge = (result: JudgmentResult) => {
    switch (result) {
      case "Pass":
        return <Badge variant="success">Pass</Badge>;
      case "Fail":
        return <Badge variant="destructive">Fail</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  // Get position display name
  const getPositionLabel = (position: Position): string => {
    switch (position) {
      case "FR STD":
        return "Front Standard";
      case "FR LDT":
        return "Front LDT";
      case "RR":
        return "Rear";
      default:
        return position;
    }
  };

  const statusSummary = calculateStatusSummary();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SP2 PE Front Bumper Dimension Inspection Status (STD)</h1>
          <p className="text-muted-foreground">MBD0019DAFC_Package - Dimension and Weight Check Management</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dimension">Dimension Check Input</TabsTrigger>
              <TabsTrigger value="weight">Weight Check Input</TabsTrigger>
              <TabsTrigger value="summary">FR/RR Status</TabsTrigger>
              <TabsTrigger value="history">Inspection History</TabsTrigger>
            </TabsList>

            {/* Tab 1: Dimension Check Input */}
            <TabsContent value="dimension">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Dimension Check Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Header Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                    <div className="grid gap-4 md:grid-cols-5">
                      <div className="space-y-2">
                        <Label>Record No.</Label>
                        <Input value={formData.recordNo} disabled className="bg-muted" />
                      </div>
                      <div className="space-y-2">
                        <Label>Inspection Date *</Label>
                        <Input
                          type="date"
                          value={formData.inspectionDate}
                          onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Vehicle Type *</Label>
                        <Select
                          value={formData.vehicleType}
                          onValueChange={(value) => setFormData({ ...formData, vehicleType: value as VehicleType })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SP2">SP2</SelectItem>
                            <SelectItem value="SP3">SP3</SelectItem>
                            <SelectItem value="EV1">EV1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Position *</Label>
                        <Select
                          value={formData.position}
                          onValueChange={(value) => setFormData({ ...formData, position: value as Position })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FR STD">FR STD (Front Standard)</SelectItem>
                            <SelectItem value="FR LDT">FR LDT (Front LDT)</SelectItem>
                            <SelectItem value="RR">RR (Rear)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Inspector *</Label>
                        <Input
                          value={formData.inspector}
                          onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                          placeholder="Inspector Name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Measurement Points */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold border-b pb-2">Measurement Points</h3>
                      <Button size="sm" onClick={addDimensionPoint}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Point
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">No.</TableHead>
                          <TableHead>Point Name</TableHead>
                          <TableHead className="w-28">Specification</TableHead>
                          <TableHead className="w-28">Tolerance</TableHead>
                          <TableHead className="w-28">Measured Value</TableHead>
                          <TableHead className="w-24">Judgment</TableHead>
                          <TableHead className="w-16">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dimensionPoints.map((point, index) => (
                          <TableRow key={point.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={point.pointName}
                                onChange={(e) => updateDimensionPoint(point.id, "pointName", e.target.value)}
                                placeholder="Point Name"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={point.specification}
                                onChange={(e) => updateDimensionPoint(point.id, "specification", e.target.value)}
                                placeholder="e.g., 100.0"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={point.tolerance}
                                onChange={(e) => updateDimensionPoint(point.id, "tolerance", e.target.value)}
                                placeholder="+/-0.5"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="any"
                                value={point.measuredValue}
                                onChange={(e) => updateDimensionPoint(point.id, "measuredValue", e.target.value)}
                                placeholder="Measured"
                              />
                            </TableCell>
                            <TableCell>
                              {point.result === "Pass" ? (
                                <span className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Pass
                                </span>
                              ) : point.result === "Fail" ? (
                                <span className="flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Fail
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDimensionPoint(point.id)}
                                disabled={dimensionPoints.length === 1}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setActiveTab("weight")}>Next: Weight Check</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Weight Check Input */}
            <TabsContent value="weight">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Weight className="h-5 w-5" />
                    Weight Check Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Selection Info */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground">Vehicle Type</div>
                        <div className="text-lg font-bold">{formData.vehicleType}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground">Position</div>
                        <div className="text-lg font-bold">{getPositionLabel(formData.position)}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground">Inspection Date</div>
                        <div className="text-lg font-bold">{formData.inspectionDate}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground">Inspector</div>
                        <div className="text-lg font-bold">{formData.inspector || "-"}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Weight Items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold border-b pb-2">Weight Measurement</h3>
                      <Button size="sm" onClick={addWeightItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">No.</TableHead>
                          <TableHead>Part Name</TableHead>
                          <TableHead className="w-32">Target Weight (g)</TableHead>
                          <TableHead className="w-32">Actual Weight (g)</TableHead>
                          <TableHead className="w-36">Deviation</TableHead>
                          <TableHead className="w-24">Judgment</TableHead>
                          <TableHead className="w-16">Delete</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {weightItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <Input
                                value={item.partName}
                                onChange={(e) => updateWeightItem(item.id, "partName", e.target.value)}
                                placeholder="Part Name"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.targetWeight}
                                onChange={(e) => updateWeightItem(item.id, "targetWeight", e.target.value)}
                                placeholder="Target"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.actualWeight}
                                onChange={(e) => updateWeightItem(item.id, "actualWeight", e.target.value)}
                                placeholder="Actual"
                              />
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {item.deviation || "-"}
                            </TableCell>
                            <TableCell>
                              {item.result === "Pass" ? (
                                <span className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Pass
                                </span>
                              ) : item.result === "Fail" ? (
                                <span className="flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Fail
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWeightItem(item.id)}
                                disabled={weightItems.length === 1}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Remarks</h3>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Enter any remarks or observations..."
                    />
                  </div>

                  {/* Summary */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-muted-foreground">Dimension Points</div>
                        <div className="text-2xl font-bold">{dimensionPoints.length}</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-green-600">Dimension Pass</div>
                        <div className="text-2xl font-bold text-green-700">
                          {dimensionPoints.filter((p) => p.result === "Pass").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-green-600">Weight Pass</div>
                        <div className="text-2xl font-bold text-green-700">
                          {weightItems.filter((w) => w.result === "Pass").length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50">
                      <CardContent className="pt-4">
                        <div className="text-sm text-red-600">Total Fails</div>
                        <div className="text-2xl font-bold text-red-700">
                          {dimensionPoints.filter((p) => p.result === "Fail").length +
                            weightItems.filter((w) => w.result === "Fail").length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveTab("dimension")}>
                      Previous: Dimension Check
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Record
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: FR/RR Status Summary */}
            <TabsContent value="summary">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Front / Rear Status Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Cards */}
                  <div className="grid gap-4 md:grid-cols-3">
                    {statusSummary.map((status) => (
                      <Card key={status.position} className="relative overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{getPositionLabel(status.position)}</CardTitle>
                          <p className="text-sm text-muted-foreground">{status.position}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Total Inspections</span>
                              <span className="font-bold text-lg">{status.totalInspections}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-600">Pass</span>
                              <span className="font-bold text-lg text-green-700">{status.passCount}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-red-600">Fail</span>
                              <span className="font-bold text-lg text-red-700">{status.failCount}</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Pass Rate</span>
                                <span
                                  className={`font-bold text-lg ${
                                    status.passRate >= 90
                                      ? "text-green-700"
                                      : status.passRate >= 70
                                      ? "text-yellow-700"
                                      : "text-red-700"
                                  }`}
                                >
                                  {status.passRate.toFixed(1)}%
                                </span>
                              </div>
                              {/* Progress bar */}
                              <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    status.passRate >= 90
                                      ? "bg-green-500"
                                      : status.passRate >= 70
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${status.passRate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Overall Summary */}
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{inspectionHistory.length}</div>
                          <div className="text-sm text-muted-foreground">Total Records</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-700">
                            {inspectionHistory.filter((r) => r.overallResult === "Pass").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Pass</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-red-700">
                            {inspectionHistory.filter((r) => r.overallResult === "Fail").length}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Fail</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-700">
                            {inspectionHistory.length > 0
                              ? (
                                  (inspectionHistory.filter((r) => r.overallResult === "Pass").length /
                                    inspectionHistory.length) *
                                  100
                                ).toFixed(1)
                              : "0.0"}
                            %
                          </div>
                          <div className="text-sm text-muted-foreground">Overall Pass Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {inspectionHistory.length === 0 && (
                    <p className="text-muted-foreground py-8 text-center">
                      No inspection records yet. Start by adding dimension and weight checks.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Inspection History */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Inspection History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by record no. or inspector..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <div className="w-36">
                      <Select value={filterVehicle} onValueChange={setFilterVehicle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Vehicles</SelectItem>
                          <SelectItem value="SP2">SP2</SelectItem>
                          <SelectItem value="SP3">SP3</SelectItem>
                          <SelectItem value="EV1">EV1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-40">
                      <Select value={filterPosition} onValueChange={setFilterPosition}>
                        <SelectTrigger>
                          <SelectValue placeholder="Position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Positions</SelectItem>
                          <SelectItem value="FR STD">FR STD</SelectItem>
                          <SelectItem value="FR LDT">FR LDT</SelectItem>
                          <SelectItem value="RR">RR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {filteredHistory.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center">No inspection records found.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Record No.</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Vehicle Type</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead className="text-center">Dimension Points</TableHead>
                          <TableHead className="text-center">Weight Items</TableHead>
                          <TableHead>Inspector</TableHead>
                          <TableHead>Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-mono text-sm">{record.recordNo}</TableCell>
                            <TableCell>{record.inspectionDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{record.vehicleType}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{record.position}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-green-600">
                                {record.dimensionPoints.filter((p) => p.result === "Pass").length}
                              </span>
                              /
                              <span className="text-muted-foreground">{record.dimensionPoints.length}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="text-green-600">
                                {record.weightItems.filter((w) => w.result === "Pass").length}
                              </span>
                              /
                              <span className="text-muted-foreground">{record.weightItems.length}</span>
                            </TableCell>
                            <TableCell>{record.inspector}</TableCell>
                            <TableCell>{getResultBadge(record.overallResult)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
