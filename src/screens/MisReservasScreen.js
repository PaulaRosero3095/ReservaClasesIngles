import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useUsuario from '../hooks/useUsuario';
import useReserva from '../hooks/useReserva';
import EstadoVacio from '../components/EstadoVacio';
import BotonPrimario from '../components/BotonPrimario';
import { colors, radius, spacing, typography } from '../theme';
import { formatearPrecio, CLASES } from '../data/clases';

export default function MisReservasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { estaLogueado } = useUsuario();
  const { reservas, editarReserva, eliminarReserva } = useReserva();

  // Reserva que se está editando (null = modal cerrado)
  const [editando, setEditando] = useState(null);
  // Horario elegido dentro del modal
  const [nuevoHorario, setNuevoHorario] = useState(null);

  // Horarios ocupados por OTRAS reservas (para bloquear choques al editar)
  const horariosOcupados = useMemo(() => {
    if (!editando) return new Set();
    return new Set(
      reservas
        .filter((r) => r.id !== editando.id)
        .map((r) => r.horario)
    );
  }, [reservas, editando]);

  // Clase completa desde CLASES para obtener sus horarios disponibles
  const claseDelModal = useMemo(() => {
    if (!editando) return null;
    return CLASES.find((c) => c.id === editando.claseId) ?? null;
  }, [editando]);

  // --- Estados vacíos ---
  if (!estaLogueado) {
    return (
      <View style={[styles.pantalla, { paddingTop: insets.top }]}>
        <EstadoVacio
          icono="person-outline"
          titulo="Inicia sesión"
          mensaje="Regístrate para ver y gestionar tus reservas."
          onAction={() => navigation.navigate('Perfil')}
        />
      </View>
    );
  }

  if (reservas.length === 0) {
    return (
      <View style={[styles.pantalla, { paddingTop: insets.top }]}>
        <EstadoVacio
          icono="calendar-outline"
          titulo="Sin reservas"
          mensaje="Aún no tienes reservas. ¡Explora las clases!"
          onAction={() => navigation.navigate('Clases')}
        />
      </View>
    );
  }

  // --- Acciones ---
  const abrirModal = (reserva) => {
    setEditando(reserva);
    setNuevoHorario(reserva.horario);
  };

  const cerrarModal = () => {
    setEditando(null);
    setNuevoHorario(null);
  };

  const confirmarEliminar = (reserva) => {
    Alert.alert(
      'Eliminar reserva',
      `¿Eliminar tu reserva de "${reserva.titulo}" (${reserva.horario})?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => eliminarReserva(reserva.id),
        },
      ]
    );
  };

  const guardarCambioHorario = () => {
    if (!nuevoHorario) return;
    if (nuevoHorario === editando.horario) {
      cerrarModal();
      return;
    }

    const resultado = editarReserva(editando.id, nuevoHorario);

    if (!resultado.ok) {
      const mensajes = {
        'choque-horario': 'Ya tienes otra clase reservada en ese horario.',
      };
      Alert.alert(
        'No se pudo cambiar',
        mensajes[resultado.motivo] ?? 'Intenta de nuevo.'
      );
      return;
    }

    Alert.alert('Reserva actualizada', `Nuevo horario: ${nuevoHorario}`);
    cerrarModal();
  };

  // --- Render ---
  return (
    <View style={[styles.pantalla, { paddingTop: insets.top }]}>
      <Text style={styles.encabezado}>Mis reservas</Text>

      <FlatList
        data={reservas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: spacing.lg,
          gap: spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagen }} style={styles.imagen} />
            <View style={styles.info}>
              <Text style={styles.titulo} numberOfLines={1}>
                {item.titulo}
              </Text>
              <Text style={styles.meta}>{item.profesor}</Text>
              <View style={styles.filaHorario}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={colors.primario}
                />
                <Text style={styles.horario}>{item.horario}</Text>
              </View>
              <Text style={styles.precio}>{formatearPrecio(item.precio)}</Text>
            </View>

            <View style={styles.acciones}>
              <Pressable
                onPress={() => abrirModal(item)}
                style={styles.iconoBtn}
                hitSlop={6}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={colors.primario}
                />
              </Pressable>
              <Pressable
                onPress={() => confirmarEliminar(item)}
                style={styles.iconoBtn}
                hitSlop={6}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.peligro}
                />
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Modal de edición de horario */}
      <Modal
        visible={!!editando}
        transparent
        animationType="slide"
        onRequestClose={cerrarModal}
      >
        <Pressable style={styles.modalFondo} onPress={cerrarModal}>
          <Pressable style={styles.modalCaja} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Cambiar horario</Text>
              <Pressable onPress={cerrarModal} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textoSuave} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitulo} numberOfLines={1}>
              {editando?.titulo}
            </Text>
            <Text style={styles.meta}>Profesor: {editando?.profesor}</Text>

            <Text style={styles.modalSeccion}>Horarios disponibles</Text>

            {!claseDelModal ? (
              <Text style={styles.meta}>
                No se encontró información de la clase.
              </Text>
            ) : (
              <View style={styles.listaHorarios}>
                {claseDelModal.horarios.map((horario) => {
                  const ocupado = horariosOcupados.has(horario);
                  const activo = nuevoHorario === horario;

                  return (
                    <Pressable
                      key={horario}
                      onPress={() => setNuevoHorario(horario)}
                      disabled={ocupado}
                      style={({ pressed }) => [
                        styles.opcionHorario,
                        activo && styles.opcionActiva,
                        ocupado && styles.opcionOcupada,
                        pressed && !ocupado && styles.opcionPresionada,
                      ]}
                    >
                      <Ionicons
                        name={
                          ocupado
                            ? 'close-circle'
                            : activo
                            ? 'radio-button-on'
                            : 'radio-button-off'
                        }
                        size={18}
                        color={
                          activo
                            ? colors.superficie
                            : ocupado
                            ? colors.peligro
                            : colors.primario
                        }
                      />
                      <Text
                        style={[
                          styles.opcionTexto,
                          activo && styles.opcionTextoActivo,
                          ocupado && !activo && styles.opcionTextoOcupado,
                        ]}
                      >
                        {horario}
                        {ocupado ? ' · Ocupado' : ''}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <View style={styles.modalAcciones}>
              <Pressable
                onPress={cerrarModal}
                style={[styles.modalBtn, styles.modalBtnSecundario]}
              >
                <Text style={styles.modalBtnTexto}>Cancelar</Text>
              </Pressable>

              <BotonPrimario
                texto="Guardar"
                icono="checkmark-circle-outline"
                onPress={guardarCambioHorario}
                disabled={!nuevoHorario || nuevoHorario === editando?.horario}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  encabezado: {
    ...typography.titulo,
    fontSize: 22,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    alignItems: 'center',
  },
  imagen: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.borde,
  },
  info: { flex: 1, gap: 2 },
  titulo: { fontSize: 15, fontWeight: '700', color: colors.texto },
  meta: { fontSize: 12, color: colors.textoSuave },
  filaHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  horario: { fontSize: 12, color: colors.primario, fontWeight: '600' },
  precio: { fontSize: 14, fontWeight: '800', color: colors.primario, marginTop: 2 },
  acciones: { gap: spacing.sm },
  iconoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Modal ---
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCaja: {
    backgroundColor: colors.superficie,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    padding: spacing.xl,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitulo: { ...typography.subtitulo },
  modalSubtitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.texto,
  },
  modalSeccion: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.texto,
    marginTop: spacing.sm,
  },
  listaHorarios: { gap: spacing.sm },
  opcionHorario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarioSuave,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  opcionActiva: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  opcionOcupada: {
    backgroundColor: '#FEE2E2',
    borderColor: colors.peligro,
    opacity: 0.7,
  },
  opcionPresionada: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  opcionTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.texto,
  },
  opcionTextoActivo: { color: colors.superficie },
  opcionTextoOcupado: { color: colors.peligro },

  modalAcciones: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnSecundario: {
    backgroundColor: colors.fondo,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  modalBtnTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.texto,
  },
});