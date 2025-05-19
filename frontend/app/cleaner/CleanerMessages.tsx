import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getConversations, getMessages, sendMessage } from '../../services/message.service';
import { useAuth } from '../../context/auth-context';

// Define the navigation stack's param list
type CleanerStackParamList = {
  CleanerHome: undefined;
  Login: undefined;
  // Add other routes as needed
};

// Type the navigation prop
type NavigationProp = NativeStackNavigationProp<CleanerStackParamList>;

interface User {
  id: string;
  name: string;
  email: string;
}

interface Conversation {
  id: string;
  user: User;
  cleaner?: { id: string; name: string; email: string };
  service?: { id: string; name: string };
  isGroup: boolean;
  messages: { content: string; createdAt: string }[];
}

interface Message {
  id: string;
  senderId: string;
  senderType: 'User' | 'Cleaner';
  content: string;
  createdAt: string;
  user?: { name: string };
  cleaner?: { name: string };
}

const CleanerMessages: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { authState } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!authState.authenticated) {
      navigation.navigate('Login');
      return;
    }

    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [authState.authenticated, navigation]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const data = await getMessages(selectedConversation);
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        content: newMessage,
        conversationId: selectedConversation,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          senderId: authState.user?.id || '',
          senderType: 'Cleaner',
          content: newMessage,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={tw`flex-row items-center p-4 border-b border-gray-200`}
      onPress={() => handleSelectConversation(item.id)}>
      <Image
        source={{ uri: 'https://shorturl.at/PEb19' }} // Fallback image
        style={tw`w-12 h-12 rounded-full mr-3`}
      />
      <View style={tw`flex-1`}>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-lg font-semibold text-gray-800`}>{item.user.name}</Text>
          <Text style={tw`text-sm text-gray-500`}>
            {item.messages[0] ? new Date(item.messages[0].createdAt).toLocaleTimeString() : ''}
          </Text>
        </View>
        <Text style={tw`text-gray-600`}>{item.messages[0]?.content || 'No messages'}</Text>
        {item.messages.length > 0 && (
          <View style={tw`bg-green-500 rounded-full px-2 py-1 mt-1`}>
            <Text style={tw`text-white text-xs`}>1</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View
      style={tw`mb-4 mx-4 flex-row ${
        item.senderType === 'Cleaner' ? 'justify-end' : 'justify-start'
      }`}>
      <View
        style={tw`max-w-[70%] p-3 rounded-lg ${
          item.senderType === 'Cleaner' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
        }`}>
        <Text style={tw`${item.senderType === 'Cleaner' ? 'text-white' : 'text-gray-800'}`}>
          {item.content}
        </Text>
        <Text
          style={tw`text-xs mt-1 ${
            item.senderType === 'Cleaner' ? 'text-white' : 'text-gray-500'
          }`}>
          {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  if (selectedConversation) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)}>
            <Ionicons name="chevron-back" size={24} color="#27AE60" />
          </TouchableOpacity>
          <Text style={tw`ml-3 text-lg font-semibold text-gray-800`}>
            {conversations.find((c) => c.id === selectedConversation)?.user.name || 'Chat'}
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
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="#27AE60" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 border-b border-gray-200 flex-row justify-between items-center`}>
        <Text style={tw`text-2xl font-bold text-gray-800`}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CleanerHome')}>
          <Ionicons name="home-outline" size={24} color="#27AE60" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-4`}
      />
    </SafeAreaView>
  );
};

export default CleanerMessages;
