import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Overview of your application</Text>
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

export default Dashboard;
