import { Stack } from 'expo-router';

const TabLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="lists" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TabLayout;
