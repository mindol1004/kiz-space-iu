
'use client'

import React, { useCallback, useMemo } from 'react';
import { Post } from '../types/post-type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserPlus, UserMinus, MessageCircle, Heart, Bookmark, MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useFollowUser } from '@/features/users/hooks/use-follow-user';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
}

export const PostCard = React.memo(({ post }: PostCardProps) => {
  const { user: currentUser } = useAuth();
  const { follow, unfollow, isFollowing, isUnfollowing } = useFollowUser();

  const handleFollowToggle = useCallback(() => {
    if (post.isFollowedByCurrentUser) {
      unfollow(post.author.id);
    } else {
      follow(post.author.id);
    }
  }, [post.isFollowedByCurrentUser, post.author.id, unfollow, follow]);
  
  // 단순한 계산으로 변경하여 무한 루프 방지
  const isMyPost = currentUser?.id === post.author.id;
  const isProcessingFollow = isFollowing || isUnfollowing;

  // Date 포맷팅을 직접 수행
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.nickname[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          {!isMyPost && (
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleFollowToggle} disabled={isProcessingFollow}>
                {post.isFollowedByCurrentUser ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    <span>언팔로우</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>팔로우</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
        <div className="flex-1">
          <p className="font-semibold">{post.author.nickname}</p>
          <p className="text-xs text-muted-foreground">
            {formattedDate}
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="ghost" size="sm">
          <Heart className="mr-2 h-4 w-4" /> {post.likesCount}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" /> {post.commentsCount}
        </Button>
        <Button variant="ghost" size="sm">
          <Bookmark className="mr-2 h-4 w-4" /> {post.bookmarksCount}
        </Button>
      </CardFooter>
    </Card>
  );
});
