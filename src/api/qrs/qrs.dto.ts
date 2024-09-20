import { Contact, notification, Qr } from "@car-qr-link/apis";
import { IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";


export class GetResponse {
    qr: Pick<Qr, 'id'>
    account?: {}
}

export class LinkRequest {
    @IsPhoneNumber('RU', { message: 'Неверный формат телефона' })
    phone: string;

    @IsNotEmpty({ message: 'Не указан гос. номер автомобиля' })
    licensePlate: string;
}


export class LinkResponse {
    requestId: string;
}

export class LinkConfirmRequest {
    @IsNotEmpty({ message: 'Не указан ИД запроса подтверждения' })
    requestId: string;

    @IsNotEmpty({ message: 'Не указан код подтверждения' })
    code: string;
}

export class LinkConfirmResponse { }

export class NotifyRequest {
    @IsOptional()
    reasonId?: string;
}

export class NotifyResponse {
    contact?: Contact;
    answer?: notification.Answer;
}


export interface VerifyRequestPayload extends LinkRequest {
    code: string;
}