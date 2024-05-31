import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet, Easing, PixelRatio } from "react-native";
import { Marker } from "react-native-maps";
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  size?: number;
  markerColor?: string;
}

const CompassMarker: React.FC<Props> = ({ coordinate, size = 30, markerColor = "#4285F4" }) => {
  const rotationValue = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const compassAnimation = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    compassAnimation.start();

    return () => {
      compassAnimation.stop();
    };
  }, [rotationValue]);

  useEffect(() => {
    const pulseInAnimation = Animated.timing(pulseAnimation, {
      toValue: 1.2,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    const pulseOutAnimation = Animated.timing(pulseAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    const pulseSequence = Animated.sequence([pulseInAnimation, pulseOutAnimation]);

    const pulseLoop = Animated.loop(pulseSequence);
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, [pulseAnimation]);

  const rotateStyle = {
    transform: [{
      rotate: rotationValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      })
    }]
  };

  const pulseStyle = {
    transform: [{ scale: pulseAnimation }],
  };

  const markerContainerStyle = {
    width: size +10,
    height: size +10,
    borderRadius: (size + 1) / 6,
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
  };

  const iconSize = size * PixelRatio.getFontScale() * 0.6;

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={[styles.markerContainer, markerContainerStyle]}>
        <Animated.View style={[styles.compass, rotateStyle, pulseStyle, { width: size, height: size, borderRadius: size / 2, backgroundColor: markerColor }]}>
          <MaterialIcons name="location-pin" size={iconSize} color="#fff" />
        </Animated.View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  compass: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default CompassMarker;
