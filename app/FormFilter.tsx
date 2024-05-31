import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
interface FilterFormProps {
    showFilterForm: boolean;
    selectedProvince: string;
    selectedTitle: string;
    selectedProduct: string;
    selectedOtherProduct: string;
    selectedDescription: string | null;
    selectedService: string;
    setSelectedProvince: (value: string) => void;
    setSelectedTitle: (value: string) => void;
    setSelectedProduct: (value: string) => void;
    setSelectedOtherProduct: (value: string) => void;
    setSelectedDescription: (value: string) => void;
    setSelectedService: (value: string) => void;
    provinceOptions: string[];
    titleOptions: string[];
    productOptions: string[];
    otherProductOptions: string[];
    descriptionOptions: string[];
    serviceOptions: string[];
    applyFilters: () => void;
    toggleFilterForm: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
    showFilterForm,
    selectedProvince,
    selectedTitle,
    selectedProduct,
    selectedOtherProduct,
    selectedDescription,
    selectedService,
    setSelectedProvince,
    setSelectedTitle,
    setSelectedProduct,
    setSelectedOtherProduct,
    setSelectedDescription,
    setSelectedService,
    provinceOptions,
    titleOptions,
    productOptions,
    otherProductOptions,
    descriptionOptions,
    serviceOptions,
    applyFilters,
    toggleFilterForm,
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

