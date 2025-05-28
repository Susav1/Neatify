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
import { getCleanerBookings, updateCleanerBookingStatus } from '../../services/booking.service';
import { useAuth } from '../../context/auth-context';

export interface Booking {
  id: string;
  service: { name: string; id: string; price: number };
  user: { name: string; email: string; phone: string };
  date: string;
  time: string;
  location: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

const History: React.FC = () => {
  const { authState } = useAuth();
  const [activeTab, setActiveTab] = useState<'Past' | 'Active' | 'Cancelled'>('Active');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirmModal, setConfirmModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToUpdate, setBookingToUpdate] = useState<{
    id: string;
    status: 'COMPLETED' | 'CANCELLED';
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCleanerBookings = async () => {
      try {
        setLoading(true);
        const response = await getCleanerBookings({});
        setBookings(response);
      } catch (err: any) {
        setError('Failed to load bookings. Please try again.');
        console.error('Error fetching cleaner bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    if (authState.authenticated && authState.user?.role === 'Cleaner') {
      fetchCleanerBookings();
    }
  }, [authState]);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'Past') return b.status === 'COMPLETED';
    if (activeTab === 'Active') return ['PENDING', 'CONFIRMED'].includes(b.status);
    if (activeTab === 'Cancelled') return b.status === 'CANCELLED';
    return false;
  });

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsModal(true);
  };

  const handleStatusUpdate = (bookingId: string, status: 'COMPLETED' | 'CANCELLED') => {
    setBookingToUpdate({ id: bookingId, status });
    setConfirmModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (bookingToUpdate) {
      try {
        await updateCleanerBookingStatus(bookingToUpdate.id, bookingToUpdate.status);
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingToUpdate.id
              ? { ...booking, status: bookingToUpdate.status }
              : booking
          )
        );
        setConfirmModal(false);
        setBookingToUpdate(null);
        Alert.alert(
          'Success',
          `Booking marked as ${bookingToUpdate.status.toLowerCase()} successfully!`
        );
      } catch (error: any) {
        console.error('Error updating booking status:', error);
        Alert.alert(
          'Error',
          error.message || `Failed to mark booking as ${bookingToUpdate.status.toLowerCase()}.`
        );
      }
    }
  };

  const cancelStatusUpdate = () => {
    setConfirmModal(false);
    setBookingToUpdate(null);
  };

  const closeDetailsModal = () => {
    setDetailsModal(false);
    setSelectedBooking(null);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <TouchableOpacity
      onPress={() => handleBookingPress(booking)}
      style={styles.bookingCard}
      activeOpacity={0.8}>
      <View style={styles.bookingContent}>
        <Text style={styles.bookingName}>{booking.service.name}</Text>
        <View style={styles.bookingDetails}>
          <Text style={styles.bookingText}>
            Date: {new Date(booking.date).toLocaleDateString()}
          </Text>
          <Text style={styles.bookingText}>Time: {booking.time}</Text>
          <Text style={styles.bookingText}>Address: {booking.location}</Text>
          <Text style={styles.bookingText}>Customer: {booking.user.name}</Text>
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
          <View style={styles.actionButtons}>
            {booking.status === 'PENDING' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(booking.id, 'CONFIRMED');
                }}>
                <Text style={styles.actionButtonText}>Confirm</Text>
              </TouchableOpacity>
            )}
            {booking.status === 'CONFIRMED' && (
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleStatusUpdate(booking.id, 'COMPLETED');
                }}>
                <Text style={styles.actionButtonText}>Task Completed</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={(e) => {
                e.stopPropagation();
                handleStatusUpdate(booking.id, 'CANCELLED');
              }}>
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
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

      {/* Booking Details Modal */}
      <Modal visible={detailsModal} transparent={true} animationType="slide">
        <View style={styles.detailsModalOverlay}>
          <View style={styles.detailsModalContainer}>
            <View style={styles.detailsModalHeader}>
              <Text style={styles.detailsModalTitle}>Booking Details</Text>
              <TouchableOpacity onPress={closeDetailsModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedBooking && (
              <ScrollView style={styles.detailsContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Service:</Text>
                  <Text style={styles.value}>{selectedBooking.service.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Date:</Text>
                  <Text style={styles.value}>
                    {new Date(selectedBooking.date).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.value}>{selectedBooking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>{selectedBooking.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Customer:</Text>
                  <Text style={styles.value}>{selectedBooking.user.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Customer Phone:</Text>
                  <Text style={styles.value}>{selectedBooking.user.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Status:</Text>
                  <Text
                    style={[
                      styles.value,
                      selectedBooking.status === 'CANCELLED' && styles.cancelledStatus,
                      selectedBooking.status === 'PENDING' && styles.pendingStatus,
                      selectedBooking.status === 'CONFIRMED' && styles.confirmedStatus,
                    ]}>
                    {selectedBooking.status}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Amount:</Text>
                  <Text style={styles.value}>Rs. {selectedBooking.service.price}</Text>
                </View>

                {['PENDING', 'CONFIRMED'].includes(selectedBooking.status) && (
                  <View style={styles.actionButtonsContainer}>
                    {selectedBooking.status === 'PENDING' && (
                      <TouchableOpacity
                        style={[styles.modalActionButton, styles.confirmButton]}
                        onPress={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}>
                        <Text style={styles.modalActionButtonText}>Confirm Booking</Text>
                      </TouchableOpacity>
                    )}
                    {selectedBooking.status === 'CONFIRMED' && (
                      <TouchableOpacity
                        style={[styles.modalActionButton, styles.completeButton]}
                        onPress={() => handleStatusUpdate(selectedBooking.id, 'COMPLETED')}>
                        <Text style={styles.modalActionButtonText}>Task Completed</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.modalActionButton, styles.cancelButton]}
                      onPress={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}>
                      <Text style={styles.modalActionButtonText}>Cancel Booking</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Status Update Confirmation Modal */}
      <Modal visible={confirmModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {bookingToUpdate?.status === 'COMPLETED' ? 'Complete Task' : 'Cancel Booking'}
            </Text>
            <Text style={styles.modalText}>
              Are you sure you want to mark this booking as {bookingToUpdate?.status.toLowerCase()}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.noButton]}
                onPress={cancelStatusUpdate}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.yesButton]}
                onPress={confirmStatusUpdate}>
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
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  bookingContent: {
    padding: 16,
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
    fontWeight: '600',
  },
  confirmedStatus: {
    color: '#1E90FF',
    fontWeight: '600',
  },
  cancelledStatus: {
    color: '#FF4500',
    fontWeight: '600',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  confirmButton: {
    backgroundColor: '#1E90FF',
  },
  completeButton: {
    backgroundColor: '#2E8B57',
  },
  cancelButton: {
    backgroundColor: '#FF4500',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 20,
  },
  detailsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailsModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  detailsContent: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  actionButtonsContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 10,
  },
  modalActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalActionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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

export default History;
