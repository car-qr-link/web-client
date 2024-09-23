import { NotificationChannel } from "@car-qr-link/apis";

export interface VerifyRequest<T> {
    channel: NotificationChannel;
    address: string;
    code: string;

    payload: T;
}
