// ResultModal.js
import React from 'react';
import { Modal, View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ResultModal = ({ results, modalVisible, setModalVisible }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.result}>
                {item.images && item.images.length > 0 && (
                  <Image
                    source={{ uri: item.images[0].url.s }}
                    style={styles.resultImage}
                  />
                )}
                <Text style={styles.resultText}>
                  Nama ilmiah: {item.species && item.species.scientificName}
                </Text>
                <Text style={styles.resultText}>
                  Nama umum:{' '}
                  {item.species && item.species.commonNames.length > 0
                    ? item.species.commonNames.join(', ')
                    : '-'}
                </Text>
                <Text style={styles.resultText}>
                  Skor kepercayaan: {(item.score * 100).toFixed(2)}%
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    color: 'red',
  },
  result: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  resultImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
});

export default ResultModal;
