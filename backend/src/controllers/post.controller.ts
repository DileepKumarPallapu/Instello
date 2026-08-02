// Multi-Type Post Controller: Photo, Video, Carousel, Audio, Poll, Pinned, Scheduling
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from '../services/db.service';

const db = DbService.getInstance();

export class PostController {
  public static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { authorId, type, caption, media, poll, location, scheduledAt, isPinned } = req.body;
      const user = db.users.find(u => u.id === (authorId || 'u-1')) || db.users[0];

      const newPost = {
        id: `post-${uuidv4().substring(0, 8)}`,
        authorId: user.id,
        type: type || 'TEXT',
        caption: caption || '',
        location: location || null,
        isPinned: Boolean(isPinned),
        isArchived: false,
        isDraft: false,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        likesCount: 0,
        commentsCount: 0,
        repostsCount: 0,
        viewsCount: 1,
        createdAt: new Date(),
        media: media || [],
        poll: poll ? {
          id: `poll-${uuidv4().substring(0, 6)}`,
          question: poll.question,
          totalVotes: 0,
          options: poll.options.map((opt: string, idx: number) => ({
            id: `opt-${idx + 1}`,
            text: opt,
            voteCount: 0,
          })),
        } : undefined,
      };

      db.posts.unshift(newPost);

      res.status(201).json({
        success: true,
        message: 'Post published successfully',
        data: newPost,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = db.posts.find(p => p.id === id);

      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      const author = db.users.find(u => u.id === post.authorId);
      const authorProfile = db.profiles.find(p => p.userId === post.authorId);
      const comments = db.comments.filter(c => c.postId === post.id);

      res.status(200).json({
        success: true,
        data: {
          ...post,
          author: author ? {
            id: author.id,
            username: author.username,
            fullName: author.fullName,
            isVerified: author.isVerified,
            avatarUrl: authorProfile?.avatarUrl,
          } : null,
          comments,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async votePoll(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const { optionId } = req.body;

      const post = db.posts.find(p => p.id === postId);
      if (!post || !post.poll) {
        res.status(404).json({ success: false, error: 'Poll post not found' });
        return;
      }

      const targetOpt = post.poll.options.find((opt: any) => opt.id === optionId);
      if (targetOpt) {
        targetOpt.voteCount += 1;
        post.poll.totalVotes += 1;
      }

      res.status(200).json({
        success: true,
        message: 'Vote cast successfully',
        data: post.poll,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async togglePinPost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const post = db.posts.find(p => p.id === id);
      if (!post) {
        res.status(404).json({ success: false, error: 'Post not found' });
        return;
      }

      post.isPinned = !post.isPinned;
      res.status(200).json({
        success: true,
        message: post.isPinned ? 'Post pinned to profile' : 'Post unpinned',
        data: post,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
