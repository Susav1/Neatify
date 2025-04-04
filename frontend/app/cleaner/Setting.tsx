import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

const Settings = () => {
  const settingsOptions = [
    { id: '1', name: 'Profile' },
    { id: '2', name: 'Notifications' },
    { id: '3', name: 'Privacy & Security' },
    { id: '4', name: 'Payment Methods' },
    { id: '5', name: 'Help & Support' },
    { id: '6', name: 'Log Out' },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      {settingsOptions.map((option) => (
        <TouchableOpacity key={option.id} style={tw`p-4 bg-gray-100 rounded-lg mb-2`}>
          <Text style={tw`text-gray-700`}>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Settings;
