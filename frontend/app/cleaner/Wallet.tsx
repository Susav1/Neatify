import React from 'react';
import { View, Text } from 'react-native';

const Wallet = () => {
  const walletBalance = 250.75;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
      }}>
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Wallet</Text>
        <Text style={{ marginTop: 10, fontSize: 20, color: 'green' }}>
          ${walletBalance.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default Wallet;
