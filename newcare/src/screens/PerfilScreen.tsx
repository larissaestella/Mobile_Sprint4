import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useApp } from "../context/AppContext";
import { Botao } from "../components/Botao";
import { AppColors } from "../../constants/theme";
import { StatusMissao } from "../types";
import { BrandHeader } from "../components/BrandHeader";
import { RootStackParamList } from "../routes/types";
import { avataresIniciais } from "./EscolhaAvatarScreen";

export function PerfilScreen() {
  const { colors, logout, missoes, resetarPlano, usuario } = useApp();
  const styles = criarStyles(colors);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const avatarAtual = avataresIniciais.find((avatar) => avatar.id === usuario?.avatarId) ?? avataresIniciais[0];

  const concluidas = missoes.filter((missao) => missao.status === StatusMissao.Concluida).length;
  const pendentes = missoes.length - concluidas;
  const progressoMeta = Math.min(
    100,
    (concluidas / Math.max(1, usuario?.preferencias.metaDiaria ?? 3)) * 100
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BrandHeader compact />
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{avatarAtual.simbolo}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.nome}>{usuario?.nome}</Text>
          <Text style={styles.subtitulo}>
            Level {usuario?.nivel} • Especialidade: {usuario?.areaDominante}
          </Text>
          <Text style={styles.subtitulo}>{avatarAtual.nome} • fase atual 1</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{usuario?.xp ?? 0}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{usuario?.moedas ?? 0}</Text>
          <Text style={styles.statLabel}>Moedas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{usuario?.streak ?? 0}</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValor}>{usuario?.diasPerfeitos ?? 0}</Text>
          <Text style={styles.statLabel}>Dias perfeitos</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.secaoTitulo}>Resumo das missões</Text>
        <Text style={styles.item}>Email: {usuario?.email}</Text>
        <Text style={styles.item}>Missões pendentes: {pendentes}</Text>
        <Text style={styles.item}>Missões concluídas: {concluidas}</Text>
        <Text style={styles.item}>Meta diária: {usuario?.preferencias.metaDiaria ?? 3} missões</Text>
        <Text style={styles.item}>Conquistas: {usuario?.conquistas.length ?? 0}</Text>
        <View style={styles.barraMeta}>
          <View style={[styles.barraMetaInterna, { width: `${progressoMeta}%` }]} />
        </View>
        <Text style={styles.itemDescricao}>
          {concluidas >= (usuario?.preferencias.metaDiaria ?? 3)
            ? "Meta diária alcançada."
            : "Continue concluindo missões para bater sua meta diária."}
        </Text>
      </View>

      <Botao titulo="Configurações" variante="secundario" onPress={() => navigation.navigate("Configuracoes")} />
      <View style={styles.espaco} />
      <Botao
        titulo="Resetar plano diário"
        variante="secundario"
        onPress={() => {
          resetarPlano();
          Alert.alert("Plano resetado", "Suas missões voltaram para pendente.");
        }}
      />
      <View style={styles.espaco} />
      <Botao titulo="Sair" onPress={logout} />
    </ScrollView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 22,
    height: 74,
    justifyContent: "center",
    width: 74,
  },
  avatarTexto: {
    fontSize: 34,
  },
  headerInfo: {
    flex: 1,
  },
  nome: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitulo: {
    color: colors.muted,
    marginTop: 4,
    textTransform: "capitalize",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    width: "48%",
  },
  statValor: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },
  statLabel: {
    color: colors.muted,
    fontWeight: "700",
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  secaoTitulo: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
  },
  label: {
    color: colors.text,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: 8,
  },
  itemDescricao: {
    color: colors.muted,
    marginTop: 2,
  },
  item: {
    color: colors.text,
    fontWeight: "700",
    marginBottom: 10,
  },
  barraMeta: {
    backgroundColor: colors.background,
    borderRadius: 999,
    height: 10,
    marginBottom: 10,
    marginTop: 4,
    overflow: "hidden",
  },
  barraMetaInterna: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: "100%",
  },
  espaco: {
    height: 12,
  },
});
