import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';

const ThumbnailCard = ({ imageSrc, title, children }) => {
    return (
        <View style={styles.thumbnailCard}>
            <Image source={imageSrc} style={styles.thumbnailCardImage} />
            <Text style={styles.thumbnailCardTitle}>{title}</Text>
            <View style={styles.thumbnailCardContent}>
                {children}
            </View>
        </View>
    );
};

ThumbnailCard.propTypes = {
    imageSrc: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node
};

const styles = StyleSheet.create({
    thumbnailCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    thumbnailCardImage: {
        width: '100%',
        height: 200
    },
    thumbnailCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10
    },
    thumbnailCardContent: {
        padding: 10
    }
});

module.exports = ThumbnailCard;