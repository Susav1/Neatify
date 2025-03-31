import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, bgColor }) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    flex: 1,
    margin: 8,
  },
  title: {
    color: 'white',
    fontSize: 12,
  },
  value: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default StatsCard;
