import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text, Button } from 'react-native-paper';

const UserCleanerSelection = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Neatify
      </Text>
      <Text style={styles.tagline}>We Clean So You Don't Have To</Text>

      <Text variant="titleMedium" style={styles.selectionTitle}>
        Choose Your Role
      </Text>

      <Button
        mode="contained"
        onPress={() => router.push('/(auth)/sign-in')}
        style={styles.button}
        labelStyle={styles.buttonText}>
        As a User
      </Button>

      <Button
        mode="contained"
        onPress={() => router.push('/(auth)/cleaner-sign-in')}
        style={styles.button}
        labelStyle={styles.buttonText}>
        As a Cleaner
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F4F8F7',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  selectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#27AE60',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default UserCleanerSelection;
