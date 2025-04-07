import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import StatsCard from '@/components/admin/StatsCard';

// Define mock data for StatsCard
const statsData = [
  { title: 'Total Users', value: 200 },
  { title: 'Active Users', value: 150 },
];

const AdminDashboard = () => {
  return (
    <ScrollView style={{ padding: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Admin Dashboard</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* Pass title and value as props to StatsCard */}
        {statsData.map((data, index) => (
          <StatsCard key={index} title={data.title} value={data.value} />
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18 }}>More Stats</Text>
        <Text style={{ color: 'gray' }}>I am </Text>
      </View>
    </ScrollView>
  );
};

export default AdminDashboard;
