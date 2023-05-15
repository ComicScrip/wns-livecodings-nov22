import { StyleSheet, Text, View, FlatList } from "react-native";
import { useWildersQuery } from "../gql/generated/schema";
import WilderListItem from "../components/WilderListItem";

export default function WilderScreen() {
  const { loading: loadingWilders, data, error } = useWildersQuery();
  const wilders = data?.wilders || [];

  console.log({ error, data, loadingWilders });

  return (
    <View style={styles.container}>
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
  container: {},
  separator: {
    height: 1,
    backgroundColor: "lightgrey",
  },
});
