import React, { useState } from 'react';
import { View, Box, Fab, FabIcon, AddIcon, FabLabel } from '@/components/ui';
import { FlatList } from 'react-native-gesture-handler';


const CollectionScreen = ({ navigation }) => {
    const [collectionName, setCollectionName] = useState('');

    const handleAddCollection = () => {
        // Add your collection logic here
        console.log('Collection added:', collectionName);
        setCollectionName('');
    };

    return (
        <View style={{ padding: 20 }}>

            <Box
                className='h-full w-full bg-background-50 rounded-md'
            >

                <FlatList>
                    {/* Add your collection list here */}
                </FlatList>
                <Fab size="md" placement="bottom right" isHovered={false} isDisabled={false} onPress={() => navigation.navigate('CreateArboretum')}>
                    <FabIcon as={AddIcon} />
                    <FabLabel>Tambah koleksi</FabLabel>
                </Fab>

            </Box>


        </View>
    );
};

export default CollectionScreen;