import React, { Component } from "react";
import {
    Text,
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    Alert,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { storageError, WIDTH, HEIGHT } from "./utils";

const defaultTo = (arr, defValue) => (arr.length < 1 ? defValue : arr);

const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
        borderRadius: 16,
    },
    propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726",
    },
};

const data = [
    {
        name: "Cautious",
        score: 4,
        color: "rgba(123, 250, 178, 1)",
        legendFontColor: "rgba(200, 200, 200, 1)",
        legendFontSize: 15,
    },
    {
        name: "Not Cautious",
        score: 1,
        color: "rgba(246, 36, 89, 1)",
        legendFontColor: "rgba(200, 200, 200, 1)",
        legendFontSize: 15,
    },
];

class Score extends Component {
    state = {};
    constructor(props) {
        super(props);
        AsyncStorage.getAllKeys()
            .then((arr) => {
                for (const key of arr) {
                    AsyncStorage.getItem(key)
                        .then((val) => {
                            const obj = {};
                            obj[key] = parseInt(val);
                            this.setState(obj);
                        })
                        .catch((e) => {
                            const obj = {};
                            obj[key] = 0;
                            this.setState(obj);
                            storageError(e);
                        });
                }
            })
            .catch(storageError);
    }

    render() {
        const todaysScore =
            this.state[Math.floor(Date.now() / (1000 * 60 * 60 * 24))] || 0;

        const scoresThisWeek = Object.keys(this.state)
            .map((key) => parseInt(key))
            .filter(
                (day) => day <= Math.floor(Date.now() - 1000 * 60 * 60 * 24) - 7
            )
            .map((key) => this.state[key]);
        const averageThisWeek = scoresThisWeek.length < 1
            ? "-"
            : (scoresThisWeek.reduce((a, b) => a + b, 0) / scoresThisWeek.length).toFixed(2);

        const scores = Object.values(this.state);
        const averageAllTime = scores.length < 1
            ? "-"
            : (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);

        const bestScore = scores.sort((a, b) => b - a)[0] || 0;

        data[0].score = todaysScore / 10;
        data[1].score = 5 - todaysScore / 10;

        const labels = defaultTo(
            Object.keys(this.state).map((key) =>
                new Date(
                    parseInt(key) * (1000 * 60 * 60 * 24)
                ).getDate()
            ),
            ["-"]
        );

        const dataset = defaultTo(
            Object.values(this.state).map((val) => parseInt(val)),
            [0]
        );

        return (
            <ScrollView style={styles.container}>
                <View style={styles.main}>
                    <Text
                        style={{
                            color: "rgba(255, 255, 255, 1)",
                            fontSize: 30,
                        }}
                    >
                        Today's Score
                    </Text>
                    <PieChart
                        data={data}
                        width={WIDTH}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="score"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                    <Text style={styles.text}>
                        Average Score This Week: {averageThisWeek}
                    </Text>
                    <Text style={styles.text}>
                        Average Score All Time: {averageAllTime}
                    </Text>
                    <Text style={styles.text}>Best Score: {bestScore}</Text>
                    <Text style={styles.text}>Maximum Score Possible: 50</Text>
                    <View
                        style={{
                            borderBottomColor: "#FFFFFF",
                            borderBottomWidth: 1,
                        }}
                    />
                    <LineChart
                        data={{
                            labels,
                            datasets: [
                                {
                                    data: dataset,
                                },
                            ],
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={220}
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            // backgroundColor: "blue",
                            backgroundGradientFrom: "#abd9ff",
                            backgroundGradientTo: "#abd9ff",
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#ffa726",
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                            marginTop: 30,
                        }}
                    />
                    <Text style={styles.text}>
                        {averageThisWeek === "-"
                            ? "You should take the quiz!"
                            : averageThisWeek > 40
                            ? "You're doing good! Keep up the good work!"
                            : averageThisWeek > 30
                            ? "You have to be a little bit more cautious!"
                            : averageThisWeek > 20
                            ? "You're on the middle. Please be careful!"
                            : averageThisWeek > 10
                            ? "You take little amount of precautions! We don't want you to get the virus, so please take care of yourself UwU"
                            : "You should really consider avoiding the virus -.-"}
                    </Text>
                </View>
                <View style={styles.bottomMargin}></View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#141f28",
        // alignItems: 'center',
        // justifyContent: 'center'
        height: HEIGHT,
        width: WIDTH,
    },

    text: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: 20,
        // fontFamily: "Montserrat",
        fontWeight: "bold",
        textAlign: "center",
        // marginTop: 223,
        justifyContent: "center",
    },

    chart: {
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center",
    },

    main: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: HEIGHT / 8,
        lineHeight: 100,
    },

    bottomMargin: {
        marginBottom: 100,
    },
});

export default Score;
