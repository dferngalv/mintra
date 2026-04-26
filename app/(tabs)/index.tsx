import { StyleSheet, Text, View } from "react-native";
import Header from "../../components/Header";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Mintra</Text>
        <Text style={styles.subtitle}>Explore amazing content</Text>
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
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
