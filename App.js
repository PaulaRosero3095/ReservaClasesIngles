import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import InicioTabs from './src/navigation/InicioTabs';
import {colors} from './src/theme';
import { UsuarioProvider } from './src/context/UsuarioContext';
import { ReservaProvider } from './src/context/ReservasContext';

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <UsuarioProvider>
        <ReservaProvider>
          <NavigationContainer theme={temaNavegacion}>
            <StatusBar style="dark" />
            <InicioTabs />
          </NavigationContainer>
        </ReservaProvider>
      </UsuarioProvider>
    </SafeAreaProvider>
  );
}

