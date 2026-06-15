import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppColors } from "../../constants/theme";
import { useApp } from "../context/AppContext";

export type AlertaTipo = "sucesso" | "erro" | "info" | "conquista" | "nivel";

export interface AlertaConfig {
  visivel: boolean;
  tipo: AlertaTipo;
  titulo: string;
  mensagem: string;
}

export const ALERTA_INICIAL: AlertaConfig = {
  visivel: false,
  tipo: "info",
  titulo: "",
  mensagem: "",
};

const iconesPorTipo: Record<AlertaTipo, keyof typeof Ionicons.glyphMap> = {
  sucesso: "checkmark-circle",
  erro: "alert-circle",
  info: "information-circle",
  conquista: "trophy",
  nivel: "flash",
};

export function AppAlert() {
  const { alerta, fecharAlerta, colors } = useApp();
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (alerta.visivel) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 8 }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [alerta.visivel, scaleAnim, opacityAnim]);

  if (!alerta.visivel) return null;

  const corIcone = corPorTipo(alerta.tipo, colors);
  const bgIcone = bgPorTipo(alerta.tipo, colors);

  return (
    <Modal transparent animationType="fade" visible={alerta.visivel} onRequestClose={fecharAlerta}>
      <Pressable style={styles.overlay} onPress={fecharAlerta}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border, transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          <View style={[styles.iconeContainer, { backgroundColor: bgIcone }]}>
            <Ionicons name={iconesPorTipo[alerta.tipo]} size={32} color={corIcone} />
          </View>
          <Text style={[styles.titulo, { color: colors.text }]}>{alerta.titulo}</Text>
          <Text style={[styles.mensagem, { color: colors.muted }]}>{alerta.mensagem}</Text>
          <Pressable style={[styles.botao, { backgroundColor: corIcone }]} onPress={fecharAlerta}>
            <Text style={styles.botaoTexto}>OK</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function corPorTipo(tipo: AlertaTipo, colors: AppColors): string {
  switch (tipo) {
    case "sucesso": return colors.success;
    case "erro": return colors.danger;
    case "conquista": return colors.accent;
    case "nivel": return colors.secondary;
    default: return colors.primary;
  }
}

function bgPorTipo(tipo: AlertaTipo, colors: AppColors): string {
  switch (tipo) {
    case "sucesso": return colors.successSoft;
    case "erro": return colors.warningSoft;
    case "conquista": return colors.accentSoft;
    case "nivel": return colors.secondarySoft;
    default: return colors.primarySoft;
  }
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  card: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    maxWidth: 340,
    padding: 28,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconeContainer: {
    alignItems: "center",
    borderRadius: 999,
    height: 64,
    justifyContent: "center",
    marginBottom: 16,
    width: 64,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  mensagem: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 22,
    textAlign: "center",
  },
  botao: {
    alignItems: "center",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 32,
    width: "100%",
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});
