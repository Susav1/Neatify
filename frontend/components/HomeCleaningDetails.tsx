import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

interface CleaningServiceViewProps {
  setCurrentPage: (page: string) => void;
}

const CleaningServiceView: React.FC<CleaningServiceViewProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidPhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  // Handle booking submission
  const handleBooking = () => {
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Validate phone format
    if (!isValidPhone(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    Alert.alert(
      'Booking Confirmed',
      `Thank you, ${formData.name}. Your cleaning service is booked.`,
      [
        {
          text: 'OK',
          onPress: () => setCurrentPage('Home'),
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Home Cleaning Service</Text>

      <Image
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
        }}
        style={styles.serviceImage}
      />

      <Text style={styles.description}>
        We offer professional home cleaning services using eco-friendly products.
      </Text>

      <Text style={styles.sectionTitle}>Service Details</Text>
      <View style={styles.serviceDetails}>
        <Text style={styles.detailText}>Price: NPR 2000</Text>
        <Text style={styles.detailText}>Duration: 2-3 hours</Text>
        <Text style={styles.detailText}>Cleaning Areas: Kitchen, Living Room, Bathroom</Text>
      </View>

      {/* Booking Form */}
      <Text style={styles.formTitle}>Your Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name*"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number*"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => handleInputChange('phone', text)}
        maxLength={10}
      />

      <TextInput
        style={styles.input}
        placeholder="Address*"
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />

      <TextInput
        style={[styles.input, styles.notesInput]}
        multiline
        value={formData.notes}
        onChangeText={(text) => handleInputChange('notes', text)}
      />

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => setCurrentPage('Home')}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  serviceImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  serviceDetails: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  bookButton: {
    backgroundColor: '#27AE60',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#DB2955',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CleaningServiceView;
