import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import EtiquetaNivel from './EtiquetaNivel';
import { colors, radius, spacing, typography } from '../theme';
import {formatearPrecio, CLASES} from '../data/clases';

export default function Card({ clase, onPress }){
    return (
        <Pressable
            onPress={onPress} style={style.tarjeta}
        >
            <Image source={{ uri: clase.image }} style={style.imagen} />
            <View style={style.cuerpo}>
                <EtiquetaNivel nivel={clase.nivel} />
            </View>

            <Text style={style.titulo} numberOfLines={2}>{clase.titulo}
        </Text>
        <View style={style.filaProfesor}>
          <Image source={{ uri: clase.profesor.foto }} style={style.avatar} />
          <Text style={style.profesor} numberOfLines={1}>{clase.profesor.nombre}</Text>
        </View>

        <View style={style.detalles}>
          <Text style={style.meta}>Modalidad: {clase.modalidad}</Text>
          <Text style={style.meta}>Rating: {clase.rating}</Text>
        </View>

        <View style={style.pie}>
          <Text style={style.meta}>Duración: {clase.duracion} minutos</Text>
          <Text style={style.precio}>{formatearPrecio(clase.precio)}</Text>
        </View>
      
        </Pressable>
    );
}

const style = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imagen: {
    width: '100%',
    height: 130,
    backgroundColor: colors.primarioSuave,
  },
  cuerpo: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: colors.texto },
  filaProfesor: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.borde },
  profesor: { fontSize: 13, color: colors.textoSuave, flexShrink: 1 },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  filaCentro: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 12, color: colors.textoSuave },
  punto: { color: colors.borde, marginHorizontal: 2 },
  precio: { fontSize: 14, fontWeight: '800', color: colors.primario },
});