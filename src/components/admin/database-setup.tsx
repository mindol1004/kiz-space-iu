"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Play, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function DatabaseSetup() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [initStatus, setInitStatus] = useState<"idle" | "success" | "error">("idle")
  const [seedStatus, setSeedStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const handleInitialize = async () => {
    setIsInitializing(true)
    setInitStatus("idle")

    try {
      const response = await fetch("/api/init", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("초기화 실패")
      }

      const result = await response.json()
      setInitStatus("success")
      toast({
        title: "초기화 완료",
        description: "데이터베이스가 성공적으로 초기화되었습니다.",
      })
    } catch (error) {
      setInitStatus("error")
      toast({
        title: "초기화 실패",
        description: "데이터베이스 초기화 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const handleSeed = async () => {
    setIsSeeding(true)
    setSeedStatus("idle")

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("시드 데이터 생성 실패")
      }

      const result = await response.json()
      setSeedStatus("success")
      toast({
        title: "시드 데이터 생성 완료",
        description: `${result.data.users}명의 사용자와 ${result.data.posts}개의 게시글이 생성되었습니다.`,
      })
    } catch (error) {
      setSeedStatus("error")
      toast({
        title: "시드 데이터 생성 실패",
        description: "샘플 데이터 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const getStatusIcon = (status: "idle" | "success" | "error") => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: "idle" | "success" | "error") => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">완료</Badge>
      case "error":
        return <Badge variant="destructive">실패</Badge>
      default:
        return <Badge variant="outline">대기</Badge>
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mb-4">
          <Database className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">데이터베이스 설정</h1>
        <p className="text-gray-600 mt-2">KIZ-SPACE 데이터베이스를 초기화하고 샘플 데이터를 생성합니다</p>
      </motion.div>

      <div className="grid gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    데이터베이스 초기화
                  </CardTitle>
                  <CardDescription>컬렉션 생성 및 인덱스 설정</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(initStatus)}
                  {getStatusBadge(initStatus)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleInitialize}
                disabled={isInitializing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    초기화 중...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    데이터베이스 초기화
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    샘플 데이터 생성
                  </CardTitle>
                  <CardDescription>테스트용 사용자, 게시글, 댓글 생성</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(seedStatus)}
                  {getStatusBadge(seedStatus)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleSeed}
                disabled={isSeeding}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    샘플 데이터 생성
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">⚠️ 주의사항</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700 text-sm space-y-2">
            <p>• 이 기능은 개발 환경에서만 사용할 수 있습니다.</p>
            <p>• 샘플 데이터 생성 시 기존 데이터가 삭제됩니다.</p>
            <p>• 프로덕션 환경에서는 절대 사용하지 마세요.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
