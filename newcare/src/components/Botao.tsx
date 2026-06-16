import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { AppColors } from "../../constants/theme";
import { useApp } from "../context/AppContext";

interface Props {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  compact?: boolean;
  disabled?: boolean;
  variante?: "primario" | "secundario";
}

export function Botao({ titulo, onPress, carregando = false, compact = false, disabled = false, variante = "primario" }: Props) {
  const { colors } = useApp();
  const styles = criarStyles(colors);
  const bloqueado = carregando || disabled;

  return (
    <TouchableOpacity
      style={[styles.btn, variante === "secundario" && styles.secundario, compact && styles.compact, bloqueado && styles.bloqueado]}
      onPress={onPress}
      disabled={bloqueado}
    >
      {carregando ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.text}>{titulo}</Text>}
    </TouchableOpacity>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  secundario: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
  },
  bloqueado: {
    opacity: 0.45,
  },
  compact: {
    padding: 10,
    minHeight: 40,
    borderRadius: 10,
  },
  text: {
    color: colors.surface,
    textAlign: "center",
    fontWeight: "800",
  },
});
