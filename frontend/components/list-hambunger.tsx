import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '@/context/auth-context';
import Bookings from './bookings';
import Messages from './messages';
import Profile from './Profile';
import SettingsScreen from './settings';
import { useGetProfile } from '@/services/profile.service';

const ListHamburger = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const { onLogout } = useAuth();
  const { data: profileData } = useGetProfile();

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return (
          <View style={styles.pageContainer}>
            <Text style={styles.pageText}>Home Page</Text>
          </View>
        );
      case 'bookings':
        return <Bookings />; 
      case 'Messages':
        return (
          <View style={styles.pageContainer}>
            <Text style={styles.pageText}>Messages Page</Text>
          </View>
        );
      case 'Settings':
        return <SettingsScreen />; 
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <View style={styles.content}>{renderPage()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          onPress={() => setCurrentPage('Home')}
          style={[
            styles.navItem,
            currentPage === 'Home' && styles.activeNavItem,
          ]}
        >
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentPage('bookings')} 
          style={[
            styles.navItem,
            currentPage === 'bookings' && styles.activeNavItem,
          ]}
        >
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentPage('Messages')}
          style={[
            styles.navItem,
            currentPage === 'Messages' && styles.activeNavItem,
          ]}
        >
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentPage('Settings')}
          style={[
            styles.navItem,
            currentPage === 'Settings' && styles.activeNavItem,
          ]}
        >
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#27AE60',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#DB2955',
  },
  navText: {
    fontSize: 16,
    color: 'white',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#DB2955',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ListHamburger;