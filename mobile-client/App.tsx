import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WilderScreen from "./screens/WildersScreen";
import { ApolloProvider } from "@apollo/client";
import client from "./gql/client";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Wilders" component={WilderScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
