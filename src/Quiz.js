import React, { Component } from "react";
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

import { storageError, WIDTH, HEIGHT } from "./utils";

class Quiz extends Component {
    questions = [null, null, null, null, null];

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.main}>
                    <Text style={styles.title}>
                        {" "}
                        What have you done today?{" "}
                    </Text>
                    <View style={styles.limited}>
                        <View style={{ height: HEIGHT / 50 }}></View>
                        <Question
                            prompt="Did you wear a mask today?"
                            onChange={(val) => (this.questions[0] = val)}
                        />
                        <View style={{ height: HEIGHT / 50 }}></View>
                        <Question
                            prompt="Did you wash your hands frequently?"
                            onChange={(val) => (this.questions[1] = val)}
                        />
                        <View style={{ height: HEIGHT / 50 }}></View>
                        <Question
                            prompt="Did you obey the social distancing rules?"
                            onChange={(val) => (this.questions[2] = val)}
                        />
                        <View style={{ height: HEIGHT / 50 }}></View>
                        <Question
                            prompt="Did you avoid touching your nose, eyes and mouth?"
                            onChange={(val) => (this.questions[3] = val)}
                        />
                        <View style={{ height: HEIGHT / 50 }}></View>
                        <Question
                            prompt="Did you cover your nose and mouth when you coughed or sneezed?"
                            onChange={(val) => (this.questions[4] = val)}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.submit()}
                    >
                        <Text style={styles.mediumText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    async submit() {
        if (this.questions.some((question) => question === null)) {
            //not answered yet
            Alert.alert("Alert", "You must answer all questons!");
            return;
        }

        const points = this.calculatePoints();
        //console.log(points, "points", this.questions);
        try {
            await AsyncStorage.setItem(
                Math.floor(Date.now() / (1000 * 60 * 60 * 24)) + "",
                points + ""
            );
            this.props.navigation.navigate("Score");
        } catch (e) {
            storageError(e);
        }
    }

    calculatePoints() {
        return this.questions
            .map((question) => +question)
            .reduce((a, b) => b * 10 + a, 0);
    }
}

class Question extends Component {
    state = { value: null };

    constructor(props) {
        super(props);
    }

    select(bool) {
        //console.log("Set to", bool);
        this.props.onChange(bool);
        this.setState({ value: bool });
    }

    render() {
        return (
            <View>
                <View style={styles.fluid}>
                    <Text style={styles.text}>{this.props.prompt}</Text>
                </View>
                <View style={styles.wrapper}>
                    <TouchableOpacity
                        style={
                            this.state.value === true
                                ? styles.markedBox
                                : styles.box
                        }
                        onPress={() => this.select(true)}
                    >
                        <Text>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={
                            this.state.value === false
                                ? styles.markedBox
                                : styles.box
                        }
                        onPress={() => this.select(false)}
                    >
                        <Text>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#141f28",
        height: HEIGHT,
        width: WIDTH,
    },
    main: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: HEIGHT / 10,
        lineHeight: 100,
    },
    title: {
        marginTop: HEIGHT / 20,
        fontSize: 50,
        textAlign: "center",
        color: "white",
    },
    mediumText: {
        fontSize: 24,
        color: "white",
    },
    button: {
        marginTop: HEIGHT / 20,
        backgroundColor: "purple",
        padding: 10,
        borderRadius: 10,
        marginBottom: HEIGHT / 10,
    },
    wrapper: {
        alignItems: "center",
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
    },
    box: {
        width: WIDTH / 2,
        padding: 5,
        textAlign: "center",
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    markedBox: {
        width: WIDTH / 2,
        padding: 5,
        textAlign: "center",
        backgroundColor: "lime",
        alignItems: "center",
        justifyContent: "center",
    },
    fluid: {
        width: WIDTH,
    },
    space: {
        marginTop: 10,
    },
});

export default Quiz;
