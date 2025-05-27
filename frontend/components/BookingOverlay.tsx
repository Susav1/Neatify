'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBooking } from '../services/booking.service';
import { useAuth } from '../context/auth-context';
import { secureStore } from '../helper/secure.storage.helper';
import { ACCESS_TOKEN_KEY } from '../constants';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapOverlay, setShowMapOverlay] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef<HTMLIFrameElement>(null);

  // Kathmandu bounds for service area
  const KATHMANDU_BOUNDS = {
    minLon: 85.2,
    minLat: 27.6,
    maxLon: 85.5,
    maxLat: 27.8,
  };

  const kathmanduCenter = {
    lat: 27.7172,
    lng: 85.324,
  };

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

  // Setup message listener for map iframe communication
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.source === mapRef.current?.contentWindow) {
        if (event.data.type === 'mapReady') {
          setIsMapReady(true);
        } else if (event.data.type === 'locationSelected') {
          const { lat, lng, address } = event.data;
          console.log('Location selected:', { lat, lng, address });

          // Update the location in booking data
          setBookingData((prev) => ({
            ...prev,
            location: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          }));

          // Close map overlay
          setShowMapOverlay(false);
          setIsMapReady(false);
        }
      }
    };

    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, []);

  const createMapHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Select Location</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
        <style>
          body, html, #map {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          .selected-marker {
            background-color: #27AE60;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            width: 20px;
            height: 20px;
          }
          .map-instructions {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.95);
            padding: 12px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          .confirm-button {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: #27AE60;
            color: white;
            border: none;
            padding: 15px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            display: none;
          }
          .confirm-button:hover {
            background: #229954;
          }
          .confirm-button:disabled {
            background: #95a5a6;
            cursor: not-allowed;
          }
          .loading-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            z-index: 1001;
            display: none;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="map-instructions">
          <strong>Tap on the map to select your location</strong><br>
          <small>Make sure the location is within Kathmandu service area</small>
        </div>
        <button id="confirmButton" class="confirm-button" onclick="confirmLocation()">
          Confirm Location
        </button>
        <div id="loadingOverlay" class="loading-overlay">
          <div>Getting address...</div>
        </div>
        
        <script>
          // Initialize map
          const map = L.map('map').setView([${kathmanduCenter.lat}, ${kathmanduCenter.lng}], 13);
          
          // Add tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Service area bounds
          const bounds = {
            minLon: ${KATHMANDU_BOUNDS.minLon},
            minLat: ${KATHMANDU_BOUNDS.minLat},
            maxLon: ${KATHMANDU_BOUNDS.maxLon},
            maxLat: ${KATHMANDU_BOUNDS.maxLat}
          };
          
          // Add service area rectangle
          const serviceArea = L.rectangle([
            [bounds.minLat, bounds.minLon],
            [bounds.maxLat, bounds.maxLon]
          ], {
            color: '#27AE60',
            weight: 2,
            fillOpacity: 0.1,
            dashArray: '5, 5'
          }).addTo(map);
          
          let selectedMarker = null;
          let selectedLocation = null;
          
          // Custom marker icon
          const selectedIcon = L.divIcon({
            className: 'selected-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          // Map click handler
          map.on('click', function(e) {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            // Check if location is within service area
            const isInServiceArea = lat >= bounds.minLat && lat <= bounds.maxLat && 
                                   lng >= bounds.minLon && lng <= bounds.maxLon;
            
            if (!isInServiceArea) {
              alert('Please select a location within the Kathmandu service area (highlighted region)');
              return;
            }
            
            // Remove existing marker
            if (selectedMarker) {
              map.removeLayer(selectedMarker);
            }
            
            // Add new marker
            selectedMarker = L.marker([lat, lng], {icon: selectedIcon}).addTo(map);
            selectedLocation = {lat, lng};
            
            // Show confirm button
            document.getElementById('confirmButton').style.display = 'block';
            
            // Update instructions
            document.querySelector('.map-instructions').innerHTML = 
              '<strong>Location selected!</strong><br><small>Tap "Confirm Location" to use this address</small>';
          });
          
          // Confirm location function
          async function confirmLocation() {
            if (!selectedLocation) return;
            
            const confirmBtn = document.getElementById('confirmButton');
            const loadingOverlay = document.getElementById('loadingOverlay');
            
            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Getting address...';
            loadingOverlay.style.display = 'block';
            
            try {
              // Reverse geocoding to get address
              const response = await fetch(
                \`https://nominatim.openstreetmap.org/reverse?lat=\${selectedLocation.lat}&lon=\${selectedLocation.lng}&format=json&addressdetails=1\`
              );
              
              if (response.ok) {
                const data = await response.json();
                const address = data.display_name || \`\${selectedLocation.lat.toFixed(6)}, \${selectedLocation.lng.toFixed(6)}\`;
                
                // Send location back to React component
                window.parent.postMessage({
                  type: 'locationSelected',
                  lat: selectedLocation.lat,
                  lng: selectedLocation.lng,
                  address: address
                }, '*');
              } else {
                throw new Error('Failed to get address');
              }
            } catch (error) {
              console.error('Error getting address:', error);
              // Send coordinates as fallback
              window.parent.postMessage({
                type: 'locationSelected',
                lat: selectedLocation.lat,
                lng: selectedLocation.lng,
                address: \`\${selectedLocation.lat.toFixed(6)}, \${selectedLocation.lng.toFixed(6)}\`
              }, '*');
            } finally {
              loadingOverlay.style.display = 'none';
            }
          }
          
          // Let parent know we're ready
          if (window.parent) {
            window.parent.postMessage({ type: 'mapReady' }, '*');
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleSetOnMap = () => {
    setShowLocationOptions(false);
    setShowMapOverlay(true);
    setIsMapReady(false);
  };

  const closeMapOverlay = () => {
    setShowMapOverlay(false);
    setIsMapReady(false);
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
    if (isSubmitting) return; // Prevent multiple submissions
    setIsSubmitting(true);

    try {
      console.log('handleSubmit called, authState:', authState);
      if (!authState.authenticated) {
        Alert.alert('Authentication Required', 'Please log in to book a service', [
          { text: 'OK', onPress: onClose },
        ]);
        setIsSubmitting(false);
        return;
      }

      if (!serviceId) {
        Alert.alert('Error', 'Service ID is missing. Please try again or contact support.');
        console.error('Missing serviceId in booking submission');
        setIsSubmitting(false);
        return;
      }

      if (!validateInputs()) {
        setIsSubmitting(false);
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
        const paymentAmount = servicePrice * bookingData.duration + Math.round(servicePrice * 0.05);
        navigation.navigate('Khalti', { payment: paymentAmount });
        setIsSubmitting(false);
      } else {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) {
    console.log('BookingOverlay not visible');
    return null;
  }

  return (
    <>
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
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
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
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
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
                      <Ionicons name="map-outline" size={20} color="#27AE60" />
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
                  <Ionicons
                    name="checkbox-outline"
                    size={20}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Kitchen, Living Room"
                    value={bookingData.areas.join(', ')}
                    onChangeText={(text) =>
                      setBookingData({
                        ...bookingData,
                        areas: text.split(',').map((s) => s.trim()),
                      })
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
              <TouchableOpacity
                style={[styles.confirmButton, isSubmitting && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={isSubmitting}>
                <Text style={styles.confirmButtonText}>
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Map Overlay Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showMapOverlay}
        onRequestClose={closeMapOverlay}>
        <View style={styles.mapOverlayContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={closeMapOverlay} style={styles.mapCloseButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Select Your Location</Text>
            <View style={styles.mapHeaderSpacer} />
          </View>

          <View style={styles.mapContainer}>
            <iframe
              ref={mapRef}
              srcDoc={createMapHtml()}
              style={styles.mapIframe}
              title="Location Selection Map"
              frameBorder="0"
            />
            {!isMapReady && (
              <View style={styles.mapLoadingOverlay}>
                <ActivityIndicator size="large" color="#27AE60" />
                <Text style={styles.mapLoadingText}>Loading map...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
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
    fontWeight: '500',
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
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Map overlay styles
  mapOverlayContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  mapCloseButton: {
    padding: 5,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mapHeaderSpacer: {
    width: 34, // Same width as close button for centering
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapIframe: {
    width: '100%',
    height: '100%',
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  mapLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#27AE60',
    fontWeight: '500',
  },
});

export default BookingOverlay;
