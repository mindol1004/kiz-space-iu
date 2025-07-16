
"use client"

import Link from 'next/link';
import { Clock, ChevronRight, Users, User as UserIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatRoomCardProps } from "../types/chat-types";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function ChatRoomCard({ room }: ChatRoomCardProps) {
  return (
    <Link href={`/chat/${room.id}`} className="block">
      <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardContent className="p-3">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-pink-100">
                <AvatarImage src={room.avatar || undefined} alt={room.name} />
                <AvatarFallback className="bg-pink-50 text-pink-500">
                  {room.type === "GROUP" ? <Users className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              {/* 온라인 상태 표시는 현재 데이터에 없으므로 주석 처리
              {room.type === "DIRECT" && room.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
              */}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-800 truncate">{room.name}</h3>
                  {room.type === "GROUP" && (
                    <Badge variant="secondary" className="text-xs font-normal">
                      <Users className="h-3 w-3 mr-1" />
                      {room.participantsCount}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {room.lastMessage && (
                    <span className="text-xs text-gray-500 flex items-center flex-shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(room.lastMessage.createdAt), { locale: ko, addSuffix: true })}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate flex-1">
                  {room.lastMessage?.content || '아직 메시지가 없습니다.'}
                </p>
                {room.unreadCount > 0 && (
                  <Badge className="bg-pink-500 hover:bg-pink-600 text-white text-xs ml-2 flex-shrink-0">
                    {room.unreadCount > 99 ? "99+" : room.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
