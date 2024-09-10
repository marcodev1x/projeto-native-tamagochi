import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PetListScreen from '../screens/PetListScreen';
import AddPetScreen from '../screens/AddPetScreen';
import PetDetailScreen from '../screens/PetDetailScreen';
import FindThePairs from "../screens/FindThePairs";
import GuessNumberScreen from "../screens/GuessNumberScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function PetStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="PetListScreen" component={PetListScreen} />
            <Stack.Screen name="PetDetailScreen" component={PetDetailScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Pets" component={PetStack} />
                <Tab.Screen name="Add Pet" component={AddPetScreen} />
                <Tab.Screen name="Encontre o par" component={FindThePairs} />
                <Tab.Screen name="Jogo da adivinhação" component={GuessNumberScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
