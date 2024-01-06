import { db } from "../db/database";
import { MoviesInfo } from "../db/db";
import { sql } from "kysely";
async function insert(data: any) {
  const result = await db.insertInto("movie_comments").values(data).execute();
  return result;
}

async function getComments(movieId: any) {
  const comments = await db
    .selectFrom("movie_comments")
    .selectAll()
    .where("movie_id", "=", movieId)
    .execute();
  const commentsWithReplies = buildCommentTree(comments);
  return commentsWithReplies;
}

function buildCommentTree(comments: any, parent_id = null) {
  const result = [];

  for (const comment of comments) {
    if (comment.parent_id == parent_id) {
      const replies = buildCommentTree(comments, comment.id);
      if (replies.length > 0) {
        comment.replies = replies;
      }
      result.push(comment);
    }
  }
  return result;
}

export { insert, getComments };
