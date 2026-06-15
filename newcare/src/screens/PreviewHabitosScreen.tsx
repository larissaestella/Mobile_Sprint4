import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStyledFlatListRef } from "../components/AppScrollView";
import { Botao } from "../components/Botao";
import { BrandHeader } from "../components/BrandHeader";
import { useApp } from "../context/AppContext";
import { AppColors } from "../../constants/theme";

export function PreviewHabitosScreen() {
  const { atualizarDuracaoMissao, colors, confirmarHabitos, missoes, mostrarAlerta, removerMissao } = useApp();
  const styles = criarStyles(colors);
  const flatListRef = useStyledFlatListRef();

  async function confirmar() {
    if (missoes.length === 0) {
      mostrarAlerta("erro", "Escolha pelo menos um hábito", "Mantenha uma missão para começar sua jornada.");
      return;
    }

    await confirmarHabitos();
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={styles.lista}
        data={missoes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <BrandHeader compact />
            <Text style={styles.titulo}>Pré-visualização dos hábitos</Text>
            <Text style={styles.subtitulo}>Revise as missões sugeridas, remova o que não combina e ajuste a duração.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTopo}>
              <View style={styles.cardTexto}>
                <Text style={styles.cardTitulo}>{item.titulo}</Text>
                <Text style={styles.cardDescricao}>{item.categoria} • {item.recompensaXp} XP • {item.recompensaMoedas} moedas</Text>
              </View>
              <TouchableOpacity style={styles.remover} onPress={() => removerMissao(item.id)}>
                <Text style={styles.removerTexto}>Remover</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <View style={styles.duracaoLinha}>
              <TouchableOpacity style={styles.stepper} onPress={() => atualizarDuracaoMissao(item.id, item.duracaoMinutos - 5)}>
                <Text style={styles.stepperTexto}>-</Text>
              </TouchableOpacity>
              <Text style={styles.duracao}>{item.duracaoMinutos} min</Text>
              <TouchableOpacity style={styles.stepper} onPress={() => atualizarDuracaoMissao(item.id, item.duracaoMinutos + 5)}>
                <Text style={styles.stepperTexto}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            <Botao titulo="Confirmar hábitos" onPress={confirmar} />
          </View>
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator
        persistentScrollbar={Platform.OS === "android"}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, minHeight: 0 },
  lista: { flex: 1, minHeight: 0 },
  content: { flexGrow: 1, padding: 20, paddingBottom: 26 },
  titulo: { color: colors.text, fontSize: 27, fontWeight: "900", marginTop: 12 },
  subtitulo: { color: colors.muted, fontWeight: "700", marginBottom: 18, marginTop: 6 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, marginBottom: 12, padding: 14 },
  cardTopo: { alignItems: "flex-start", flexDirection: "row", gap: 10, justifyContent: "space-between" },
  cardTexto: { flex: 1 },
  cardTitulo: { color: colors.text, fontSize: 16, fontWeight: "900" },
  cardDescricao: { color: colors.primary, fontSize: 12, fontWeight: "800", marginTop: 3, textTransform: "capitalize" },
  descricao: { color: colors.muted, fontWeight: "700", marginTop: 9 },
  remover: { backgroundColor: colors.warningSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  removerTexto: { color: colors.warning, fontSize: 12, fontWeight: "900" },
  duracaoLinha: { alignItems: "center", flexDirection: "row", gap: 14, marginTop: 14 },
  stepper: { alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 999, height: 34, justifyContent: "center", width: 34 },
  stepperTexto: { color: colors.primary, fontSize: 20, fontWeight: "900", lineHeight: 22 },
  duracao: { color: colors.text, fontSize: 16, fontWeight: "900", minWidth: 70, textAlign: "center" },
  footer: { marginTop: 8 },
});
