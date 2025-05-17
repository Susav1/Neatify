import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { getCleanerBookings, updateCleanerBookingStatus } from '../../services/booking.service';
import { useAuth } from '../../context/auth-context';

interface Booking {
  id: string;
  user: { name: string; email: string; phone: string };
  service: { name: string; price: number };
  date: string;
  time: string;
  location: string;
  duration: number;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string;
  areas: string[];
}

const Home: React.FC = () => {
  const { authState } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCleanerBookings({ status: 'PENDING' });
      setBookings(response);
    } catch (err: any) {
      setError('Failed to load bookings. Please try again.');
      console.error('Error fetching cleaner bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.authenticated) {
      fetchBookings();
    }
  }, [authState]);

  const handleBookingAction = async (bookingId: string, status: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await updateCleanerBookingStatus(bookingId, status);
      // Refresh bookings after status update
      await fetchBookings();
      Alert.alert('Success', `Booking ${status.toLowerCase()} successfully!`);
    } catch (error: any) {
      console.error('Error updating booking status:', error);
      Alert.alert('Error', error.message || 'Failed to update booking status.');
    }
  };

  if (!authState.authenticated) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-red-500 text-lg`}>Please log in to view bookings</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#27AE60" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-red-500 text-lg`}>{error}</Text>
        <TouchableOpacity
          style={tw`mt-4 bg-[#27AE60] px-6 py-2 rounded-full`}
          onPress={fetchBookings}>
          <Text style={tw`text-white font-semibold`}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={tw`bg-white flex-1`}>
      {/* Header */}
      <View style={tw`bg-[#27AE60] p-6 rounded-b-3xl`}>
        <Text style={tw`text-white text-2xl font-bold`}>Hello, Cleaner</Text>
        <Text style={tw`text-white text-lg mt-1`}>
          You have {bookings.length} new booking requests
        </Text>
      </View>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <View style={tw`flex-1 justify-center items-center mt-10`}>
          <Text style={tw`text-gray-500 text-lg`}>No pending bookings</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <View
            key={booking.id}
            style={tw`m-4 bg-white rounded-lg p-4 shadow-lg border border-[#27AE60]`}>
            {/* Booking Header */}
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center`}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  style={tw`w-14 h-14 rounded-full mr-4`}
                />
                <View>
                  <Text style={tw`text-lg font-bold text-[#27AE60]`}>{booking.user.name}</Text>
                  <Text style={tw`text-gray-500`}>
                    {new Date(booking.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={tw`text-lg font-bold text-[#27AE60]`}>NPR {booking.price}</Text>
            </View>

            {/* Booking Details */}
            <View style={tw`mt-3`}>
              <Text style={tw`text-lg font-semibold text-gray-800`}>{booking.service.name}</Text>
              <View style={tw`flex-row items-center mt-2`}>
                <Ionicons name="location-outline" size={18} color="#27AE60" />
                <Text style={tw`text-gray-700 ml-1`}>{booking.location}</Text>
              </View>
              <View style={tw`flex-row items-center mt-1`}>
                <Ionicons name="time-outline" size={18} color="#27AE60" />
                <Text style={tw`text-gray-700 ml-1`}>{booking.time}</Text>
              </View>
              <View style={tw`flex-row items-center mt-1`}>
                <Ionicons name="timer-outline" size={18} color="#27AE60" />
                <Text style={tw`text-gray-700 ml-1`}>{booking.duration} hr service</Text>
              </View>
              {booking.notes && (
                <View style={tw`mt-1`}>
                  <Text style={tw`text-gray-700`}>Notes: {booking.notes}</Text>
                </View>
              )}
              {booking.areas.length > 0 && (
                <View style={tw`mt-1`}>
                  <Text style={tw`text-gray-700`}>Areas: {booking.areas.join(', ')}</Text>
                </View>
              )}
              <View style={tw`flex-row items-center mt-1`}>
                <Ionicons name="mail-outline" size={18} color="#27AE60" />
                <Text style={tw`text-gray-700 ml-1`}>{booking.user.email}</Text>
              </View>
              <View style={tw`flex-row items-center mt-1`}>
                <Ionicons name="call-outline" size={18} color="#27AE60" />
                <Text style={tw`text-gray-700 ml-1`}>{booking.user.phone}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={tw`flex-row justify-between mt-4`}>
              <TouchableOpacity
                style={tw`border border-red-500 px-6 py-2 rounded-full flex-1 mr-2`}
                onPress={() => handleBookingAction(booking.id, 'CANCELLED')}>
                <Text style={tw`text-red-500 text-center font-semibold`}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-[#27AE60] px-6 py-2 rounded-full flex-1 ml-2`}
                onPress={() => handleBookingAction(booking.id, 'CONFIRMED')}>
                <Text style={tw`text-white text-center font-semibold`}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default Home;
