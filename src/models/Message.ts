export interface Message {
    id: string;
    content: string;
    author: { id: string, name: string };
    createdAt: Date;
}

export default Message;