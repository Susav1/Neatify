import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../admin/dashboard';
import Bookings from '../admin/bookings';

const Stack = createNativeStackNavigator();

const AdminTabs = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Bookings" component={Bookings} />
    </Stack.Navigator>
  );
};

export default AdminTabs;
