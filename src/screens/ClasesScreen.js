import React, {useState, useEffect} from 'react';
import { View, Text, Image, Pressable, StyleSheet, TextInput, ScrollView, FlatList } from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import EtiquetaNivel from '../components/EtiquetaNivel';
import Card from '../components/Card';
import EstadoVacio from '../components/EstadoVacio';
import NivelChip from '../components/NivelChips';
import useResponsive from '../hooks/useResponsive';
import { colors, radius, spacing, typography } from '../theme';
import { formatearPrecio, CLASES, NIVELES } from '../data/clases';

export default function ClasesScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { columnas, paddingHorizontal } = useResponsive();
    const [nivel, setNivel] = useState();
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
        <View style={[style.pantalla, {paddingTop: insets.top + spacing.md}]}>
            <View style={style.header}>
                <Text style={typography.titulo}>Aplicacion para clases de ingles</Text>
                <Ionicons name="search" size={23} color={colors.textoSuave} />
                <TextInput
                    placeholder="Buscar por nivel"
                    value={busqueda}
                    onChangeText={setBusqueda}
                    autoCorrect={false}
                />
                {
                    busqueda.length > 0 && (
                        <Ionicons
                            name='close-circle'
                            size={25}
                            color={colors.textoSuave}
                            onPress={() => setBusqueda('')}
                        />
                    )
                }
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} justifyContent='center' alignItems='center' style={{ flexGrow: 0 }}>
                    {
                        NIVELES.map((item) => (
                            <NivelChip
                                key={item}
                                etiqueta={item}
                                activo={item === nivel}
                                onPress={() => setNivel(item)}
                            />
                        ))
                    }
                </ScrollView>
            
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
                contentContainerStyle={{ paddingHorizontal, flexGrow: 1 }}
                numColumns={columnas}
                ListEmptyComponent={
                    <EstadoVacio
                        icono='search-outline'
                        titulo='No se encontraron resultados'
                        mensaje='Intenta con otro nivel o profesor'
                        onAction={() => {
                            setNivel('Todos');
                            setBusqueda('');
                        }}
                    />
                }
            />
            </View>
    )

}

const style = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
});