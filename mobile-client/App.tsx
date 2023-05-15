import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WilderScreen from "./screens/WildersScreen";
import { ApolloProvider } from "@apollo/client";
import client from "./gql/client";
import { NavigationContainer } from "@react-navigation/native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./screens/HomeScreen";
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Wilders">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Wilders" component={WilderScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
