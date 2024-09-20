import { Contact, notification } from "@car-qr-link/apis";
import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsOptional, IsPhoneNumber } from "class-validator";
import { EXAMPLES } from "src/swagger";

export class Qr {
    @ApiProperty({ description: 'Значение QR', example: EXAMPLES.QR_CODE })
    code: string;
}

export class GetResponse {
    @ApiProperty({ description: 'Информация о QR' })
    qr: Qr

    @ApiPropertyOptional({ description: 'Наличие привязанной учетной записи' })
    account?: {}
}

export class LinkRequest {
    @IsPhoneNumber('RU', { message: 'Неверный формат телефона' })
    @ApiProperty({ description: 'Номер телефона', example: EXAMPLES.PHONE })
    phone: string;

    @IsNotEmpty({ message: 'Не указан гос. номер автомобиля' })
    @ApiProperty({ description: 'Гос. номер автомобиля', example: EXAMPLES.LICENSE_PLATE })
    licensePlate: string;
}

export class VerifyConfirmation {
    @IsNotEmpty({ message: 'Не указан ИД запроса подтверждения' })
    @ApiProperty({ description: 'ИД запроса подтверждения', example: EXAMPLES.CONFIRMATION_ID })
    id: string;

    @IsNotEmpty({ message: 'Не указан код подтверждения' })
    @ApiProperty({ description: 'Код подтверждения', example: EXAMPLES.CONFIRMATION_CODE })
    code: string;
}

export class VerifyRequested extends PickType(VerifyConfirmation, ['id'] as const) { }

export class LinkResponse {
    @ApiProperty()
    verification: VerifyRequested
}

export class LinkConfirmRequest {
    @ApiProperty()
    verification: VerifyConfirmation
}

export class LinkConfirmResponse { }

export class NotifyRequest { }

export class NotifyResponse {
    @ApiPropertyOptional({ description: 'Контакты владельца QR' })
    contact?: Contact;
    @ApiPropertyOptional({ description: 'Ответ владельца QR' })
    answer?: notification.Answer;
}


export interface VerifyRequestPayload extends LinkRequest {
    code: string;
}
