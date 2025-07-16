
import { User } from '@/features/auth/types/auth-types';

export interface Post {
    id: string;
    content: string;
    images?: string[];
    category: string;
    ageGroup: string;
    tags?: string[];
    author: {
        id: string;
        nickname: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    commentsCount: number;
    bookmarksCount: number;
    viewsCount: number;
    
    // 현재 사용자의 팔로우 여부를 나타내는 필드
    isFollowedByCurrentUser?: boolean;
}

// ... (다른 타입 정의가 있다면 그대로 유지)
