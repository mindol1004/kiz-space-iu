
'use client';

import { MessageBubbleProps } from '@/features/chat/types/chat-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        'flex items-end space-x-2',
        isCurrentUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isCurrentUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>{message.sender.nickname[0]}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'p-3 rounded-lg max-w-xs lg:max-w-md',
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <p className="text-sm">{message.content}</p>
        <p className={cn(
            "text-xs mt-1",
            isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
            {format(new Date(message.createdAt), 'p')}
        </p>
      </div>
    </div>
  );
};
