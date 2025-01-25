"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let NotificationGateway = class NotificationGateway {
    handleConnection(client) {
        const partnerId = client.handshake.query.partnerId;
        console.log(partnerId);
        if (partnerId) {
            client.join(partnerId);
            console.log(`Client ${client.id} joined room: ${partnerId}`);
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    sendNotificationToPartner(partnerId, notification) {
        this.server.to(partnerId).emit('notifyPartner', notification);
    }
    sendNotificationToUser(userId, notification) {
        this.server.to(userId).emit('notifyUser', notification);
    }
    handleNewBooking(data) {
        console.log('New booking received:', data);
        this.server.emit('notifyPartner', {
            message: `New booking: ${data.message}`,
            date: new Date(),
        });
    }
    handlePromoteUser(data) {
        console.log('Partner Promoted:', data);
        this.server.emit('notifyUser', {
            message: `New booking: ${data.message}`,
            date: new Date(),
        });
    }
};
exports.NotificationGateway = NotificationGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('newBooking'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handleNewBooking", null);
__decorate([
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationGateway.prototype, "handlePromoteUser", null);
exports.NotificationGateway = NotificationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONT_END_URL,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })
], NotificationGateway);
//# sourceMappingURL=notification.gateway.js.map