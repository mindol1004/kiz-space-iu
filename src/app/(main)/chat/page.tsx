
'use client';

import { useState } from 'react';
import { useChat } from '@/features/chat/hooks/use-chat';
import { ChatRoomCard } from '@/features/chat/components/chat-room-card';
import { ChatEmptyState } from '@/features/chat/components/chat-empty-state';
import { NewChatDialog } from '@/features/chat/components/new-chat-dialog';
import { NewGroupChatDialog } from '@/features/chat/components/new-group-chat-dialog';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatQuickActions } from '@/features/chat/components/chat-quick-actions';

export default function ChatListPage() {
  const { rooms, isLoading } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isNewDirectChatOpen, setIsNewDirectChatOpen] = useState(false);
  const [isNewGroupChatOpen, setIsNewGroupChatOpen] = useState(false);
  const router = useRouter();

  const handleChatCreated = (room: any) => {
    setIsNewDirectChatOpen(false);
    setIsNewGroupChatOpen(false);
    router.push(`/chat/${room.id}`);
  };

  const filteredRooms = rooms
    .filter(room => {
      const roomName = room.name || '';
      const lastMessage = room.lastMessage?.content || '';
      return roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter(room => {
      if (activeTab === 'all') return true;
      if (activeTab === 'groups') return room.type === 'GROUP';
      if (activeTab === 'direct') return room.type === 'DIRECT';
      return true;
    });

  if (isLoading) {
    return (
      <div className="p-4 space-y-3 max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-20">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">채팅</h1>
            <p className="text-sm text-gray-500">육아 친구들과 소통해요</p>
          </div>
          {/* 기본 새 채팅 버튼은 1:1 채팅을 열도록 합니다. */}
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600" onClick={() => setIsNewDirectChatOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />새 채팅
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="채팅방 또는 메시지 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-lg shadow-sm">
            <TabsTrigger value="all" className="text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              전체
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              그룹채팅
            </TabsTrigger>
            <TabsTrigger value="direct" className="text-sm data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              개인채팅
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Chat List */}
        <div className="space-y-2">
          {filteredRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <ChatRoomCard room={room} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRooms.length === 0 && (
          <div className="pt-16">
            <ChatEmptyState onNewChat={() => setIsNewDirectChatOpen(true)} />
          </div>
        )}

        {/* Quick Actions */}
        <ChatQuickActions 
          onNewDirectChat={() => setIsNewDirectChatOpen(true)}
          onNewGroupChat={() => setIsNewGroupChatOpen(true)}
        />
        
        <NewChatDialog
          isOpen={isNewDirectChatOpen}
          onClose={() => setIsNewDirectChatOpen(false)}
          onChatCreated={handleChatCreated}
        />
        <NewGroupChatDialog
          isOpen={isNewGroupChatOpen}
          onClose={() => setIsNewGroupChatOpen(false)}
          onChatCreated={handleChatCreated}
        />
      </div>
    </div>
  );
}
