// Creator Monetization & Tip Controller
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { DbService } from '../services/db.service';

const db = DbService.getInstance();

export class MonetizationController {
  public static async getPlans(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: db.subscriptions,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async sendTip(req: Request, res: Response): Promise<void> {
    try {
      const { receiverId, amount, message } = req.body;
      
      const newTip = {
        id: `tip-${uuidv4().substring(0, 8)}`,
        senderId: 'u-2',
        receiverId: receiverId || 'u-1',
        amount: parseFloat(amount) || 5.0,
        currency: 'USD',
        message: message || 'Great content!',
        createdAt: new Date(),
      };

      res.status(200).json({
        success: true,
        message: `Successfully tipped $${newTip.amount} to creator`,
        data: newTip,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
