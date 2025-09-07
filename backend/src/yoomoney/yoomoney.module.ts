import { Module } from '@nestjs/common';
import { YooMoneyService } from './yoomoney.service';
import { YooMoneyController } from './yoomoney.controller';

@Module({
  controllers: [YooMoneyController],
  providers: [YooMoneyService],
  exports: [YooMoneyService],
})
export class YooMoneyModule {}
