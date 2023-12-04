export type TMessage = {
    _id?: string;
    context: string;
    senderId: string;
    receiverId?: string;
    chatRoomId: string;
    tempId?: string;
    createdAt: string
  };