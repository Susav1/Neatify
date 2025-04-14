import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryHome = ({ setCurrentPage }) => {
  const services = [
    {
      name: 'Window Cleaning',
      description: 'Professional window cleaning for sparkling results',
      price: '$40',
      rating: 4.7,
      image: 'https://shorturl.at/example1', // replace with actual image URL
    },
    {
      name: 'Sofa Cleaning',
      description: 'Deep cleaning for all types of sofas',
      price: '$60',
      rating: 4.8,
      image: 'https://shorturl.at/example2', // replace with actual image URL
    },
    {
      name: 'Kitchen Cleaning',
      description: 'Complete kitchen deep cleaning service',
      price: '$75',
      rating: 4.9,
      image: 'https://shorturl.at/example3', // replace with actual image URL
    },
    {
      name: 'Bathroom Cleaning',
      description: 'Sanitization and deep cleaning of bathrooms',
      price: '$55',
      rating: 4.6,
      image: 'https://shorturl.at/example4', // replace with actual image URL
    },
    {
      name: 'Bedroom Cleaning',
      description: 'Complete bedroom cleaning and organization',
      price: '$50',
      rating: 4.5,
      image: 'https://shorturl.at/example5', // replace with actual image URL
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage('Home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#27AE60" />
        </TouchableOpacity>
        <Text style={styles.title}>House Cleaning Services</Text>
      </View>

      {services.map((service, index) => (
        <TouchableOpacity
          key={index}
          style={styles.serviceCard}
          onPress={() => {
            // You can navigate to specific service details if needed
            // For now, we'll just go to HomeCleaningDetails
            setCurrentPage('HomeCleaningDetails');
          }}>
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            <View style={styles.serviceFooter}>
              <Text style={styles.servicePrice}>{service.price}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{service.rating}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: 100,
    height: 100,
  },
  serviceInfo: {
    flex: 1,
    padding: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default CategoryHome;
