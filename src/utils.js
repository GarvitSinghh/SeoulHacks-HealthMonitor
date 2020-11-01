import { Dimensions, Alert } from "react-native";

export const storageError = (e) => {
    console.error(e);
    Alert.alert(
        "Alert",
        "An error occurred while trying to access the storage. Please try again."
    );
};

export const WIDTH = Dimensions.get("window").width;
export const HEIGHT = Dimensions.get("window").height;
