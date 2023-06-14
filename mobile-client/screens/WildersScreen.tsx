import { StyleSheet, Text, View, FlatList } from "react-native";
import { useWildersQuery } from "../gql/generated/schema";
import WilderListItem from "../components/WilderListItem";
import Constants from "expo-constants";
const env = Constants.expoConfig?.extra || {};

export default function WilderScreen() {
  const { loading: loadingWilders, data, error } = useWildersQuery();
  const wilders = data?.wilders || [];

  console.log({ error, data, loadingWilders });

  return (
    <View style={styles.container}>
      <Text>hello</Text>
      <Text>
        {JSON.stringify({ error, data, loadingWilders, env }, null, 2)}
      </Text>
      <FlatList
        data={wilders}
        refreshing={loadingWilders}
        renderItem={({ item }) => <WilderListItem wilder={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>no wilders</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
  },
});
