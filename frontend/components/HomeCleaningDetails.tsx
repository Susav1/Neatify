'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Share,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getServiceById } from '../services/service.service';
import { createBooking } from '../services/booking.service';
import { useAuth } from '../context/auth-context';
import BookingOverlay from './BookingOverlay'; // Adjust path as needed

interface CleaningServiceViewProps {
  setCurrentPage: (page: string) => void;
  serviceId: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  category: { name: string };
  reviews: Review[];
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  user: { name: string };
  createdAt: string;
}

interface BookingData {
  date: string;
  time: string;
  location: string;
  paymentMethod: 'CASH' | 'KHALTI';
  duration: number;
}

const HomeCleaningDetails: React.FC<CleaningServiceViewProps> = ({ setCurrentPage, serviceId }) => {
  const { authState } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showBookingOverlay, setShowBookingOverlay] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const serviceData = await getServiceById(serviceId);
        setService(serviceData);
      } catch (err) {
        setError('Failed to load service details. Please try again.');
        console.error('Error fetching service:', err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${service?.name} on Neatify!`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality
  };

  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleBookNow = () => {
    console.log('Book Now clicked, authState:', authState);
    if (!authState.authenticated) {
      Alert.alert('Authentication Required', 'Please log in to book a service.', [
        { text: 'OK', onPress: () => setCurrentPage('Login') },
      ]);
      return;
    }
    setShowBookingOverlay(true);
    console.log('BookingOverlay should be visible, showBookingOverlay:', true);
  };

  const handleBookingSubmit = async (bookingData: BookingData) => {
    try {
      if (!service) {
        throw new Error('Service details not available');
      }
      const payload = {
        serviceId: service.id,
        date: bookingData.date,
        time: bookingData.time,
        location: bookingData.location,
        paymentMethod: bookingData.paymentMethod,
        duration: bookingData.duration,
      };
      console.log('Submitting booking payload:', payload);
      const response = await createBooking(payload);
      Alert.alert('Success', 'Booking created successfully!');
      setShowBookingOverlay(false);
      console.log('Booking response:', response);
    } catch (error: any) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', error.message || 'Failed to create booking. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color={i <= rating ? '#FFD700' : '#ccc'}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const calculateAverageRating = (): string => {
    if (!service?.reviews || service.reviews.length === 0) return '0.0';
    const total = service.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / service.reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#27AE60" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Service not found.'}</Text>
          <TouchableOpacity onPress={() => setCurrentPage('Home')}>
            <Text style={styles.backLink}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentPage('Home')}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleShare} style={styles.headerActionBtn}>
              <Ionicons name="share-social-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFavorite} style={styles.headerActionBtn}>
              <Ionicons
                name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isFavorite ? '#fff' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Service image */}
          <Image
            source={{
              uri: service.image || 'https://shorturl.at/PEb19',
            }}
            style={styles.serviceImage}
          />

          {/* Service title section */}
          <View style={styles.serviceTitleContainer}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>
                {calculateAverageRating()} ({service.reviews.length} Reviews)
              </Text>
            </View>
          </View>

          {/* Provider info */}
          <View style={styles.providerInfo}>
            <View style={styles.providerBadge}>
              <MaterialIcons name="verified" size={16} color="#27AE60" />
              <Text style={styles.providerName}>Neatify Services</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.locationText}>Kathmandu, Nepal</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>NPR {service.price}</Text>
            <Text style={styles.priceUnit}>(per service)</Text>
          </View>

          {/* About section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About this service</Text>
            <Text style={styles.sectionContent}>{service.description}</Text>
          </View>

          {/* Service details */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="time-outline" size={18} color="#27AE60" />
                </View>
                <Text style={styles.detailText}>{service.duration} hours</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="home-outline" size={18} color="#27AE60" />
                </View>
                <Text style={styles.detailText}>{service.category.name}</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#27AE60" />
                </View>
                <Text style={styles.detailText}>Eco-friendly</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons name="people-outline" size={18} color="#27AE60" />
                </View>
                <Text style={styles.detailText}>Professional team</Text>
              </View>
            </View>
          </View>

          {/* Photos section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Photos & Videos</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosScroll}>
              {[1, 2, 3].map((item) => (
                <Image
                  key={item}
                  source={{
                    uri: service.image || 'https://shorturl.at/zpU6H',
                  }}
                  style={styles.photoThumbnail}
                />
              ))}
            </ScrollView>
          </View>

          {/* Reviews section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity onPress={toggleShowAllReviews}>
                <Text style={styles.seeAll}>{showAllReviews ? 'Show Less' : 'See All'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.reviewsSummary}>
              <View style={styles.reviewsRatingContainer}>
                <Text style={styles.reviewsRatingNumber}>{calculateAverageRating()}</Text>
                <View style={styles.reviewsStarsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons
                      key={i}
                      name={
                        i <= Math.floor(parseFloat(calculateAverageRating()))
                          ? 'star'
                          : 'star-outline'
                      }
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
                <Text style={styles.reviewsCount}>{service.reviews.length} reviews</Text>
              </View>

              <View style={styles.reviewsRatingBars}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = service.reviews.filter((r) => r.rating === rating).length;
                  const percentage =
                    service.reviews.length > 0 ? (count / service.reviews.length) * 100 : 0;
                  return (
                    <View key={rating} style={styles.ratingBarRow}>
                      <Text style={styles.ratingBarLabel}>{rating}</Text>
                      <View style={styles.ratingBarContainer}>
                        <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {service.reviews.slice(0, showAllReviews ? service.reviews.length : 2).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: 'https://shorturl.at/PEb19' }}
                    style={styles.reviewerAvatar}
                  />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.user.name}</Text>
                    <View style={styles.reviewRatingRow}>
                      <View style={{ flexDirection: 'row' }}>{renderStars(review.rating)}</View>
                      <Text style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment || 'No comment provided.'}</Text>
              </View>
            ))}

            {!showAllReviews && service.reviews.length > 2 && (
              <TouchableOpacity style={styles.showMoreReviewsButton} onPress={toggleShowAllReviews}>
                <Text style={styles.showMoreReviewsText}>
                  Show All Reviews ({service.reviews.length})
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom action buttons */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.messageButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#27AE60" />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Text style={styles.bookButtonText}>Book Now</Text>
            <Text style={styles.bookButtonPrice}>NPR {service.price}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BookingOverlay
        visible={showBookingOverlay}
        onClose={() => {
          console.log('Closing BookingOverlay');
          setShowBookingOverlay(false);
        }}
        onSubmit={handleBookingSubmit}
        servicePrice={service.price}
        serviceId={service.id}
        duration={service.duration}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  header: {
    height: 200,
    backgroundColor: '#27AE60',
    position: 'relative',
    paddingTop: 40,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    marginTop: -80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  serviceImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    marginTop: -70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  serviceTitleContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  providerInfo: {
    paddingHorizontal: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#27AE60',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 5,
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '500',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 15,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  photosScroll: {
    marginTop: 10,
  },
  photoThumbnail: {
    width: 140,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  reviewsSummary: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewsRatingContainer: {
    alignItems: 'center',
    marginRight: 25,
    width: 80,
  },
  reviewsRatingNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewsStarsRow: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  reviewsCount: {
    fontSize: 12,
    color: '#666',
  },
  reviewsRatingBars: {
    flex: 1,
    justifyContent: 'center',
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  ratingBarLabel: {
    width: 15,
    fontSize: 12,
    color: '#666',
    marginRight: 5,
  },
  ratingBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
  },
  ratingBarFill: {
    height: 6,
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  reviewRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  showMoreReviewsButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27AE60',
    borderRadius: 8,
    marginTop: 10,
  },
  showMoreReviewsText: {
    color: '#27AE60',
    fontWeight: '500',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#27AE60',
    borderRadius: 8,
  },
  messageButtonText: {
    marginLeft: 8,
    color: '#27AE60',
    fontWeight: '500',
  },
  bookButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#27AE60',
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookButtonPrice: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  backLink: {
    fontSize: 16,
    color: '#27AE60',
    fontWeight: '500',
  },
});

export default HomeCleaningDetails;
