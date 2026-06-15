import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { AppColors } from "../../constants/theme";
import { useStyledFlatListRef } from "../components/AppScrollView";
import { AvatarMapCard } from "../components/AvatarMapCard";
import { BrandHeader } from "../components/BrandHeader";
import { CardMissao } from "../components/CardMissao";
import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../routes/types";
import { StatusMissao } from "../types";

export function HomeScreen() {
  const {
    colors,
    usuario,
    missoes,
    hidratacao,
    completarMissao,
    registrarAguaBebida,
    mostrarAlerta,
  } = useApp();
  const styles = criarStyles(colors);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const flatListRef = useStyledFlatListRef();
  const concluidas = missoes.filter((m) => m.status === StatusMissao.Concluida).length;
  const pendentes = missoes.filter((m) => m.status === StatusMissao.Pendente);
  const percentualHoje = Math.round((concluidas / Math.max(1, missoes.length)) * 100);
  const metaAguaMl = hidratacao.metaMl ?? 0;
  const progressoAgua = metaAguaMl > 0
    ? Math.min((hidratacao.consumidoMl / metaAguaMl) * 100, 100)
    : 0;
  const medidasRestantes = metaAguaMl > 0
    ? Math.max(0, Math.ceil((metaAguaMl - hidratacao.consumidoMl) / hidratacao.medidaPadraoMl))
    : 0;

  function concluirMissao(id: string) {
    const missao = missoes.find((item) => item.id === id);
    completarMissao(id);
    if (missao?.status === StatusMissao.Pendente) {
      mostrarAlerta("sucesso", "Missão concluída", `Você ganhou ${missao.recompensaXp} XP.`);
    }
  }

  async function registrarConsumoAgua() {
    if (metaAguaMl <= 0 || !usuario) return;

    const atualizada = await registrarAguaBebida(metaAguaMl);
    if (!hidratacao.metaBatida && atualizada.metaBatida) {
      mostrarAlerta("sucesso", "Meta de água concluída", "Você ganhou 25 XP e 5 moedas.");
    }
  }

  const cabecalho = (
    <>
      <View style={styles.topoMarca}>
        <BrandHeader compact align="left" />
        <Pressable style={styles.notificacao} accessibilityRole="button" accessibilityLabel="Notificações">
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.headerInfo}>
        <Text style={styles.saudacao}>Olá, {usuario?.nome}</Text>
        <Text style={styles.subtitulo}>
          Nível {usuario?.nivel ?? 1} • Especialidade: {usuario?.areaDominante}
        </Text>
      </View>

      <AvatarMapCard
        onPress={() => navigation.navigate("AvatarMap")}
        mostrarEvolucao
      />

      <View style={styles.resumoGrid}>
        <View style={styles.resumoCard}>
          <View style={styles.resumoIcone}>
            <Ionicons name="today-outline" size={22} color={colors.primary} />
          </View>
          <Text style={styles.resumoValor}>{percentualHoje}%</Text>
          <Text style={styles.resumoLabel}>Hoje</Text>
        </View>
        <View style={styles.resumoCard}>
          <View style={styles.resumoIcone}>
            <Ionicons name="flame-outline" size={22} color={colors.success} />
          </View>
          <Text style={styles.resumoValor}>{usuario?.streak ?? 0}</Text>
          <Text style={styles.resumoLabel}>Sequência</Text>
        </View>
        <View style={styles.resumoCard}>
          <View style={styles.resumoIcone}>
            <Ionicons name="clipboard-outline" size={22} color={colors.accent} />
          </View>
          <Text style={styles.resumoValor}>{pendentes.length}</Text>
          <Text style={styles.resumoLabel}>Pendentes</Text>
        </View>
      </View>

      <View style={styles.hidratacaoCard}>
        <View style={styles.hidratacaoTopo}>
          <View style={styles.hidratacaoIdentidade}>
            <View style={styles.aguaIcone}>
              <Ionicons name="water-outline" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.hidratacaoRotulo}>Hidratação inteligente</Text>
              <Text style={styles.hidratacaoTitulo}>
                {metaAguaMl > 0 ? `${hidratacao.consumidoMl} de ${metaAguaMl} ml` : "Calcule sua meta diária"}
              </Text>
            </View>
          </View>
          <View style={[styles.statusPill, metaAguaMl > 0 ? styles.statusOnline : styles.statusOffline]}>
            <Ionicons
              name={metaAguaMl > 0 ? "checkmark-circle-outline" : "time-outline"}
              size={14}
              color={metaAguaMl > 0 ? colors.success : colors.warning}
            />
            <Text style={styles.statusTexto}>{metaAguaMl > 0 ? "Ativa" : "Pendente"}</Text>
          </View>
        </View>

        <View style={styles.barraAgua}>
          <View style={[styles.barraAguaInterna, { width: `${progressoAgua}%` }]} />
        </View>

        {metaAguaMl > 0 ? (
          <>
            <View style={styles.hidratacaoResumoLinha}>
              <Text style={styles.feedbackTexto}>{Math.round(progressoAgua)}% da meta</Text>
              <Text style={styles.feedbackTexto}>{medidasRestantes} porções restantes</Text>
            </View>
            <View style={styles.acoesLinha}>
              <Pressable style={styles.botaoPrimario} onPress={registrarConsumoAgua}>
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.botaoPrimarioTexto}>
                  Registrar {hidratacao.medidaPadraoMl >= 1000
                    ? `${hidratacao.medidaPadraoMl / 1000} L`
                    : `${hidratacao.medidaPadraoMl} ml`}
                </Text>
              </Pressable>
              <Pressable style={styles.botaoSecundario} onPress={() => navigation.navigate("Hidratacao")}>
                <Ionicons name="analytics-outline" size={18} color={colors.text} />
                <Text style={styles.botaoSecundarioTexto}>Detalhes</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable style={styles.botaoDetalheAgua} onPress={() => navigation.navigate("Hidratacao")}>
            <Ionicons name="calculator-outline" size={18} color={colors.primary} />
            <Text style={styles.botaoDetalheAguaTexto}>Calcular hidratação</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.linhaTitulo}>
        <View style={styles.tituloBloco}>
          <Text style={styles.tituloSecao}>Próximas missões</Text>
          <Text style={styles.descricaoSecao}>Complete tarefas para evoluir seu AvatarMAP.</Text>
        </View>
        <View style={styles.contadorPill}>
          <Text style={styles.contador}>{concluidas}/{missoes.length}</Text>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        style={styles.lista}
        data={pendentes.length > 0 ? pendentes : missoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardMissao
            missao={item}
            onPress={concluirMissao}
            onDetalhes={(missaoId) => navigation.navigate("DetalheMissao", { missaoId })}
          />
        )}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          <View style={styles.estadoVazio}>
            <Ionicons name="checkmark-done-circle-outline" size={42} color={colors.success} />
            <Text style={styles.estadoVazioTitulo}>Tudo pronto por hoje</Text>
            <Text style={styles.estadoVazioTexto}>Você concluiu todas as missões disponíveis.</Text>
          </View>
        }
        contentContainerStyle={styles.listaConteudo}
        showsVerticalScrollIndicator
        persistentScrollbar={Platform.OS === "android"}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 0,
  },
  lista: {
    flex: 1,
    minHeight: 0,
  },
  listaConteudo: {
    flexGrow: 1,
    paddingBottom: 30,
    paddingHorizontal: 18,
    paddingTop: 48,
  },
  topoMarca: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificacao: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    width: 46,
  },
  headerInfo: {
    marginBottom: 18,
    marginTop: 2,
  },
  saudacao: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitulo: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 5,
    textTransform: "capitalize",
  },
  resumoGrid: {
    flexDirection: "row",
    gap: 9,
  },
  resumoCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    minHeight: 116,
    padding: 11,
    shadowColor: colors.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  },
  resumoIcone: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 38,
    justifyContent: "center",
    marginBottom: 7,
    width: 38,
  },
  resumoValor: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  resumoLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },
  hidratacaoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
    padding: 15,
  },
  hidratacaoTopo: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  hidratacaoIdentidade: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: 10,
  },
  aguaIcone: {
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: 14,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  hidratacaoRotulo: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  hidratacaoTitulo: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 2,
  },
  statusPill: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statusOnline: {
    backgroundColor: colors.successSoft,
  },
  statusOffline: {
    backgroundColor: colors.warningSoft,
  },
  statusTexto: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  barraAgua: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    height: 9,
    marginTop: 14,
    overflow: "hidden",
  },
  barraAguaInterna: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: "100%",
    minWidth: 6,
  },
  hidratacaoResumoLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  feedbackTexto: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  acoesLinha: {
    flexDirection: "row",
    gap: 9,
    marginTop: 13,
  },
  botaoPrimario: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    flex: 1.35,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 10,
  },
  botaoPrimarioTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  botaoSecundario: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    flex: 0.85,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 10,
  },
  botaoSecundarioTexto: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "900",
  },
  botaoDetalheAgua: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    marginTop: 13,
    minHeight: 44,
  },
  botaoDetalheAguaTexto: {
    color: colors.primary,
    fontWeight: "900",
  },
  linhaTitulo: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 26,
  },
  tituloBloco: {
    flex: 1,
    paddingRight: 10,
  },
  tituloSecao: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
  },
  descricaoSecao: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },
  contadorPill: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  contador: {
    color: colors.primary,
    fontWeight: "900",
  },
  estadoVazio: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
  },
  estadoVazioTitulo: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: 8,
  },
  estadoVazioTexto: {
    color: colors.muted,
    marginTop: 4,
    textAlign: "center",
  },
});
