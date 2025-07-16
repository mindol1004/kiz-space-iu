
'use client';

import { useRouter } from 'next/navigation';
import { ChatRoomHeaderProps } from '@/features/chat/types/chat-types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const ChatRoomHeader = ({ roomName }: ChatRoomHeaderProps) => {
  const router = useRouter();

  return (
    <div className="p-2 border-b flex items-center space-x-2 sticky top-0 bg-background z-10">
      <Button onClick={() => router.back()} variant="ghost" size="icon">
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <h2 className="text-lg font-semibold truncate">{roomName}</h2>
    </div>
  );
};
