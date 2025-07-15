
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { withAuth } from "@/lib/auth-middleware"
import { z } from "zod"
import { PostCategory, AgeGroup } from "@prisma/client"

const postUpdateSchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요.").optional(),
  category: z.nativeEnum(PostCategory).optional(),
  ageGroup: z.nativeEnum(AgeGroup).optional(),
  tags: z.array(z.string()).max(5, "태그는 최대 5개까지 추가할 수 있습니다.").optional(),
  images: z.array(z.string()).optional(),
});


/**
 * 게시물 수정 시 태그 변경을 처리하는 헬퍼 함수
 * @param oldTags - 기존 태그 배열
 * @param newTags - 새로운 태그 배열
 */
async function handleTagChanges(oldTags: string[], newTags: string[]) {
  const tagsToRemove = oldTags.filter(tag => !newTags.includes(tag));
  const tagsToAdd = newTags.filter(tag => !oldTags.includes(tag));

  // 사라진 태그 카운트 감소
  if (tagsToRemove.length > 0) {
    await prisma.tag.updateMany({
      where: { name: { in: tagsToRemove } },
      data: { usageCount: { decrement: 1 } },
    });
  }

  // 추가된 태그 카운트 증가 (upsert 사용)
  if (tagsToAdd.length > 0) {
    await Promise.all(
      tagsToAdd.map(tagName => 
        prisma.tag.upsert({
          where: { name: tagName },
          update: { usageCount: { increment: 1 } },
          create: { name: tagName, usageCount: 1 },
        })
      )
    );
  }
}


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const postId = params.id

    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            verified: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
                avatar: true,
                verified: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    nickname: true,
                    avatar: true,
                    verified: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        bookmarks: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
            views: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "게시글을 가져오는데 실패했습니다" }, { status: 500 })
  }
}

export const PUT = withAuth(async (request: NextRequest, auth: {user: any}, { params }: { params: { id: string } }) => {
  try {
    const postId = params.id;
    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 });
    }

    const body = await request.json();
    const validation = postUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { tags, ...updateData } = validation.data;

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, tags: true },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 });
    }

    if (existingPost.authorId !== auth.user.id) {
      return NextResponse.json({ error: "수정 권한이 없습니다" }, { status: 403 });
    }

    // --- 태그 처리 로직 추가 ---
    if (tags) {
      await handleTagChanges(existingPost.tags, tags);
    }
    // -------------------------

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...updateData,
        tags, // 업데이트된 태그 정보 저장
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            verified: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
            views: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "게시글 수정에 실패했습니다" }, { status: 500 });
  }
});


export const DELETE = withAuth(async (request: NextRequest, auth: {user: any}, { params }: { params: { id: string } }) => {
  try {
    const postId = params.id
    
    if (!postId) {
      return NextResponse.json({ error: "포스트 ID가 필요합니다" }, { status: 400 })
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, tags: true }
    })

    if (!existingPost) {
      return NextResponse.json({ error: "게시글을 찾을 수 없습니다" }, { status: 404 })
    }

    if (existingPost.authorId !== auth.user.id) {
      return NextResponse.json({ error: "삭제 권한이 없습니다" }, { status: 403 })
    }
    
    // --- 삭제 시 태그 카운트 감소 로직 ---
    if (existingPost.tags && existingPost.tags.length > 0) {
        await prisma.tag.updateMany({
            where: { name: { in: existingPost.tags } },
            data: { usageCount: { decrement: 1 } },
        });
    }
    // ------------------------------------

    await prisma.post.delete({
        where: { id: postId }
    })
    
    // 사용자의 게시물 수 감소
    await prisma.user.update({
        where: { id: auth.user.id },
        data: { postsCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "게시글 삭제에 실패했습니다" }, { status: 500 })
  }
});
