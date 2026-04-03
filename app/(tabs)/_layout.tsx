import { Colors } from '@/constants/Colors';
//import { Tabs } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Index from '.';
import List from './list';
import Popular from './popular';
import Settings from './settings';
import CustomTabBar from '../../components/CustomTabBar';
import MenuLabelView from '@/components/MenuLabelView';
import { useTheme } from '@/contexts/ThemeProvider';

export default function TabLayout() {

  const {theme, toggleTheme} = useTheme();
  const isDark = theme === "dark";

  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ tabBarActiveTintColor: Colors.primaryColor, tabBarIndicatorStyle: { backgroundColor: Colors.primaryColor }, tabBarStyle: { backgroundColor: isDark ? Colors.black : Colors.white }}}>
      <Tab.Screen
        name="index"
        component={Index}
        options={{
          title: 'Home',
          tabBarLabel: ({ color }) => (
            <MenuLabelView iconName='home' label='Home' color={color}/>

          ),
        }}
      />
      <Tab.Screen
        name="list"
        component={List}
        options={{
          title: 'List',
          tabBarLabel: ({ color }) => (
            <MenuLabelView iconName='th-list' label='List' color={color}/>
          ),
        }}
      />
      <Tab.Screen
        name="popular"
        component={Popular}
        options={{
          title: 'Popular',
          tabBarLabel: ({ color }) => (
            <MenuLabelView iconName='fire-alt' label='Popular' color={color}/>
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={Settings}
        options={{
          title: 'Settings',
          tabBarLabel: ({ color }) => (
            <MenuLabelView iconName='cog' label='Settings' color={color}/>
          ),
        }}
      />
    </Tab.Navigator>
  );
}