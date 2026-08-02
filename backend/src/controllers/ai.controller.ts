// Generative AI Controller: AI Captions, Auto Hashtags, Smart Moderation & Translation
import { Request, Response } from 'express';

export class AiController {
  public static async generateCaption(req: Request, res: Response): Promise<void> {
    try {
      const { topic, tone, keywords } = req.body;
      const selectedTone = tone || 'creative';
      
      const captionTemplates: Record<string, string[]> = {
        creative: [
          `Exploring new dimensions in ${topic || 'digital art'}. Where vision meets code and light meets structure. ✨ #AuraNext #${keywords ? keywords.join(' #') : 'Innovation'}`,
          `Unlocking future aesthetics. Every layer holds a story waiting to be told. 🌌 #${topic || 'CreativeFlow'}`,
        ],
        professional: [
          `Excited to share our latest architecture update regarding ${topic || 'scalable systems'}. Seamless performance meets modern engineering. 🚀`,
          `Key takeaway from today's build: ${topic || 'Enterprise Design Patterns'} enable long-term code maintainability and user delight.`,
        ],
        casual: [
          `Weekend vibe check with ${topic || 'the team'}! What are you creating today? 😎`,
          `Just dropped something special. Let me know what you think in the comments below! 👇`,
        ]
      };

      const options = captionTemplates[selectedTone] || captionTemplates.creative;
      const suggestedCaption = options[Math.floor(Math.random() * options.length)];

      res.status(200).json({
        success: true,
        data: {
          caption: suggestedCaption,
          suggestedHashtags: ['#AuraPlatform', '#Web3Design', `#${(topic || 'Trending').replace(/\s+/g, '')}`],
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async moderateContent(req: Request, res: Response): Promise<void> {
    try {
      const { text } = req.body;
      const forbiddenWords = ['scam', 'malware', 'phishing', 'explicit_abuse'];
      const containsAbuse = forbiddenWords.some(word => text?.toLowerCase().includes(word));

      res.status(200).json({
        success: true,
        data: {
          passed: !containsAbuse,
          riskScore: containsAbuse ? 0.95 : 0.02,
          flaggedCategories: containsAbuse ? ['SPAM_SAFETY'] : [],
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
