import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import TabBar from "../../components/TabBar";

export default function AppLayout() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
