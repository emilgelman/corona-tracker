import React from 'react';

import HomeScreen from './components/HomeScreen';
import DetailsScreen from "./components/DetailsScreen";
import {createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        title: '',
                        headerTransparent: true,
                        headerStyle: {
                            backgroundColor: '#fffcef',
                        },
                    }}
                />
                <Stack.Screen
                    name="Details"
                    component={DetailsScreen}
                    options={{
                        title: 'מיקומים אחרונים',
                        headerStyle: {
                            backgroundColor: '#fffcef',
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
