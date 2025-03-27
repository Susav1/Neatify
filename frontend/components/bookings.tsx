import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import api from '@/services/api';

type Booking = {
  id: string;
  serviceType: string;
  date: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
};

// Define BookingCard as a separate component
const BookingCard = ({ booking }: { booking: Booking }) => (
  <View style={styles.bookingCard}>
    <Text style={styles.bookingName}>{booking.serviceType}</Text>
    <Text style={styles.bookingDate}>Date: {booking.date}</Text>
    <Text style={[
      styles.bookingStatus, 
      booking.status === 'CANCELLED' && styles.cancelledStatus
    ]}>
      Status: {booking.status}
    </Text>
  </View>
);

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<'Past' | 'Active' | 'Cancelled'>('Active');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        const formattedBookings = response.data.map((b: any) => ({
          id: b.id,
          serviceType: b.service?.name || 'Unknown Service',
          date: new Date(b.date).toLocaleDateString(),
          status: b.status,
        }));
        setBookings(formattedBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Past') return b.status === 'COMPLETED';
    if (activeTab === 'Active') return b.status === 'PENDING';
    if (activeTab === 'Cancelled') return b.status === 'CANCELLED';
    return false;
  });

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Past' && styles.activeTabButton]}
          onPress={() => setActiveTab('Past')}
        >
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Active' && styles.activeTabButton]}
          onPress={() => setActiveTab('Active')}
        >
          <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Cancelled' && styles.activeTabButton]}
          onPress={() => setActiveTab('Cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'Cancelled' && styles.activeTabText]}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      {/* Booking List */}
      <ScrollView style={styles.bookingList}>
        {filteredBookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </ScrollView>
    </View>
  );
};

// Complete StyleSheet
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F7F7F7', 
    padding: 16 
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: '#27AE60',
  },
  tabText: {
    color: 'gray',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bookingList: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bookingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 14,
    color: '#4CAF50',
  },
  cancelledStatus: {
    color: '#F44336',
  },
});

export default Bookings;