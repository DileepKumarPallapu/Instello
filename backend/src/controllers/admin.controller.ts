// Admin Governance & Moderation Control Center
import { Request, Response } from 'express';
import { DbService } from '../services/db.service';

const db = DbService.getInstance();

export class AdminController {
  public static async getReports(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: [
          {
            id: 'rep-101',
            reporterUsername: 'elena_design',
            reportedUsername: 'spammer_bot99',
            reason: 'Suspicious automated link distribution',
            status: 'PENDING',
            createdAt: new Date(Date.now() - 3600000 * 4),
          },
          {
            id: 'rep-102',
            reporterUsername: 'alex_creator',
            reportedUsername: 'troll_account',
            reason: 'Harassment & abusive comments',
            status: 'PENDING',
            createdAt: new Date(Date.now() - 3600000 * 18),
          }
        ],
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { status, isVerified } = req.body;
      const user = db.users.find(u => u.id === userId);

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      if (status !== undefined) user.status = status;
      if (isVerified !== undefined) user.isVerified = isVerified;

      res.status(200).json({
        success: true,
        message: 'User account governance status updated',
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
