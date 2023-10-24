export class CreateMessageDto {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  text: string;
}
