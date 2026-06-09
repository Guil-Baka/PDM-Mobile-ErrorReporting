import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="ocorrencia/[id]"
          options={{ title: 'Detalhes da Ocorrência' }}
        />
        <Stack.Screen
          name="ocorrencia/nova"
          options={{ title: 'Nova Ocorrência', presentation: 'modal' }}
        />
      </Stack>
    </AppProvider>
  );
}
