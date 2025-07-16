
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { NewChatDialogProps } from '@/features/chat/types/chat-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNewChat } from '../hooks/use-new-chat';

export const NewChatDialog = ({ isOpen, onClose, onChatCreated }: NewChatDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { users, isLoadingUsers, createChat, isCreatingChat } = useNewChat(onChatCreated);

  const handleCreateChat = () => {
    if (selectedUserId) {
      createChat(selectedUserId);
    }
  };

  const filteredUsers = users.filter(user => 
    user.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새로운 채팅 시작하기</DialogTitle>
          <DialogDescription>
            서로 팔로우하는 친구들과 대화를 시작해보세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="이름으로 친구 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoadingUsers}
            />
          </div>
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
            {isLoadingUsers ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                    <div 
                        key={user.id}
                        onClick={() => setSelectedUserId(user.id)}
                        className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                            selectedUserId === user.id ? 'bg-pink-100' : 'hover:bg-muted/50'
                        }`}
                    >
                        <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                        </Avatar>
                        <span>{user.nickname}</span>
                    </div>
                ))
            ) : (
                <div className="text-center text-sm text-muted-foreground pt-10">
                    {searchQuery ? '검색 결과가 없습니다.' : '서로 팔로우하는 친구가 없습니다.'}
                </div>
            )}
            </div>
          </ScrollArea>
        </div>
        {/* 작은 화면에서는 수직으로, sm 사이즈 이상에서는 수평으로 버튼을 배치합니다. */}
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose} 
            disabled={isCreatingChat}
            className="mt-2 sm:mt-0"
          >
            취소
          </Button>
          <Button 
            type="button" 
            onClick={handleCreateChat}
            disabled={!selectedUserId || isCreatingChat}
            className="bg-pink-500 hover:bg-pink-600"
          >
            {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : '채팅 시작'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
