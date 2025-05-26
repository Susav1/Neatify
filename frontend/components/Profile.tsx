import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/auth-context';
import { updateProfile, uploadProfilePicture, getProfile } from '@/services/profile.service';
import * as ImagePicker from 'react-native-image-picker';
import { API_URL } from '@/constants';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ProfileFormData {
  name: string;
  phone: string;
}

const ProfileScreen = () => {
  const { authState, updateUser } = useAuth();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: authState.user?.name || '',
      phone: authState.user?.phone || '',
    },
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(
    authState.user?.profilePicture || null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getProfile();
        updateUser(userData);
        reset({ name: userData.name, phone: userData.phone });
        setProfilePicture(userData.profilePicture);
      } catch (error) {
        console.error('[ProfileScreen] Error fetching profile:', error);
        Alert.alert('Error', 'Failed to fetch profile data');
      }
    };
    fetchProfile();
  }, []);

  const { mutateAsync: updateProfileMutation } = useMutation({
    mutationKey: ['update-profile'],
    mutationFn: updateProfile,
  });

  const { mutateAsync: uploadPictureMutation } = useMutation({
    mutationKey: ['upload-profile-picture'],
    mutationFn: uploadProfilePicture,
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const updatedUser = await updateProfileMutation(data);
      updateUser(updatedUser.user);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      console.error('[ProfileScreen] Update profile error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    if (Platform.OS === 'web') {
      // Handle web file input
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/jpg,image/png';
      input.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('profilePicture', file);
            console.log('[ProfileScreen] Web FormData:', formData, 'File:', file);

            const updatedUser = await uploadPictureMutation(formData);
            updateUser(updatedUser.user);
            setProfilePicture(updatedUser.user.profilePicture);
            Alert.alert('Success', 'Profile picture uploaded successfully');
          } catch (error: any) {
            console.error('[ProfileScreen] Web upload error:', error);
            Alert.alert(
              'Error',
              error.response?.data?.message || 'Failed to upload profile picture'
            );
          } finally {
            setIsLoading(false);
          }
        }
      };
      input.click();
    } else {
      // Handle mobile/emulator with react-native-image-picker
      const options: ImagePicker.ImageLibraryOptions = {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.7,
      };

      ImagePicker.launchImageLibrary(options, async (response) => {
        if (response.didCancel) {
          console.log('[ProfileScreen] Image picker cancelled');
        } else if (response.errorCode) {
          console.error('[ProfileScreen] Image picker error:', response.errorMessage);
          Alert.alert('Error', 'Failed to pick image');
        } else if (response.assets && response.assets[0].uri) {
          try {
            setIsLoading(true);
            const formData = new FormData();
            const asset = response.assets[0];
            formData.append('profilePicture', {
              uri: asset.uri,
              name: asset.fileName || 'profile.jpg',
              type: asset.type || 'image/jpeg',
            } as any);
            console.log('[ProfileScreen] Mobile FormData:', {
              uri: asset.uri,
              name: asset.fileName,
              type: asset.type,
            });

            const updatedUser = await uploadPictureMutation(formData);
            updateUser(updatedUser.user);
            setProfilePicture(updatedUser.user.profilePicture);
            Alert.alert('Success', 'Profile picture uploaded successfully');
          } catch (error: any) {
            console.error('[ProfileScreen] Mobile upload error:', error);
            Alert.alert(
              'Error',
              error.response?.data?.message || 'Failed to upload profile picture'
            );
          } finally {
            setIsLoading(false);
          }
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage} disabled={isLoading}>
          {profilePicture ? (
            <Image
              source={{
                uri: profilePicture.startsWith('http')
                  ? profilePicture
                  : `${API_URL}${profilePicture}`,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Icon name="person" size={40} color="#888" />
            </View>
          )}
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>

        <Controller
          control={control}
          rules={{
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
            />
          )}
          name="name"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <TextInput
          label="Email"
          value={authState.user?.email || ''}
          disabled
          mode="outlined"
          style={styles.input}
        />

        <Controller
          control={control}
          rules={{
            pattern: {
              value: /^\d{10}$/,
              message: 'Please enter a valid 10-digit phone number',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Phone"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="phone-pad"
              mode="outlined"
              style={styles.input}
              error={!!errors.phone}
            />
          )}
          name="phone"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
          labelStyle={styles.saveButtonText}
          loading={isLoading}
          disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F7',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#27AE60',
    fontSize: 16,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  input: {
    width: '100%',
    marginVertical: 8,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#27AE60',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    width: '70%',
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileScreen;
