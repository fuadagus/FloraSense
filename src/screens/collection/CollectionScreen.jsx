import React, { useState, useEffect } from 'react';
import { View, Box, Fab, FabIcon, AddIcon, FabLabel, Text } from '@/components/ui';
import { FlatList } from 'react-native-gesture-handler';


// const CollectionScreen = ({ navigation }) => {
//     const [collectionName, setCollectionName] = useState('');

//     const handleAddCollection = () => {
//         // Add your collection logic here
//         console.log('Collection added:', collectionName);
//         setCollectionName('');
//     };

//     return (
//         <View style={{ padding: 20 }}>

//             <Box
//                 className='h-full w-full bg-background-50 rounded-md'
//             >

//                 <FlatList>
//                     {/* Add your collection list here */}
//                 </FlatList>
//                 <Fab size="md" placement="bottom right" isHovered={false} isDisabled={false} onPress={() => navigation.navigate('CreateArboretum')}>
//                     <FabIcon as={AddIcon} />
//                     <FabLabel>Tambah koleksi</FabLabel>
//                 </Fab>

//             </Box>


//         </View>
//     );
// };

// export default CollectionScreen;
// import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CollectionScreen = ({ navigation }) => {
    const [collectionName, setCollectionName] = useState('');
    const [arboretums, setArboretums] = useState([]);

    useEffect(() => {
        axios.get('http://192.168.15.241:4000/api/arboretums')
            .then(response => {
                setArboretums(response.data);
            })
            .catch(error => {
                console.error('Error fetching arboretums:', error);
            });
    }, []);

    const handleAddCollection = () => {
        // Add your collection logic here
        console.log('Collection added:', collectionName);
        setCollectionName('');
    };

    return (
        <View style={{ padding: 20 }}>
            <Box className='h-full w-full bg-background-50 rounded-md'>
                <FlatList
                    data={arboretums}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ fontSize: 18 }}>{item.name}</Text>
                            <Text style={{ color: '#666' }}>{item.location}</Text>
                            <Text>{item.description}</Text>
                        </View>
                    )}
                />
                <Fab size="md" placement="bottom right" isHovered={false} isDisabled={false} onPress={() => navigation.navigate('CreateArboretum')}>
                    <FabIcon as={AddIcon} />
                    <FabLabel>Tambah koleksi</FabLabel>
                </Fab>
            </Box>
        </View>
    );
};

export default CollectionScreen;