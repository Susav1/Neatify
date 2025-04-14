import { Stack } from 'expo-router';

const TabLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="/service" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabLayout;
