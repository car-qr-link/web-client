import { Body, Controller, Get, Logger, Param, Post, Redirect, Render } from '@nestjs/common';

@Controller()
export class AppController {
    private readonly logger = new Logger(AppController.name);

    @Get()
    @Render('index')
    async index() { }

    @Get(':code')
    @Redirect('/')
    async qr(
        @Param('code') code: string
    ) {
        this.logger.debug(code);
    }

    @Post()
    @Render('success')
    async post(
        @Body('code') code: string
    ) {
        this.logger.debug(code);

        return {
            body: {
                // contact: {
                //     address: '+7-999-123-45-67',
                // }
            }
        };
    }
}
