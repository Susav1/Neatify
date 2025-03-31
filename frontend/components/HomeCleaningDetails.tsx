import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';

const CleaningServiceView = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [userLocation, setUserLocation] = useState('');

  const handleBooking = () => {
    if (!userName || !userPhone || !userLocation) {
      Alert.alert('Please fill all required fields.');
    } else {
      // Placeholder for booking logic
      Alert.alert('Booking confirmed!', `Thank you, ${userName}.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Cleaning Service</Text>
      <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
        }} // Replace with actual image URL
        style={styles.serviceImage}
      />
      <Text style={styles.description}>
        We offer professional home cleaning services using eco-friendly products to ensure your home
        is spotless and safe.
      </Text>

      <Text style={styles.sectionTitle}>Service Details</Text>
      <View style={styles.serviceDetails}>
        <Text style={styles.detailText}>Price: NPR 2000</Text>
        <Text style={styles.detailText}>Duration: 2-3 hours</Text>
        <Text style={styles.detailText}>Cleaning Areas: Kitchen, Living Room, Bathroom</Text>
        <Text style={styles.detailText}>Features: Eco-friendly, Pet-friendly</Text>
      </View>

      {/* Moved buttons down further by increasing marginTop */}
      <TouchableOpacity style={[styles.bookButton, { marginTop: 50 }]} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backButton, { marginTop: 20 }]}
        onPress={() => setCurrentPage('Home')}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  serviceImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  serviceDetails: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  bookButton: {
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#DB2955',
    padding: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default CleaningServiceView;
