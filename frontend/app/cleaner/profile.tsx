// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useAuth } from '@/context/auth-context';
// import { useGetProfile, useUpdateProfile } from '@/services/profile.service';
// import tw from 'twrnc';

// const CleanerProfileScreen: React.FC = () => {
//   const { authState, updateUser } = useAuth();
//   const { data: profile, isLoading } = useGetProfile(true);
//   const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile(true);
//   const [name, setName] = useState(authState.user?.name || '');
//   const [phone, setPhone] = useState(authState.user?.phone || '');
//   const [profilePic, setProfilePic] = useState<string | undefined>(authState.user?.profilePicture);

//   useEffect(() => {
//     if (profile) {
//       setName(profile.fullName);
//       setPhone(profile.phone || '');
//       setProfilePic(profile.profilePic);
//     }
//   }, [profile]);

//   const pickImage = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Please allow access to your photo library.');
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 1,
//     });

//     if (!result.canceled && result.assets[0].uri) {
//       setProfilePic(result.assets[0].uri);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const updatedData = await updateProfile({ fullName: name, phone, profilePic });
//       updateUser({
//         name: updatedData.name,
//         phone: updatedData.phone,
//         profilePicture: updatedData.profilePicture,
//       });
//       Alert.alert('Success', 'Profile updated successfully!');
//     } catch (error: any) {
//       Alert.alert('Error', error.message || 'Failed to update profile.');
//     }
//   };

//   return (
//     <View style={tw`flex-1 bg-white p-4`}>
//       <Text style={tw`text-2xl font-bold text-gray-800 mb-6`}>Cleaner Profile</Text>

//       <View style={tw`items-center mb-6`}>
//         <TouchableOpacity onPress={pickImage} style={tw`relative`}>
//           {profilePic ? (
//             <Image source={{ uri: profilePic }} style={tw`w-24 h-24 rounded-full`} />
//           ) : (
//             <View style={tw`w-24 h-24 rounded-full bg-gray-200 justify-center items-center`}>
//               <Icon name="person" size={40} color="#888" />
//             </View>
//           )}
//           <View style={tw`absolute bottom-0 right-0 bg-blue-500 rounded-full p-1`}>
//             <Icon name="edit" size={16} color="#fff" />
//           </View>
//         </TouchableOpacity>
//         <Text style={tw`mt-2 text-gray-600`}>Tap to change profile picture</Text>
//       </View>

//       <View style={tw`mb-4`}>
//         <Text style={tw`text-gray-700 mb-2`}>Name</Text>
//         <TextInput
//           style={tw`border border-gray-300 rounded-lg p-2`}
//           value={name}
//           onChangeText={setName}
//           placeholder="Enter your name"
//         />
//       </View>

//       <View style={tw`mb-4`}>
//         <Text style={tw`text-gray-700 mb-2`}>Email</Text>
//         <TextInput
//           style={tw`border border-gray-300 rounded-lg p-2 bg-gray-100`}
//           value={authState.user?.email}
//           editable={false}
//         />
//       </View>

//       <View style={tw`mb-4`}>
//         <Text style={tw`text-gray-700 mb-2`}>Phone</Text>
//         <TextInput
//           style={tw`border border-gray-300 rounded-lg p-2`}
//           value={phone}
//           onChangeText={setPhone}
//           placeholder="Enter your phone number"
//           keyboardType="phone-pad"
//         />
//       </View>

//       <TouchableOpacity
//         style={tw`bg-blue-500 rounded-lg p-3 items-center ${isUpdating ? 'opacity-50' : ''}`}
//         onPress={handleSave}
//         disabled={isUpdating}>
//         <Text style={tw`text-white font-semibold`}>
//           {isUpdating ? 'Saving...' : 'Save Changes'}
//         </Text>
//       </TouchableOpacity>

//       {isLoading && <Text style={tw`text-center mt-4`}>Loading profile...</Text>}
//     </View>
//   );
// };

// export default CleanerProfileScreen;
