import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import type { User, Post, Comment, Child } from "./schemas"

// User operations
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(user)
    return { success: true, userId: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export async function getUserById(userId: string) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
    if (!user) return null

    return { ...user, _id: user._id.toString() }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ email })
    if (!user) return null

    return { ...user, _id: user._id.toString() }
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

// Post operations
export async function createPost(postData: Omit<Post, "_id" | "createdAt" | "updatedAt">) {
  try {
    const db = await getDatabase()
    const postsCollection = db.collection("posts")

    const post = {
      ...postData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await postsCollection.insertOne(post)
    return { success: true, postId: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating post:", error)
    throw new Error("Failed to create post")
  }
}

export async function getPosts(filters: {
  category?: string
  ageGroup?: string
  page?: number
  limit?: number
}) {
  try {
    const db = await getDatabase()
    const postsCollection = db.collection("posts")
    const usersCollection = db.collection("users")

    const { category, ageGroup, page = 1, limit = 10 } = filters

    // Build filter
    const filter: any = {}
    if (category && category !== "all") {
      filter.category = category
    }
    if (ageGroup && ageGroup !== "all") {
      filter.ageGroup = ageGroup
    }

    // Get posts with pagination
    const posts = await postsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Get author information for each post
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await usersCollection.findOne(
          { _id: new ObjectId(post.authorId) },
          { projection: { nickname: 1, avatar: 1 } },
        )
        return {
          ...post,
          _id: post._id.toString(),
          author: author || { nickname: "Unknown", avatar: null },
        }
      }),
    )

    return {
      posts: postsWithAuthors,
      hasMore: posts.length === limit,
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    throw new Error("Failed to fetch posts")
  }
}

export async function likePost(postId: string, userId: string) {
  try {
    const db = await getDatabase()
    const postsCollection = db.collection("posts")

    const post = await postsCollection.findOne({ _id: new ObjectId(postId) })
    if (!post) throw new Error("Post not found")

    const isLiked = post.likes.includes(userId)

    if (isLiked) {
      // Unlike
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { likes: userId },
          $set: { updatedAt: new Date() },
        },
      )
    } else {
      // Like
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        {
          $addToSet: { likes: userId },
          $set: { updatedAt: new Date() },
        },
      )
    }

    return { success: true, isLiked: !isLiked }
  } catch (error) {
    console.error("Error toggling like:", error)
    throw new Error("Failed to toggle like")
  }
}

export async function bookmarkPost(postId: string, userId: string) {
  try {
    const db = await getDatabase()
    const postsCollection = db.collection("posts")

    const post = await postsCollection.findOne({ _id: new ObjectId(postId) })
    if (!post) throw new Error("Post not found")

    const isBookmarked = post.bookmarks.includes(userId)

    if (isBookmarked) {
      // Remove bookmark
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { bookmarks: userId },
          $set: { updatedAt: new Date() },
        },
      )
    } else {
      // Add bookmark
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        {
          $addToSet: { bookmarks: userId },
          $set: { updatedAt: new Date() },
        },
      )
    }

    return { success: true, isBookmarked: !isBookmarked }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    throw new Error("Failed to toggle bookmark")
  }
}

// Comment operations
export async function createComment(commentData: Omit<Comment, "_id" | "createdAt">) {
  try {
    const db = await getDatabase()
    const commentsCollection = db.collection("comments")
    const postsCollection = db.collection("posts")

    const comment = {
      ...commentData,
      createdAt: new Date(),
    }

    const result = await commentsCollection.insertOne(comment)

    // Update comment count in post
    await postsCollection.updateOne(
      { _id: new ObjectId(commentData.postId) },
      {
        $inc: { commentCount: 1 },
        $set: { updatedAt: new Date() },
      },
    )

    return { success: true, commentId: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating comment:", error)
    throw new Error("Failed to create comment")
  }
}

export async function getCommentsByPostId(postId: string) {
  try {
    const db = await getDatabase()
    const commentsCollection = db.collection("comments")
    const usersCollection = db.collection("users")

    const comments = await commentsCollection.find({ postId }).sort({ createdAt: 1 }).toArray()

    // Get author information for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await usersCollection.findOne(
          { _id: new ObjectId(comment.authorId) },
          { projection: { nickname: 1, avatar: 1 } },
        )
        return {
          ...comment,
          _id: comment._id.toString(),
          author: author || { nickname: "Unknown", avatar: null },
        }
      }),
    )

    return commentsWithAuthors
  } catch (error) {
    console.error("Error fetching comments:", error)
    throw new Error("Failed to fetch comments")
  }
}

// Child operations
export async function createChild(childData: Omit<Child, "_id" | "createdAt">) {
  try {
    const db = await getDatabase()
    const childrenCollection = db.collection("children")

    const child = {
      ...childData,
      createdAt: new Date(),
    }

    const result = await childrenCollection.insertOne(child)
    return { success: true, childId: result.insertedId.toString() }
  } catch (error) {
    console.error("Error creating child:", error)
    throw new Error("Failed to create child")
  }
}

export async function getChildrenByParentId(parentId: string) {
  try {
    const db = await getDatabase()
    const childrenCollection = db.collection("children")

    const children = await childrenCollection.find({ parentId }).sort({ createdAt: 1 }).toArray()

    return children.map((child) => ({ ...child, _id: child._id.toString() }))
  } catch (error) {
    console.error("Error fetching children:", error)
    return []
  }
}
