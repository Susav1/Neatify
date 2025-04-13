import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { useAuth } from '@/context/auth-context';
import Bookings from './bookings';
import Messages from './messages';
import Profile from './Profile';
import SettingsScreen from './settings';
import { useGetProfile } from '@/services/profile.service';
import HomeCleaningDetails from './HomeCleaningDetails';
import CarpetCleaningDetails from './CarpetCleaningDetails';

const ListHamburger = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const { onLogout } = useAuth();
  const { data: profileData } = useGetProfile();

  const taskImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ez6ka9mIXFVE8pjmZV4OABBZfcPRrUQOZQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ez6ka9mIXFVE8pjmZV4OABBZfcPRrUQOZQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs9AeS9mdMO01iat_VnqZfupKMafryPBjdDw&s',
  ];

  const categoryImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ez6ka9mIXFVE8pjmZV4OABBZfcPRrUQOZQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ez6ka9mIXFVE8pjmZV4OABBZfcPRrUQOZQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Ez6ka9mIXFVE8pjmZV4OABBZfcPRrUQOZQ&s',
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return (
          <ScrollView contentContainerStyle={styles.pageContainer}>
            <Text style={styles.appName}>Neatify</Text>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search services..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Search</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Tasks</Text>
            <ScrollView horizontal style={styles.taskContainer}>
              {['Home Cleaning', 'Office Cleaning', 'Carpet Cleaning'].map((task, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.taskCard}
                  onPress={() => {
                    if (task === 'Home Cleaning') setCurrentPage('HomeCleaningDetails');
                    else if (task === 'Office Cleaning') setCurrentPage('OfficeCleaningDetails');
                    else if (task === 'Carpet Cleaning') setCurrentPage('CarpetCleaningDetails');
                  }}>
                  <Image
                    source={{ uri: taskImages[index] }}
                    style={styles.taskImage}
                    resizeMode="cover"
                    onError={() => console.log('Image failed to load')}
                  />
                  <Text style={styles.taskTitle}>{task}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sectionSpacer} />

            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView horizontal style={styles.categoryContainer}>
              {['House Cleaning', 'Office Cleaning', 'Deep Cleaning'].map((category, index) => (
                <View key={index} style={styles.categoryCard}>
                  <Image
                    source={{ uri: categoryImages[index] }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                    onError={() => console.log('Image failed to load')}
                  />
                  <Text style={styles.categoryTitle}>{category}</Text>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        );
      case 'bookings':
        return <Bookings />;
      case 'Messages':
        return <Messages />;
      case 'Settings':
        return <SettingsScreen />;
      case 'HomeCleaningDetails':
        return <HomeCleaningDetails setCurrentPage={setCurrentPage} />;
      case 'OfficeCleaningDetails':
        return <OfficeCleaningDetails setCurrentPage={setCurrentPage} />;
      case 'CarpetCleaningDetails':
        return <CarpetCleaningDetails setCurrentPage={setCurrentPage} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderPage()}</View>

      <View style={styles.bottomNav}>
        {['Home', 'bookings', 'Messages', 'Settings'].map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            style={[styles.navItem, currentPage === page && styles.activeNavItem]}>
            <Text style={styles.navText}>{page}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
  },
  pageContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
    marginBottom: 50,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: 150,
    height: 150,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  taskTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionSpacer: {
    height: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    width: 150,
    height: 150,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  categoryTitle: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#27AE60',
    padding: 10,
  },
  navItem: {
    padding: 10,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#DB2955',
  },
  navText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default ListHamburger;
