"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Save, Plus, Trash2, FileText } from "lucide-react";

interface ContactPerson {
  id: number;
  department: string;
  position: string;
  name: string;
  phone: string;
  mobile: string;
  email: string;
}

interface HistoryItem {
  id: number;
  date: string;
  content: string;
}

interface ProductInfo {
  id: number;
  customer: string;
  deliveryAmount: string;
  dependencyRate: string;
  vehicleType: string;
}

interface TechCapability {
  id: number;
  field: string;
  hasCapability: boolean;
  needsCapability: boolean;
}

interface SubcontractorInfo {
  id: number;
  companyName: string;
  representative: string;
  location: string;
  totalSales: string;
  capital: string;
  relationship: string;
  sqCertified: string;
}

export default function SupplierSurveyPage() {
  const [activeTab, setActiveTab] = useState("basic");

  // 1. 기본정보
  const [basicInfo, setBasicInfo] = useState({
    supplierCode: "",
    companyNameKr: "",
    companyNameCh: "",
    companyNameEn: "",
    businessNo: "",
    address: "",
    postalCode: "",
    factory2Address: "",
    mainProduct: "",
    businessType: "",
    employees: "",
    companySize: "",
    foundedDate: "",
    mainCustomer: "",
    deliveryAmount: "",
    dependencyRate: "",
    vehicleType: "",
    corporateConversionDate: "",
    registrationDate: "",
    businessCategory: "",
    companyType: "",
    mainBank: "",
    associationJoinDate: "",
    landArea: "",
    buildingArea: "",
    companyMotto: "",
    overallEvaluation: "",
    recentIssues: "",
  });

  // 비상연락망
  const [contacts, setContacts] = useState<ContactPerson[]>([
    { id: 1, department: "영업", position: "", name: "", phone: "", mobile: "", email: "" },
    { id: 2, department: "품질", position: "", name: "", phone: "", mobile: "", email: "" },
    { id: 3, department: "개발", position: "", name: "", phone: "", mobile: "", email: "" },
    { id: 4, department: "구매", position: "", name: "", phone: "", mobile: "", email: "" },
    { id: 5, department: "생산", position: "", name: "", phone: "", mobile: "", email: "" },
    { id: 6, department: "총무", position: "", name: "", phone: "", mobile: "", email: "" },
  ]);

  // 2. 회사동향
  const [companyHistory, setCompanyHistory] = useState<HistoryItem[]>([]);
  const [executiveInfo, setExecutiveInfo] = useState({
    ceoName: "",
    ceoBirthDate: "",
    ceoIdNo: "",
    ceoAddress: "",
    ceoPhone: "",
    ceoEducation: "",
  });
  const [unionInfo, setUnionInfo] = useState({
    establishDate: "",
    unionType: "",
    memberCount: "",
    chairmanName: "",
    chairmanBirthDate: "",
    chairmanEducation: "",
    wageNegotiationDate: "",
    collectiveNegotiationDate: "",
    affiliatedOrg: "",
    unionTendency: "",
    recentDispute: "",
  });

  // 3. 주소/약도
  const [locationInfo, setLocationInfo] = useState({
    factory1Address: "",
    factory1Phone: "",
    factory1Fax: "",
    factory2Address: "",
    factory2Phone: "",
    factory2Fax: "",
    factory3Address: "",
    factory3Phone: "",
    factory3Fax: "",
    mapDescription: "",
  });

  // 4. 주생산품
  const [productInfo, setProductInfo] = useState<ProductInfo[]>([]);
  const [overseasInvestment, setOverseasInvestment] = useState({
    country: "",
    company: "",
    investmentScale: "",
    equity: "",
    product: "",
  });

  // 5. 재무구조
  const [financialInfo, setFinancialInfo] = useState({
    currentAssets: "",
    fixedAssets: "",
    currentLiabilities: "",
    fixedLiabilities: "",
    capital: "",
    retainedEarnings: "",
    totalAssets: "",
    sales: "",
    costOfSales: "",
    grossProfit: "",
    sgaExpenses: "",
    operatingProfit: "",
    ordinaryProfit: "",
    netProfit: "",
    stabilityDebtRatio: "",
    profitabilityOperating: "",
    growthSales: "",
    activityAssetTurnover: "",
    productivityPerCapita: "",
  });

  // 7. 기술보유
  const [techCapabilities, setTechCapabilities] = useState<TechCapability[]>([
    { id: 1, field: "JIG설계", hasCapability: false, needsCapability: false },
    { id: 2, field: "JIG제작", hasCapability: false, needsCapability: false },
    { id: 3, field: "금형설계", hasCapability: false, needsCapability: false },
    { id: 4, field: "금형제작", hasCapability: false, needsCapability: false },
    { id: 5, field: "생산장비 설계", hasCapability: false, needsCapability: false },
    { id: 6, field: "생산장비 제작", hasCapability: false, needsCapability: false },
    { id: 7, field: "제품성능시험", hasCapability: false, needsCapability: false },
    { id: 8, field: "사내정보시스템", hasCapability: false, needsCapability: false },
  ]);
  const [techAlliance, setTechAlliance] = useState({
    item: "",
    country: "",
    partner: "",
    period: "",
    initialPayment: "",
    royalty: "",
  });
  const [researchCenter, setResearchCenter] = useState({
    name: "",
    establishDate: "",
    governmentApprovalDate: "",
    staffCount: "",
    area: "",
    mainWork: "",
  });

  // 8. 외주업체현황
  const [subcontractors, setSubcontractors] = useState<SubcontractorInfo[]>([]);
  const [supplierEvaluation, setSupplierEvaluation] = useState({
    inLineDefectRate: "",
    claimAmount: "",
    lineStopMinutes: "",
    overallGrade: "",
    productivityImprovement: "",
    hanmaum: "",
  });
  const [requestToParent, setRequestToParent] = useState("");

  const handleSave = () => {
    const data = {
      basicInfo,
      contacts,
      companyHistory,
      executiveInfo,
      unionInfo,
      locationInfo,
      productInfo,
      overseasInvestment,
      financialInfo,
      techCapabilities,
      techAlliance,
      researchCenter,
      subcontractors,
      supplierEvaluation,
      requestToParent,
    };
    console.log("Saving supplier survey:", data);
    alert("업체실태조사서가 저장되었습니다.");
  };

  const addHistoryItem = () => {
    setCompanyHistory([...companyHistory, { id: Date.now(), date: "", content: "" }]);
  };

  const addProductInfo = () => {
    setProductInfo([...productInfo, { id: Date.now(), customer: "", deliveryAmount: "", dependencyRate: "", vehicleType: "" }]);
  };

  const addSubcontractor = () => {
    setSubcontractors([...subcontractors, { id: Date.now(), companyName: "", representative: "", location: "", totalSales: "", capital: "", relationship: "", sqCertified: "" }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            업체실태조사서
          </h1>
          <p className="text-muted-foreground">협력업체 실태현황 조사 (8개 섹션)</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          저장
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="basic">1.기본</TabsTrigger>
          <TabsTrigger value="trend">2.동향</TabsTrigger>
          <TabsTrigger value="location">3.주소</TabsTrigger>
          <TabsTrigger value="product">4.생산품</TabsTrigger>
          <TabsTrigger value="finance">5.재무</TabsTrigger>
          <TabsTrigger value="executive">6.임원</TabsTrigger>
          <TabsTrigger value="tech">7.기술</TabsTrigger>
          <TabsTrigger value="subcontract">8.외주</TabsTrigger>
        </TabsList>

        {/* 탭 1: 협력업체 기본 */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>□ 협력업체 기본정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>업체 CODE</Label>
                  <Input value={basicInfo.supplierCode} onChange={(e) => setBasicInfo({...basicInfo, supplierCode: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>사업자번호</Label>
                  <Input value={basicInfo.businessNo} onChange={(e) => setBasicInfo({...basicInfo, businessNo: e.target.value})} placeholder="000-00-00000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>회사명 (한글)</Label>
                  <Input value={basicInfo.companyNameKr} onChange={(e) => setBasicInfo({...basicInfo, companyNameKr: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>회사명 (한문)</Label>
                  <Input value={basicInfo.companyNameCh} onChange={(e) => setBasicInfo({...basicInfo, companyNameCh: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>회사명 (영문)</Label>
                  <Input value={basicInfo.companyNameEn} onChange={(e) => setBasicInfo({...basicInfo, companyNameEn: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>우편번호</Label>
                  <Input value={basicInfo.postalCode} onChange={(e) => setBasicInfo({...basicInfo, postalCode: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>본사 주소</Label>
                  <Input value={basicInfo.address} onChange={(e) => setBasicInfo({...basicInfo, address: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>2공장 주소</Label>
                  <Input value={basicInfo.factory2Address} onChange={(e) => setBasicInfo({...basicInfo, factory2Address: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>대지 (평)</Label>
                  <Input value={basicInfo.landArea} onChange={(e) => setBasicInfo({...basicInfo, landArea: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>건물 (평)</Label>
                  <Input value={basicInfo.buildingArea} onChange={(e) => setBasicInfo({...basicInfo, buildingArea: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>주생산품</Label>
                  <Input value={basicInfo.mainProduct} onChange={(e) => setBasicInfo({...basicInfo, mainProduct: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>업종</Label>
                  <Input value={basicInfo.businessType} onChange={(e) => setBasicInfo({...basicInfo, businessType: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>종업원수</Label>
                  <Input type="number" value={basicInfo.employees} onChange={(e) => setBasicInfo({...basicInfo, employees: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>기업규모</Label>
                  <Select value={basicInfo.companySize} onValueChange={(v) => setBasicInfo({...basicInfo, companySize: v})}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="대기업">대기업</SelectItem>
                      <SelectItem value="중견기업">중견기업</SelectItem>
                      <SelectItem value="중소기업">중소기업</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>창립일자</Label>
                  <Input type="date" value={basicInfo.foundedDate} onChange={(e) => setBasicInfo({...basicInfo, foundedDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>법인전환일</Label>
                  <Input type="date" value={basicInfo.corporateConversionDate} onChange={(e) => setBasicInfo({...basicInfo, corporateConversionDate: e.target.value})} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>주거래처</Label>
                  <Input value={basicInfo.mainCustomer} onChange={(e) => setBasicInfo({...basicInfo, mainCustomer: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>납품액 (억원)</Label>
                  <Input value={basicInfo.deliveryAmount} onChange={(e) => setBasicInfo({...basicInfo, deliveryAmount: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>의존율 (%)</Label>
                  <Input value={basicInfo.dependencyRate} onChange={(e) => setBasicInfo({...basicInfo, dependencyRate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>납품차종</Label>
                  <Input value={basicInfo.vehicleType} onChange={(e) => setBasicInfo({...basicInfo, vehicleType: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>기업 종합평가</Label>
                <Textarea value={basicInfo.overallEvaluation} onChange={(e) => setBasicInfo({...basicInfo, overallEvaluation: e.target.value})} rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>비상연락망</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>부서</TableHead>
                    <TableHead>직책</TableHead>
                    <TableHead>성명</TableHead>
                    <TableHead>연락처(유선)</TableHead>
                    <TableHead>H.P</TableHead>
                    <TableHead>E-MAIL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact, idx) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.department}</TableCell>
                      <TableCell>
                        <Input value={contact.position} onChange={(e) => { const n = [...contacts]; n[idx].position = e.target.value; setContacts(n); }} className="h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={contact.name} onChange={(e) => { const n = [...contacts]; n[idx].name = e.target.value; setContacts(n); }} className="h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={contact.phone} onChange={(e) => { const n = [...contacts]; n[idx].phone = e.target.value; setContacts(n); }} className="h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={contact.mobile} onChange={(e) => { const n = [...contacts]; n[idx].mobile = e.target.value; setContacts(n); }} className="h-8" />
                      </TableCell>
                      <TableCell>
                        <Input value={contact.email} onChange={(e) => { const n = [...contacts]; n[idx].email = e.target.value; setContacts(n); }} className="h-8" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 탭 2: 회사동향 */}
        <TabsContent value="trend" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>□ 회사연혁</CardTitle>
              <Button size="sm" onClick={addHistoryItem}><Plus className="mr-2 h-4 w-4" />추가</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">년 월 일</TableHead>
                    <TableHead>내용</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyHistory.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell><Input type="date" value={item.date} onChange={(e) => { const n = [...companyHistory]; n[idx].date = e.target.value; setCompanyHistory(n); }} className="h-8" /></TableCell>
                      <TableCell><Input value={item.content} onChange={(e) => { const n = [...companyHistory]; n[idx].content = e.target.value; setCompanyHistory(n); }} className="h-8" /></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => setCompanyHistory(companyHistory.filter(h => h.id !== item.id))}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>□ 경영자현황</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2"><Label>성명</Label><Input value={executiveInfo.ceoName} onChange={(e) => setExecutiveInfo({...executiveInfo, ceoName: e.target.value})} /></div>
                <div className="space-y-2"><Label>생년월일</Label><Input type="date" value={executiveInfo.ceoBirthDate} onChange={(e) => setExecutiveInfo({...executiveInfo, ceoBirthDate: e.target.value})} /></div>
                <div className="space-y-2"><Label>전화번호</Label><Input value={executiveInfo.ceoPhone} onChange={(e) => setExecutiveInfo({...executiveInfo, ceoPhone: e.target.value})} /></div>
              </div>
              <div className="space-y-2"><Label>현주소</Label><Input value={executiveInfo.ceoAddress} onChange={(e) => setExecutiveInfo({...executiveInfo, ceoAddress: e.target.value})} /></div>
              <div className="space-y-2"><Label>최종학력/주요경력</Label><Textarea value={executiveInfo.ceoEducation} onChange={(e) => setExecutiveInfo({...executiveInfo, ceoEducation: e.target.value})} rows={2} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>□ 노조현황</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2"><Label>노조설립일</Label><Input type="date" value={unionInfo.establishDate} onChange={(e) => setUnionInfo({...unionInfo, establishDate: e.target.value})} /></div>
                <div className="space-y-2"><Label>노조유형</Label>
                  <Select value={unionInfo.unionType} onValueChange={(v) => setUnionInfo({...unionInfo, unionType: v})}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="기업별">기업별</SelectItem>
                      <SelectItem value="산업별">산업별</SelectItem>
                      <SelectItem value="없음">없음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>조합원수</Label><Input type="number" value={unionInfo.memberCount} onChange={(e) => setUnionInfo({...unionInfo, memberCount: e.target.value})} /></div>
                <div className="space-y-2"><Label>노조위원장</Label><Input value={unionInfo.chairmanName} onChange={(e) => setUnionInfo({...unionInfo, chairmanName: e.target.value})} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 탭 3: 주소/약도 */}
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>□ 협력업체 주소록</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3].map(num => (
                <div key={num} className="border p-4 rounded-lg space-y-4">
                  <h4 className="font-semibold">{num}공장</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2 md:col-span-3"><Label>주소</Label>
                      <Input value={num === 1 ? locationInfo.factory1Address : num === 2 ? locationInfo.factory2Address : locationInfo.factory3Address}
                        onChange={(e) => setLocationInfo({...locationInfo, [`factory${num}Address`]: e.target.value})} />
                    </div>
                    <div className="space-y-2"><Label>전용전화</Label>
                      <Input value={num === 1 ? locationInfo.factory1Phone : num === 2 ? locationInfo.factory2Phone : locationInfo.factory3Phone}
                        onChange={(e) => setLocationInfo({...locationInfo, [`factory${num}Phone`]: e.target.value})} />
                    </div>
                    <div className="space-y-2"><Label>FAX번호</Label>
                      <Input value={num === 1 ? locationInfo.factory1Fax : num === 2 ? locationInfo.factory2Fax : locationInfo.factory3Fax}
                        onChange={(e) => setLocationInfo({...locationInfo, [`factory${num}Fax`]: e.target.value})} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="space-y-2"><Label>약도 설명</Label><Textarea value={locationInfo.mapDescription} onChange={(e) => setLocationInfo({...locationInfo, mapDescription: e.target.value})} rows={4} placeholder="오시는 길 설명..." /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 탭 4: 주생산품 */}
        <TabsContent value="product" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>□ 거래처별 매출현황</CardTitle>
              <Button size="sm" onClick={addProductInfo}><Plus className="mr-2 h-4 w-4" />추가</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>거래처</TableHead>
                    <TableHead>납품액 (백만원)</TableHead>
                    <TableHead>의존율 (%)</TableHead>
                    <TableHead>납품차종</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productInfo.map((item, idx) => (
                    <TableRow key={item.id}>
                      <TableCell><Input value={item.customer} onChange={(e) => { const n = [...productInfo]; n[idx].customer = e.target.value; setProductInfo(n); }} className="h-8" /></TableCell>
                      <TableCell><Input type="number" value={item.deliveryAmount} onChange={(e) => { const n = [...productInfo]; n[idx].deliveryAmount = e.target.value; setProductInfo(n); }} className="h-8" /></TableCell>
                      <TableCell><Input value={item.dependencyRate} onChange={(e) => { const n = [...productInfo]; n[idx].dependencyRate = e.target.value; setProductInfo(n); }} className="h-8" /></TableCell>
                      <TableCell><Input value={item.vehicleType} onChange={(e) => { const n = [...productInfo]; n[idx].vehicleType = e.target.value; setProductInfo(n); }} className="h-8" /></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => setProductInfo(productInfo.filter(p => p.id !== item.id))}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>□ 해외투자현황</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2"><Label>투자국가</Label><Input value={overseasInvestment.country} onChange={(e) => setOverseasInvestment({...overseasInvestment, country: e.target.value})} /></div>
                <div className="space-y-2"><Label>투자회사</Label><Input value={overseasInvestment.company} onChange={(e) => setOverseasInvestment({...overseasInvestment, company: e.target.value})} /></div>
                <div className="space-y-2"><Label>투자규모</Label><Input value={overseasInvestment.investmentScale} onChange={(e) => setOverseasInvestment({...overseasInvestment, investmentScale: e.target.value})} /></div>
                <div className="space-y-2"><Label>지분 (%)</Label><Input value={overseasInvestment.equity} onChange={(e) => setOverseasInvestment({...overseasInvestment, equity: e.target.value})} /></div>
                <div className="space-y-2"><Label>생산품</Label><Input value={overseasInvestment.product} onChange={(e) => setOverseasInvestment({...overseasInvestment, product: e.target.value})} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 탭 5: 재무구조 */}
        <TabsContent value="finance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>□ 요약 대차대조표</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2"><Label>유동자산</Label><Input type="number" value={financialInfo.currentAssets} onChange={(e) => setFinancialInfo({...financialInfo, currentAssets: e.target.value})} /></div>
                  <div className="space-y-2"><Label>유동부채</Label><Input type="number" value={financialInfo.currentLiabilities} onChange={(e) => setFinancialInfo({...financialInfo, currentLiabilities: e.target.value})} /></div>
                  <div className="space-y-2"><Label>고정자산</Label><Input type="number" value={financialInfo.fixedAssets} onChange={(e) => setFinancialInfo({...financialInfo, fixedAssets: e.target.value})} /></div>
                  <div className="space-y-2"><Label>고정부채</Label><Input type="number" value={financialInfo.fixedLiabilities} onChange={(e) => setFinancialInfo({...financialInfo, fixedLiabilities: e.target.value})} /></div>
                  <div className="space-y-2"><Label>자본금</Label><Input type="number" value={financialInfo.capital} onChange={(e) => setFinancialInfo({...financialInfo, capital: e.target.value})} /></div>
                  <div className="space-y-2"><Label>잉여금</Label><Input type="number" value={financialInfo.retainedEarnings} onChange={(e) => setFinancialInfo({...financialInfo, retainedEarnings: e.target.value})} /></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>□ 요약 손익계산서</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <div className="space-y-2"><Label>매출액</Label><Input type="number" value={financialInfo.sales} onChange={(e) => setFinancialInfo({...financialInfo, sales: e.target.value})} /></div>
                  <div className="space-y-2"><Label>매출원가</Label><Input type="number" value={financialInfo.costOfSales} onChange={(e) => setFinancialInfo({...financialInfo, costOfSales: e.target.value})} /></div>
                  <div className="space-y-2"><Label>영업이익</Label><Input type="number" value={financialInfo.operatingProfit} onChange={(e) => setFinancialInfo({...financialInfo, operatingProfit: e.target.value})} /></div>
                  <div className="space-y-2"><Label>경상이익</Label><Input type="number" value={financialInfo.ordinaryProfit} onChange={(e) => setFinancialInfo({...financialInfo, ordinaryProfit: e.target.value})} /></div>
                  <div className="space-y-2"><Label>당기순이익</Label><Input type="number" value={financialInfo.netProfit} onChange={(e) => setFinancialInfo({...financialInfo, netProfit: e.target.value})} /></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>□ 주요 경영비율분석</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2"><Label>부채비율 (%)</Label><Input value={financialInfo.stabilityDebtRatio} onChange={(e) => setFinancialInfo({...financialInfo, stabilityDebtRatio: e.target.value})} /></div>
                <div className="space-y-2"><Label>영업이익율 (%)</Label><Input value={financialInfo.profitabilityOperating} onChange={(e) => setFinancialInfo({...financialInfo, profitabilityOperating: e.target.value})} /></div>
                <div className="space-y-2"><Label>매출액증가율 (%)</Label><Input value={financialInfo.growthSales} onChange={(e) => setFinancialInfo({...financialInfo, growthSales: e.target.value})} /></div>
                <div className="space-y-2"><Label>총자산회전율</Label><Input value={financialInfo.activityAssetTurnover} onChange={(e) => setFinancialInfo({...financialInfo, activityAssetTurnover: e.target.value})} /></div>
                <div className="space-y-2"><Label>1인당매출액</Label><Input value={financialInfo.productivityPerCapita} onChange={(e) => setFinancialInfo({...financialInfo, productivityPerCapita: e.target.value})} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 탭 6: 경영진/주주현황 */}
        <TabsContent value="executive" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>□ 경영진현황</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">경영진 정보는 2.동향 탭에서 입력합니다.</p>
              <Button variant="outline" onClick={() => setActiveTab("trend")}><FileText className="mr-2 h-4 w-4" />2.동향 탭으로 이동</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 탭 7: 기술보유 */}
        <TabsContent value="tech" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>□ 보유기술</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>분야</TableHead>
                    <TableHead className="text-center">보유</TableHead>
                    <TableHead className="text-center">필요성</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {techCapabilities.map((tech, idx) => (
                    <TableRow key={tech.id}>
                      <TableCell>{tech.field}</TableCell>
                      <TableCell className="text-center">
                        <input type="checkbox" checked={tech.hasCapability} onChange={(e) => { const n = [...techCapabilities]; n[idx].hasCapability = e.target.checked; setTechCapabilities(n); }} className="h-4 w-4" />
                      </TableCell>
                      <TableCell className="text-center">
                        <input type="checkbox" checked={tech.needsCapability} onChange={(e) => { const n = [...techCapabilities]; n[idx].needsCapability = e.target.checked; setTechCapabilities(n); }} className="h-4 w-4" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>□ 기술제휴현황</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-6">
                <div className="space-y-2"><Label>기술제휴품목</Label><Input value={techAlliance.item} onChange={(e) => setTechAlliance({...techAlliance, item: e.target.value})} /></div>
                <div className="space-y-2"><Label>국가</Label><Input value={techAlliance.country} onChange={(e) => setTechAlliance({...techAlliance, country: e.target.value})} /></div>
                <div className="space-y-2"><Label>제휴업체</Label><Input value={techAlliance.partner} onChange={(e) => setTechAlliance({...techAlliance, partner: e.target.value})} /></div>
                <div className="space-y-2"><Label>기간</Label><Input value={techAlliance.period} onChange={(e) => setTechAlliance({...techAlliance, period: e.target.value})} /></div>
                <div className="space-y-2"><Label>초기지급</Label><Input value={techAlliance.initialPayment} onChange={(e) => setTechAlliance({...techAlliance, initialPayment: e.target.value})} /></div>
                <div className="space-y-2"><Label>로얄티</Label><Input value={techAlliance.royalty} onChange={(e) => setTechAlliance({...techAlliance, royalty: e.target.value})} /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>□ 연구소현황</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2"><Label>연구소명</Label><Input value={researchCenter.name} onChange={(e) => setResearchCenter({...researchCenter, name: e.target.value})} /></div>
                <div className="space-y-2"><Label>설립일</Label><Input type="date" value={researchCenter.establishDate} onChange={(e) => setResearchCenter({...researchCenter, establishDate: e.target.value})} /></div>
                <div className="space-y-2"><Label>정부인가일</Label><Input type="date" value={researchCenter.governmentApprovalDate} onChange={(e) => setResearchCenter({...researchCenter, governmentApprovalDate: e.target.value})} /></div>
                <div className="space-y-2"><Label>인원</Label><Input type="number" value={researchCenter.staffCount} onChange={(e) => setResearchCenter({...researchCenter, staffCount: e.target.value})} /></div>
                <div className="space-y-2"><Label>면적 (평)</Label><Input value={researchCenter.area} onChange={(e) => setResearchCenter({...researchCenter, area: e.target.value})} /></div>
                <div className="space-y-2"><Label>연구소 업무</Label><Input value={researchCenter.mainWork} onChange={(e) => setResearchCenter({...researchCenter, mainWork: e.target.value})} /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 탭 8: 외주업체현황 */}
        <TabsContent value="subcontract" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>□ 외주업체현황</CardTitle>
              <Button size="sm" onClick={addSubcontractor}><Plus className="mr-2 h-4 w-4" />추가</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>업체명</TableHead>
                    <TableHead>대표자</TableHead>
                    <TableHead>소재지</TableHead>
                    <TableHead>총매출액</TableHead>
                    <TableHead>SQ인증</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcontractors.map((sub, idx) => (
                    <TableRow key={sub.id}>
                      <TableCell><Input value={sub.companyName} onChange={(e) => { const n = [...subcontractors]; n[idx].companyName = e.target.value; setSubcontractors(n); }} className="h-8" /></TableCell>
                      <TableCell><Input value={sub.representative} onChange={(e) => { const n = [...subcontractors]; n[idx].representative = e.target.value; setSubcontractors(n); }} className="h-8" /></TableCell>
                      <TableCell><Input value={sub.location} onChange={(e) => { const n = [...subcontractors]; n[idx].location = e.target.value; setSubcontractors(n); }} className="h-8" /></TableCell>
                      <TableCell><Input value={sub.totalSales} onChange={(e) => { const n = [...subcontractors]; n[idx].totalSales = e.target.value; setSubcontractors(n); }} className="h-8" /></TableCell>
                      <TableCell>
                        <Select value={sub.sqCertified} onValueChange={(v) => { const n = [...subcontractors]; n[idx].sqCertified = v; setSubcontractors(n); }}>
                          <SelectTrigger className="h-8"><SelectValue placeholder="선택" /></SelectTrigger>
                          <SelectContent><SelectItem value="Y">Y</SelectItem><SelectItem value="N">N</SelectItem></SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => setSubcontractors(subcontractors.filter(s => s.id !== sub.id))}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>□ 업체평가</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2"><Label>IN LINE불량율 (PPM)</Label><Input value={supplierEvaluation.inLineDefectRate} onChange={(e) => setSupplierEvaluation({...supplierEvaluation, inLineDefectRate: e.target.value})} /></div>
                <div className="space-y-2"><Label>CLAIM (백만원)</Label><Input value={supplierEvaluation.claimAmount} onChange={(e) => setSupplierEvaluation({...supplierEvaluation, claimAmount: e.target.value})} /></div>
                <div className="space-y-2"><Label>LINE STOP (분)</Label><Input value={supplierEvaluation.lineStopMinutes} onChange={(e) => setSupplierEvaluation({...supplierEvaluation, lineStopMinutes: e.target.value})} /></div>
                <div className="space-y-2"><Label>종합평가등급</Label>
                  <Select value={supplierEvaluation.overallGrade} onValueChange={(v) => setSupplierEvaluation({...supplierEvaluation, overallGrade: v})}>
                    <SelectTrigger><SelectValue placeholder="선택" /></SelectTrigger>
                    <SelectContent><SelectItem value="A">A</SelectItem><SelectItem value="B">B</SelectItem><SelectItem value="C">C</SelectItem><SelectItem value="D">D</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>□ 모기업에 대한 요청/건의사항</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={requestToParent} onChange={(e) => setRequestToParent(e.target.value)} rows={4} placeholder="요청 또는 건의사항을 입력하세요..." />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
