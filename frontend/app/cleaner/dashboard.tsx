import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import tw from 'twrnc';

interface Booking {
  _id: string;
  customerName: string;
  date: string;
  time: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [earnings, setEarnings] = useState<number>(0);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/cleaner/dashboard', {
          headers: { Authorization: `Bearer YOUR_JWT_TOKEN` },
        });
        setEarnings(response.data.earnings);
        setBookings(response.data.bookings);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ScrollView style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-2xl font-bold mb-4`}>Cleaner Dashboard</Text>
      <View style={tw`bg-blue-500 p-4 rounded-xl mb-4`}>
        <Text style={tw`text-white text-lg`}>Total Earnings: ${earnings}</Text>
      </View>
      <Text style={tw`text-xl font-bold mb-2`}>Upcoming Bookings</Text>
      {bookings.map((booking) => (
        <View key={booking._id} style={tw`bg-gray-100 p-4 mb-2 rounded-xl`}>
          <Text style={tw`text-lg`}>Customer: {booking.customerName}</Text>
          <Text>Date: {booking.date}</Text>
          <Text>Time: {booking.time}</Text>
          <Text>Status: {booking.status}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default Dashboard;
