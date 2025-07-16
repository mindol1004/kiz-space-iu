
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNewGroupChat } from '../hooks/use-new-group-chat';
import { Checkbox } from '@/components/ui/checkbox';
import { ChatRoom } from '../types/chat-types';

interface NewGroupChatDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onChatCreated: (room: ChatRoom) => void;
}

export const NewGroupChatDialog = ({ isOpen, onClose, onChatCreated }: NewGroupChatDialogProps) => {
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { users, isLoadingUsers, createChat, isCreatingChat } = useNewGroupChat(onChatCreated);

  const handleCreateGroupChat = () => {
    if (groupName && selectedUserIds.length > 1) {
      createChat({ name: groupName, participantIds: selectedUserIds });
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새로운 그룹 채팅</DialogTitle>
          <DialogDescription>
            채팅방 이름을 정하고, 함께할 친구들을 초대하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Input
            placeholder="그룹 채팅방 이름을 입력하세요..."
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={isCreatingChat}
          />
          <ScrollArea className="h-48 border rounded-md">
            <div className="p-4 space-y-2">
            {isLoadingUsers ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : users.length > 0 ? (
                users.map(user => (
                    <div 
                        key={user.id}
                        onClick={() => handleUserSelect(user.id)}
                        className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-muted/50"
                    >
                        <Checkbox
                            id={`user-${user.id}`}
                            checked={selectedUserIds.includes(user.id)}
                            onCheckedChange={() => handleUserSelect(user.id)}
                        />
                        <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.nickname[0]}</AvatarFallback>
                        </Avatar>
                        <label htmlFor={`user-${user.id}`} className="flex-1 cursor-pointer">{user.nickname}</label>
                    </div>
                ))
            ) : (
                <div className="text-center text-sm text-muted-foreground pt-10">
                    초대할 친구가 없습니다.
                </div>
            )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isCreatingChat}>취소</Button>
          <Button 
            type="button" 
            onClick={handleCreateGroupChat}
            disabled={!groupName || selectedUserIds.length < 2 || isCreatingChat}
            className="bg-pink-500 hover:bg-pink-600"
          >
            {isCreatingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : `그룹 채팅 생성 (${selectedUserIds.length + 1}명)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
