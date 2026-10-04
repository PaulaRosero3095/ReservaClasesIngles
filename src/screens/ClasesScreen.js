import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/Card';
import EstadoVacio from '../components/EstadoVacio';
import NivelChip from '../components/NivelChip';
import useResponsive from '../hooks/useResponsive';
import { colors, radius, spacing, typography } from '../theme';
import { CLASES, NIVELES } from '../data/clases';

// Agregamos "Todos" al inicio para poder limpiar el filtro.
const FILTROS = NIVELES;

export default function ClasesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { columnas, paddingHorizontal } = useResponsive();
  const [nivel, setNivel] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const resultados = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();
    return CLASES.filter((clase) => {
      const coincidenciaNivel = nivel === 'Todos' || clase.nivel === nivel;
      const coincidenciaTexto =
        textoBusqueda === '' ||
        clase.titulo.toLowerCase().includes(textoBusqueda) ||
        clase.profesor.nombre.toLowerCase().includes(textoBusqueda);
      return coincidenciaNivel && coincidenciaTexto;
    });
  }, [nivel, busqueda]);

  return (
    <View style={[style.pantalla, { paddingTop: insets.top + spacing.md }]}>
      {/* Encabezado */}
      <View style={[style.header, { paddingHorizontal }]}>
        <View style={style.headerTexto}>
          <Text style={style.titulo}>Clases de inglés</Text>
          <Text style={style.subtitulo}>
            {resultados.length}{' '}
            {resultados.length === 1 ? 'clase disponible' : 'clases disponibles'}
          </Text>
        </View>

        {/* Buscador correctamente envuelto */}
        <View style={style.buscador}>
          <Ionicons name="search" size={18} color={colors.textoSuave} />
          <TextInput
            style={style.input}
            placeholder="Buscar por clase o profesor"
            placeholderTextColor={colors.textoSuave}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
            returnKeyType="search"
          />
          {busqueda.length > 0 && (
            <Pressable onPress={() => setBusqueda('')} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={colors.textoSuave} />
            </Pressable>
          )}
        </View>

        {/* Chips de nivel con estado activo real */}
        <FlatList
          data={FILTROS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={style.chipsContainer}
          style={style.chipsLista}
          renderItem={({ item }) => (
            <NivelChip
              etiqueta={item}
              activo={nivel === item}
              onPress={() => setNivel(item)}
            />
          )}
        />
      </View>

      {/* Lista de clases */}
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            clase={item}
            onPress={() => navigation.navigate('DetalleClase', { clase: item })}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
          flexGrow: 1,
        }}
        numColumns={columnas}
        columnWrapperStyle={columnas > 1 ? { gap: spacing.md } : undefined}
        ListEmptyComponent={
          <EstadoVacio
            icono="search-outline"
            titulo="No se encontraron resultados"
            mensaje="Intenta con otro nivel o profesor"
            onAction={() => {
              setNivel('Todos');
              setBusqueda('');
            }}
          />
        }
      />
    </View>
  );
}

const style = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  header: {
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  headerTexto: {
    gap: 2,
  },
  titulo: {
    ...typography.titulo,
    fontSize: 22,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textoSuave,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.texto,
    paddingVertical: 0,
  },
  chipsLista: {
    flexGrow: 0,
    marginHorizontal: -spacing.lg, // para que el scroll llegue al borde
  },
  chipsContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});