import React from "react";
import { Marker } from "react-native-maps";
import { Svg, Circle } from "react-native-svg";

interface CustomMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  onPress: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ coordinate, title, onPress }) => {
  return (
    <Marker coordinate={coordinate} title={title} onPress={onPress}>
      <Svg height="40" width="40">
        <Circle cx="20" cy="20" r="10" fill="red" />
      </Svg>
    </Marker>
  );
};

export default CustomMarker;
