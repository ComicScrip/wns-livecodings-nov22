import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WilderScreen from "./screens/WildersScreen";
import { ApolloProvider } from "@apollo/client";
import client from "./gql/client";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <View>
        <WilderScreen />
        <StatusBar style="auto" />
      </View>
    </ApolloProvider>
  );
}
