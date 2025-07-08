"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Shield, Eye, HelpCircle, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: false,
      likes: true,
      comments: true,
      follows: true,
      events: false,
    },
    privacy: {
      profileVisible: true,
      showOnlineStatus: true,
      allowMessages: true,
    },
    appearance: {
      darkMode: false,
      language: "ko",
    },
  })
  const { toast } = useToast()
  const { logout } = useAuthStore()
  const router = useRouter()

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleSave = () => {
    toast({
      title: "설정 저장 완료",
      description: "설정이 성공적으로 저장되었습니다.",
    })
    onOpenChange(false)
  }

  const handleLogout = () => {
    logout()
    onOpenChange(false)
    router.push("/")
    toast({
      title: "로그아웃 완료",
      description: "성공적으로 로그아웃되었습니다.",
    })
  }

  const settingSections = [
    {
      title: "알림 설정",
      icon: Bell,
      items: [
        {
          key: "push",
          label: "푸시 알림",
          description: "새로운 활동에 대한 푸시 알림을 받습니다",
          type: "switch",
          value: settings.notifications.push,
        },
        {
          key: "email",
          label: "이메일 알림",
          description: "중요한 알림을 이메일로 받습니다",
          type: "switch",
          value: settings.notifications.email,
        },
        {
          key: "likes",
          label: "좋아요 알림",
          description: "게시글에 좋아요를 받을 때 알림",
          type: "switch",
          value: settings.notifications.likes,
        },
        {
          key: "comments",
          label: "댓글 알림",
          description: "새로운 댓글이 달릴 때 알림",
          type: "switch",
          value: settings.notifications.comments,
        },
        {
          key: "follows",
          label: "팔로우 알림",
          description: "새로운 팔로워가 생길 때 알림",
          type: "switch",
          value: settings.notifications.follows,
        },
        {
          key: "events",
          label: "이벤트 알림",
          description: "관심 있는 이벤트 알림",
          type: "switch",
          value: settings.notifications.events,
        },
      ],
    },
    {
      title: "개인정보 설정",
      icon: Shield,
      items: [
        {
          key: "profileVisible",
          label: "프로필 공개",
          description: "다른 사용자가 내 프로필을 볼 수 있습니다",
          type: "switch",
          value: settings.privacy.profileVisible,
        },
        {
          key: "showOnlineStatus",
          label: "온라인 상태 표시",
          description: "다른 사용자에게 온라인 상태를 표시합니다",
          type: "switch",
          value: settings.privacy.showOnlineStatus,
        },
        {
          key: "allowMessages",
          label: "메시지 허용",
          description: "다른 사용자가 메시지를 보낼 수 있습니다",
          type: "switch",
          value: settings.privacy.allowMessages,
        },
      ],
    },
    {
      title: "화면 설정",
      icon: Eye,
      items: [
        {
          key: "darkMode",
          label: "다크 모드",
          description: "어두운 테마를 사용합니다",
          type: "switch",
          value: settings.appearance.darkMode,
        },
        {
          key: "language",
          label: "언어",
          description: "앱에서 사용할 언어를 선택합니다",
          type: "select",
          value: settings.appearance.language,
          options: [
            { value: "ko", label: "한국어" },
            { value: "en", label: "English" },
          ],
        },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {settingSections.map((section, sectionIndex) => {
            const Icon = section.icon
            return (
              <div key={section.title}>
                <div className="flex items-center space-x-2 mb-4">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold">{section.title}</h3>
                </div>

                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="font-medium">{item.label}</Label>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>

                      <div className="ml-4">
                        {item.type === "switch" && (
                          <Switch
                            checked={item.value as boolean}
                            onCheckedChange={(checked) =>
                              updateSetting(
                                sectionIndex === 0 ? "notifications" : sectionIndex === 1 ? "privacy" : "appearance",
                                item.key,
                                checked,
                              )
                            }
                          />
                        )}

                        {item.type === "select" && (
                          <Select
                            value={item.value as string}
                            onValueChange={(value) => updateSetting("appearance", item.key, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {sectionIndex < settingSections.length - 1 && <Separator className="mt-6" />}
              </div>
            )
          })}

          {/* 기타 옵션 */}
          <Separator />
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <HelpCircle className="h-4 w-4 mr-2" />
              도움말 및 지원
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>

          {/* 저장 버튼 */}
          <div className="pt-4">
            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              설정 저장
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
