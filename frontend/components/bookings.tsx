import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { getUserBookings, updateBookingStatus } from '../services/booking.service';
import { useAuth } from '../context/auth-context';

interface Booking {
  id: string;
  service: { name: string };
  date: string;
  time: string;
  location: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

const Bookings: React.FC = () => {
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState<'Past' | 'Active' | 'Cancelled'>('Active');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBookings();
        setBookings(response);
      } catch (err: any) {
        setError('Failed to load bookings. Please try again.');
        console.error('Error fetching user bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    if (authState.authenticated) {
      fetchBookings();
    }
  }, [authState]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Past') return b.status === 'COMPLETED';
    if (activeTab === 'Active') return ['PENDING', 'CONFIRMED'].includes(b.status);
    if (activeTab === 'Cancelled') return b.status === 'CANCELLED';
    return false;
  });

  const handleCancelPress = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setConfirmModal(true);
  };

  const confirmCancellation = async () => {
    if (bookingToCancel) {
      try {
        await updateBookingStatus(bookingToCancel, 'CANCELLED');
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingToCancel ? { ...booking, status: 'CANCELLED' } : booking
          )
        );
        setConfirmModal(false);
        setBookingToCancel(null);
        Alert.alert('Success', 'Booking cancelled successfully!');
      } catch (error: any) {
        console.error('Error cancelling booking:', error);
        Alert.alert('Error', error.message || 'Failed to cancel booking.');
      }
    }
  };

  const cancelCancellation = () => {
    setConfirmModal(false);
    setBookingToCancel(null);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingName}>{booking.service.name}</Text>
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingText}>Date: {new Date(booking.date).toLocaleDateString()}</Text>
        <Text style={styles.bookingText}>Time: {booking.time}</Text>
        <Text style={styles.bookingText}>Address: {booking.location}</Text>
      </View>
      <Text
        style={[
          styles.bookingStatus,
          booking.status === 'CANCELLED' && styles.cancelledStatus,
          booking.status === 'PENDING' && styles.pendingStatus,
          booking.status === 'CONFIRMED' && styles.confirmedStatus,
        ]}>
        Status: {booking.status}
      </Text>

      {['PENDING', 'CONFIRMED'].includes(booking.status) && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelPress(booking.id)}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Past' && styles.activeTabButton]}
          onPress={() => setActiveTab('Past')}>
          <Text style={[styles.tabText, activeTab === 'Past' && styles.activeTabText]}>Past</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Active' && styles.activeTabButton]}
          onPress={() => setActiveTab('Active')}>
          <Text style={[styles.tabText, activeTab === 'Active' && styles.activeTabText]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Cancelled' && styles.activeTabButton]}
          onPress={() => setActiveTab('Cancelled')}>
          <Text style={[styles.tabText, activeTab === 'Cancelled' && styles.activeTabText]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.bookingList}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings found</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={confirmModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cancel Booking</Text>
            <Text style={styles.modalText}>Are you sure you want to cancel this booking?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={cancelCancellation}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={confirmCancellation}>
                <Text style={[styles.modalButtonText, styles.yesButtonText]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  activeTabButton: {
    backgroundColor: '#2E8B57',
  },
  tabText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '500',
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
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bookingName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E8B57',
  },
  bookingDetails: {
    marginBottom: 8,
  },
  bookingText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  bookingStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E8B57',
    marginBottom: 12,
  },
  pendingStatus: {
    color: '#FFA500',
  },
  confirmedStatus: {
    color: '#1E90FF',
  },
  cancelledStatus: {
    color: '#FF4500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  cancelButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  yesButton: {
    backgroundColor: '#FF4500',
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  yesButtonText: {
    color: 'white',
  },
});

export default Bookings;
