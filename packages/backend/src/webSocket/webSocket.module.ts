import { Module, forwardRef } from '@nestjs/common';
import { WebSocketService } from 'src/webSocket/webSocket.service';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [forwardRef(() => MessageModule)],
  providers: [WebSocketService],
  exports: [WebSocketService],
})
export class WebSocketModule {}
