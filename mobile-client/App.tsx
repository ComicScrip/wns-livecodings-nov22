import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import WilderScreen from "./screens/WildersScreen";
import { ApolloProvider } from "@apollo/client";
import client from "./gql/client";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import NotificationsScreen from "./screens/NotificationsScreen";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Wilders" component={WilderScreen} />
          <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
