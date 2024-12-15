import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const UploadImageScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.error) {
        setImageUri(response.assets[0].uri); // Image URI
      }
    });
  };

  const uploadImageToCloudinary = async () => {
    if (!imageUri) return;

    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'uploaded_image.jpg',
    });
    formData.append('upload_preset', '<CLOUDINARY_UPLOAD_PRESET>'); // Replace with your Cloudinary preset
    formData.append('cloud_name', '<CLOUDINARY_CLOUD_NAME>'); // Replace with your Cloudinary cloud name

    try {
      setUploading(true);
      const res = await axios.post('https://api.cloudinary.com/v1_1/<CLOUDINARY_CLOUD_NAME>/image/upload', formData);
      const cloudinaryUrl = res.data.secure_url;

      // Send the URL to your server
      const serverRes = await axios.post('http://<YOUR_SERVER_URL>/api/plants', { imageUrl: cloudinaryUrl });
      setServerResponse(serverRes.data);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Select Image" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginVertical: 10 }} />}
      <Button title="Upload Image" onPress={uploadImageToCloudinary} disabled={uploading} />
      {uploading && <Text>Uploading...</Text>}
      {serverResponse && <Text>Server Response: {JSON.stringify(serverResponse)}</Text>}
    </View>
  );
};

export default UploadImageScreen;
