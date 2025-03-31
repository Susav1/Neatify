import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Sidebar = () => {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.item}>Home</Text>
      <Text style={styles.item}>Bookings</Text>
      <Text style={styles.item}>Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    padding: 20,
    backgroundColor: '#e0e0e0',
  },
  item: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default Sidebar;
