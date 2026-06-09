"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 공장별 사출 CAPA 데이터 타입
interface InjectionCapaItem {
  id: number
  factory: string
  vehicleType: string
  kmcPlan: number
  uph: number
  kmcRequired: number
  asRequired: number
}

// 사출 호기별 CAPA 데이터
interface InjectionMachineItem {
  id: number
  machineNo: string
  productItem: string
  kmcPlan: number
  asPlan: number
}

// 도장 CAPA 데이터
interface PaintingCapaItem {
  id: number
  supplier: string
  lineName: string
  firstTier: string
  vehicleType: string
  item: string
  colorCount: string
  oemQty: number
  asQty: number
  ckdQty: number
  conveyerSpeed: number
  hangerCapacity: number
  hangerPitch: number
}

// 도장라인 기본정보
interface PaintingLineInfo {
  supplier: string
  primerType: string
  colorType: string
  clearType: string
  lineCount: number
  yearlyCapacity: number
  yearlyActual: number
  dailyCapacity: number
  dailyActual: number
}

export default function CapaAnalysisPage() {
  const [activeTab, setActiveTab] = useState("injection-factory")
  const [selectedPeriod, setSelectedPeriod] = useState("2024-1H")

  // 공장별 사출 CAPA 데이터
  const [factoryCapaData, setFactoryCapaData] = useState<InjectionCapaItem[]>([
    { id: 1, factory: "1공장", vehicleType: "SP2/SK3", kmcPlan: 500, uph: 47.3, kmcRequired: 1200, asRequired: 100 },
    { id: 2, factory: "1공장", vehicleType: "기타", kmcPlan: 200, uph: 47.3, kmcRequired: 480, asRequired: 50 },
    { id: 3, factory: "2공장", vehicleType: "NQ5/SK3", kmcPlan: 600, uph: 59.5, kmcRequired: 1440, asRequired: 120 },
    { id: 4, factory: "3공장", vehicleType: "PU", kmcPlan: 300, uph: 26.6, kmcRequired: 720, asRequired: 60 },
    { id: 5, factory: "4공장", vehicleType: "AX1", kmcPlan: 400, uph: 35.0, kmcRequired: 960, asRequired: 80 },
  ])

  // 사출 호기별 CAPA
  const [machineCapaData, setMachineCapaData] = useState<InjectionMachineItem[]>([
    { id: 1, machineNo: "1호기", productItem: "범퍼 FR", kmcPlan: 300, asPlan: 30 },
    { id: 2, machineNo: "2호기", productItem: "범퍼 RR", kmcPlan: 280, asPlan: 25 },
    { id: 3, machineNo: "3호기", productItem: "사이드 스커트", kmcPlan: 350, asPlan: 40 },
    { id: 4, machineNo: "4호기", productItem: "휀더", kmcPlan: 400, asPlan: 35 },
    { id: 5, machineNo: "5호기", productItem: "그릴", kmcPlan: 320, asPlan: 28 },
  ])

  // 도장 라인 기본정보
  const [paintingLineInfo, setPaintingLineInfo] = useState<PaintingLineInfo>({
    supplier: "캠스(광주)",
    primerType: "자동",
    colorType: "자동",
    clearType: "자동",
    lineCount: 1,
    yearlyCapacity: 240000,
    yearlyActual: 220000,
    dailyCapacity: 1000,
    dailyActual: 920,
  })

  // 도장 CAPA 상세 데이터
  const [paintingCapaData, setPaintingCapaData] = useState<PaintingCapaItem[]>([
    { id: 1, supplier: "캠스(광주)", lineName: "자동라인", firstTier: "캠스(광주)", vehicleType: "SK3 PE", item: "FR STD 1공장", colorCount: "8/8", oemQty: 100, asQty: 10, ckdQty: 0, conveyerSpeed: 4.08, hangerCapacity: 2, hangerPitch: 2.86 },
    { id: 2, supplier: "캠스(광주)", lineName: "자동라인", firstTier: "캠스(광주)", vehicleType: "SK3 PE", item: "FR GTL 1공장", colorCount: "8/8", oemQty: 80, asQty: 8, ckdQty: 0, conveyerSpeed: 4.08, hangerCapacity: 2, hangerPitch: 2.86 },
    { id: 3, supplier: "캠스(광주)", lineName: "자동라인", firstTier: "캠스(광주)", vehicleType: "SK3 PE", item: "RR STD 1공장", colorCount: "8/8", oemQty: 100, asQty: 10, ckdQty: 0, conveyerSpeed: 4.08, hangerCapacity: 2, hangerPitch: 2.86 },
    { id: 4, supplier: "캠스(광주)", lineName: "자동라인", firstTier: "캠스(광주)", vehicleType: "NQ5", item: "FR STD 2공장", colorCount: "10/10", oemQty: 120, asQty: 12, ckdQty: 5, conveyerSpeed: 4.08, hangerCapacity: 2, hangerPitch: 2.86 },
    { id: 5, supplier: "캠스(광주)", lineName: "자동라인", firstTier: "캠스(광주)", vehicleType: "NQ5", item: "RR STD 2공장", colorCount: "10/10", oemQty: 120, asQty: 12, ckdQty: 5, conveyerSpeed: 4.08, hangerCapacity: 2, hangerPitch: 2.86 },
  ])

  // 시간당 생산량 계산
  const calcHourlyProduction = (speed: number, capacity: number, pitch: number) => {
    return Math.round(speed * capacity * 60 / pitch)
  }

  // 합계 계산
  const factoryTotals = factoryCapaData.reduce((acc, item) => ({
    kmcPlan: acc.kmcPlan + item.kmcPlan,
    kmcRequired: acc.kmcRequired + item.kmcRequired,
    asRequired: acc.asRequired + item.asRequired,
  }), { kmcPlan: 0, kmcRequired: 0, asRequired: 0 })

  const machineTotals = machineCapaData.reduce((acc, item) => ({
    kmcPlan: acc.kmcPlan + item.kmcPlan,
    asPlan: acc.asPlan + item.asPlan,
  }), { kmcPlan: 0, asPlan: 0 })

  const paintingTotals = paintingCapaData.reduce((acc, item) => ({
    oemQty: acc.oemQty + item.oemQty,
    asQty: acc.asQty + item.asQty,
    ckdQty: acc.ckdQty + item.ckdQty,
  }), { oemQty: 0, asQty: 0, ckdQty: 0 })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CAPA 분석 (생산능력 분석)</h1>
          <p className="text-muted-foreground">사출/도장 공정별 생산능력 현황 관리</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-1H">2024년 상반기</SelectItem>
              <SelectItem value="2024-2H">2024년 하반기</SelectItem>
              <SelectItem value="2025-1H">2025년 상반기</SelectItem>
            </SelectContent>
          </Select>
          <Button>저장</Button>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">日 KMC 생산계획</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factoryTotals.kmcPlan.toLocaleString()} 台/日</div>
            <p className="text-xs text-muted-foreground">전 공장 합계</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">日 사출 소요량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(factoryTotals.kmcRequired + factoryTotals.asRequired).toLocaleString()} PCS/日</div>
            <p className="text-xs text-muted-foreground">KMC + A/S</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">도장 日 생산CAPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paintingLineInfo.dailyCapacity.toLocaleString()} 台/日</div>
            <p className="text-xs text-muted-foreground">가동시간 20HR 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">도장 가동률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(paintingLineInfo.dailyActual / paintingLineInfo.dailyCapacity * 100)}%</div>
            <p className="text-xs text-muted-foreground">{paintingLineInfo.dailyActual.toLocaleString()} / {paintingLineInfo.dailyCapacity.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="injection-factory">1. 공장별 사출 CAPA</TabsTrigger>
          <TabsTrigger value="injection-machine">2. 호기별 사출 CAPA</TabsTrigger>
          <TabsTrigger value="painting-overview">3. 도장 CAPA 현황</TabsTrigger>
          <TabsTrigger value="painting-detail">4. 도장 상세 (차종/ITEM별)</TabsTrigger>
        </TabsList>

        {/* Tab 1: 공장별 사출 CAPA */}
        <TabsContent value="injection-factory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>日 KMC 생산계획 대비 필요량</CardTitle>
              <CardDescription>공장별 차종별 사출 소요량 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>구분</TableHead>
                    <TableHead>차종</TableHead>
                    <TableHead className="text-right">KMC 계획 [台/日]</TableHead>
                    <TableHead className="text-right">UPH</TableHead>
                    <TableHead className="text-right">사출 소요량 KMC [PCS/日]</TableHead>
                    <TableHead className="text-right">사출 소요량 A/S [PCS/日]</TableHead>
                    <TableHead className="text-right">계</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factoryCapaData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.factory}</TableCell>
                      <TableCell>{item.vehicleType}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.kmcPlan}
                          onChange={(e) => {
                            const newData = factoryCapaData.map(d =>
                              d.id === item.id ? { ...d, kmcPlan: parseInt(e.target.value) || 0 } : d
                            )
                            setFactoryCapaData(newData)
                          }}
                          className="w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">{item.uph}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.kmcRequired}
                          onChange={(e) => {
                            const newData = factoryCapaData.map(d =>
                              d.id === item.id ? { ...d, kmcRequired: parseInt(e.target.value) || 0 } : d
                            )
                            setFactoryCapaData(newData)
                          }}
                          className="w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.asRequired}
                          onChange={(e) => {
                            const newData = factoryCapaData.map(d =>
                              d.id === item.id ? { ...d, asRequired: parseInt(e.target.value) || 0 } : d
                            )
                            setFactoryCapaData(newData)
                          }}
                          className="w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.kmcRequired + item.asRequired).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={2}>합계</TableCell>
                    <TableCell className="text-right">{factoryTotals.kmcPlan.toLocaleString()}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">{factoryTotals.kmcRequired.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{factoryTotals.asRequired.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(factoryTotals.kmcRequired + factoryTotals.asRequired).toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFactoryCapaData([...factoryCapaData, {
                      id: Date.now(),
                      factory: "",
                      vehicleType: "",
                      kmcPlan: 0,
                      uph: 0,
                      kmcRequired: 0,
                      asRequired: 0,
                    }])
                  }}
                >
                  + 행 추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: 호기별 사출 CAPA */}
        <TabsContent value="injection-machine" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>日 공정별 CAMS CAPA 현황</CardTitle>
              <CardDescription>사출 호기별 생산 ITEM 및 계획</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>구분</TableHead>
                    <TableHead>호기</TableHead>
                    <TableHead>생산 ITEM</TableHead>
                    <TableHead className="text-right">생산계획 KMC</TableHead>
                    <TableHead className="text-right">생산계획 A/S</TableHead>
                    <TableHead className="text-right">계</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machineCapaData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">사출</TableCell>
                      <TableCell>{item.machineNo}</TableCell>
                      <TableCell>
                        <Input
                          value={item.productItem}
                          onChange={(e) => {
                            const newData = machineCapaData.map(d =>
                              d.id === item.id ? { ...d, productItem: e.target.value } : d
                            )
                            setMachineCapaData(newData)
                          }}
                          className="w-40"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.kmcPlan}
                          onChange={(e) => {
                            const newData = machineCapaData.map(d =>
                              d.id === item.id ? { ...d, kmcPlan: parseInt(e.target.value) || 0 } : d
                            )
                            setMachineCapaData(newData)
                          }}
                          className="w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={item.asPlan}
                          onChange={(e) => {
                            const newData = machineCapaData.map(d =>
                              d.id === item.id ? { ...d, asPlan: parseInt(e.target.value) || 0 } : d
                            )
                            setMachineCapaData(newData)
                          }}
                          className="w-24 text-right"
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.kmcPlan + item.asPlan).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell colSpan={3}>합계</TableCell>
                    <TableCell className="text-right">{machineTotals.kmcPlan.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{machineTotals.asPlan.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{(machineTotals.kmcPlan + machineTotals.asPlan).toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: 도장 CAPA 현황 */}
        <TabsContent value="painting-overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>■ [ 캠스 ] 도장 CAPA 현황</CardTitle>
              <CardDescription>도장라인 기본정보 및 생산능력</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 도장라인 기본정보 */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">도장방식</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>협력사명</TableHead>
                          <TableHead>PRIMER</TableHead>
                          <TableHead>COLOR</TableHead>
                          <TableHead>CLEAR</TableHead>
                          <TableHead>보유라인</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">{paintingLineInfo.supplier}</TableCell>
                          <TableCell>
                            <Badge variant={paintingLineInfo.primerType === "자동" ? "default" : "secondary"}>
                              {paintingLineInfo.primerType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={paintingLineInfo.colorType === "자동" ? "default" : "secondary"}>
                              {paintingLineInfo.colorType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={paintingLineInfo.clearType === "자동" ? "default" : "secondary"}>
                              {paintingLineInfo.clearType}
                            </Badge>
                          </TableCell>
                          <TableCell>{paintingLineInfo.lineCount}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">생산현황</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">생산현황/年 (작업일수 240일)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <span className="text-xs">CAPA</span>
                            <Input
                              type="number"
                              value={paintingLineInfo.yearlyCapacity}
                              onChange={(e) => setPaintingLineInfo({ ...paintingLineInfo, yearlyCapacity: parseInt(e.target.value) || 0 })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-xs">실적</span>
                            <Input
                              type="number"
                              value={paintingLineInfo.yearlyActual}
                              onChange={(e) => setPaintingLineInfo({ ...paintingLineInfo, yearlyActual: parseInt(e.target.value) || 0 })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">現생산현황/日 (가동시간 20HR)</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <span className="text-xs">CAPA</span>
                            <Input
                              type="number"
                              value={paintingLineInfo.dailyCapacity}
                              onChange={(e) => setPaintingLineInfo({ ...paintingLineInfo, dailyCapacity: parseInt(e.target.value) || 0 })}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <span className="text-xs">실적</span>
                            <Input
                              type="number"
                              value={paintingLineInfo.dailyActual}
                              onChange={(e) => setPaintingLineInfo({ ...paintingLineInfo, dailyActual: parseInt(e.target.value) || 0 })}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 산출기준 설명 */}
              <Card className="bg-blue-50">
                <CardContent className="pt-4">
                  <h4 className="font-semibold mb-2">산출기준</h4>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">CONVEYER SPEED:</span>
                      <span className="ml-2 font-medium">4.08 m/min</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">HANGER 적재능력:</span>
                      <span className="ml-2 font-medium">2 EA</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">HANGER PITCH:</span>
                      <span className="ml-2 font-medium">2.86 m</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">시간당 생산량:</span>
                      <span className="ml-2 font-medium">{calcHourlyProduction(4.08, 2, 2.86)} EA/HR</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    시간당 생산량 = CONVEYER SPEED × HANGER 적재능력 × 60 / HANGER PITCH
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: 도장 상세 (차종/ITEM별) */}
        <TabsContent value="painting-detail" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>도장 상세 CAPA (차종/ITEM별)</CardTitle>
              <CardDescription>차종별 ITEM별 평균 생산수량/일</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>협력사명</TableHead>
                      <TableHead>도장라인명</TableHead>
                      <TableHead>1차사명</TableHead>
                      <TableHead>차종</TableHead>
                      <TableHead>ITEM</TableHead>
                      <TableHead>칼라수</TableHead>
                      <TableHead className="text-right">OEM</TableHead>
                      <TableHead className="text-right">A/S</TableHead>
                      <TableHead className="text-right">CKD</TableHead>
                      <TableHead className="text-right">계</TableHead>
                      <TableHead className="text-right">시간당 생산량</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paintingCapaData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.lineName}</TableCell>
                        <TableCell>{item.firstTier}</TableCell>
                        <TableCell>{item.vehicleType}</TableCell>
                        <TableCell>{item.item}</TableCell>
                        <TableCell>{item.colorCount}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.oemQty}
                            onChange={(e) => {
                              const newData = paintingCapaData.map(d =>
                                d.id === item.id ? { ...d, oemQty: parseInt(e.target.value) || 0 } : d
                              )
                              setPaintingCapaData(newData)
                            }}
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.asQty}
                            onChange={(e) => {
                              const newData = paintingCapaData.map(d =>
                                d.id === item.id ? { ...d, asQty: parseInt(e.target.value) || 0 } : d
                              )
                              setPaintingCapaData(newData)
                            }}
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.ckdQty}
                            onChange={(e) => {
                              const newData = paintingCapaData.map(d =>
                                d.id === item.id ? { ...d, ckdQty: parseInt(e.target.value) || 0 } : d
                              )
                              setPaintingCapaData(newData)
                            }}
                            className="w-20 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {(item.oemQty + item.asQty + item.ckdQty).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {calcHourlyProduction(item.conveyerSpeed, item.hangerCapacity, item.hangerPitch)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={6}>합계</TableCell>
                      <TableCell className="text-right">{paintingTotals.oemQty.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{paintingTotals.asQty.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{paintingTotals.ckdQty.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(paintingTotals.oemQty + paintingTotals.asQty + paintingTotals.ckdQty).toLocaleString()}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setPaintingCapaData([...paintingCapaData, {
                      id: Date.now(),
                      supplier: "캠스(광주)",
                      lineName: "자동라인",
                      firstTier: "캠스(광주)",
                      vehicleType: "",
                      item: "",
                      colorCount: "",
                      oemQty: 0,
                      asQty: 0,
                      ckdQty: 0,
                      conveyerSpeed: 4.08,
                      hangerCapacity: 2,
                      hangerPitch: 2.86,
                    }])
                  }}
                >
                  + 행 추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
