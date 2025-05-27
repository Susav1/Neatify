import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="user-cleaner-selection" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      {/* <Stack.Screen name="document-verification" options={{ headerShown: false }} /> */}
    </Stack>
  );
};

export default AuthLayout;
