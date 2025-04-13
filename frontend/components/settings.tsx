import { logout } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen: React.FC = () => {
  const handleMyBookings = () => {
    Alert.alert('My Bookings', 'Navigate to My Bookings screen');
  };

  const handleContactUs = () => {
    Alert.alert('Contact Us', 'Navigate to Contact Us screen');
  };

  const handleLanguage = () => {
    Alert.alert('Language', 'Open Language selection modal');
  };

  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationKey: ['logout'],
    mutationFn: logout,
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            // Call the logout mutation
            await mutateAsync();

            // After successful logout, navigate to login screen
            router.replace('/(auth)/sign-in');

            console.log('User logged out successfully');
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Logout Failed', 'There was a problem logging out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* Options Container */}
      <View style={styles.optionsContainer}>
        {/* My Bookings Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleMyBookings}>
          <View style={styles.optionContent}>
            <Icon name="book" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>My Bookings</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        {/* Contact Us Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleContactUs}>
          <View style={styles.optionContent}>
            <Icon name="contact-support" size={24} color="#2196F3" />
            <Text style={styles.optionText}>Contact Us</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        {/* Language Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleLanguage}>
          <View style={styles.optionContent}>
            <Icon name="language" size={24} color="#FF9800" />
            <Text style={styles.optionText}>Language</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        {/* Logout Option */}
        <TouchableOpacity style={styles.optionCard} onPress={handleLogout}>
          <View style={styles.optionContent}>
            <Icon name="logout" size={24} color="#F44336" />
            <Text style={[styles.optionText, styles.logoutText]}>Logout</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Changed background color to white
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 150,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsContainer: {
    marginTop: 20, // Added margin to bring the options closer to the header
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 16,
  },
  logoutText: {
    color: '#F44336',
  },
});

export default SettingsScreen;
