
'use client';

import { useEffect, useRef } from 'react';
import { MessageListProps } from '@/features/chat/types/chat-types';
import { MessageBubble } from './message-bubble';
import { Skeleton } from '@/components/ui/skeleton';

export const MessageList = ({ messages, currentUser }: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 메시지 목록이 변경될 때마다 맨 아래로 스크롤합니다.
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // currentUser가 로드되지 않았을 경우 스켈레톤 UI를 표시합니다.
  if (!currentUser) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-2/3" />
        <Skeleton className="h-16 w-1/2 self-end ml-auto" />
        <Skeleton className="h-12 w-3/4" />
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="space-y-4 p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isCurrentUser={message.sender.id === currentUser.id}
        />
      ))}
    </div>
  );
};
