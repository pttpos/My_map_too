import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Button,
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";


import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import CurrentLocationMarker from "./CurrentLocationMarker";
import Footer from "./Footer";
import Block, { IconName } from "./Block";
import GoogleButton from "./GoogleButton";
import BlockImage from './BlockImage'; // Import the BlockImage component
import LayoutMapToggle from './LayoutMapToggle';

interface UserLocation {
  latitude: number;
  longitude: number;
}

const App = () => {
  const [markers, setMarkers] = useState<
    Array<{
      id: number;
      coordinate: { latitude: number; longitude: number };
      title: string;
      description: string[];
      product: string[];
      other_product: string[];
      service: string[];
      province: string;
      address: string;
      status: string;
      promotion: string[];
      picture?: string;
    }>
  >([]);
  const [region, setRegion] = useState<Region>({
    latitude: 11.570444444444444, // Default latitude
    longitude: 104.90508333333334, // Default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number>(0);
  const mapRef = useRef<MapView>(null);
  const pointerPosition = useRef(new Animated.Value(0)).current;
  const [mapType, setMapType] = React.useState<'standard' | 'satellite'>('standard');
  const [showFilterForm, setShowFilterForm] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState<any[]>([]);

  useEffect(() => {
    fetchMarkers();
  }, []);

  const fetchMarkers = async () => {
    try {
      const response = await fetch(
        "http://180.178.127.119:8282/API/data/markers.json"
      );
      const data = await response.json();

      // Construct full image URLs
      const markersWithImageUrls = data.map((marker: { picture: any }) => ({
        ...marker,
        picture: `http://180.178.127.119:8282/API/picture/${marker.picture}`,
      }));

      setMarkers(markersWithImageUrls);
      setFilteredMarkers(markersWithImageUrls); // Assuming you want to initially show all markers
    } catch (error) { }
  };
  // Filter options
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [descriptionOptions, setDescriptionOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [titleOptions, setTitleOptions] = useState<string[]>([]);

  // Selected filter values
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  // Function to update title options based on selected province
  const updateTitleOptions = (selectedProvince: string) => {
    const filteredTitles = markers
      .filter((marker) => marker.province === selectedProvince)
      .flatMap((marker) => marker.title);
    const uniqueTitles = Array.from(new Set(filteredTitles));
    setTitleOptions(uniqueTitles);
  };
  useEffect(() => {
    if (selectedProvince) {
      updateTitleOptions(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch(
          "http://180.178.127.119:8282/API/data/markers.json"
        );
        const data = await response.json();

        // Process the data to include the full image URL
        const markersWithImageUrls = data.STATION.map(
          (station: {
            id: any;
            latitude: any;
            longitude: any;
            title: any;
            description: any;
            product: any;
            other_product: any;
            service: any;
            province: any;
            address: any;
            status: any;
            promotion: any;
            picture: any;
          }) => ({
            id: station.id,
            coordinate: {
              latitude: parseFloat(station.latitude), // Ensure latitude is a number
              longitude: parseFloat(station.longitude), // Ensure longitude is a number
            },
            title: station.title,
            description: station.description,
            product: station.product,
            other_product: station.other_product,
            service: station.service,
            province: station.province,
            address: station.address,
            status: station.status,
            promotion: station.promotion,
            picture: `http://180.178.127.119:8282/API/pictures/${station.picture}`, // Full image URL
          })
        );

        // Set the markers state with processed data
        setMarkers(markersWithImageUrls);

        // Extract unique values for filter options
        const allProducts = markersWithImageUrls.flatMap(
          (station: { product: any }) => station.product
        );
        const allDescriptions = markersWithImageUrls.flatMap(
          (station: { description: any }) => station.description
        );
        const allServices = markersWithImageUrls.flatMap(
          (station: { service: any }) => station.service
        );
        const allProvinces = markersWithImageUrls.map(
          (station: { province: any }) => station.province
        );
        const allTitles = markersWithImageUrls.map(
          (station: { title: any }) => station.title
        );

        setProvinceOptions(Array.from(new Set(allProvinces)));
        setProductOptions(Array.from(new Set(allProducts)));
        setDescriptionOptions(Array.from(new Set(allDescriptions)));
        setServiceOptions(Array.from(new Set(allServices)));
        setTitleOptions(Array.from(new Set(allTitles)));
      } catch (error) {
        console.error("Error fetching marker data:", error);
      }
    };

    fetchMarkers();
  }, []);

  useEffect(() => {
    const startWatchingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getLastKnownPositionAsync({}); // Try to get last known position
      if (!location) {
        // If last known position not available, get current position
        location = await Location.getCurrentPositionAsync({});
      }

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(newRegion, 500); // Move and zoom to current location
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update location every 5 seconds
          distanceInterval: 0, // Update location regardless of distance
        },
        handleUserLocationChange
      );
    };

    startWatchingLocation();
  }, []);

  const handleUserLocationChange = (location: {
    coords: { latitude: any; longitude: any };
  }) => {
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    // Animate pointer
    Animated.timing(pointerPosition, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const handleMarkerPress = (marker: any) => {
    setRegion({
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setSelectedMarker(marker);
    setModalVisible(true); // Show the modal when marker is pressed
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  // Function to handle title selection
  const handleTitleSelection = (title: string) => {
    // Find the marker associated with the selected title
    const markerWithTitle = markers.find((marker) => marker.title === title);
    if (markerWithTitle) {
      // Get the province of the marker
      const provinceOfTitle = markerWithTitle.province;
      // Find the marker with the same province as the selected title
      const markerInProvince = markers.find(
        (marker) => marker.province === provinceOfTitle
      );
      if (markerInProvince) {
        // Move and zoom the map to the province of the selected title
        mapRef.current?.animateToRegion(
          {
            latitude: markerInProvince.coordinate.latitude,
            longitude: markerInProvince.coordinate.longitude,
            latitudeDelta: 0.02, // Adjust as needed
            longitudeDelta: 0.02, // Adjust as needed
          },
          500
        ); // Adjust the duration as needed (500 milliseconds in this example)
      }
    }
  };

  const applyFilters = () => {
    let filtered = markers;

    if (selectedProduct) {
      filtered = filtered.filter((marker) =>
        marker.product.includes(selectedProduct)
      );
    }

    if (selectedDescription) {
      filtered = filtered.filter((marker) =>
        marker.description.includes(selectedDescription)
      );
    }

    if (selectedService) {
      filtered = filtered.filter((marker) =>
        marker.service.includes(selectedService)
      );
    }

    if (selectedProvince) {
      filtered = filtered.filter(
        (marker) => marker.province === selectedProvince
      );
    }

    if (selectedTitle) {
      // Find the selected marker by title
      const selectedMarker = markers.find(
        (marker) => marker.title === selectedTitle
      );
      if (selectedMarker) {
        // Zoom in on the selected marker
        const region = {
          latitude: selectedMarker.coordinate.latitude,
          longitude: selectedMarker.coordinate.longitude,
          latitudeDelta: 0.0, // Adjust as needed
          longitudeDelta: 0.01, // Adjust as needed
        };
        mapRef.current?.animateToRegion(region, 500);
        setRegion(region); // Update the region state to encompass the selected marker
      }
    } else {
      // Calculate the bounding region to encompass all markers
      if (filtered.length > 0) {
        const coordinates = filtered.map((marker) => marker.coordinate);
        const minLatitude = Math.min(
          ...coordinates.map((coord) => coord.latitude)
        );
        const maxLatitude = Math.max(
          ...coordinates.map((coord) => coord.latitude)
        );
        const minLongitude = Math.min(
          ...coordinates.map((coord) => coord.longitude)
        );
        const maxLongitude = Math.max(
          ...coordinates.map((coord) => coord.longitude)
        );

        const region = {
          latitude: (minLatitude + maxLatitude) / 2,
          longitude: (minLongitude + maxLongitude) / 2,
          latitudeDelta: maxLatitude - minLatitude + 1.1,
          longitudeDelta: maxLongitude - minLongitude + 1.1,
        };

        mapRef.current?.animateToRegion(region, 500);
        setRegion(region); // Update the region state to encompass all markers
      }
    }

    setFilteredMarkers(filtered);
    setShowFilterForm(false);
  };

  useEffect(() => {
    // Zoom in to marker's location when a title is selected
    if (selectedTitle && selectedMarker) {
      const { latitude, longitude } = selectedMarker.coordinate;
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.02, // Adjust as needed
          longitudeDelta: 0.02, // Adjust as needed
        },
        500
      );
    }
  }, [selectedTitle]);

  useEffect(() => {
    if (selectedProvince) {
      const filteredTitles = markers
        .filter((marker) => marker.province === selectedProvince)
        .map((marker) => marker.title);
      setTitleOptions(Array.from(new Set(filteredTitles)));
    } else {
      setTitleOptions([]);
    }
  }, [selectedProvince]);
  const markerImage = require("../assets/picture/6.png"); // Use your custom marker image here
  // Define an object to map product values to image URLs

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        mapType={mapType}
        showsUserLocation={false}
      >
        {filteredMarkers.length > 0
          ? filteredMarkers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => handleMarkerPress(marker)}
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0, y: -20 }}
            >
              <View style={styles.markerWrapper}>
                <Image source={markerImage} style={styles.markerImage} />
              </View>
            </Marker>
          ))
          : markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => handleMarkerPress(marker)}
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0, y: -20 }}
            >
              <View style={styles.markerWrapper}>
                <Image source={markerImage} style={styles.markerImage} />
              </View>
            </Marker>
          ))}

        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            centerOffset={{ x: 0, y: -1 }}
          >
            <CurrentLocationMarker coordinate={userLocation} />
          </Marker>
        )}
      </MapView>
      {/* Toggle button for map type */}
      <LayoutMapToggle mapType={mapType} setMapType={setMapType} />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          {selectedMarker && (
            <View>
              <View style={styles.header}>
                <View style={styles.logoAndButtonsContainer}>
                  <GoogleButton
                    onPress={() =>
                      openGoogleMaps(
                        selectedMarker.coordinate.latitude,
                        selectedMarker.coordinate.longitude
                      )
                    }
                  />
                </View>
                <View style={styles.logoAndCloseContainer}>
                  <Image
                    source={require("../assets/picture/logo_Station.png")} // Replace with your logo path
                    style={[styles.headerImage, { marginRight: "28%" }]} // Adjust margin percentage as needed
                  />
                  <TouchableOpacity
                    style={[styles.closeButton, { marginLeft: "28%" }]} // Adjust margin percentage as needed
                    onPress={handleCloseModal}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                {selectedMarker.picture && (
                  <Image
                    source={{ uri: selectedMarker.picture }}
                    style={styles.customImageStyle}
                  />
                )}
                <Text style={styles.modalTitle}>{selectedMarker.title}</Text>
              </View>

              <View style={styles.blocksContainer}>
                <ScrollView horizontal={true}>
                  {[
                    { text: "Product", icon: "water-outline" },
                    { text: "Other Product", icon: "wallet-outline" },
                    { text: "Service", icon: "restaurant-outline" },
                    { text: "Promotion", icon: "megaphone-outline" },
                    { text: "Address", icon: "location-outline" },
                  ].map((block, index) => (
                    <Block
                      key={index}
                      icon={block.icon as IconName} // Ensure the icon is cast to IconName
                      text={block.text}
                      isSelected={selectedBlock === index}
                      onPress={() => setSelectedBlock(index)}
                    />
                  ))}
                </ScrollView>
              </View>

              <BlockImage selectedBlock={selectedBlock} selectedMarker={selectedMarker} />

            </View>
          )}
        </View>
      </Modal>

      {/* Footer */}
      <Footer
        setShowFilterForm={setShowFilterForm}
        mapRef={mapRef}
        userLocation={userLocation}
      />
      {/* Filter Form */}
      {showFilterForm && (
        <View style={styles.filterContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Province:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Province", value: null }}
              value={selectedProvince}
              onValueChange={(value) => setSelectedProvince(value)}
              items={provinceOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Title:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Title", value: null }}
              value={selectedTitle}
              onValueChange={(value) => {
                setSelectedTitle(value);
                handleTitleSelection(value);
              }}
              items={titleOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Product:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Product", value: null }}
              value={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
              items={productOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Description:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Description", value: null }}
              value={selectedDescription}
              onValueChange={(value) => setSelectedDescription(value)}
              items={descriptionOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Service:</Text>
            <RNPickerSelect
              placeholder={{ label: "Select Service", value: null }}
              value={selectedService}
              onValueChange={(value) => setSelectedService(value)}
              items={serviceOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              style={pickerSelectStyles}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
            <Text style={styles.filterButtonText}>Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterCloseButton}
            onPress={() => setShowFilterForm(false)}
          >
            <Text style={styles.filterButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

function openGoogleMaps(lat: number, lon: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  Linking.openURL(url);
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    padding: 8,
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    padding: 8,
  },
});
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  customImageStyle: {
    width: width * 0.9, // Adjust width to 80% of screen width
    height: height * 0.18, // Adjust height to 30% of screen height
    borderRadius: 0.05 * Math.min(width, height), // Adjust borderRadius relative to the smaller of width and height
    position: "relative",
  },
  imageContainer: {
    position: "relative",
  },
  logoAndButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  logoAndCloseContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  markerWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 45,
  },
  markerImage: {
    width: 40,
    height: 45,
    resizeMode: "contain",
  },
  mapButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 50,
    backgroundColor: "rgba(255, 255, 255, 1)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerButton: {
    marginBottom: 60,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    marginTop: "30%", // Adjust as needed
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  headerImage: {
    width: "30%", // Adjust as needed
    aspectRatio: 2.5, // Ensure the aspect ratio remains square
    resizeMode: "contain", // Use 'contain' to maintain the image's aspect ratio and fit within the specified width and height
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  blocksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  block: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  selectedBlock: {
    borderBottomColor: "#4287f5",
  },
  blockText: {
    fontSize: 16,
  },
  blockContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  filterContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  filterCloseButton: {
    marginTop: 20,
    alignSelf: "flex-end",
    backgroundColor: "#4287f5",
    borderRadius: 20,
    padding: 5,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  filterPicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  // Add blockTitle style here
  blockTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  productImage: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    borderRadius: 25, // Make the image round
    marginRight: 50, // Add space between product images
    marginBottom: 5,

  },
  Other_productImage: {
    width: 70, // Adjust the width as needed
    height: 70, // Adjust the height as needed
    marginRight: 10, // Add space between product images
    marginBottom: 5,
    resizeMode: 'contain', // Fit image within the container without cropping
  },

});

export default App;
