import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Quiz from "./src/Quiz";
import Reminder from "./src/Reminder";
import Score from "./src/Score";

const Stack = createStackNavigator();

export default () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Reminder"
                component={Reminder}
                options={() => ({ headerShown: false })}
            />
            <Stack.Screen
                name="Quiz"
                component={Quiz}
                options={() => ({ headerShown: false })}
            />
            <Stack.Screen
                name="Score"
                component={Score}
                options={() => ({ headerShown: false })}
            />
        </Stack.Navigator>
    </NavigationContainer>
);
