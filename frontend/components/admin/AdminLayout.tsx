import React from 'react';
import { View, StyleSheet } from 'react-native';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.layout}>{children}</View>;
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default AdminLayout;
