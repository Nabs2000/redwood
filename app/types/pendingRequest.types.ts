export interface PendingRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  requestedAt: Date;
  topic: string;
  message?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: Date;
  updatedAt: Date;
}
