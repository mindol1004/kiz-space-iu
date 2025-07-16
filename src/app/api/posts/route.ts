import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { withAuth } from "@/lib/auth-middleware"
import { getUserIdFromCookies } from "@/lib/auth-utils"
import { PostCategory, AgeGroup } from "@prisma/client"
import { z } from "zod"

// Zod 스키마 정의
const postCreateSchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요."),
  category: z.nativeEnum(PostCategory),
  ageGroup: z.nativeEnum(AgeGroup),
  tags: z.array(z.string()).max(5, "태그는 최대 5개까지 추가할 수 있습니다.").optional(),
  images: z.array(z.string()).optional(),
});


/**
 * 태그를 처리하는 헬퍼 함수
 * @param tags - 게시물에 사용된 태그 문자열 배열
 */
async function handleTags(tags: string[]) {
  if (!tags || tags.length === 0) {
    return;
  }

  // Promise.all을 사용하여 모든 태그 처리를 병렬로 실행
  await Promise.all(
    tags.map(tagName => {
      return prisma.tag.upsert({
        where: { name: tagName },
        update: {
          usageCount: {
            increment: 1,
          },
        },
        create: {
          name: tagName,
          usageCount: 1,
        },
      });
    })
  );
}


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const ageGroup = searchParams.get("ageGroup")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // 현재 로그인한 사용자 ID를 쿠키에서 가져오기
    const currentUserId = getUserIdFromCookies(request)

    const where: any = {}
    if (category && category !== "all" && typeof category === "string") {
      where.category = category.toUpperCase()
    }
    if (ageGroup && ageGroup !== "all" && typeof ageGroup === "string") {
      where.ageGroup = ageGroup.toUpperCase().replace('-', '_')
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            followers: currentUserId
              ? {
                  where: {
                    followerId: currentUserId,
                  },
                }
              : false,
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
        likes: currentUserId
          ? {
              where: {
                userId: currentUserId,
                type: "POST",
              },
            }
          : false,
        bookmarks: currentUserId
          ? {
              where: {
                userId: currentUserId,
              },
            }
          : false,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await prisma.post.count({ where })

    // 게시글 데이터 변환
    const transformedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      images: post.images,
      category: post.category,
      ageGroup: post.ageGroup,
      tags: post.tags,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
      viewsCount: post.viewsCount,
      isLiked: currentUserId ? (post.likes && post.likes.length > 0) : false,
      isBookmarked: currentUserId ? (post.bookmarks && post.bookmarks.length > 0) : false,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      authorId: post.authorId,
      isPublished: post.isPublished,
      isPinned: post.isPinned || false,
      author: {
        id: post.author.id,
        nickname: post.author.nickname,
        avatar: post.author.avatar,
      },
    }))

    return NextResponse.json({
      posts: transformedPosts,
      total,
      page,
      limit,
      hasMore: (page - 1) * limit + posts.length < total,
      nextPage: (page - 1) * limit + posts.length < total ? page + 1 : null,
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export const POST = withAuth(async (request: NextRequest, auth: { user: any }) => {
  try {
    const authorId = getUserIdFromCookies(request)
    if (!authorId) {
      return NextResponse.json({ error: "로그인이 필요합니다" }, { status: 401 })
    }

    const body = await request.json()
    const validation = postCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { content, category, ageGroup, tags, images } = validation.data;

    // --- 태그 처리 로직 추가 ---
    if(tags) await handleTags(tags);
    // -------------------------

    const post = await prisma.post.create({
      data: {
        content,
        images: images || [],
        category,
        ageGroup,
        tags: tags || [],
        authorId: auth.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
            bookmarks: true,
          },
        },
      },
    })

    // 사용자의 게시물 수 업데이트
    await prisma.user.update({
      where: { id: auth.user.id },
      data: { postsCount: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        commentCount: post._count.comments,
        likesCount: post._count.likes,
        bookmarksCount: post._count.bookmarks,
      },
    })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
})