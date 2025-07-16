
'use client';

import { Button } from '@/components/ui/button';
import { ChatEmptyStateProps } from '@/features/chat/types/chat-types';
import { MessageSquarePlus } from 'lucide-react';

export const ChatEmptyState = ({ onNewChat }: ChatEmptyStateProps) => {
  return (
    <div className="text-center p-8">
      <MessageSquarePlus className="mx-auto h-16 w-16 text-muted-foreground" />
      <h3 className="mt-4 text-xl font-semibold">채팅방이 없습니다</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        새로운 채팅을 시작하여 대화를 나눠보세요.
      </p>
      <div className="mt-6">
        <Button onClick={onNewChat}>새 채팅 시작하기</Button>
      </div>
    </div>
  );
};
