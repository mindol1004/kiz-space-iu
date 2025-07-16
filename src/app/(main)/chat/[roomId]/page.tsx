
'use client';

import { useChatRoom } from '@/features/chat/hooks/use-chat-room';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { MessageInput } from '@/features/chat/components/message-input';
import { MessageList } from '@/features/chat/components/message-list';
import { ChatRoomHeader } from '@/features/chat/components/chat-room-header';
import { ChatRoomPageProps } from '@/features/chat/types/chat-types';
import { useChat } from '@/features/chat/hooks/use-chat';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = params;
  const { user, isLoading: isAuthLoading } = useAuth();
  const { rooms, isLoading: isLoadingRooms } = useChat(); // 방 정보를 가져오기 위해 필요
  
  const { 
    messages, 
    sendMessage, 
    isLoading: isLoadingMessages,
    isSending,
  } = useChatRoom(roomId);

  const currentRoom = rooms.find(room => room.id === roomId);
  const roomName = currentRoom?.name || '채팅';

  if (isAuthLoading || isLoadingRooms) {
    return (
      <div className="flex flex-col h-screen">
        <div className="p-4 border-b flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-16 w-2/3" />
          <Skeleton className="h-16 w-1/2 self-end ml-auto" />
          <Skeleton className="h-12 w-3/4" />
        </div>
        <div className="p-4 border-t">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--top-nav-height))] bg-background">
      <ChatRoomHeader roomName={roomName} />
      <div className="flex-1 overflow-y-auto">
        {isLoadingMessages ? (
           <div className="p-4 space-y-4">
              <Skeleton className="h-16 w-2/3" />
              <Skeleton className="h-16 w-1/2 self-end ml-auto" />
              <Skeleton className="h-12 w-3/4" />
          </div>
        ) : (
          <MessageList messages={messages} currentUser={user} />
        )}
      </div>
      <MessageInput onSendMessage={sendMessage} disabled={isSending} />
    </div>
  );
}
