import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth-middleware";

export const POST = withAuth(async (
  request: NextRequest,
  auth: { user: any },
  { params }: { params: { id: string } }
) => {
  try {
    const { id: postId } = params;

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: auth.user.id,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likesCount: {
              decrement: 1,
            },
          },
        }),
      ]);

      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { likesCount: true },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        likesCount: updatedPost?.likesCount || 0,
        message: "Post unliked",
      });
    } else {
      // Like the post
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: auth.user.id,
            postId,
          },
        }),
        prisma.post.update({
          where: { id: postId },
          data: {
            likesCount: {
              increment: 1,
            },
          },
        }),
      ]);

      const updatedPost = await prisma.post.findUnique({
        where: { id: postId },
        select: { likesCount: true },
      });

      return NextResponse.json({
        success: true,
        liked: true,
        likesCount: updatedPost?.likesCount || 0,
        message: "Post liked",
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
});