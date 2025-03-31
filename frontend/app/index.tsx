import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';

const Home = () => {
  const { authState } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // If the user is not authenticated, redirect them to the welcome page
    if (!authState.authenticated) {
      router.push('/(auth)/welcome');
    } else {
      router.push('/(tabs)/lists');
    }
  }, [authState.authenticated, isMounted, router]);

  return null;
};

export default Home;
