import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBooking } from '../services/booking.service';
import { useAuth } from '../context/auth-context';
import { secureStore } from '../helper/secure.storage.helper';
import { ACCESS_TOKEN_KEY } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define route types
export type RootStackParamList = {
  HomeCleaningDetails: undefined;
  Bookings: undefined;
  Khalti: { payment: number };
};

interface BookingOverlayProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
  servicePrice: number;
  serviceId: string;
  duration: number;
}

// Use typed navigation
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const BookingOverlay: React.FC<BookingOverlayProps> = ({
  visible,
  onClose,
  onSubmit,
  servicePrice,
  serviceId,
  duration,
}) => {
  const { authState } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    console.log('BookingOverlay mounted, visible:', visible, 'serviceId:', serviceId);
    console.log('authState:', authState);
    const checkAuth = async () => {
      try {
        const token = await secureStore.getItem(ACCESS_TOKEN_KEY);
        console.log('Token from secureStore:', token);
        console.log('authState.authenticated:', authState.authenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, [authState, visible]);

  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    location: '',
    paymentMethod: 'CASH' as 'CASH' | 'KHALTI',
    duration: duration || 1,
    notes: '',
    areas: [] as string[],
  });

  const [showLocationOptions, setShowLocationOptions] = useState(false);

  const handleSetOnMap = () => {
    Alert.alert('Feature Not Available', 'Unable to set location on map');
    setShowLocationOptions(false);
  };

  const validateInputs = () => {
    if (!bookingData.location.trim()) {
      Alert.alert('Missing Information', 'Please enter your location');
      return false;
    }
    if (!bookingData.date.trim()) {
      Alert.alert('Missing Information', 'Please enter the date');
      return false;
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(bookingData.date)) {
      Alert.alert('Invalid Date', 'Please use YYYY-MM-DD format');
      return false;
    }
    if (!bookingData.time.trim()) {
      Alert.alert('Missing Information', 'Please enter the time');
      return false;
    }
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](?:\s?(AM|PM))?$/i;
    if (!timeRegex.test(bookingData.time)) {
      Alert.alert('Invalid Time', 'Please use HH:MM or HH:MM AM/PM format');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      console.log('handleSubmit called, authState:', authState);
      if (!authState.authenticated) {
        Alert.alert('Authentication Required', 'Please log in to book a service', [
          { text: 'OK', onPress: onClose },
        ]);
        return;
      }

      if (!serviceId) {
        Alert.alert('Error', 'Service ID is missing. Please try again or contact support.');
        console.error('Missing serviceId in booking submission');
        return;
      }

      if (!validateInputs()) {
        return;
      }

      let formattedTime = bookingData.time;
      if (bookingData.time.includes(' ')) {
        const [time, period] = bookingData.time.split(' ');
        let [hours, minutes] = time.split(':');
        hours = hours.padStart(2, '0');
        if (period.toUpperCase() === 'PM' && hours !== '12') {
          hours = String(Number.parseInt(hours) + 12);
        } else if (period.toUpperCase() === 'AM' && hours === '12') {
          hours = '00';
        }
        formattedTime = `${hours}:${minutes}`;
      }

      const bookingPayload = {
        serviceId,
        date: bookingData.date,
        time: formattedTime,
        location: bookingData.location,
        paymentMethod: bookingData.paymentMethod,
        duration: Number.parseInt(String(bookingData.duration)) || 1,
        notes: bookingData.notes,
        areas: bookingData.areas,
      };

      console.log('Submitting booking with payload:', bookingPayload);

      if (bookingData.paymentMethod === 'KHALTI') {
        // Calculate payment amount (servicePrice * duration + service fee)
        const paymentAmount = servicePrice * bookingData.duration + Math.round(servicePrice * 0.05);
        // Navigate to Khalti screen
        navigation.navigate('Khalti', { payment: paymentAmount });
      } else {
        // Handle cash booking
        const response = await createBooking(bookingPayload);
        console.log('Booking response:', response);
        Alert.alert('Success', 'Booking created successfully!');
        onSubmit(response);
        onClose();
        navigation.navigate('Bookings');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', error.message || 'Failed to create booking. Please try again.');
    }
  };

  if (!visible) {
    console.log('BookingOverlay not visible');
    return null;
  }

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Book Cleaning Service</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Date</Text>
              <View style={styles.textInputContainer}>
                <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY-MM-DD"
                  value={bookingData.date}
                  onChangeText={(text) => setBookingData({ ...bookingData, date: text })}
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Time</Text>
              <View style={styles.textInputContainer}>
                <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="HH:MM or HH:MM AM/PM"
                  value={bookingData.time}
                  onChangeText={(text) => setBookingData({ ...bookingData, time: text })}
                />
              </View>
              <Text style={styles.hintText}>Format: HH:MM or HH:MM AM/PM</Text>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Duration (hours)</Text>
              <View style={styles.textInputContainer}>
                <Ionicons name="time-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter duration in hours"
                  keyboardType="numeric"
                  value={bookingData.duration.toString()}
                  onChangeText={(text) => {
                    const num = Number.parseInt(text) || 1;
                    setBookingData({ ...bookingData, duration: num });
                  }}
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Your Location</Text>
              <View style={styles.textInputContainer}>
                <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your address"
                  value={bookingData.location}
                  onChangeText={(text) => {
                    setBookingData({ ...bookingData, location: text });
                    setShowLocationOptions(!!text);
                  }}
                  onFocus={() => setShowLocationOptions(true)}
                  onBlur={() => setTimeout(() => setShowLocationOptions(false), 200)}
                />
              </View>

              {showLocationOptions && (
                <View style={styles.locationOptions}>
                  <TouchableOpacity style={styles.locationOption} onPress={handleSetOnMap}>
                    <Ionicons name="map-outline" size={20} color="#666" />
                    <Text style={styles.locationOptionText}>Set on Map</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.textInputContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Any special instructions?"
                  value={bookingData.notes}
                  onChangeText={(text) => setBookingData({ ...bookingData, notes: text })}
                  multiline
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Areas to Clean</Text>
              <View style={styles.textInputContainer}>
                <Ionicons name="checkbox-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Kitchen, Living Room"
                  value={bookingData.areas.join(', ')}
                  onChangeText={(text) =>
                    setBookingData({ ...bookingData, areas: text.split(',').map((s) => s.trim()) })
                  }
                />
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    bookingData.paymentMethod === 'CASH' && styles.selectedPaymentOption,
                  ]}
                  onPress={() => setBookingData({ ...bookingData, paymentMethod: 'CASH' })}>
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color={bookingData.paymentMethod === 'CASH' ? '#fff' : '#666'}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      bookingData.paymentMethod === 'CASH' && styles.selectedPaymentOptionText,
                    ]}>
                    Cash
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    bookingData.paymentMethod === 'KHALTI' && styles.selectedPaymentOption,
                  ]}
                  onPress={() => setBookingData({ ...bookingData, paymentMethod: 'KHALTI' })}>
                  <Ionicons
                    name="wallet-outline"
                    size={24}
                    color={bookingData.paymentMethod === 'KHALTI' ? '#fff' : '#666'}
                  />
                  <Text
                    style={[
                      styles.paymentOptionText,
                      bookingData.paymentMethod === 'KHALTI' && styles.selectedPaymentOptionText,
                    ]}>
                    Khalti
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Price</Text>
                <Text style={styles.summaryValue}>NPR {servicePrice}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration</Text>
                <Text style={styles.summaryValue}>{bookingData.duration} hour(s)</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>NPR {Math.round(servicePrice * 0.05)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  NPR {servicePrice * bookingData.duration + Math.round(servicePrice * 0.05)}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    width: '100%',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
    maxHeight: '70%',
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  locationOptions: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  locationOptionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    width: '48%',
  },
  selectedPaymentOption: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  paymentOptionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  selectedPaymentOptionText: {
    color: '#fff',
  },
  summarySection: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingOverlay;
