import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const bookings = [
    {
      id: '1',
      name: 'Susav Aryal',
      service: 'Deep Home Cleaning',
      date: '15-02-2025',
      location: '10km, Kathmandu, Balaju',
      hours: '2 hr',
      time: '10:00 AM - 12:00 PM',
      price: 'Rs. 2500',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      status: 'pending',
    },
    {
      id: '2',
      name: 'Amit Shrestha',
      service: 'Office Cleaning',
      date: '10-03-2025',
      location: '5km, Bhaktapur, Thimi',
      hours: '1 hr',
      time: '11:00 AM - 12:00 PM',
      price: 'Rs. 1800',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      status: 'pending',
    },
    {
      id: '3',
      name: 'Priya Gurung',
      service: 'Carpet Cleaning',
      date: '18-02-2025',
      location: '7km, Lalitpur, Jawalakhel',
      hours: '3 hr',
      time: '2:00 PM - 5:00 PM',
      price: 'Rs. 3500',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      status: 'pending',
    },
    {
      id: '4',
      name: 'Rajesh Hamal',
      service: 'Post-Construction Cleaning',
      date: '22-02-2025',
      location: '12km, Kathmandu, Boudha',
      hours: '4 hr',
      time: '9:00 AM - 1:00 PM',
      price: 'Rs. 4500',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      status: 'pending',
    },
    {
      id: '5',
      name: 'Sunita Khadka',
      service: 'Regular Home Cleaning',
      date: '25-02-2025',
      location: '8km, Kathmandu, Koteshwor',
      hours: '2 hr',
      time: '3:00 PM - 5:00 PM',
      price: 'Rs. 2200',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
      status: 'pending',
    },
  ];

  return (
    <ScrollView style={tw`bg-white flex-1`}>
      <View style={tw`bg-[#27AE60] p-6`}>
        <Text style={tw`text-white text-2xl`}>Hello Malu,</Text>
        <Text style={tw`text-white text-lg mt-1`}>You have {bookings.length} new requests</Text>
      </View>

      {bookings.map((booking) => (
        <View
          key={booking.id}
          style={tw`m-4 bg-white rounded-lg p-4 shadow-lg border border-[#27AE60]`}>
          <View style={tw`flex-row items-center`}>
            <Image source={{ uri: booking.image }} style={tw`w-14 h-14 rounded-full mr-4`} />
            <View style={tw`flex-1`}>
              <Text style={tw`text-lg font-bold text-[#27AE60]`}>{booking.name}</Text>
              <Text style={tw`text-gray-500`}>{booking.date}</Text>
            </View>
            <Text style={tw`text-lg font-bold text-[#27AE60]`}>{booking.price}</Text>
          </View>

          <View style={tw`mt-3`}>
            <Text style={tw`text-lg font-semibold text-gray-800`}>{booking.service}</Text>

            <View style={tw`flex-row items-center mt-2`}>
              <Ionicons name="location-outline" size={18} color="#27AE60" />
              <Text style={tw`text-gray-700 ml-1`}>{booking.location}</Text>
            </View>

            <View style={tw`flex-row items-center mt-1`}>
              <Ionicons name="time-outline" size={18} color="#27AE60" />
              <Text style={tw`text-gray-700 ml-1`}>{booking.time}</Text>
            </View>

            <View style={tw`flex-row items-center mt-1`}>
              <Ionicons name="timer-outline" size={18} color="#27AE60" />
              <Text style={tw`text-gray-700 ml-1`}>{booking.hours} service</Text>
            </View>
          </View>

          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity style={tw`border border-red-500 px-6 py-2 rounded-full flex-1 mr-2`}>
              <Text style={tw`text-red-500 text-center`}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`bg-[#27AE60] px-6 py-2 rounded-full flex-1 ml-2`}>
              <Text style={tw`text-white text-center`}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Home;
