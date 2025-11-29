export interface UpcomingSession {
  id: string;
  menteeId: string;
  menteeName: string;
  scheduledAt: Date;
  durationMinutes: number;
  topic: string;
  status: "scheduled" | "completed" | "canceled";
  createdAt: Date;
  updatedAt: Date;
}
