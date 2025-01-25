import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONT_END_URL,
    methods: ['GET', 'POST'],

    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const partnerId = client.handshake.query.partnerId;
    console.log(partnerId);


    if (partnerId) {
      client.join(partnerId);
      console.log(`Client ${client.id} joined room: ${partnerId}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendNotificationToPartner(partnerId: string, notification: any) {
    this.server.to(partnerId).emit('notifyPartner', notification);
  }

  sendNotificationToUser(userId: string, notification: any){
    this.server.to(userId).emit('notifyUser', notification);
  }

  @SubscribeMessage('newBooking')
  handleNewBooking(@MessageBody() data: any): void {
    console.log('New booking received:', data);
    // Gửi thông báo đến tất cả các clients (partners)
    this.server.emit('notifyPartner', {
      message: `New booking: ${data.message}`,
      date: new Date(),
    });
  }

  handlePromoteUser(@MessageBody() data: any): void {
    console.log('Partner Promoted:', data);
    // Gửi thông báo đến tất cả các clients (partners)
    this.server.emit('notifyUser', {
      message: `New booking: ${data.message}`,
      date: new Date(),
    });
  }
}
