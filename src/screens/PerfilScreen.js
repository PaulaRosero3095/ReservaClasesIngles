import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CampoTexto from '../components/CampoTexto';
import BotonPrimario from '../components/BotonPrimario';
import usePerfilForm from '../hooks/usePerfilForm';
import { colors, spacing, typography } from '../theme';

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();

  const {
    form,
    setCampo,
    errores,
    existente,
    guardando,
    textoBoton,
    verificarUsuario,
    enviar,
    reiniciar,
  } = usePerfilForm();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.pantalla}
        contentContainerStyle={[
          styles.contenido,
          {
            paddingTop: insets.top + spacing.xl,
            paddingBottom: insets.bottom + spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.encabezado}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={36} color={colors.primario} />
          </View>
          <Text style={styles.titulo}>
            {existente ? 'Mi perfil' : 'Crear cuenta'}
          </Text>
          <Text style={styles.subtitulo}>
            {existente
              ? 'Solo puedes modificar tu correo y tu celular.'
              : 'Completa tus datos para empezar a reservar clases.'}
          </Text>
        </View>

        <View style={styles.formulario}>
          <CampoTexto
            etiqueta="Nombres"
            icono="person-outline"
            placeholder="Ej: Laura Camila"
            value={form.nombres}
            onChangeText={(valor) => setCampo('nombres', valor)}
            editable={!existente}
            error={errores.nombres}
          />
          <CampoTexto
            etiqueta="Apellidos"
            icono="person-outline"
            placeholder="Ej: Gómez Pérez"
            value={form.apellidos}
            onChangeText={(valor) => setCampo('apellidos', valor)}
            editable={!existente}
            error={errores.apellidos}
          />
          <CampoTexto
            etiqueta="Correo electrónico"
            icono="mail-outline"
            placeholder="tucorreo@ejemplo.com"
            value={form.correo}
            onChangeText={(valor) => setCampo('correo', valor)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errores.correo}
          />
          <CampoTexto
            etiqueta="No. de identificación"
            icono="card-outline"
            placeholder="Ej: 1023456789"
            value={form.identificacion}
            onChangeText={(valor) => setCampo('identificacion', valor)}
            onEndEditing={verificarUsuario}
            keyboardType="numeric"
            maxLength={15}
            editable={!existente}
            error={errores.identificacion}
          />
          <CampoTexto
            etiqueta="Celular"
            icono="call-outline"
            placeholder="Ej: 3001234567"
            value={form.celular}
            onChangeText={(valor) => setCampo('celular', valor)}
            keyboardType="phone-pad"
            maxLength={10}
            error={errores.celular}
          />
        </View>

        <BotonPrimario
          texto={textoBoton}
          icono="checkmark-circle-outline"
          onPress={enviar}
          disabled={guardando}
        />

        {existente && (
          <Pressable onPress={reiniciar} hitSlop={8}>
            <Text style={styles.enlace}>¿No eres tú? Usar otra identificación</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  contenido: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  encabezado: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  titulo: {
    ...typography.titulo,
    fontSize: 22,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textoSuave,
    textAlign: 'center',
    lineHeight: 18,
  },
  formulario: {
    gap: spacing.md,
  },
  enlace: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primario,
    textAlign: 'center',
  },
});