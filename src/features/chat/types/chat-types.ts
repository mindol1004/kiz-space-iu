
import { User } from "@/features/auth/types/auth-types";
import { ChatRoomType } from "@prisma/client";

export interface ChatRoom {
    id: string;
    name: string;
    avatar?: string;
    lastMessage?: {
      content: string;
      createdAt: string;
    };
    unreadCount: number;
    updatedAt: string;
    type: ChatRoomType;
    participantsCount: number;
  }
  
  export interface Message {
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      nickname: string;
      avatar?: string;
    };
  }
  
  export interface ChatRoomPageProps {
    params: {
      roomId: string;
    };
  }
  
  export interface ChatListProps {
    rooms: ChatRoom[];
    currentRoomId?: string;
  }
  
  export interface MessageListProps {
    messages: Message[];
    currentUser: User | null;
  }
  
  export interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
  }
  
  export interface ChatRoomHeaderProps {
    roomName: string;
  }
  
  export interface ChatQuickActionsProps {}
  
  export interface ChatEmptyStateProps {
    onNewChat: () => void;
  }
  
  export interface ChatRoomCardProps {
    room: ChatRoom;
  }
  
  export interface MessageBubbleProps {
    message: Message;
    isCurrentUser: boolean;
  }
    
  export interface NewChatDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onChatCreated: (chatRoom: ChatRoom) => void;
  }
