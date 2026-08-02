// Enterprise Prisma & In-Memory Database Service
import { PrismaClient } from '@prisma/client';

export class DbService {
  private static instance: DbService;
  public prisma: PrismaClient;

  // In-memory initial data store for seamless immediate evaluation
  public users: any[] = [];
  public profiles: any[] = [];
  public posts: any[] = [];
  public comments: any[] = [];
  public reactions: any[] = [];
  public stories: any[] = [];
  public messages: any[] = [];
  public chatGroups: any[] = [];
  public subscriptions: any[] = [];
  public reports: any[] = [];
  public adminLogs: any[] = [];

  private constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
    this.seedInitialData();
  }

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  private seedInitialData() {
    // Seed initial system users
    this.users = [
      {
        id: 'u-founder',
        email: 'dileepkumarpallapu07@gmail.com',
        username: 'dileepkumarpallapu07@gmail.com',
        fullName: 'Pallapu Dileep Kumar',
        role: 'FOUNDER & ARCHITECT',
        isVerified: true,
        isCreator: true,
        isBusiness: false,
        isPrivate: false,
        twoFactorEnabled: true,
        createdAt: new Date(),
      },
      {
        id: 'u-1',
        email: 'alex@instello.app',
        username: 'alex_creator',
        fullName: 'Alex Vance',
        role: 'CREATOR',
        isVerified: true,
        isCreator: true,
        isBusiness: false,
        isPrivate: false,
        twoFactorEnabled: true,
        createdAt: new Date(),
      },
      {
        id: 'u-2',
        email: 'elena@instello.app',
        username: 'elena_design',
        fullName: 'Elena Rostova',
        role: 'USER',
        isVerified: true,
        isCreator: false,
        isBusiness: true,
        isPrivate: false,
        twoFactorEnabled: false,
        createdAt: new Date(),
      },
      {
        id: 'u-3',
        email: 'admin@instello.app',
        username: 'instello_admin',
        fullName: 'Instello Administrator',
        role: 'ADMIN',
        isVerified: true,
        isCreator: false,
        isBusiness: false,
        isPrivate: false,
        twoFactorEnabled: true,
        createdAt: new Date(),
      }
    ];

    this.profiles = [
      {
        id: 'p-founder',
        userId: 'u-founder',
        bio: 'Lead Creator, Chief Architect & Founder of the Instello platform ecosystem. ⚡',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        website: 'https://instello.app/dileepkumarpallapu07@gmail.com',
        location: 'Global Community',
        pronouns: 'he/him',
        skills: ['Instello Founder', 'Digital Arts', 'Spatial Web'],
        socialLinks: { twitter: 'dileep_instello' },
        professionalDashboardEnabled: true,
        monthlyViewsCount: 850000,
        totalReachCount: 2500000,
      },
      {
        id: 'p-1',
        userId: 'u-1',
        bio: 'Building the next evolution of social media on Instello. Visual artist & AI enthusiast. ⚡',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        website: 'https://instello.app/alex',
        location: 'San Francisco, CA',
        pronouns: 'they/them',
        skills: ['UI/UX', 'React', 'Generative AI', '3D Graphics'],
        socialLinks: { twitter: 'alex_instello' },
        professionalDashboardEnabled: true,
        monthlyViewsCount: 142500,
        totalReachCount: 489000,
      },
      {
        id: 'p-2',
        userId: 'u-2',
        bio: 'Spatial UI Engineer & Sound Architect. Designing glassmorphism UI patterns.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80',
        website: 'https://elena.design',
        location: 'Berlin, Germany',
        pronouns: 'she/her',
        skills: ['Next.js', 'Framer Motion', 'Audio Synthesizer'],
        socialLinks: { twitter: 'elena_design' },
        professionalDashboardEnabled: true,
        monthlyViewsCount: 98300,
        totalReachCount: 230000,
      }
    ];

    this.posts = [
      {
        id: 'post-founder',
        authorId: 'u-founder',
        type: 'PHOTO',
        caption: 'Welcome to Instello! Designed and built with Next.js 15, Socket.io & Apple Vision Pro Glassmorphism UI. 👑 #Instello #Founder',
        location: 'Global Community',
        isPinned: true,
        likesCount: 5420,
        commentsCount: 384,
        repostsCount: 1230,
        viewsCount: 45400,
        createdAt: new Date(Date.now() - 3600000 * 1),
        media: [
          {
            id: 'm-founder',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
            mediaType: 'image',
            aspectRatio: 1.6,
          }
        ]
      },
      {
        id: 'post-1',
        authorId: 'u-1',
        type: 'PHOTO',
        caption: 'Welcome to Instello! The future of interconnected creative social media is finally here. ✨ #InstelloNext #DesignSystem',
        location: 'San Francisco, CA',
        isPinned: false,
        likesCount: 1420,
        commentsCount: 84,
        repostsCount: 230,
        viewsCount: 15400,
        createdAt: new Date(Date.now() - 3600000 * 2),
        media: [
          {
            id: 'm-1',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
            mediaType: 'image',
            aspectRatio: 1.6,
          }
        ]
      }
    ];

    this.stories = [
      {
        id: 'story-1',
        userId: 'u-founder',
        caption: 'Building the next evolution of Instello... ⚡',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        viewsCount: 1340,
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
      }
    ];

    this.messages = [
      {
        id: 'msg-1',
        groupId: 'group-1',
        senderId: 'u-founder',
        content: 'Welcome to Instello Messenger! WebRTC P2P end-to-end encrypted channel is active. 🚀',
        type: 'TEXT',
        createdAt: new Date(Date.now() - 3600000),
      }
    ];

    this.chatGroups = [
      {
        id: 'group-1',
        name: 'Pallapu Dileep Kumar & Elena Rostova',
        isGroup: false,
        members: ['u-founder', 'u-2'],
        updatedAt: new Date(),
      }
    ];
  }
}
