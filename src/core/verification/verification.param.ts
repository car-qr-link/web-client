import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const VerificationPayload = createParamDecorator<string>((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.verificationPayload;
})