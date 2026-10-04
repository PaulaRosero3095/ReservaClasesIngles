import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, Image, ScrollView, Pressable } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useResponsive from "../hooks/useResponsive";
import {colors, radius, spacing, typography} from '../theme';
import {formatearPrecio} from '../data/clases';
import EtiquetaNivel from "../components/EtiquetaNivel";

export default function DetalleClaseScreen({route, navigation}) {
    // Obtiene la clase seleccionada y adapta el diseño a la pantalla del dispositivo.
    const insets = useSafeAreaInsets();
    const {clase} = route.params;
    const {paddingHorizontal, esTablet} = useResponsive();

  // Guarda si el usuario tiene una reserva activa para esta clase.
  const [reservada, setReservada] = useState(false);
  // Al reservar, se descuenta temporalmente un cupo de la cantidad disponible.
  const cuposDisponibles = clase.cupos - (reservada ? 1 : 0);

  // Reserva la clase o solicita confirmación antes de cancelar la reserva.
  const cambiarReserva = () => {
    if (reservada) {
      Alert.alert('Cancelar reserva', '¿Quieres cancelar tu reserva?', [
        { text: 'No', style: 'cancelar' },
        { text: 'Cancelar reserva', style: 'destructive', onPress: () => setReservada(false) },
      ]);
      return;
    }

    if (cuposDisponibles === 0) {
      Alert.alert('Clase llena', 'No quedan cupos disponibles para esta clase.');
      return;
    }

    setReservada(true);
    Alert.alert('Reserva confirmada', 'Tu reserva se ha realizado correctamente.');
  };

    return (
    <View style={style.pantalla}>
          {/* Contenido desplazable con la información completa de la clase. */}
            <ScrollView
        contentContainerStyle={{paddingBottom: 140 + insets.bottom}}
                showsVerticalScrollIndicator={false}
           >
            <Image source={{uri: clase.imagen}}
                resizeMode="cover"
                style={[style.portada, {height: esTablet ? 300 : 220}]} 
            />

          {/* Encabezado, profesor, cupos, horarios y descripción de la clase. */}
      <View style={[style.contenido, {paddingHorizontal}]}> 
        <EtiquetaNivel nivel={clase.nivel} />
        <Text style={style.titulo}>{clase.titulo}</Text>

        <View style={style.filaProfesor}>
          <Image source={{uri: clase.profesor.foto}} style={style.avatar} />
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

        <View>
          <Text style={typography.subtitulo}>Horarios</Text>
          <View style={style.horarios}>
            {clase.horarios.map((horario) => (
              <View key={horario} style={style.horario}>
                <Ionicons name="calendar-outline" size={16} color={colors.primario} />
                <Text style={style.horarioTexto}>{horario}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <Text style={typography.subtitulo}>Sobre esta clase</Text>
          <Text style={style.descripcion}>{clase.descripcion}</Text>
        </View>
      </View>
            </ScrollView>

      <View style={[style.barra, {paddingBottom: insets.bottom + spacing.lg}]}>
        <View>
          <Text style={style.meta}>Precio por clase</Text>
          <Text style={style.precio}>{formatearPrecio(clase.precio)}</Text>
        </View>
        <Pressable
          onPress={cambiarReserva}
          disabled={!reservada && cuposDisponibles === 0}
          style={({pressed}) => [
            style.boton,
            reservada ? style.botonCancelar : style.botonReservar,
            !reservada && cuposDisponibles === 0 && style.botonDeshabilitado,
            pressed && style.botonPresionado,
          ]}
        >
          <Ionicons
            name={reservada ? 'close-circle-outline' : 'checkmark-circle-outline'}
            size={20}
            color={colors.superficie}
          />
          <Text style={style.botonTexto}>
            {reservada ? 'Cancelar' : cuposDisponibles === 0 ? 'Sin cupos' : 'Reservar'}
          </Text>
        </Pressable>
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
  horarios: { gap: spacing.sm, marginTop: spacing.md },
  horario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarioSuave,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  horarioTexto: { fontSize: 14, fontWeight: '600', color: colors.texto },
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
  },
  botonReservar: { backgroundColor: colors.primario },
  botonCancelar: { backgroundColor: colors.peligro },
  botonDeshabilitado: { backgroundColor: colors.textoSuave },
  botonPresionado: { opacity: 0.8 },
  botonTexto: { color: colors.superficie, fontSize: 15, fontWeight: '700' },
});