    const languageData: { [key: string]: { [key: string]: string } } = {
        en: {
            filterByProvince: "Filter by Province:",
            filterByStation: "Filter by Station:",
            filterByProduct: "Filter by Product:",
            filterByOtherProduct: "Filter by Other Product:",
            filterByDescription: "Filter by Service:",
            filterByService: "Filter by Payment:",
            selectProvince: "Select Province",
            selectTitle: "Select Title",
            selectProduct: "Select Product",
            selectOtherProduct: "Select Other Product",
            selectDescription: "Select Service",
            selectService: "Select Payment",
            applyFilters: "Apply",
            close: "Close",
            clearSelections: "Clear",
            english: "English",
            khmer: "Khmer",
            thai: "Thai",
        },
        kh: {
            filterByProvince: "ចូលស្វែងរកតាមខេត្ត:",
            filterByStation: "ចូលស្វែងរកតាមស្ថានភាព:",
            filterByProduct: "ចូលស្វែងរកតាមផលិតផល:",
            filterByOtherProduct: "ចូលស្វែងរកតាមផលិតផលផ្សេងៗ:",
            filterByDescription: "ចូលស្វែងរកតាមសេវាកម្ម:",
            filterByService: "ចូលស្វែងរកតាមការទូទាត់:",
            selectProvince: "ជ្រើសរើសខេត្ត",
            selectTitle: "ជ្រើសរើសចំណងជើង",
            selectProduct: "ជ្រើសរើសផលិតផល",
            selectOtherProduct: "ជ្រើសរើសផលិតផលផ្សេងៗ",
            selectDescription: "ជ្រើសរើសសេវាកម្ម",
            selectService: "ជ្រើសរើសការទូទាត់",
            applyFilters: "ស្វែងរក",
            close: "បិទ",
            clearSelections: "សំអាត",
            english: "អង់គ្លេស",
            khmer: "ខ្មែរ",
            thai: "ថៃ",
        },
        th: {
            filterByProvince: "ค้นหาตามจังหวัด:",
            filterByStation: "ค้นหาตามสถานี:",
            filterByProduct: "ค้นหาตามผลิตภัณฑ์:",
            filterByOtherProduct: "ค้นหาตามผลิตภัณฑ์อื่นๆ:",
            filterByDescription: "ค้นหาตามคำอธิบาย:",
            filterByService: "ค้นหาตามบริการ:",
            selectProvince: "เลือกจังหวัด",
            selectTitle: "เลือกชื่อสถานี",
            selectProduct: "เลือกผลิตภัณฑ์",
            selectOtherProduct: "เลือกผลิตภัณฑ์อื่นๆ",
            selectDescription: "เลือกคำอธิบาย",
            selectService: "เลือกบริการ",
            applyFilters: "ค้นหา",
            close: "ปิด",
            clearSelections: "ชัดเจน",
            english: "อังกฤษ",
            khmer: "เขมร",
            thai: "ไทย",
        },
    };

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language);
    };

    const getTranslatedText = (textKey: string) => {
        return languageData[selectedLanguage][textKey];
    };

    const clearSelections = () => {
        setSelectedProvince("");
        setSelectedTitle("");
        setSelectedProduct("");
        setSelectedOtherProduct(""); // Provide a default empty string value
        setSelectedDescription(""); // Provide a default empty string value
        setSelectedService("");
    };

    useEffect(() => {
        console.log("otherProductOptions: ", otherProductOptions);
        console.log("selectedOtherProduct: ", selectedOtherProduct);
    }, [otherProductOptions, selectedOtherProduct]);

    if (!showFilterForm) {
        return null;
    }

    return (
        <View style={styles.centeredView}>
            <View style={styles.filterContainer}>
                {/* Language Selection Buttons */}
                <View style={styles.languageSelection}>
                    <Animatable.View
                        animation="fadeIn"
                        delay={500}
                        style={styles.languageButton}
                    >
                        <TouchableOpacity onPress={() => handleLanguageChange("en")}>
                            <Icon name="globe" size={24} color="#007AFF" />
                            <Text style={styles.languageButtonText}>
                                {getTranslatedText("english")}
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View
                        animation="fadeIn"
                        delay={1000}
                        style={styles.languageButton}
                    >
                        <TouchableOpacity onPress={() => handleLanguageChange("kh")}>
                            <Icon name="globe" size={24} color="#007AFF" />
                            <Text style={styles.languageButtonText}>
                                {getTranslatedText("khmer")}
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>
                    <Animatable.View
                        animation="fadeIn"
                        delay={1500}
                        style={styles.languageButton}
                    >
                        <TouchableOpacity onPress={() => handleLanguageChange("th")}>
                            <Icon name="globe" size={24} color="#007AFF" />
                            <Text style={styles.languageButtonText}>
                                {getTranslatedText("thai")}
                            </Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>

                {/* Filter elements */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>
                        {getTranslatedText("filterByProvince")}
                    </Text>
                    <RNPickerSelect
                        placeholder={{
                            label: getTranslatedText("selectProvince"),
                            value: null,
                        }}
                        value={selectedProvince}
                        onValueChange={(value) => setSelectedProvince(value)}
                        items={provinceOptions.map((option) => ({
                            label: option,
                            value: option,
                        }))}
                        style={pickerSelectStyles}
                    />
                </View>

                {/* Filter by Station */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>
                        {getTranslatedText("filterByStation")}
                    </Text>
                    <RNPickerSelect
                        placeholder={{
                            label: getTranslatedText("selectTitle"),
                            value: null,
                        }}
                        value={selectedTitle}
                        onValueChange={(value) => {
                            setSelectedTitle(value);
                        }}
                        items={titleOptions.map((option) => ({
                            label: option,
                            value: option,
                        }))}
                        style={pickerSelectStyles}
                    />
                </View>

                {/* Filter by Product */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>
                        {getTranslatedText("filterByProduct")}
                    </Text>
                    <RNPickerSelect
                        placeholder={{
                            label: getTranslatedText("selectProduct"),
                            value: null,
                        }}
                        value={selectedProduct}
                        onValueChange={(value) => setSelectedProduct(value)}
                        items={productOptions.map((option) => ({
                            label: option,
                            value: option,
                        }))}
                        style={pickerSelectStyles}
                    />
                </View>

                {/* Filter by Other Product */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>
                        {getTranslatedText("filterByOtherProduct")}
                    </Text>
                    <RNPickerSelect
                        placeholder={{
                            label: getTranslatedText("selectOtherProduct"),
                            value: null,
                        }}
                        value={selectedOtherProduct}
                        onValueChange={(value) => {
                            console.log("Selected Other Product: ", value);
                            setSelectedOtherProduct(value);
                        }}
                        items={otherProductOptions
                            .filter((option) => option !== "")
                            .map((option) => ({
                                label: option,
                                value: option,
                            }))}
                        style={pickerSelectStyles}
                    />
                </View>

                {/* Filter by Description */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>
                        {getTranslatedText("filterByDescription")}
                    </Text>
                    <RNPickerSelect
                        placeholder={{
                            label: getTranslatedText("selectDescription"),
                            value: null,
                        }}
                        value={selectedDescription}
                        onValueChange={(value) => setSelectedDescription(value)}
                        items={descriptionOptions
                            .filter((option) => option !== "")
                            .map((option) => ({
                                label: option,
                                value: option,
                            }))}
                        style={pickerSelectStyles}
                    />
                </View>

                {/* Filter by Service */}
                <View style={styles.filterGroup}>
                    <Text style={styles.filterTitle}>
                        {getTranslatedText("filterByService")}
                    </Text>
                    <RNPickerSelect
                        placeholder={{
                            label: getTranslatedText("selectService"),
                            value: null,
                        }}
                        value={selectedService}
                        onValueChange={(value) => setSelectedService(value)}
                        items={serviceOptions.map((option) => ({
                            label: option,
                            value: option,
                        }))}
                        style={pickerSelectStyles}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    {/* Clear Selections Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.clearSelectionButton]}
                        onPress={clearSelections}
                    >
                        <Icon
                            name="close-circle-outline"
                            size={windowWidth * 0.07}
                            color="#fff"
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>
                            {getTranslatedText("clearSelections")}
                        </Text>
                    </TouchableOpacity>

                    {/* Filter Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.filterButton]}
                        onPress={applyFilters}
                    >
                        <Icon
                            name="filter-outline"
                            size={windowWidth * 0.07}
                            color="#fff"
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>
                            {getTranslatedText("applyFilters")}
                        </Text>
                    </TouchableOpacity>

                    {/* Close Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.filterCloseButton]}
                        onPress={toggleFilterForm}
                    >
                        <Icon
                            name="close-outline"
                            size={windowWidth * 0.07}
                            color="#fff"
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>{getTranslatedText("close")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        height: "100%", // Ensures full height
        width: "100%", // Ensures full width
    },
    filterContainer: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: "80%", // Adjust width as necessary
    },
    filterGroup: {
        marginBottom: 5,
    },
    filterTitle: {
        fontWeight: "bold",
        marginBottom: 10,
    },
    filterButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    languageSelection: {
        flexDirection: "row",

        marginBottom: 10,
    },
    languageButton: {
        marginRight: 5,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#007AFF",
        backgroundColor: "#fff",
    },
    languageButtonText: {
        marginLeft: 10,
        color: "#007AFF",
        fontSize: 12,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: windowWidth * 0.05,
        marginTop: windowWidth * 0.02,
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: windowWidth * 0.02,
        paddingVertical: windowWidth * 0.001, // Adjusted padding for better fit
        paddingHorizontal: windowWidth * 0.04, // Added horizontal padding for better fit
        borderRadius: windowWidth * 0.05, // More rounded corners
        backgroundColor: "#007AFF",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    icon: {
        marginRight: windowWidth * 0.005, // Space between icon and text
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: windowWidth * 0.02, // Slightly larger text
        textAlign: "center",
    },
    clearSelectionButton: {
        backgroundColor: "#007AFF",
    },
    filterButton: {
        backgroundColor: "#007AFF",
    },
    filterCloseButton: {
        backgroundColor: "red",
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 4,
        color: "black",
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: "purple",
        borderRadius: 8,
        color: "black",
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default FilterForm;
