import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EtiquetaNivel({nivel}) { 
    return (
        <View style={styles.contenedor}>
            <Text style={styles.texto}>{nivel}</Text>
        </View>
         
    )
}

const styles = StyleSheet.create({
    contenedor: {
        paddingVertical: 3,
        paddingHorizontal: 2,
        borderRadius: full,
        borderWidth: 1,

    },
    texto: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3}


})