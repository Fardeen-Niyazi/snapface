import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import StudioScreen from '../screens/StudioScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { TabIcon } from './TabIcon';
import { TabParamList } from './types';
import { useTheme } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const { colors, type } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Studio"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { ...type.caption, fontSize: 10.5, fontFamily: 'Inter-SemiBold' },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.line,
          height: 56 + insets.bottom,
          paddingTop: 6,
        },
        tabBarIcon: ({ color }) => <TabIcon name={route.name} color={color} />,
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Studio" component={StudioScreen} />
      <Tab.Screen name="Saved" component={HistoryScreen} />
    </Tab.Navigator>
  );
}