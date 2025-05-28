import { logout } from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';
import { router, Href } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '@/context/auth-context';
import { API_URL } from '@/constants';

interface SettingsScreenProps {
  setCurrentPage: (page: string) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ setCurrentPage }) => {
  const { onLogout, authState } = useAuth();
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
            onLogout();
            await mutateAsync();
            router.replace({ pathname: '/(auth)/sign-in' } as Href);
          } catch (error) {
            console.error('Logout failed:', error);
            onLogout();
            router.replace({ pathname: '/(auth)/sign-in' } as Href);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <TouchableOpacity style={styles.profileSection} onPress={() => setCurrentPage('Profile')}>
        <View style={styles.profileImageContainer}>
          {authState.user?.profilePicture ? (
            <Image
              source={{
                uri: authState.user.profilePicture.startsWith('http')
                  ? authState.user.profilePicture
                  : `${API_URL}${authState.user.profilePicture}`,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Icon name="person" size={24} color="#888" />
            </View>
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{authState.user?.name || 'User Name'}</Text>
          <Text style={styles.profileEmail}>{authState.user?.email || 'user@example.com'}</Text>
          <Text style={styles.editProfileText}>View Profile</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={() => Alert.alert('My Bookings')}>
          <View style={styles.optionContent}>
            <Icon name="book" size={24} color="#4CAF50" />
            <Text style={styles.optionText}>My Bookings</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => Alert.alert('Notifications')}>
          <View style={styles.optionContent}>
            <Icon name="notifications" size={24} color="#FF9800" />
            <Text style={styles.optionText}>Notifications</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => Alert.alert('Payment')}>
          <View style={styles.optionContent}>
            <Icon name="payment" size={24} color="#2196F3" />
            <Text style={styles.optionText}>Payment</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={() => Alert.alert('Contact Us')}>
          <View style={styles.optionContent}>
            <Icon name="contact-support" size={24} color="#2196F3" />
            <Text style={styles.optionText}>Contact Us</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

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
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  editProfileText: {
    color: '#2196F3',
    marginTop: 5,
    fontSize: 14,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
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
