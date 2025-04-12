import { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { Link, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { signUp } from '@/services/auth.service';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  licenseNumber: string;
  phone: string;
};

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'cleaner',
      licenseNumber: '',
      phone: '',
    },
  });

  const router = useRouter();
  const { mutateAsync } = useMutation({
    mutationKey: ['register-cleaner'],
    mutationFn: signUp,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data: RegisterFormData) => {
    mutateAsync(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'cleaner',
        licenseNumber: data.licenseNumber,
        phone: data.phone,
      },
      {
        onSuccess: () => {
          Alert.alert('Registration Successful!');
          router.push('/(auth)/cleaner-sign-in');
        },
        onError: () => {
          Alert.alert('Error while registering, please try later!');
        },
      }
    );
    reset();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text variant="headlineMedium" style={styles.title}>
          Neatify
        </Text>
        <Text style={styles.tagline}>Professional Cleaning Services</Text>

        <Text variant="titleMedium" style={styles.registerTitle}>
          Cleaner Registration
        </Text>

        {/* Name Input */}
        <Controller
          control={control}
          rules={{
            required: 'Name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Full Name"
              value={value}
              mode="outlined"
              style={styles.input}
            />
          )}
          name="name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        {/* Email Input */}
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

        {/* Phone Input */}
        <Controller
          control={control}
          rules={{
            required: 'Phone number is required',
            pattern: {
              value: /^\d{10}$/,
              message: 'Please enter a valid 10-digit phone number',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Phone Number"
              value={value}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
            />
          )}
          name="phone"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

        {/* License Number Input */}
        <Controller
          control={control}
          rules={{
            required: 'License number is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="License Number"
              value={value}
              mode="outlined"
              style={styles.input}
            />
          )}
          name="licenseNumber"
        />
        {errors.licenseNumber && (
          <Text style={styles.errorText}>{errors.licenseNumber.message}</Text>
        )}

        {/* Password Input */}
        <Controller
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
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

        {/* Confirm Password Input */}
        <Controller
          control={control}
          rules={{
            required: 'Confirm Password is required',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Confirm Password"
                value={value}
                secureTextEntry={!showConfirmPassword}
                mode="outlined"
                style={styles.input}
              />
              <IconButton
                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                size={24}
                style={styles.eyeIcon}
              />
            </View>
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.registerButton}
          labelStyle={styles.registerButtonText}>
          Register as Cleaner
        </Button>

        <Text style={styles.orText}>or</Text>

        <Link style={styles.loginLink} href="/(auth)/cleaner-sign-in">
          Login
        </Link>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  registerTitle: {
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
    transform: [{ translateY: -16 }],
    padding: 0,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  registerButton: {
    backgroundColor: '#27AE60',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
    marginTop: 10,
  },
  registerButtonText: {
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
  loginLink: {
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

export default RegisterForm;
