-- KIZ-SPACE Database Schema for MongoDB
-- This is a reference schema - MongoDB is schemaless but this shows the structure

 Users Collection
 {
   _id: ObjectId,
   email: String (unique),
   nickname: String,
   avatar: String (optional),
   location: String (optional),
   interests: Array<String>,
   verified: Boolean,
   createdAt: Date,
   updatedAt: Date
 }

 Children Collection
 {
   _id: ObjectId,
   parentId: ObjectId (ref: Users),
   name: String,
   age: Number,
   gender: String (enum: 'male', 'female'),
   avatar: String (optional),
   createdAt: Date
 }

 Posts Collection
 {
   _id: ObjectId,
   authorId: ObjectId (ref: Users),
   content: String,
   images: Array<String>,
   category: String (enum: 'play', 'health', 'education', 'food', 'products', 'advice'),
   ageGroup: String (enum: '0-2', '3-5', '6-8', '9-12', 'all'),
   tags: Array<String>,
   likes: Array<ObjectId> (ref: Users),
   bookmarks: Array<ObjectId> (ref: Users),
   commentCount: Number,
   createdAt: Date,
   updatedAt: Date
 }

 Comments Collection
 {
   _id: ObjectId,
   postId: ObjectId (ref: Posts),
   authorId: ObjectId (ref: Users),
   content: String,
   parentId: ObjectId (ref: Comments, optional for replies),
   likes: Array<ObjectId> (ref: Users),
   createdAt: Date
 }

 Groups Collection
 {
   _id: ObjectId,
   name: String,
   description: String,
   category: String,
   members: Array<ObjectId> (ref: Users),
   adminId: ObjectId (ref: Users),
   isPrivate: Boolean,
   createdAt: Date
 }

 Messages Collection
 {
   _id: ObjectId,
   senderId: ObjectId (ref: Users),
   receiverId: ObjectId (ref: Users),
   groupId: ObjectId (ref: Groups, optional),
   content: String,
   messageType: String (enum: 'text', 'image', 'file'),
   readAt: Date (optional),
   createdAt: Date
 }

 Create indexes for better performance
 db.users.createIndex({ "email": 1 }, { unique: true })
 db.posts.createIndex({ "createdAt": -1 })
 db.posts.createIndex({ "category": 1, "ageGroup": 1 })
 db.posts.createIndex({ "authorId": 1 })
 db.comments.createIndex({ "postId": 1 })
 db.messages.createIndex({ "senderId": 1, "receiverId": 1 })
 db.messages.createIndex({ "groupId": 1 })
