import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const bookings = [
    {
      id: '1',
      name: 'Susav Aryal',
      date: '15-02-2025',
      location: '10km, kathmandu, balaju',
      hours: '2 hr',
      time: '10:00 AM',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: '2',
      name: 'Amit Shrestha',
      date: '10-03-2025',
      location: '5km, bhaktapur, thimi',
      hours: '1 hr',
      time: '11:00 AM',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
  ];

  return (
    <ScrollView style={tw`bg-white flex-1`}>
      <View style={tw`bg-[#27AE60] p-6`}>
        {/* <Text style={tw`text-white text-4xl text-center mb-4`}>Neatify</Text> */}
        <Text style={tw`text-white text-2xl`}>Hello Malu,</Text>
      </View>

      {bookings.map((booking) => (
        <View
          key={booking.id}
          style={tw`m-4 bg-white rounded-lg p-4 shadow-lg border border-[#27AE60]`}>
          <View style={tw`flex-row items-center`}>
            <Image source={{ uri: booking.image }} style={tw`w-14 h-14 rounded-full mr-4`} />
            <View>
              <Text style={tw`text-lg font-bold text-[#27AE60]`}>{booking.name}</Text>
              <Text style={tw`text-gray-500`}>{booking.date}</Text>
            </View>
          </View>

          <View style={tw`mt-2`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="location-outline" size={18} color="#27AE60" />
              <Text style={tw`text-gray-700 ml-1`}>{booking.location}</Text>
            </View>
            <Text style={tw`text-gray-500 mt-1`}>
              {booking.hours} | {booking.time}
            </Text>
          </View>

          <View style={tw`flex-row justify-between mt-4`}>
            <TouchableOpacity style={tw`border border-red-500 px-4 py-2 rounded-full`}>
              <Text style={tw`text-red-500`}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`bg-[#27AE60] px-4 py-2 rounded-full`}>
              <Text style={tw`text-white`}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Home;
