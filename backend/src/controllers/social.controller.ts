// Social Engagement Controller: Multi-Emoji Reactions, Nested Comments, Reposts, Bookmarks
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from '../services/db.service';

const db = DbService.getInstance();

export class SocialController {
  public static async reactPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { type, userId } = req.body;
      const post = db.posts.find(p => p.id === postId);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      // Toggle or increment reaction
      post.likesCount += 1;

      const reaction = {
        id: `react-${uuidv4().substring(0, 6)}`,
        userId: userId || 'u-1',
        postId,
        type: type || 'LIKE',
        createdAt: new Date(),
      };

      db.reactions.push(reaction);

      res.status(200).json({
        success: true,
        message: 'Reaction recorded',
        data: {
          likesCount: post.likesCount,
          reaction,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { content, parentId, authorId } = req.body;
      const post = db.posts.find(p => p.id === postId);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      const author = db.users.find(u => u.id === (authorId || 'u-1')) || db.users[0];
      const authorProfile = db.profiles.find(p => p.userId === author.id);

      const newComment = {
        id: `c-${uuidv4().substring(0, 8)}`,
        postId,
        authorId: author.id,
        content,
        parentId: parentId || null,
        likesCount: 0,
        createdAt: new Date(),
        author: {
          id: author.id,
          username: author.username,
          fullName: author.fullName,
          avatarUrl: authorProfile?.avatarUrl,
        },
      };

      db.comments.push(newComment);
      post.commentsCount += 1;

      res.status(201).json({
        success: true,
        message: 'Comment added',
        data: newComment,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async repost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { authorId, quoteCaption } = req.body;

      const original = db.posts.find(p => p.id === postId);
      if (!original) {
        res.status(404).json({ success: false, error: 'Original post not found' });
        return;
      }

      const user = db.users.find(u => u.id === (authorId || 'u-1')) || db.users[0];
      original.repostsCount += 1;

      const repostPost = {
        id: `post-${uuidv4().substring(0, 8)}`,
        authorId: user.id,
        type: 'TEXT',
        caption: quoteCaption || `Reposted from @${db.users.find(u => u.id === original.authorId)?.username}`,
        originalPostId: original.id,
        likesCount: 0,
        commentsCount: 0,
        repostsCount: 0,
        viewsCount: 1,
        createdAt: new Date(),
      };

      db.posts.unshift(repostPost);

      res.status(201).json({
        success: true,
        message: 'Post reposted successfully',
        data: repostPost,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
