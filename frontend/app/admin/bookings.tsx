import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Bookings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Manage your bookings here</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default Bookings;
