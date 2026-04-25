import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { NAV_THEME } from '@/lib/theme';
import { AIProvider } from '@/lib/ai/llm-service';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { useUniwind } from 'uniwind';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { theme } = useUniwind();
  const isDark = theme === 'dark';

  return (
    <AIProvider>
      <ThemeProvider value={NAV_THEME[isDark ? 'dark' : 'light']}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        </Stack>
        <PortalHost />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </ThemeProvider>
    </AIProvider>
  );
}
