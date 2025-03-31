import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} /> {/* Your Welcome Page */}
      <Stack.Screen name="user-cleaner-selection" options={{ headerShown: false }} />{' '}
      {/* User/Cleaner Selection Page */}
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
