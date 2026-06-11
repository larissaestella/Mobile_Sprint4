import { useState } from "react";
import { Alert, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Botao } from "../components/Botao";
import { useApp } from "../context/AppContext";
import { CategoriaMissao } from "../types";
import { AppColors, Colors, PaletaAcessibilidadeId, paletasAcessibilidade } from "../../constants/theme";
import { BrandHeader } from "../components/BrandHeader";

const focos = [
  { label: "Mental", valor: CategoriaMissao.Mental, emoji: "🧠", descricao: "foco, pausa e respiração" },
  { label: "Física", valor: CategoriaMissao.Fisica, emoji: "💪", descricao: "movimento e energia" },
  { label: "Lazer", valor: CategoriaMissao.Lazer, emoji: "🎮", descricao: "descanso e prazer" },
  { label: "Sono", valor: CategoriaMissao.Sono, emoji: "😴", descricao: "rotina e recuperação" },
];

const tempos = [10, 15, 30];
const niveis = ["iniciante", "intermediario", "avancado"] as const;
const personalizacoesFuturas = [
  "Objetivos pessoais",
  "Rotina de notificações",
  "Preferências de conteúdo",
];
const etapas = ["Paleta", "Foco", "Rotina", "Resumo"];

export function OnboardingScreen() {
  const { colors, concluirOnboarding, atualizarPaletaAcessibilidade, usuario } = useApp();
  const styles = criarStyles(colors);
  const [foco, setFoco] = useState(CategoriaMissao.Mental);
  const [tempoDiario, setTempoDiario] = useState(15);
  const [nivelAtual, setNivelAtual] = useState<"iniciante" | "intermediario" | "avancado">("iniciante");
  const [carregando, setCarregando] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const paletaAtual = usuario?.preferencias.paletaAcessibilidade ?? "auroraHealth";
  const focoSelecionado = focos.find((item) => item.valor === foco) ?? focos[0];
  const paletaSelecionada = paletasAcessibilidade.find((item) => item.id === paletaAtual) ?? paletasAcessibilidade[0];
  const ultimaEtapa = etapaAtual === etapas.length - 1;

  async function escolherPaleta(paleta: PaletaAcessibilidadeId) {
    await atualizarPaletaAcessibilidade(paleta);
  }

  async function gerarPlano() {
    try {
      setCarregando(true);
      await concluirOnboarding({ foco, tempoDiario, nivelAtual });
    } catch {
      Alert.alert("Não foi possível gerar o plano", "Tente novamente em alguns instantes.");
    } finally {
      setCarregando(false);
    }
  }

  function avancar() {
    if (ultimaEtapa) {
      gerarPlano();
      return;
    }

    setEtapaAtual((atual) => Math.min(atual + 1, etapas.length - 1));
  }

  function voltar() {
    setEtapaAtual((atual) => Math.max(atual - 1, 0));
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <BrandHeader compact />
          <Text style={styles.titulo}>Personalize seu NewCare</Text>
          <Text style={styles.subtitulo}>
            Etapa {etapaAtual + 1} de {etapas.length}: {etapas[etapaAtual]}
          </Text>
          <View style={styles.progresso}>
            {etapas.map((etapa, index) => (
              <View
                key={etapa}
                style={[styles.progressoPonto, index <= etapaAtual && styles.progressoPontoAtivo]}
              />
            ))}
          </View>
        </View>

        <View style={styles.etapa}>
          {etapaAtual === 0 && (
            <View style={styles.secao}>
              <Text style={styles.label}>Escolha a paleta do app</Text>
              <View style={styles.paletaGrid}>
                {paletasAcessibilidade.map((paleta) => {
                  const amostra = Colors[paleta.id];
                  const ativa = paletaAtual === paleta.id;

                  return (
                    <TouchableOpacity
                      key={paleta.id}
                      style={[styles.paletaCard, ativa && styles.paletaCardAtiva]}
                      onPress={() => escolherPaleta(paleta.id)}
                    >
                      <View style={styles.paletaTopo}>
                        <View style={[styles.amostraCor, { backgroundColor: amostra.primary }]} />
                        <View style={[styles.amostraCor, { backgroundColor: amostra.secondary }]} />
                        <View style={[styles.amostraCor, { backgroundColor: amostra.accent }]} />
                      </View>
                      <Text style={styles.paletaNome}>{paleta.nome}</Text>
                      <Text style={styles.paletaResumo}>{paleta.resumo}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {etapaAtual === 1 && (
            <View style={styles.secao}>
              <Text style={styles.label}>Qual área deve guiar sua experiência?</Text>
              <View style={styles.grid}>
                {focos.map((item) => (
                  <TouchableOpacity
                    key={item.valor}
                    style={[styles.opcao, foco === item.valor && styles.opcaoAtiva]}
                    onPress={() => setFoco(item.valor)}
                  >
                    <Text style={styles.opcaoEmoji}>{item.emoji}</Text>
                    <Text style={styles.opcaoTexto}>{item.label}</Text>
                    <Text style={styles.opcaoDescricao}>{item.descricao}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {etapaAtual === 2 && (
            <View style={styles.secao}>
              <Text style={styles.label}>Quanto tempo você quer investir por dia?</Text>
              <View style={styles.linha}>
                {tempos.map((tempo) => (
                  <TouchableOpacity
                    key={tempo}
                    style={[styles.chip, tempoDiario === tempo && styles.chipAtivo]}
                    onPress={() => setTempoDiario(tempo)}
                  >
                    <Text style={[styles.chipTexto, tempoDiario === tempo && styles.chipTextoAtivo]}>
                      {tempo} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.blocoNivel}>
                <Text style={styles.label}>Qual seu nível atual?</Text>
                <View style={styles.linha}>
                  {niveis.map((nivel) => (
                    <TouchableOpacity
                      key={nivel}
                      style={[styles.chip, nivelAtual === nivel && styles.chipAtivo]}
                      onPress={() => setNivelAtual(nivel)}
                    >
                      <Text style={[styles.chipTexto, nivelAtual === nivel && styles.chipTextoAtivo]}>
                        {nivel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {etapaAtual === 3 && (
            <View>
              <View style={styles.cardDestaque}>
                <Text style={styles.cardDestaqueEmoji}>{focoSelecionado.emoji}</Text>
                <View style={styles.cardDestaqueInfo}>
                  <Text style={styles.cardDestaqueTitulo}>Visual {paletaSelecionada.nome}</Text>
                  <Text style={styles.cardDestaqueTexto}>
                    {focoSelecionado.label} • {tempoDiario} min • nível {nivelAtual}
                  </Text>
                </View>
              </View>

              <View style={styles.resumo}>
                <Text style={styles.resumoTitulo}>Seu plano inicial</Text>
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoLabel}>Missões</Text>
                  <Text style={styles.resumoValor}>{tempoDiario <= 10 ? 2 : tempoDiario <= 20 ? 3 : 4}</Text>
                  <Text style={[styles.resumoLabel, { marginLeft: 12 }]}>Recompensa</Text>
                  <Text style={styles.resumoValor}>XP + moedas</Text>
                </View>
              </View>

              <View style={styles.placeholderLista}>
                {personalizacoesFuturas.map((item) => (
                  <View key={item} style={styles.placeholder}>
                    <Text style={styles.placeholderTitulo}>{item}</Text>
                    <Text style={styles.placeholderTexto}>Espaço reservado para configurar depois.</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.navegacao}>
          <TouchableOpacity
            style={[styles.botaoVoltar, etapaAtual === 0 && styles.botaoVoltarDesativado]}
            onPress={voltar}
            disabled={etapaAtual === 0}
          >
            <Text style={[styles.botaoVoltarTexto, etapaAtual === 0 && styles.botaoVoltarTextoDesativado]}>
              Voltar
            </Text>
          </TouchableOpacity>
          <View style={styles.botaoAvancar}>
            <Botao
              titulo={ultimaEtapa ? "Finalizar cadastro" : "Avançar"}
              onPress={avancar}
              carregando={carregando}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  header: {
    marginBottom: 16,
  },
  marca: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  subtitulo: {
    color: colors.muted,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 8,
    fontSize: 14,
  },
  progresso: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
  },
  progressoPonto: {
    backgroundColor: colors.border,
    borderRadius: 999,
    flex: 1,
    height: 5,
  },
  progressoPontoAtivo: {
    backgroundColor: colors.primary,
  },
  etapa: {
    flex: 1,
  },
  cardDestaque: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: 14,
    flexDirection: "row",
    gap: 14,
    marginBottom: 22,
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDestaqueEmoji: {
    fontSize: 28,
  },
  cardDestaqueInfo: {
    flex: 1,
  },
  cardDestaqueTitulo: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "900",
  },
  cardDestaqueTexto: {
    color: colors.primarySoft,
    fontWeight: "700",
    marginTop: 5,
    fontSize: 13,
  },
  secao: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "800",
    color: colors.text,
    marginBottom: 8,
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  paletaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  paletaCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 104,
    paddingHorizontal: 12,
    paddingVertical: 11,
    width: "48%",
  },
  paletaCardAtiva: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  paletaTopo: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginBottom: 12,
  },
  amostraCor: {
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 22,
    width: 22,
  },
  paletaNome: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 17,
  },
  paletaResumo: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
    marginTop: 4,
  },
  opcao: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    minHeight: 112,
    padding: 12,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  opcaoAtiva: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  opcaoEmoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  opcaoTexto: {
    fontWeight: "900",
    color: colors.text,
    fontSize: 14,
  },
  opcaoDescricao: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 4,
  },
  linha: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  blocoNivel: {
    marginTop: 18,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexGrow: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipAtivo: {
    backgroundColor: colors.secondarySoft,
    borderColor: colors.secondary,
  },
  chipTexto: {
    color: colors.muted,
    fontWeight: "800",
    textTransform: "capitalize",
    fontSize: 13,
  },
  chipTextoAtivo: {
    color: colors.secondary,
  },
  resumo: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
  },
  resumoTitulo: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },
  resumoLinha: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    rowGap: 4,
  },
  resumoLabel: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 12,
  },
  resumoValor: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 13,
  },
  placeholderLista: {
    gap: 10,
  },
  placeholder: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    padding: 12,
  },
  placeholderTitulo: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900",
  },
  placeholderTexto: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  navegacao: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
  },
  botaoVoltar: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 50,
    paddingHorizontal: 18,
  },
  botaoVoltarDesativado: {
    opacity: 0.45,
  },
  botaoVoltarTexto: {
    color: colors.text,
    fontWeight: "900",
  },
  botaoVoltarTextoDesativado: {
    color: colors.muted,
  },
  botaoAvancar: {
    flex: 1,
  },
});
