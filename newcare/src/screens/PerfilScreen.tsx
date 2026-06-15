import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AppColors } from "../../constants/theme";
import { AppScrollView } from "../components/AppScrollView";
import { Botao } from "../components/Botao";
import { BrandHeader } from "../components/BrandHeader";
import { useApp } from "../context/AppContext";
import { obterAvatarPorNivel } from "../data/avatarMap";
import { RootStackParamList } from "../routes/types";
import { StatusMissao } from "../types";

export function PerfilScreen() {
  const { colors, logout, missoes, mostrarAlerta, resetarPlano, usuario } = useApp();
  const styles = criarStyles(colors);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const avatarAtual = obterAvatarPorNivel(usuario?.nivel ?? 1);
  const concluidas = missoes.filter((missao) => missao.status === StatusMissao.Concluida).length;
  const pendentes = missoes.length - concluidas;
  const progressoMeta = Math.min(
    100,
    (concluidas / Math.max(1, usuario?.preferencias.metaDiaria ?? 3)) * 100
  );

  const estatisticas = [
    { valor: usuario?.xp ?? 0, label: "XP", icone: "star-outline" as const },
    { valor: usuario?.moedas ?? 0, label: "Moedas", icone: "cash-outline" as const },
    { valor: usuario?.streak ?? 0, label: "Sequência", icone: "flame-outline" as const },
    { valor: usuario?.diasPerfeitos ?? 0, label: "Dias perfeitos", icone: "sunny-outline" as const },
  ];

  return (
    <AppScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BrandHeader compact align="left" />

      <Pressable style={styles.header} onPress={() => navigation.navigate("AvatarMap")}>
        <View style={styles.avatar}>
          <Image source={avatarAtual.imagem} style={styles.avatarImagem} resizeMode="contain" />
          <View style={styles.nivelBadge}>
            <Text style={styles.nivelBadgeTexto}>{usuario?.nivel ?? 1}</Text>
          </View>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.nome}>{usuario?.nome}</Text>
          <Text style={styles.subtitulo}>
            Nível {usuario?.nivel ?? 1} • Especialidade: {usuario?.areaDominante}
          </Text>
          <View style={styles.avatarLink}>
            <Ionicons name="color-palette-outline" size={15} color={colors.primary} />
            <Text style={styles.avatarLinkTexto}>Personalizar AvatarMAP</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={21} color={colors.primary} />
      </Pressable>

      <View style={styles.statsGrid}>
        {estatisticas.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <View style={styles.statIcone}>
              <Ionicons name={item.icone} size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValor}>{item.valor}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.cardTituloLinha}>
          <Ionicons name="clipboard-outline" size={22} color={colors.primary} />
          <Text style={styles.secaoTitulo}>Resumo das missões</Text>
        </View>
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>Pendentes</Text>
          <Text style={styles.infoValor}>{pendentes}</Text>
        </View>
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>Concluídas</Text>
          <Text style={styles.infoValor}>{concluidas}</Text>
        </View>
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>Meta diária</Text>
          <Text style={styles.infoValor}>{usuario?.preferencias.metaDiaria ?? 3} missões</Text>
        </View>
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>Conquistas</Text>
          <Text style={styles.infoValor}>{usuario?.conquistas.length ?? 0}</Text>
        </View>
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
          mostrarAlerta("sucesso", "Plano resetado", "Suas missões voltaram para pendente.");
        }}
      />
      <View style={styles.espaco} />
      <Botao titulo="Sair" onPress={logout} />
    </AppScrollView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingBottom: 32,
    paddingHorizontal: 18,
    paddingTop: 48,
  },
  header: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: "row",
    gap: 13,
    marginBottom: 16,
    padding: 14,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#FFFFFF",
    borderRadius: 40,
    borderWidth: 2,
    height: 80,
    justifyContent: "center",
    position: "relative",
    width: 80,
  },
  avatarImagem: {
    height: 72,
    width: 72,
  },
  nivelBadge: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 2,
    bottom: -2,
    height: 25,
    justifyContent: "center",
    position: "absolute",
    right: -2,
    width: 25,
  },
  nivelBadgeTexto: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  headerInfo: {
    flex: 1,
  },
  nome: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },
  subtitulo: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
    textTransform: "capitalize",
  },
  avatarLink: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 7,
  },
  avatarLinkTexto: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
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
    borderRadius: 17,
    borderWidth: 1,
    padding: 13,
    width: "48.5%",
  },
  statIcone: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 11,
    height: 36,
    justifyContent: "center",
    marginBottom: 7,
    width: 36,
  },
  statValor: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 19,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  cardTituloLinha: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 13,
  },
  secaoTitulo: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  infoLinha: {
    alignItems: "flex-start",
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingVertical: 9,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  infoValor: {
    color: colors.text,
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
  },
  itemDescricao: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  barraMeta: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 9,
    marginBottom: 10,
    marginTop: 14,
    overflow: "hidden",
  },
  barraMetaInterna: {
    backgroundColor: colors.success,
    borderRadius: 999,
    height: "100%",
    minWidth: 6,
  },
  espaco: {
    height: 12,
  },
});
