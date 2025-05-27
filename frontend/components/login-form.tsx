import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { Link, router } from 'expo-router';
import type { LoginFormData, ErrorResponse } from '../types/form';
import { useAuth } from '@/context/auth-context';

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { onLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log('[login-form] Submitting login with data:', data);
      const response = await onLogin(data);
      console.log('[login-form] Login response:', response);
      if ('error' in response && response.error) {
        console.error('[login-form] Login failed:', response.msg);
      } else {
        reset();
      }
    } catch (error) {
      console.error('[login-form] Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => router.back()}
        style={styles.backButton}
      />

      <Text variant="headlineMedium" style={styles.title}>
        Neatify
      </Text>
      <Text style={styles.tagline}>Book a Clean, Live Serene!</Text>

      <Text variant="titleMedium" style={styles.loginTitle}>
        Login
      </Text>

      <Controller
        control={control}
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email address',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Email"
            value={value}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            style={styles.input}
            error={!!errors.email}
          />
        )}
        name="email"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: 'Password is required',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.passwordContainer}>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Password"
              value={value}
              secureTextEntry={!showPassword}
              mode="outlined"
              style={styles.input}
              error={!!errors.password}
            />
            <IconButton
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
              size={24}
              style={styles.eyeIcon}
            />
          </View>
        )}
        name="password"
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Link style={styles.forgotPassword} href="/(auth)/forgot-password">
        Forgot Password?
      </Link>

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        style={styles.loginButton}
        labelStyle={styles.loginButtonText}
        loading={isLoading}
        disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>

      <Text style={styles.orText}>or</Text>

      <Link style={styles.registerLink} href="/(auth)/sign-up">
        Signup
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F4F8F7',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    top: '32%',
    right: 15,
    transform: [{ translateY: -12 }],
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#27AE60',
    marginTop: 5,
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#27AE60',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  orText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    color: '#808080',
  },
  registerLink: {
    backgroundColor: '#2ECC71',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 12,
    marginTop: 10,
  },
});

export default LoginForm;
