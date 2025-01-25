import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    sendNotificationToPartner(partnerId: string, notification: any): void;
    sendNotificationToUser(userId: string, notification: any): void;
    handleNewBooking(data: any): void;
    handlePromoteUser(data: any): void;
}
