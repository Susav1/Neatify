import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { Link } from 'expo-router';
import axios from 'axios';

type ForgotPasswordFormData = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    try {
      const response = await axios.post('http://localhost:5000/forgot-pass', { email: data.email });
      setGeneratedCode(response.data.verificationCode);
      setStep('verify');
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
  };

  const onVerifyCode = () => {
    if (verificationCode === generatedCode) {
      setStep('reset');
    } else {
      console.error('Invalid verification code');
    }
  };

  const onChangePassword = async (data: ForgotPasswordFormData) => {
    if (data.newPassword === data.confirmPassword) {
      try {
        await axios.post('http://localhost:5000/reset-pass', {
          email: watch('email'),
          newPassword: data.newPassword,
        });
        reset();
        setStep('email');
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    } else {
      console.error('Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Neatify</Text>
      <Text style={styles.tagline}>Book a Clean, Live Serene!</Text>

      {step === 'email' && (
        <>
          <Text variant="titleMedium" style={styles.header}>Forgot Password</Text>
          <Text style={styles.subtitle}>Enter your email to reset your password.</Text>

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
              />
            )}
            name="email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

          <Button mode="contained" onPress={handleSubmit(onSubmitEmail)} style={styles.button}>
            Send Verification Code
          </Button>
        </>
      )}

      {step === 'verify' && (
        <>
          <Text variant="titleMedium" style={styles.header}>Verify Code</Text>
          <Text style={styles.subtitle}>Enter the code sent to your email.</Text>

          <TextInput
            placeholder="Enter Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />

          <Button mode="contained" onPress={onVerifyCode} style={styles.button}>
            Verify Code
          </Button>
        </>
      )}

      {step === 'reset' && (
        <>
          <Text variant="titleMedium" style={styles.header}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter a new password below.</Text>

          <Controller
            control={control}
            rules={{ required: 'New password is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="New Password"
                  value={value}
                  secureTextEntry={!showPassword}
                  mode="outlined"
                  style={styles.input}
                />
                <IconButton
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  size={24}
                  style={styles.eyeIcon}
                />
              </View>
            )}
            name="newPassword"
          />
          {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}

          <Controller
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: (value) => value === watch('newPassword') || 'Passwords do not match',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Confirm Password"
                  value={value}
                  secureTextEntry={!showPassword}
                  mode="outlined"
                  style={styles.input}
                />
                <IconButton
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  size={24}
                  style={styles.eyeIcon}
                />
              </View>
            )}
            name="confirmPassword"
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

          <Button mode="contained" onPress={handleSubmit(onChangePassword)} style={styles.button}>
            Change Password
          </Button>
        </>
      )}

      <Link style={styles.backToLogin} href="/(auth)/sign-in">
        Back to Login
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
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
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
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#27AE60',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
  },
  backToLogin: {
    textAlign: 'center',
    color: '#27AE60',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default ForgotPassword;
