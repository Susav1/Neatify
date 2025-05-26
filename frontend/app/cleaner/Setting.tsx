import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, Href } from 'expo-router';
import tw from 'twrnc';
import { logout } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { Alert } from 'react-native';

const Settings = () => {
  const { onLogout } = useAuth();
  const { mutateAsync } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
  });

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await mutateAsync();
            onLogout();
            router.replace('/(auth)/sign-in');
          } catch (error) {
            console.error('Logout failed:', error);
            onLogout();
            router.replace('/(auth)/sign-in');
          }
        },
      },
    ]);
  };

  const settingsOptions = [
    { id: '1', name: 'Profile', action: () => router.push('/cleaner/Profile' as Href) },
    { id: '2', name: 'Notifications', action: () => Alert.alert('Notifications') },
    { id: '3', name: 'Privacy & Security', action: () => Alert.alert('Privacy & Security') },
    { id: '4', name: 'Payment Methods', action: () => Alert.alert('Payment Methods') },
    { id: '5', name: 'Help & Support', action: () => Alert.alert('Help & Support') },
    { id: '6', name: 'Log Out', action: handleLogout },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      {settingsOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={tw`p-4 bg-gray-100 rounded-lg mb-2`}
          onPress={option.action}>
          <Text style={tw`text-gray-700 text-base`}>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Settings;
