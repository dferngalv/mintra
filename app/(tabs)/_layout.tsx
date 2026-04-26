import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function AppLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="home" color={color}/>, headerShown: false
        }}
      />
      <Tabs.Screen
        name="mylist"
        options={{
          title: 'My List',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="book" color={color}/>, headerShown: false
        }}
      />
      <Tabs.Screen
        name="popular"
        options={{
          title: 'Popular',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="fire" color={color}/>, headerShown: false
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="cog" color={color}/>, headerShown: false
        }}
      />
    </Tabs>
  );
}
