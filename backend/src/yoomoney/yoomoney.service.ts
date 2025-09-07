import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface PaymentRequest {
  amount: number;
  description: string;
  userId: string;
  returnUrl?: string;
}

export interface PaymentResponse {
  paymentId: string;
  paymentUrl: string;
  status: string;
}

@Injectable()
export class YooMoneyService {
  private readonly shopId: string;
  private readonly secretKey: string;
  private readonly apiUrl = 'https://api.yookassa.ru/v3';

  constructor(private configService: ConfigService) {
    this.shopId =
      this.configService.get<string>('YOOMONEY_SHOP_ID') || 'test_shop_id';
    this.secretKey =
      this.configService.get<string>('YOOMONEY_SECRET_KEY') ||
      'test_secret_key';
  }

  async createPayment(
    paymentRequest: PaymentRequest,
  ): Promise<PaymentResponse> {
    try {
      const headers = {
        Authorization: `Basic ${Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': this.generateIdempotenceKey(),
      };

      const data = {
        amount: {
          value: paymentRequest.amount.toFixed(2),
          currency: 'RUB',
        },
        confirmation: {
          type: 'redirect',
          return_url:
            paymentRequest.returnUrl || 'https://your-app.com/payment/success',
        },
        capture: true,
        description: paymentRequest.description,
        metadata: {
          userId: paymentRequest.userId,
        },
      };

      const response = await axios.post(`${this.apiUrl}/payments`, data, {
        headers,
      });

      return {
        paymentId: response.data.id,
        paymentUrl: response.data.confirmation.confirmation_url,
        status: response.data.status,
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка создания платежа: ${error.response?.data?.description || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    try {
      const headers = {
        Authorization: `Basic ${Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.get(`${this.apiUrl}/payments/${paymentId}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ошибка получения статуса платежа: ${error.response?.data?.description || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async capturePayment(paymentId: string, amount?: number): Promise<any> {
    try {
      const headers = {
        Authorization: `Basic ${Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': this.generateIdempotenceKey(),
      };

      const data = amount
        ? {
            amount: {
              value: amount.toFixed(2),
              currency: 'RUB',
            },
          }
        : {};

      const response = await axios.post(
        `${this.apiUrl}/payments/${paymentId}/capture`,
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ошибка подтверждения платежа: ${error.response?.data?.description || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cancelPayment(paymentId: string): Promise<any> {
    try {
      const headers = {
        Authorization: `Basic ${Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': this.generateIdempotenceKey(),
      };

      const response = await axios.post(
        `${this.apiUrl}/payments/${paymentId}/cancel`,
        {},
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ошибка отмены платежа: ${error.response?.data?.description || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createRefund(
    paymentId: string,
    amount: number,
    description?: string,
  ): Promise<any> {
    try {
      const headers = {
        Authorization: `Basic ${Buffer.from(`${this.shopId}:${this.secretKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': this.generateIdempotenceKey(),
      };

      const data = {
        amount: {
          value: amount.toFixed(2),
          currency: 'RUB',
        },
        payment_id: paymentId,
        description: description || 'Возврат средств',
      };

      const response = await axios.post(`${this.apiUrl}/refunds`, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Ошибка создания возврата: ${error.response?.data?.description || error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Валидация webhook от ЮMoney
  validateWebhook(requestBody: any, signature: string): boolean {
    const crypto = require('crypto');

    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(JSON.stringify(requestBody));
    const expectedSignature = hmac.digest('hex');

    return signature === expectedSignature;
  }

  private generateIdempotenceKey(): string {
    return Date.now().toString() + Math.random().toString(36).substring(7);
  }

  // Получение списка платежных методов
  async getPaymentMethods(): Promise<any> {
    return {
      methods: [
        { id: 'bank_card', name: 'Банковская карта', enabled: true },
        { id: 'yoo_money', name: 'ЮMoney', enabled: true },
        { id: 'sberbank', name: 'Сбербанк Онлайн', enabled: true },
        { id: 'qiwi', name: 'QIWI Wallet', enabled: true },
        { id: 'webmoney', name: 'WebMoney', enabled: true },
        { id: 'alfabank', name: 'Альфа-Клик', enabled: true },
        { id: 'apple_pay', name: 'Apple Pay', enabled: true },
        { id: 'google_pay', name: 'Google Pay', enabled: true },
      ],
    };
  }
}
