// User Profile, Graph, & Search Controller
import { Request, Response } from 'express';
import { DbService } from '../services/db.service';

const db = DbService.getInstance();

export class UserController {
  public static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      const profile = db.profiles.find(p => p.userId === user.id);
      const userPosts = db.posts.filter(p => p.authorId === user.id);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            isVerified: user.isVerified,
            isCreator: user.isCreator,
            isBusiness: user.isBusiness,
            isPrivate: user.isPrivate,
            createdAt: user.createdAt,
          },
          profile,
          stats: {
            postsCount: userPosts.length,
            followersCount: Math.floor(Math.random() * 5000) + 120,
            followingCount: Math.floor(Math.random() * 300) + 40,
          },
          posts: userPosts,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId, bio, avatarUrl, coverUrl, website, location, pronouns, skills, socialLinks } = req.body;
      let profile = db.profiles.find(p => p.userId === userId);

      if (!profile) {
        profile = {
          id: `p-${Date.now()}`,
          userId,
          bio: bio || '',
          avatarUrl: avatarUrl || '',
          coverUrl: coverUrl || '',
          website: website || '',
          location: location || '',
          pronouns: pronouns || '',
          skills: skills || [],
          socialLinks: socialLinks || {},
          monthlyViewsCount: 0,
          totalReachCount: 0,
        };
        db.profiles.push(profile);
      } else {
        if (bio !== undefined) profile.bio = bio;
        if (avatarUrl !== undefined) profile.avatarUrl = avatarUrl;
        if (coverUrl !== undefined) profile.coverUrl = coverUrl;
        if (website !== undefined) profile.website = website;
        if (location !== undefined) profile.location = location;
        if (pronouns !== undefined) profile.pronouns = pronouns;
        if (skills !== undefined) profile.skills = skills;
        if (socialLinks !== undefined) profile.socialLinks = socialLinks;
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const query = (req.query.q as string || '').toLowerCase();
      if (!query) {
        res.status(200).json({ success: true, data: [] });
        return;
      }

      const results = db.users
        .filter(u => u.username.toLowerCase().includes(query) || u.fullName.toLowerCase().includes(query))
        .map(u => {
          const profile = db.profiles.find(p => p.userId === u.id);
          return {
            id: u.id,
            username: u.username,
            fullName: u.fullName,
            isVerified: u.isVerified,
            avatarUrl: profile?.avatarUrl,
            bio: profile?.bio,
          };
        });

      res.status(200).json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
