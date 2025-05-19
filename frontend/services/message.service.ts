import api from './api';

interface MessagePayload {
  content: string;
  serviceId?: string;
  conversationId?: string;
}

interface Conversation {
  id: string;
  user: { id: string; name: string; email: string };
  cleaner?: { id: string; name: string; email: string };
  service?: { id: string; name: string };
  isGroup: boolean;
  messages: { content: string; createdAt: string }[];
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'User' | 'Cleaner';
  content: string;
  createdAt: string;
  user?: { name: string };
  cleaner?: { name: string };
}

export const sendMessage = async (payload: MessagePayload) => {
  try {
    const response = await api.post('/api/messages', payload);
    return response.data.message;
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error(error.response?.data?.error || 'Failed to send message');
  }
};

export const getConversations = async () => {
  try {
    const response = await api.get('/api/messages');
    return response.data as Conversation[];
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch conversations');
  }
};

export const getMessages = async (conversationId: string) => {
  try {
    const response = await api.get(`/api/messages/${conversationId}/messages`);
    return response.data as Message[];
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch messages');
  }
};
