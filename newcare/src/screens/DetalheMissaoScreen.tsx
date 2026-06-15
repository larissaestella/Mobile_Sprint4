import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppScrollView } from "../components/AppScrollView";
import { Botao } from "../components/Botao";
import { useApp } from "../context/AppContext";
import { StatusMissao } from "../types";
import { AppColors } from "../../constants/theme";
import { RootStackParamList } from "../routes/types";

type Props = StackScreenProps<RootStackParamList, "DetalheMissao">;

export function DetalheMissaoScreen({ navigation, route }: Props) {
  const { colors, completarMissao, missoes, mostrarAlerta } = useApp();
  const styles = criarStyles(colors);
  const missao = missoes.find((item) => item.id === route.params.missaoId);

  if (!missao) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.titulo}>Missão não encontrada</Text>
        <Botao titulo="Voltar" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const concluida = missao.status === StatusMissao.Concluida;

  function concluir() {
    if (!missao) return;
    completarMissao(missao.id);
    mostrarAlerta("sucesso", "Missão concluída", `Você ganhou ${missao.recompensaXp} XP e ${missao.recompensaMoedas} moedas.`);
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScrollView contentContainerStyle={styles.content}>
        <Text style={styles.categoria}>{missao.categoria}</Text>
        <Text style={styles.titulo}>{missao.titulo}</Text>
        <Text style={styles.descricao}>{missao.descricao}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Duração</Text>
          <Text style={styles.valor}>{missao.duracaoMinutos} minutos</Text>
          <Text style={styles.label}>Recompensa</Text>
          <Text style={styles.valor}>{missao.recompensaXp} XP • {missao.recompensaMoedas} moedas</Text>
          <Text style={styles.label}>Timer</Text>
          <Text style={styles.timer}>{String(missao.duracaoMinutos).padStart(2, "0")}:00</Text>
        </View>

        <View style={styles.footer}>
          <Botao titulo={concluida ? "Missão concluída" : "Concluir missão"} onPress={concluir} carregando={false} />
          <View style={styles.espaco} />
          <TouchableOpacity style={styles.botaoVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={18} color={colors.text} />
            <Text style={styles.botaoVoltarTexto}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </AppScrollView>
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1, minHeight: 0 },
  content: { flexGrow: 1, padding: 20 },
  categoria: { color: colors.primary, fontWeight: "900", textTransform: "capitalize" },
  titulo: { color: colors.text, fontSize: 30, fontWeight: "900", marginTop: 8 },
  descricao: { color: colors.muted, fontSize: 16, fontWeight: "700", lineHeight: 23, marginTop: 10 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, marginTop: 22, padding: 16 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "900", marginTop: 10, textTransform: "uppercase" },
  valor: { color: colors.text, fontSize: 17, fontWeight: "900", marginTop: 4 },
  timer: { color: colors.primary, fontSize: 42, fontWeight: "900", marginTop: 6 },
  footer: { marginTop: "auto" },
  espaco: { height: 12 },
  botaoVoltar: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: "row", gap: 4, justifyContent: "center", minHeight: 50, paddingHorizontal: 16 },
  botaoVoltarTexto: { color: colors.text, fontWeight: "900" },
});
