import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { sendMessage, getMessages } from '../services/message.service';
import { useAuth } from '../context/auth-context';

interface Message {
  id: string;
  senderId: string;
  senderType: 'User' | 'Cleaner';
  content: string;
  createdAt: string;
  cleaner?: { name: string };
}

interface ChatProps {
  setCurrentPage: (page: string) => void;
  serviceId: string | null;
}

const Chat: React.FC<ChatProps> = ({ setCurrentPage, serviceId }) => {
  const { authState } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedCleanerId, setSelectedCleanerId] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId || !authState.authenticated) {
      setCurrentPage('Home');
      return;
    }

    const fetchMessages = async () => {
      try {
        if (conversationId) {
          const fetchedMessages = await getMessages(conversationId);
          setMessages(fetchedMessages);
          const cleanerResponse = fetchedMessages.find((msg) => msg.senderType === 'Cleaner');
          if (cleanerResponse) {
            setSelectedCleanerId(cleanerResponse.senderId);
            setCurrentPage('Messages');
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    fetchMessages();

    return () => clearInterval(interval);
  }, [conversationId, serviceId, authState.authenticated, setCurrentPage]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const payload = {
        content: newMessage,
        serviceId: serviceId || undefined, // Convert null to undefined
        conversationId: conversationId || undefined, // Convert null to undefined
      };
      const response = await sendMessage(payload);
      setConversationId(response.conversation.id);
      setMessages((prev) => [
        ...prev,
        {
          id: response.id,
          senderId: authState.user?.id || '',
          senderType: 'User',
          content: newMessage,
          createdAt: response.createdAt,
        },
      ]);
      setNewMessage('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message');
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={tw`mb-4 mx-4 flex-row ${
        item.senderType === 'User' ? 'justify-end' : 'justify-start'
      }`}>
      <View
        style={tw`max-w-[70%] p-3 rounded-lg ${
          item.senderType === 'User' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}>
        <Text style={tw`${item.senderType === 'User' ? 'text-white' : 'text-gray-800'}`}>
          {item.content}
        </Text>
        <Text
          style={tw`text-xs mt-1 ${item.senderType === 'User' ? 'text-white' : 'text-gray-500'}`}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
        <TouchableOpacity onPress={() => setCurrentPage('HomeCleaningDetails')}>
          <Ionicons name="chevron-back" size={24} color="#27AE60" />
        </TouchableOpacity>
        <Text style={tw`ml-3 text-lg font-semibold text-gray-800`}>
          {selectedCleanerId ? 'Cleaner Chat' : 'All Cleaners'}
        </Text>
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-4`}
      />
      <View style={tw`flex-row items-center p-4 border-t border-gray-200`}>
        <TextInput
          style={tw`flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2`}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message to all cleaners..."
        />
        <TouchableOpacity onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#27AE60" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
