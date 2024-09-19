import { IsNotEmpty, IsPhoneNumber } from "class-validator";

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
