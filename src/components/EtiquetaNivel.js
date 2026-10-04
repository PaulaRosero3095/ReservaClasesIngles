import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

export default function EtiquetaNivel({nivel, profesor, horarios, precio}) { 
    return (
        <View style={[styles.contenedor, { backgroundColor: colors.fondo }]}>
        <Text style={styles.texto}>{nivel}</Text>
      </View>
        
         
    )
}

const styles = StyleSheet.create({
    contenedor: {
        alignSelf: 'auto',
        paddingVertical: 1,
        paddingHorizontal: spacing.sm,
        borderWidth: 1,

    },
    texto: { fontSize: 15, fontWeight: '400', letterSpacing: 0.5}


})