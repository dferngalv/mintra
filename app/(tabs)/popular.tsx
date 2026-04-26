import { StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";

export default function Popular() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Popular Screen</Text>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#000",
  },
});
