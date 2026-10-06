import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ClasesStack from './ClasesStack';
import MisReservasScreen from '../screens/MisReservasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

// Mapa de íconos por ruta: activo / inactivo
const ICONOS = {
  Clases: { focused: 'home', unfocused: 'home-outline' },
  Reservas: { focused: 'calendar', unfocused: 'calendar-outline' },
  Perfil: { focused: 'person', unfocused: 'person-outline' },
};

export default function InicioTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: colors.textoSuave,
        tabBarStyle: {
          backgroundColor: colors.superficie,
          borderTopColor: colors.borde,
          height: 62,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icono = ICONOS[route.name];
          return (
            <Ionicons
              name={focused ? icono.focused : icono.unfocused}
              size={size ?? 22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Clases"
        component={ClasesStack}
        options={{ tabBarLabel: 'Clases' }}
      />
      <Tab.Screen
        name="Reservas"
        component={MisReservasScreen}
        options={{ tabBarLabel: 'Mis Reservas' }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}