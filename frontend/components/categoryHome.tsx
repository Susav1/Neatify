import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  services: Service[];
}

interface Props {
  setCurrentPage: (page: string, params?: any) => void;
  category: Category;
  setSelectedServiceId?: (serviceId: string) => void;
}

const CategoryHome: React.FC<Props> = ({ setCurrentPage, category, setSelectedServiceId }) => {
  const services = category?.services || [];

  const handleServicePress = (service: Service, index: number) => {
    // Create a unique service ID if one doesn't exist
    const serviceId = service.id || `${category.id}-service-${index}`;

    console.log('CategoryHome - Service pressed:', {
      serviceName: service.name,
      serviceId: serviceId,
      originalService: service,
    });

    // Set the selected service ID
    if (setSelectedServiceId) {
      setSelectedServiceId(serviceId);
    }

    // Navigate to HomeCleaningDetails
    setCurrentPage('HomeCleaningDetails');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage('Home')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#27AE60" />
        </TouchableOpacity>
        <Text style={styles.title}>{category?.name} Services</Text>
      </View>

      {services.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
          No services found in this category.
        </Text>
      ) : (
        services.map((service: Service, index: number) => {
          const serviceId = service.id || `${category.id}-service-${index}`;

          return (
            <TouchableOpacity
              key={serviceId}
              style={styles.serviceCard}
              onPress={() => handleServicePress(service, index)}>
              <Image
                source={{ uri: service.image || 'https://via.placeholder.com/100' }}
                style={styles.serviceImage}
              />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <View style={styles.serviceFooter}>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>4.5</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: 100,
    height: 100,
  },
  serviceInfo: {
    flex: 1,
    padding: 15,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
});

export default CategoryHome;
