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
  Share,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Khalti from './khalti/Khalti';

interface CleaningServiceViewProps {
  setCurrentPage: (page: string) => void;
}

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

const HomeCleaningDetails: React.FC<CleaningServiceViewProps> = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [bookingMode, setBookingMode] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const servicePrice = 2000;

  // Sample reviews data
  const reviews: Review[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
      rating: 5,
      date: '2 days ago',
      comment:
        'Excellent service! The team was very professional and thorough. My house has never been cleaner. Would definitely recommend to anyone looking for quality cleaning services.',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
      rating: 4,
      date: '1 week ago',
      comment:
        'Good service overall. They were a bit late but did a great job once they arrived. The bathroom and kitchen are spotless.',
    },
    {
      id: '3',
      name: 'Anil Thapa',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
      rating: 5,
      date: '2 weeks ago',
      comment:
        'Very satisfied with the cleaning. The team was punctual and efficient. They paid attention to details and used eco-friendly products as promised.',
    },
    {
      id: '4',
      name: 'Sunita Rai',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
      rating: 4,
      date: '3 weeks ago',
      comment:
        'Great service at a reasonable price. The cleaners were friendly and did a thorough job. Will book again.',
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidPhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const validateForm = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }

    if (!isValidPhone(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handlePaymentSuccess = () => {
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

  const handlePaymentError = (error: string) => {
    Alert.alert('Payment Error', error);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this amazing home cleaning service!',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleBookingMode = () => {
    setBookingMode(!bookingMode);
  };

  const toggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  // Render stars based on rating
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setCurrentPage('Home')}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Service image */}
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
            }}
            style={styles.serviceImage}
          />

          {/* Service title section */}
          <View style={styles.serviceTitleContainer}>
            <Text style={styles.serviceTitle}>Home Cleaning Service</Text>

            <View style={styles.actionIcons}>
              <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                <Ionicons name="share-social-outline" size={22} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFavorite} style={styles.iconButton}>
                <Ionicons
                  name={isFavorite ? 'bookmark' : 'bookmark-outline'}
                  size={22}
                  color={isFavorite ? '#D81B60' : '#333'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Provider info */}
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>Clean Home Services</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.8 (98 Reviews)</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.locationText}>Kathmandu, Nepal</Text>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>NPR {servicePrice}</Text>
            <Text style={styles.priceUnit}>(per service)</Text>
          </View>

          {/* About section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About this service</Text>
            </View>
            <Text style={styles.sectionContent}>
              We offer professional home cleaning services using eco-friendly products. Our team of
              experienced cleaners will make your home spotless and fresh.
              <Text style={styles.readMore}> Read More...</Text>
            </Text>
          </View>

          {/* Service details */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Service Details</Text>
            </View>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.detailText}>2-3 hours</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="home-outline" size={20} color="#666" />
                <Text style={styles.detailText}>All rooms</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#666" />
                <Text style={styles.detailText}>Eco-friendly</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={20} color="#666" />
                <Text style={styles.detailText}>Professional team</Text>
              </View>
            </View>
          </View>

          {/* Photos section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Photos & Videos</Text>
              <Text style={styles.seeAll}>See All</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photosScroll}>
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
                }}
                style={styles.photoThumbnail}
              />
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
                }}
                style={styles.photoThumbnail}
              />
              <Image
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGZm4LOxlpZfTWZj6Nqyh5--85yGqxQu-D6w&s',
                }}
                style={styles.photoThumbnail}
              />
            </ScrollView>
          </View>

          {/* Reviews section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <Text style={styles.seeAll} onPress={toggleShowAllReviews}>
                {showAllReviews ? 'Show Less' : 'See All'}
              </Text>
            </View>

            <View style={styles.reviewsSummary}>
              <View style={styles.reviewsRatingContainer}>
                <Text style={styles.reviewsRatingNumber}>4.8</Text>
                <View style={styles.reviewsStarsRow}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Ionicons name="star-half" size={16} color="#FFD700" />
                </View>
                <Text style={styles.reviewsCount}>98 reviews</Text>
              </View>

              <View style={styles.reviewsRatingBars}>
                <View style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>5</Text>
                  <View style={styles.ratingBarContainer}>
                    <View style={[styles.ratingBarFill, { width: '80%' }]} />
                  </View>
                </View>
                <View style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>4</Text>
                  <View style={styles.ratingBarContainer}>
                    <View style={[styles.ratingBarFill, { width: '15%' }]} />
                  </View>
                </View>
                <View style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>3</Text>
                  <View style={styles.ratingBarContainer}>
                    <View style={[styles.ratingBarFill, { width: '5%' }]} />
                  </View>
                </View>
                <View style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>2</Text>
                  <View style={styles.ratingBarContainer}>
                    <View style={[styles.ratingBarFill, { width: '0%' }]} />
                  </View>
                </View>
                <View style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>1</Text>
                  <View style={styles.ratingBarContainer}>
                    <View style={[styles.ratingBarFill, { width: '0%' }]} />
                  </View>
                </View>
              </View>
            </View>

            {/* Individual reviews */}
            {reviews.slice(0, showAllReviews ? reviews.length : 2).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
                  <View style={styles.reviewerInfo}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <View style={styles.reviewRatingRow}>
                      <View style={{ flexDirection: 'row' }}>{renderStars(review.rating)}</View>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}

            {!showAllReviews && reviews.length > 2 && (
              <TouchableOpacity style={styles.showMoreReviewsButton} onPress={toggleShowAllReviews}>
                <Text style={styles.showMoreReviewsText}>Show All Reviews ({reviews.length})</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Booking form (conditionally rendered) */}
          {bookingMode && (
            <View style={styles.bookingForm}>
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
                placeholder="Additional Notes"
                value={formData.notes}
                onChangeText={(text) => handleInputChange('notes', text)}
              />

              <Khalti
                payment={servicePrice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                beforePaymentValidation={validateForm}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom action buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#D81B60" />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bookButton} onPress={toggleBookingMode}>
          <Text style={styles.bookButtonText}>{bookingMode ? 'Cancel' : 'Book Now'}</Text>
        </TouchableOpacity>
      </View>
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
  },
  header: {
    height: 180,
    backgroundColor: '#64B5F6',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  mainContent: {
    flex: 1,
    marginTop: -120,
    paddingBottom: 80, // Space for bottom buttons
  },
  serviceImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginHorizontal: 20,
    borderWidth: 4,
    borderColor: '#fff',
  },
  serviceTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  actionIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
  providerInfo: {
    paddingHorizontal: 20,
    marginTop: 5,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D81B60',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#D81B60',
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  readMore: {
    color: '#D81B60',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  photosScroll: {
    marginTop: 10,
  },
  photoThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  // Reviews section styles
  reviewsSummary: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewsRatingContainer: {
    alignItems: 'center',
    marginRight: 20,
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
    paddingBottom: 20,
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
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
  },
  showMoreReviewsText: {
    color: '#D81B60',
    fontWeight: '500',
  },
  // Bottom actions and booking form
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
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D81B60',
    borderRadius: 8,
  },
  messageButtonText: {
    marginLeft: 8,
    color: '#D81B60',
    fontWeight: '500',
  },
  bookButton: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#D81B60',
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bookingForm: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
});

export default HomeCleaningDetails;
