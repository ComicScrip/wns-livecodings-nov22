import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  useGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} from "../gql/generated/schema";
import * as SecureStore from "expo-secure-store";
import { registerForPushNotificationsAsync } from "../utils/notifications";

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({
    email: "admin@gmail.com",
    password: "Test@123",
  });
  const [error, setError] = useState("");

  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const { data: currentUser, client } = useGetProfileQuery({
    errorPolicy: "ignore",
  });

  const [updateProfile] = useUpdateProfileMutation();

  useEffect(() => {
    if (currentUser?.profile)
      registerForPushNotificationsAsync().then((expoNotificationToken) =>
        updateProfile({ variables: { data: { expoNotificationToken } } })
      );
  }, [currentUser?.profile]);

  return (
    <View style={styles.container}>
      {currentUser?.profile ? (
        <View>
          <Text>connected as {currentUser.profile.email}</Text>
          <Button
            onPress={async () => {
              try {
                await logout();
                SecureStore.deleteItemAsync("token");
              } catch (err) {
                setError("invalid credentials");
              } finally {
                client.resetStore();
              }
            }}
            title="Log out"
          />
        </View>
      ) : (
        <View>
          <TextInput
            value={credentials.email}
            onChangeText={(newValue) =>
              setCredentials({ ...credentials, email: newValue })
            }
          />
          <TextInput
            value={credentials.password}
            onChangeText={(newValue) =>
              setCredentials({ ...credentials, password: newValue })
            }
          />

          <Button
            onPress={async () => {
              try {
                setError("");
                const res = await login({ variables: { data: credentials } });
                SecureStore.setItemAsync("token", res.data?.login as string);
              } catch (err) {
                setError("invalid credentials");
              } finally {
                client.resetStore();
              }
            }}
            title="Log in"
          />

          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
  },
});
