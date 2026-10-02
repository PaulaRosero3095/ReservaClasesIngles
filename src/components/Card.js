import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native';
import EtiquetaNivel from './EtiquetaNivel';

export default function Card({ urlImagen, onPress, ancho }){
    return (
        <Pressable
            onPress={onPress}
        >
            <Image source={{ uri: clase.Image }} />
            <View>
                <EtiquetaNivel nivel={clase.nivel} />            
            </View>
        </Pressable>
    )
}