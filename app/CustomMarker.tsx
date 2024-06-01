import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

interface MarkerType {
  id: string;
  coordinate: { latitude: number; longitude: number };
  title: string;
  status: string; // '24h', '16h', 'under construction'
}

const styles = StyleSheet.create({
  markerImage: {
    width: 10, // Set the desired width
    height: 1, // Set the desired height
  },
});

const CustomMarker: React.FC<{ marker: MarkerType; onPress: () => void }> = ({ marker, onPress }) => {
  const getIconByStatus = (status: string): any => {
    switch (status) {
      case '24h':
        return require('../assets/picture/6.png'); // Path to your 24h icon
      case '16h':
        return require('../assets/picture/6.png'); // Path to your 16h icon
      case 'under construction':
        return require('../assets/picture/6.png'); // Path to your under construction icon
      default:
        return require('../assets/picture/6.png'); // Default icon
    }
  };

  return (
    <Marker
      coordinate={marker.coordinate}
      onPress={onPress}
    >
      <Image
        source={getIconByStatus(marker.status)}
        style={styles.markerImage}
        resizeMode="contain"
      />
    </Marker>
  );
};

export default CustomMarker;
