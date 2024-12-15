import React, { useState } from 'react';
import { View, Alert, StyleSheet, Modal, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';

const UploadPlant = ({ navigation }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [modal, setModal] = useState(false);

    // Function to upload the image to Cloudinary
    const handleImageUpload = (photo) => {
        const data = new FormData();
        data.append('file', photo); // Attach the image file
        data.append('upload_preset', 'arboretum_plants'); // Use your preset
        data.append('cloud_name', 'dbubscfxr'); // Replace with your Cloudinary cloud name

        fetch('https://api.cloudinary.com/v1_1/italyqb/image/upload', {
            method: 'POST',
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setPicture(data.secure_url); // Save the URL returned by Cloudinary
                setModal(false);
                Alert.alert('Image uploaded successfully!');
            })
            .catch((err) => {
                Alert.alert('Error uploading the image');
                console.log('Upload Error:', err);
            });
    };

    // Image picker options
    const openImagePicker = (type) => {
        const options = {
            title: 'Select Image',
            storageOptions: { skipBackup: true, path: 'images' },
        };

        if (type === 'gallery') {
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.uri) {
                    const source = {
                        uri: response.uri,
                        type: response.type,
                        name: response.fileName,
                    };
                    handleImageUpload(source);
                }
            });
        } else if (type === 'camera') {
            ImagePicker.launchCamera(options, (response) => {
                if (response.uri) {
                    const source = {
                        uri: response.uri,
                        type: response.type,
                        name: response.fileName,
                    };
                    handleImageUpload(source);
                }
            });
        }
    };

    // Submit plant data to the server
    const submitData = () => {
        fetch('http://10.0.2.2:3000/upload-plant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                species,
                description,
                picture,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                Alert.alert(`${data.name} has been uploaded successfully!`);
                navigation.navigate('Home');
            })
            .catch((err) => {
                Alert.alert('Error while submitting the data');
                console.log('Submit Error:', err);
            });
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <TextInput
                    label="Plant Name"
                    style={styles.input}
                    value={name}
                    mode="outlined"
                    onChangeText={(text) => setName(text)}
                />
                <TextInput
                    label="Species"
                    style={styles.input}
                    value={species}
                    mode="outlined"
                    onChangeText={(text) => setSpecies(text)}
                />
                <TextInput
                    label="Description"
                    style={styles.input}
                    value={description}
                    mode="outlined"
                    multiline
                    numberOfLines={5}
                    onChangeText={(text) => setDescription(text)}
                />
                <Button
                    icon={picture ? 'check-bold' : 'upload'}
                    style={styles.input}
                    mode="contained"
                    onPress={() => setModal(true)}
                >
                    {picture ? 'Image Uploaded' : 'Upload Image'}
                </Button>
                <Button
                    icon="content-save"
                    style={styles.input}
                    mode="contained"
                    onPress={() => submitData()}
                >
                    Save Plant
                </Button>

                <Modal
                    animationType="slide"
                    transparent
                    visible={modal}
                    onRequestClose={() => setModal(false)}
                >
                    <View style={styles.modalView}>
                        <Button
                            icon="camera"
                            mode="contained"
                            style={styles.modalButton}
                            onPress={() => openImagePicker('camera')}
                        >
                            Take Photo
                        </Button>
                        <Button
                            icon="folder-image"
                            mode="contained"
                            style={styles.modalButton}
                            onPress={() => openImagePicker('gallery')}
                        >
                            Choose from Gallery
                        </Button>
                        <Button
                            icon="close"
                            mode="contained"
                            style={styles.modalButton}
                            onPress={() => setModal(false)}
                        >
                            Cancel
                        </Button>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        marginVertical: 10,
    },
    modalView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalButton: {
        marginVertical: 10,
    },
});

export default UploadPlant;
