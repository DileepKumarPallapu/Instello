// Dynamic Feed Algorithmic Controller
import { Request, Response } from 'express';
import { DbService } from '../services/db.service';

const db = DbService.getInstance();

export class FeedController {
  public static async getFeed(req: Request, res: Response): Promise<void> {
    try {
      const type = (req.query.type as string) || 'recommended';
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      let rawPosts = [...db.posts];

      if (type === 'trending') {
        rawPosts.sort((a, b) => (b.likesCount + b.repostsCount * 2) - (a.likesCount + a.repostsCount * 2));
      } else if (type === 'reels' || type === 'audio') {
        rawPosts = rawPosts.filter(p => p.type === 'AUDIO' || p.type === 'VIDEO');
      } else if (type === 'nearby') {
        rawPosts = rawPosts.filter(p => p.location !== null);
      } else {
        // Recommended / Following feed
        rawPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      // Enrich posts with author profile details
      const enrichedPosts = rawPosts.map(post => {
        const author = db.users.find(u => u.id === post.authorId);
        const profile = db.profiles.find(p => p.userId === post.authorId);
        return {
          ...post,
          author: author ? {
            id: author.id,
            username: author.username,
            fullName: author.fullName,
            isVerified: author.isVerified,
            avatarUrl: profile?.avatarUrl,
          } : {
            id: 'u-1',
            username: 'alex_creator',
            fullName: 'Alex Vance',
            isVerified: true,
            avatarUrl: db.profiles[0]?.avatarUrl,
          },
        };
      });

      const startIndex = (page - 1) * limit;
      const paginatedPosts = enrichedPosts.slice(startIndex, startIndex + limit);

      res.status(200).json({
        success: true,
        data: {
          posts: paginatedPosts,
          pagination: {
            page,
            limit,
            totalPosts: enrichedPosts.length,
            hasMore: startIndex + limit < enrichedPosts.length,
          },
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getStories(req: Request, res: Response): Promise<void> {
    try {
      const storiesWithUser = db.stories.map(story => {
        const user = db.users.find(u => u.id === story.userId);
        const profile = db.profiles.find(p => p.userId === story.userId);
        return {
          ...story,
          user: user ? {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            avatarUrl: profile?.avatarUrl,
          } : null,
        };
      });

      res.status(200).json({
        success: true,
        data: storiesWithUser,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
