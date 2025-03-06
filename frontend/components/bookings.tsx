import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState<'Past' | 'Active' | 'Cancelled'>('Active');

  // Mock cleaning service bookings
  const bookings = {
    Past: [
      { id: '1', serviceType: 'Home Deep Cleaning', date: '2024-02-10', status: 'Completed' },
      { id: '2', serviceType: 'Office Cleaning', date: '2024-01-25', status: 'Completed' },
    ],
    Active: [
      { id: '3', serviceType: 'Carpet Cleaning', date: '2024-03-05', status: 'Upcoming' },
      { id: '4', serviceType: 'Sofa Cleaning', date: '2024-03-12', status: 'Upcoming' },
    ],
    Cancelled: [
      { id: '5', serviceType: 'Move-in Cleaning', date: '2024-02-01', status: 'Cancelled' },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TabButton title="Past" active={activeTab === 'Past'} onPress={() => setActiveTab('Past')} />
        <TabButton title="Active" active={activeTab === 'Active'} onPress={() => setActiveTab('Active')} />
        <TabButton title="Cancelled" active={activeTab === 'Cancelled'} onPress={() => setActiveTab('Cancelled')} />
      </View>

      {/* Booking List */}
      <ScrollView style={styles.bookingList}>
        {bookings[activeTab].map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </ScrollView>
    </View>
  );
};

// Tab Button Component
const TabButton = ({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.activeTabButton]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, active && styles.activeTabText]}>{title}</Text>
  </TouchableOpacity>
);

// Booking Card Component
const BookingCard = ({ booking }: { booking: { id: string; serviceType: string; date: string; status: string } }) => (
  <View style={styles.bookingCard}>
    <Text style={styles.bookingName}>{booking.serviceType}</Text>
    <Text style={styles.bookingDate}>Date: {booking.date}</Text>
    <Text style={[styles.bookingStatus, booking.status === 'Cancelled' && styles.cancelledStatus]}>
      Status: {booking.status}
    </Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7', padding: 16 },
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
    color: '#4CAF50', // Green for active/completed
  },
  cancelledStatus: {
    color: '#F44336', // Red for cancelled
  },
});

export default Bookings;
