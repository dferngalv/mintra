import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface TabItem {
  name: string;
  label: string;
  icon: React.ReactNode;
  route: string;
}

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabItem[] = [
    {
      name: "home",
      label: "Home",
      icon: <Ionicons name="home" size={24} color="#000" />,
      route: "/",
    },
    {
      name: "mylist",
      label: "My List",
      icon: <Ionicons name="book" size={24} color="#000" />,
      route: "/mylist",
    },
    {
      name: "popular",
      label: "Popular",
      icon: <FontAwesome5 name="fire" size={20} color="#000" />,
      route: "/popular",
    },
    {
      name: "settings",
      label: "Settings",
      icon: <Ionicons name="settings" size={24} color="#000" />,
      route: "/settings",
    },
  ];

  const isActive = (route: string) => {
    return pathname === route || pathname.endsWith(route);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.route)}
          >
            {tab.icon}
            <Text
              style={[
                styles.label,
                { color: active ? "#000" : "#999" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingBottom: 12,
    paddingTop: 12,
    height: 78,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
    marginTop: 4,
  },
});
