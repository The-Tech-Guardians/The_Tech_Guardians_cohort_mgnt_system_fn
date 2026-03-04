import { io, Socket } from 'socket.io-client';

import { SOCKET_URL } from '../../../../config/api';

const SOCKET_BASE_URL = SOCKET_URL;

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected');
        this.socket?.emit('register', userId);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(receiverId: string, senderId: string, content: string) {
    this.socket?.emit('sendMessage', { receiverId, senderId, content });
  }

  onReceiveMessage(callback: (message: any) => void) {
    this.socket?.on('receiveMessage', callback);
  }

  onMessageSent(callback: (message: any) => void) {
    this.socket?.on('messageSent', callback);
  }

  sendTyping(receiverId: string, senderId: string) {
    this.socket?.emit('typing', { receiverId, senderId });
  }

  onUserTyping(callback: (data: { senderId: string }) => void) {
    this.socket?.on('userTyping', callback);
  }

  onUserStatusChange(callback: (data: { userId: string; isOnline: boolean; lastSeen?: Date }) => void) {
    this.socket?.on('userStatusChange', callback);
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
