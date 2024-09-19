import { NotificationChannel } from "@car-qr-link/apis";

export interface VerifyRequest {
    channel: NotificationChannel;
    address: string;
    code: string;
}