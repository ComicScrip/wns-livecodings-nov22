import { View, StyleSheet, Text, Image } from "react-native";
import { Wilder } from "../gql/generated/schema";
import Ionicons from "@expo/vector-icons/Ionicons";

interface WilderListItemProps {
  wilder: Partial<Wilder>;
}

export default function WilderListItem({ wilder }: WilderListItemProps) {
  return (
    <View style={styles.container}>
      {wilder.avatarUrl ? (
        <Image
          source={{ uri: wilder.avatarUrl }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      ) : (
        <Ionicons name="person-circle-outline" size={40} />
      )}
      <View style={styles.textContainer}>
        <Text>{wilder.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 20,
  },
});
