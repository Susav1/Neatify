import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Bookings from './bookings';
import Messages from './messages';
import Profile from './Profile';
import SettingsScreen from './settings';
import HomeCleaningDetails from './HomeCleaningDetails';
import CategoryHome from './categoryHome';
import Chat from './chat';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState('Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await fetch('http://localhost:5000/services');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleServicePress = (service) => {
    setSelectedServiceId(service.id);
    setCurrentPage('HomeCleaningDetails');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return (
          <ScrollView contentContainerStyle={styles.pageContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.appName}>Find Your Cleaning Service</Text>
              <TouchableOpacity style={styles.profileButton}>
                {/* <Image style={styles.profileImage} /> */}
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search services..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#27AE60" />
            ) : (
              <>
                <View style={styles.sectionHeader}>
                  <TouchableOpacity>
                    <Text style={styles.sectionTitle}>Popular Services</Text>
                    <Text style={styles.seeAllText}>See all</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.taskContainer}>
                  {categories
                    .filter((cat) => cat && Array.isArray(cat.services))
                    .flatMap((cat) => cat.services || [])
                    .map((service, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.taskCard}
                        onPress={() => handleServicePress(service)}>
                        <Text style={styles.taskTitle}>{service.name}</Text>
                        <Text style={styles.taskPrice}>From NPR {service.price}</Text>
                        <Text>{service.description}</Text>
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={16} color="#FFD700" />
                          <Text style={styles.ratingText}>4.5</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryCard}
                      onPress={() => {
                        setSelectedCategory(cat);
                        setCurrentPage('CategoryHome');
                      }}>
                      <View style={styles.categoryIcon}>
                        <Image
                          source={{ uri: `http://localhost:5000/${cat.icon}` }}
                          style={{ width: 30, height: 30, resizeMode: 'contain' }}
                        />
                      </View>
                      <Text style={styles.categoryTitle}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        );
      case 'Bookings':
        return <Bookings />;
      case 'Messages':
        return <Messages setCurrentPage={setCurrentPage} />;
      case 'Settings':
        return <SettingsScreen />;
      case 'HomeCleaningDetails':
        return (
          <HomeCleaningDetails setCurrentPage={setCurrentPage} serviceId={selectedServiceId} />
        );
      case 'CategoryHome':
        return <CategoryHome setCurrentPage={setCurrentPage} category={selectedCategory} />;
      case 'Chat':
        return <Chat setCurrentPage={setCurrentPage} serviceId={selectedServiceId} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderPage()}</View>
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setCurrentPage('Home')} style={styles.navItem}>
          <Ionicons
            name={currentPage === 'Home' ? 'home' : 'home-outline'}
            size={24}
            color={currentPage === 'Home' ? '#27AE60' : '#888'}
          />
          <Text style={[styles.navText, currentPage === 'Home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentPage('Bookings')} style={styles.navItem}>
          <FontAwesome
            name={currentPage === 'Bookings' ? 'calendar-check-o' : 'calendar-o'}
            size={24}
            color={currentPage === 'Bookings' ? '#27AE60' : '#888'}
          />
          <Text style={[styles.navText, currentPage === 'Bookings' && styles.activeNavText]}>
            Bookings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentPage('Messages')} style={styles.navItem}>
          <Ionicons
            name={currentPage === 'Messages' ? 'chatbubbles' : 'chatbubbles-outline'}
            size={24}
            color={currentPage === 'Messages' ? '#27AE60' : '#888'}
          />
          <Text style={[styles.navText, currentPage === 'Messages' && styles.activeNavText]}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentPage('Settings')} style={styles.navItem}>
          <Ionicons
            name={currentPage === 'Settings' ? 'settings' : 'settings-outline'}
            size={24}
            color={currentPage === 'Settings' ? '#27AE60' : '#888'}
          />
          <Text style={[styles.navText, currentPage === 'Settings' && styles.activeNavText]}>
            Settings
          </Text>
        </TouchableOpacity>
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
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 25,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#27AE60',
    fontSize: 14,
  },
  taskContainer: {
    marginBottom: 25,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 200,
    marginRight: 15,
    padding: 15,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskPrice: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: 'bold',
  },
  ratingContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 3,
    color: '#333',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  activeNavText: {
    color: '#27AE60',
    fontWeight: '600',
  },
});

export default HomePage;
