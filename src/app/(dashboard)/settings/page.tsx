"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Building2, Bell, Database, Shield, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">설정</h1>
        <p className="text-muted-foreground">시스템 설정 및 환경 구성</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              회사 정보
            </CardTitle>
            <CardDescription>회사 기본 정보 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>회사명</Label>
              <Input placeholder="회사명 입력" defaultValue="아이켐스" />
            </div>
            <div className="space-y-2">
              <Label>사업자등록번호</Label>
              <Input placeholder="000-00-00000" />
            </div>
            <div className="space-y-2">
              <Label>대표자</Label>
              <Input placeholder="대표자명" />
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
            <CardDescription>알림 및 통지 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>교정 만료 알림</Label>
              <Select value="30" onValueChange={() => {}}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7일 전</SelectItem>
                  <SelectItem value="14">14일 전</SelectItem>
                  <SelectItem value="30">30일 전</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>심사 일정 알림</Label>
              <Select value="14" onValueChange={() => {}}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7일 전</SelectItem>
                  <SelectItem value="14">14일 전</SelectItem>
                  <SelectItem value="30">30일 전</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>자격 만료 알림</Label>
              <Select value="30" onValueChange={() => {}}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7일 전</SelectItem>
                  <SelectItem value="14">14일 전</SelectItem>
                  <SelectItem value="30">30일 전</SelectItem>
                  <SelectItem value="60">60일 전</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              데이터 관리
            </CardTitle>
            <CardDescription>데이터 백업 및 관리</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">마지막 백업</p>
              <p className="font-medium">자동 백업 (Railway)</p>
            </div>
            <Button variant="outline" className="w-full">
              데이터 내보내기 (Excel)
            </Button>
            <Button variant="outline" className="w-full">
              데이터 가져오기
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              보안 설정
            </CardTitle>
            <CardDescription>접근 권한 및 보안 설정</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>세션 타임아웃</Label>
              <Select value="30" onValueChange={() => {}}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15분</SelectItem>
                  <SelectItem value="30">30분</SelectItem>
                  <SelectItem value="60">1시간</SelectItem>
                  <SelectItem value="120">2시간</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>비밀번호 정책</Label>
              <Select value="standard" onValueChange={() => {}}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">기본 (6자 이상)</SelectItem>
                  <SelectItem value="standard">표준 (8자, 영문+숫자)</SelectItem>
                  <SelectItem value="strong">강력 (10자, 영문+숫자+특수문자)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            시스템 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">버전</p>
              <p className="font-medium">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">프레임워크</p>
              <p className="font-medium">Next.js 14</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">데이터베이스</p>
              <p className="font-medium">PostgreSQL</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">호스팅</p>
              <p className="font-medium">Railway</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
