import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function AppLayout() {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.isDark ? "#888" : "#999",
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.borderLight,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="mylist"
        options={{
          title: t("tabs.myList"),
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="book" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="popular"
        options={{
          title: t("tabs.popular"),
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="fire" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color }) => <FontAwesome5 size={24} name="cog" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="auth/login"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="auth/register"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="auth/profile"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/createseries"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/createchapters"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/createchapter"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="SearchScreen"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="series/[seriesId]"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/creatorpanel"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/creatorworkviewer"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/editwork"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/chapterreader"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/adminpanelseries"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="screens/adminpanelusers"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
