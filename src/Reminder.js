// import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    TouchableHighlight,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { storageError, WIDTH, HEIGHT } from "./utils";

class Reminder extends Component {
    constructor(props) {
        super(props);

        AsyncStorage.getItem(
            Math.floor(Date.now() / (1000 * 60 * 60 * 24)) + ""
        )
            .then((val) => {
                if (val === NaN || val === null) return;
                this.props.navigation.navigate("Score");
            })
            .catch(storageError);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>
                    You haven't taken the quiz today!
                </Text>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("Quiz")}
                    style={styles.button}
                >
                    <Text style={styles.TakeQuiz}>Take the Quiz!</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#141f28",
        alignItems: "center",
        justifyContent: "center",
        height: HEIGHT,
        width: WIDTH,
    },

    text: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: 36,
        lineHeight: 50,
        textAlign: "left",
        // marginTop: 223,
        justifyContent: "center",
        marginLeft: WIDTH / 12,
    },

    button: {
        height: 81,
        width: WIDTH - 100,
        backgroundColor: "rgba(29,161,242,1)",
        borderRadius: 100,
        justifyContent: "center",
        marginTop: 120,
        marginLeft: 31,
        marginRight: 31,
    },

    TakeQuiz: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: 24,
        alignSelf: "center",
    },
});

export default Reminder;
