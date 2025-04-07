import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Sidebar = () => {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Dashboard', path: 'Dashboard' },
    { title: 'Stats', path: 'Stats' },
    { title: 'Settings', path: 'Settings' },
  ];

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>Neatify</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.path as never)}>
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    height: '100%',
    width: 250,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  menuItem: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Sidebar;
