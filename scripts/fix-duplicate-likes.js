
const { MongoClient } = require('mongodb');

async function fixDuplicateLikes() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db();
    const likesCollection = db.collection('likes');
    
    console.log('기존 likes 데이터 분석 중...');
    
    // commentId가 null인 중복 데이터 찾기
    const duplicates = await likesCollection.aggregate([
      {
        $match: {
          commentId: null
        }
      },
      {
        $group: {
          _id: { userId: "$userId", postId: "$postId" },
          count: { $sum: 1 },
          ids: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();
    
    console.log(`발견된 중복 데이터: ${duplicates.length}개`);
    
    // 중복 데이터 제거 (첫 번째 것만 남기고 나머지 삭제)
    for (const duplicate of duplicates) {
      const idsToDelete = duplicate.ids.slice(1); // 첫 번째 제외한 나머지
      await likesCollection.deleteMany({
        _id: { $in: idsToDelete }
      });
      console.log(`중복 데이터 ${idsToDelete.length}개 삭제 완료`);
    }
    
    // commentId가 null이 아닌 중복 데이터도 확인
    const commentDuplicates = await likesCollection.aggregate([
      {
        $match: {
          commentId: { $ne: null }
        }
      },
      {
        $group: {
          _id: { userId: "$userId", commentId: "$commentId" },
          count: { $sum: 1 },
          ids: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]).toArray();
    
    console.log(`발견된 댓글 중복 데이터: ${commentDuplicates.length}개`);
    
    // 댓글 중복 데이터 제거
    for (const duplicate of commentDuplicates) {
      const idsToDelete = duplicate.ids.slice(1);
      await likesCollection.deleteMany({
        _id: { $in: idsToDelete }
      });
      console.log(`댓글 중복 데이터 ${idsToDelete.length}개 삭제 완료`);
    }
    
    console.log('중복 데이터 정리 완료!');
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
  }
}

fixDuplicateLikes();
