// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   bgColor: string;
// }

// const StatsCard: React.FC<StatsCardProps> = ({ title, value, bgColor }) => {
//   return (
//     <View style={[styles.card, { backgroundColor: bgColor }]}>
//       <Text style={styles.title}>{title}</Text>
//       <Text style={styles.value}>{value}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     padding: 16,
//     borderRadius: 16,
//     flex: 1,
//     margin: 8,
//   },
//   title: {
//     color: 'white',
//     fontSize: 12,
//   },
//   value: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

// export default StatsCard;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default StatsCard;
