import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import tw from 'twrnc';

const Notifications = () => {
  const notifications = [
    { id: '1', message: 'Your request has been accepted.' },
    { id: '2', message: 'Payment received successfully.' },
    { id: '3', message: 'New booking request received.' },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      {notifications.map((notification) => (
        <View key={notification.id} style={tw`p-4 bg-gray-100 rounded-lg mb-2`}>
          <Text style={tw`text-gray-700`}>{notification.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default Notifications;
