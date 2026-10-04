import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Image, ScrollView, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useResponsive from "../hooks/useResponsive";
import { colors, radius, spacing, typography } from '../theme';
import { formatearPrecio } from '../data/clases';
import EtiquetaNivel from "../components/EtiquetaNivel";
import BotonReservar from "../components/BotonReservar";

export default function DetalleClaseScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { clase } = route.params;
  const { paddingHorizontal, esTablet } = useResponsive();

  const [reservada, setReservada] = useState(false);
  // 🔹 NUEVO: horario seleccionado
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  const cuposDisponibles = clase.cupos - (reservada ? 1 : 0);

  const cambiarReserva = () => {
    if (reservada) {
      Alert.alert('Cancelar reserva', '¿Quieres cancelar tu reserva?', [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancelar reserva',
          style: 'destructive',
          onPress: () => {
            setReservada(false);
            // Opcional: mantener el horario elegido o limpiarlo
            // setHorarioSeleccionado(null);
          },
        },
      ]);
      return;
    }

    // 🔹 NUEVO: obligar a elegir horario antes de reservar
    if (!horarioSeleccionado) {
      Alert.alert('Elige un horario', 'Selecciona un horario antes de reservar.');
      return;
    }

    if (cuposDisponibles === 0) {
      Alert.alert('Clase llena', 'No quedan cupos disponibles para esta clase.');
      return;
    }

    setReservada(true);
    Alert.alert(
      'Reserva confirmada',
      `Tu reserva para el horario "${horarioSeleccionado}" se ha realizado correctamente.`
    );
  };

  return (
    <View style={style.pantalla}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: clase.imagen }}
          resizeMode="cover"
          style={[style.portada, { height: esTablet ? 300 : 220 }]}
        />

        <View style={[style.contenido, { paddingHorizontal }]}>
          <EtiquetaNivel nivel={clase.nivel} />
          <Text style={style.titulo}>{clase.titulo}</Text>

          <View style={style.filaProfesor}>
            <Image source={{ uri: clase.profesor.foto }} style={style.avatar} />
            <View>
              <Text style={style.profesorNombre}>{clase.profesor.nombre}</Text>
              <Text style={style.meta}>{clase.profesor.pais}</Text>
            </View>
          </View>

          <View style={style.datos}>
            <View style={style.dato}>
              <Ionicons name="time-outline" size={20} color={colors.primario} />
              <Text style={style.datoValor}>{clase.duracion} min</Text>
              <Text style={style.meta}>Duración</Text>
            </View>
            <View style={style.dato}>
              <Ionicons name="people-outline" size={20} color={colors.primario} />
              <Text style={style.datoValor}>{cuposDisponibles}</Text>
              <Text style={style.meta}>Cupos</Text>
            </View>
            <View style={style.dato}>
              <Ionicons name="desktop-outline" size={20} color={colors.primario} />
              <Text style={style.datoValor}>{clase.modalidad}</Text>
              <Text style={style.meta}>Modalidad</Text>
            </View>
          </View>

          {/* 🔹 HORARIOS SELECCIONABLES */}
          <View>
            <Text style={typography.subtitulo}>Horarios</Text>
            <Text style={style.meta}>
              {horarioSeleccionado
                ? `Seleccionado: ${horarioSeleccionado}`
                : 'Toca un horario para seleccionarlo'}
            </Text>

            <View style={style.horarios}>
              {clase.horarios.map((horario) => {
                const activo = horarioSeleccionado === horario;
                const deshabilitado = reservada; // no dejar cambiar si ya reservó
                return (
                  <Pressable
                    key={horario}
                    onPress={() => setHorarioSeleccionado(horario)}
                    disabled={deshabilitado}
                    style={({ pressed }) => [
                      style.horario,
                      activo && style.horarioActivo,
                      deshabilitado && !activo && style.horarioDeshabilitado,
                      pressed && style.horarioPresionado,
                    ]}
                  >
                    <Ionicons
                      name={activo ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={activo ? colors.superficie : colors.primario}
                    />
                    <Text
                      style={[
                        style.horarioTexto,
                        activo && style.horarioTextoActivo,
                      ]}
                    >
                      {horario}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={typography.subtitulo}>Sobre esta clase</Text>
            <Text style={style.descripcion}>{clase.descripcion}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[style.barra, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={{ flexShrink: 1 }}>
          <Text style={style.meta}>Precio por clase</Text>
          <Text style={style.precio}>{formatearPrecio(clase.precio)}</Text>
          {horarioSeleccionado && (
            <Text style={style.meta} numberOfLines={1}>
              {horarioSeleccionado}
            </Text>
          )}
        </View>

        <BotonReservar
          onPress={cambiarReserva}
          disabled={!reservada && (cuposDisponibles === 0 || !horarioSeleccionado)}
        />
      </View>
    </View>
  );
}
const style = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  portada: { width: '100%', backgroundColor: colors.primarioSuave },
  contenido: { paddingTop: spacing.xl, gap: spacing.xl },
  titulo: { ...typography.titulo, fontSize: 24 },
  filaProfesor: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  datos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  dato: { alignItems: 'center', gap: 2 },
  datoValor: { fontSize: 16, fontWeight: '800', color: colors.texto },
  profesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.borde },
  profesorNombre: { fontSize: 15, fontWeight: '700', color: colors.texto },
  meta: { fontSize: 13, color: colors.textoSuave },
  horarios: {
  gap: spacing.sm,
  marginTop: spacing.md,
},
  horario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarioSuave,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  horarioActivo: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  horarioDeshabilitado: {
    opacity: 0.5,
  },
  horarioPresionado: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  horarioTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.texto,
  },
  horarioTextoActivo: {
    color: colors.superficie,
  },
  descripcion: { ...typography.cuerpo, color: colors.textoSuave, lineHeight: 22, marginTop: spacing.sm },
  barra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingVertical: spacing.lg,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  precio: { fontSize: 18, fontWeight: '800', color: colors.primario },
  boton: {
    minWidth: 132,
    minHeight: 48,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  }
  
});