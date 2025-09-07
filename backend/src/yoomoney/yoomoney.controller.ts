import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { YooMoneyService } from './yoomoney.service';
import type { PaymentRequest } from './yoomoney.service';

@Controller('payments')
export class YooMoneyController {
  constructor(private readonly yooMoneyService: YooMoneyService) {}

  @Post('create')
  async createPayment(@Body() paymentRequest: PaymentRequest) {
    return this.yooMoneyService.createPayment(paymentRequest);
  }

  @Get(':paymentId/status')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.yooMoneyService.getPaymentStatus(paymentId);
  }

  @Post(':paymentId/capture')
  async capturePayment(
    @Param('paymentId') paymentId: string,
    @Body() body: { amount?: number },
  ) {
    return this.yooMoneyService.capturePayment(paymentId, body.amount);
  }

  @Post(':paymentId/cancel')
  async cancelPayment(@Param('paymentId') paymentId: string) {
    return this.yooMoneyService.cancelPayment(paymentId);
  }

  @Post(':paymentId/refund')
  async createRefund(
    @Param('paymentId') paymentId: string,
    @Body() body: { amount: number; description?: string },
  ) {
    return this.yooMoneyService.createRefund(
      paymentId,
      body.amount,
      body.description,
    );
  }

  @Get('methods')
  async getPaymentMethods() {
    return this.yooMoneyService.getPaymentMethods();
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() body: any,
    @Headers('x-yoomoney-signature') signature: string,
  ) {
    // Валидация подписи
    if (!this.yooMoneyService.validateWebhook(body, signature)) {
      return { error: 'Invalid signature' };
    }

    // Обработка различных типов событий
    switch (body.event) {
      case 'payment.succeeded':
        // Платеж успешно завершен
        console.log('Payment succeeded:', body.object);
        // Здесь можно обновить статус заказа в базе данных
        break;

      case 'payment.canceled':
        // Платеж отменен
        console.log('Payment canceled:', body.object);
        break;

      case 'refund.succeeded':
        // Возврат успешно выполнен
        console.log('Refund succeeded:', body.object);
        break;

      default:
        console.log('Unknown event:', body.event);
    }

    return { success: true };
  }
}
