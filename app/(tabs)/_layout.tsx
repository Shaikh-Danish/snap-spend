import '@/global.css';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeftRightIcon, HomeIcon, SparklesIcon, Wallet2Icon } from 'lucide-react-native';
import { useUniwind } from 'uniwind';

import { AddNewExpenseFab } from '@/components/navbar/add-new-expense-fab';
import { NAV_THEME } from '@/lib/theme';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function TabLayout() {
  const { theme } = useUniwind();

  useEffect(() => {
    // clearrAllData();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={NAV_THEME[theme === 'dark' ? 'dark' : 'light']}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <PortalHost />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: "absolute",
              bottom: 14,
              left: 14,
              right: 14,
              borderRadius: 14,
              height: 64,
            }
          }}
          tabBar={(props) => <AddNewExpenseFab {...props} />}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarLabel: "Home",
              tabBarIcon: ({ color, size }) => (
                <HomeIcon size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="activity"
            options={{
              title: "Activity",
              tabBarLabel: "Activity",
              tabBarIcon: ({ color, size }) => (
                <ArrowLeftRightIcon size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="wallet"
            options={{
              title: "Wallet",
              tabBarLabel: "Wallet",
              tabBarIcon: ({ color, size }) => (
                <Wallet2Icon size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="ai"
            options={{
              title: "AI",
              tabBarLabel: "AI",
              tabBarIcon: ({ color, size }) => (
                <SparklesIcon size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="+not-found"
            options={{
              href: null,
            }}
          />
        </Tabs>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
