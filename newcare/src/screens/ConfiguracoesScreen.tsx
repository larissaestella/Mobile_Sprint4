import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Botao } from "../components/Botao";
import { BrandHeader } from "../components/BrandHeader";
import { useApp } from "../context/AppContext";
import { CategoriaMissao } from "../types";
import { AppColors, Colors, PaletaAcessibilidadeId, paletasAcessibilidade } from "../../constants/theme";

const areas = [CategoriaMissao.Mental, CategoriaMissao.Fisica, CategoriaMissao.Lazer, CategoriaMissao.Sono];
const tempos = [10, 15, 30];

export function ConfiguracoesScreen() {
  const { atualizarPaletaAcessibilidade, atualizarPerfil, colors, logout, usuario } = useApp();
  const styles = criarStyles(colors);
  const [nome, setNome] = useState(usuario?.nome ?? "");
  const [email, setEmail] = useState(usuario?.email ?? "");
  const [senha, setSenha] = useState("");
  const [areaDominante, setAreaDominante] = useState(usuario?.areaDominante ?? CategoriaMissao.Mental);
  const [tempoDiario, setTempoDiario] = useState(usuario?.perfil?.tempoDiario ?? 15);
  const [metaDiaria, setMetaDiaria] = useState(String(usuario?.preferencias.metaDiaria ?? 3));
  const [notificacoes, setNotificacoes] = useState(usuario?.preferencias.notificacoes ?? true);
  const [lembreteHorario, setLembreteHorario] = useState(usuario?.preferencias.lembreteHorario ?? "08:00");
  const [paleta, setPaleta] = useState(usuario?.preferencias.paletaAcessibilidade ?? "auroraHealth");

  useEffect(() => {
    if (!usuario) return;
    setPaleta(usuario.preferencias.paletaAcessibilidade);
  }, [usuario]);

  async function selecionarPaleta(paletaAcessibilidade: PaletaAcessibilidadeId) {
    setPaleta(paletaAcessibilidade);
    await atualizarPaletaAcessibilidade(paletaAcessibilidade);
  }

  async function salvar() {
    const meta = Number(metaDiaria);
    if (!nome.trim() || !email.includes("@")) {
      Alert.alert("Dados inválidos", "Informe nome e e-mail válidos.");
      return;
    }

    if (!Number.isInteger(meta) || meta < 1 || meta > 12) {
      Alert.alert("Meta inválida", "Use uma meta entre 1 e 12 missões.");
      return;
    }

    await atualizarPerfil({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      areaDominante,
      tempoDiario,
      preferencias: {
        notificacoes,
        lembreteHorario,
        metaDiaria: meta,
        paletaAcessibilidade: paleta,
      },
    });
    Alert.alert("Configurações salvas", senha ? "Senha registrada para alteração futura." : "Preferências atualizadas.");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerFixo}>
        <BrandHeader compact showBackButton />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Configurações</Text>
        <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={colors.muted} value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={colors.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Nova senha" placeholderTextColor={colors.muted} value={senha} onChangeText={setSenha} secureTextEntry />

        <Text style={styles.label}>Cor de acessibilidade</Text>
        <View style={styles.paletasGrid}>
          {paletasAcessibilidade.map((item) => {
            const ativa = paleta === item.id;
            const amostra = Colors[item.id];

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.paletaBotao, ativa && styles.paletaBotaoAtivo]}
                onPress={() => selecionarPaleta(item.id)}
              >
                <View style={styles.paletaTopo}>
                  <View style={[styles.amostraCor, { backgroundColor: amostra.primary }]} />
                  <View style={[styles.amostraCor, { backgroundColor: amostra.secondary }]} />
                  <View style={[styles.amostraCor, { backgroundColor: amostra.accent }]} />
                </View>
                <Text style={styles.paletaNome}>{item.nome}</Text>
                <Text style={styles.paletaResumo}>{ativa ? "Ativo" : item.resumo}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Área dominante</Text>
        <View style={styles.chips}>
          {areas.map((area) => (
            <TouchableOpacity key={area} style={[styles.chip, areaDominante === area && styles.chipAtivo]} onPress={() => setAreaDominante(area)}>
              <Text style={[styles.chipTexto, areaDominante === area && styles.chipTextoAtivo]}>{area}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Tempo diário de missões</Text>
        <View style={styles.chips}>
          {tempos.map((tempo) => (
            <TouchableOpacity key={tempo} style={[styles.chip, tempoDiario === tempo && styles.chipAtivo]} onPress={() => setTempoDiario(tempo)}>
              <Text style={[styles.chipTexto, tempoDiario === tempo && styles.chipTextoAtivo]}>{tempo} min</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Meta diária</Text>
        <TextInput style={styles.input} placeholder="3" placeholderTextColor={colors.muted} value={metaDiaria} onChangeText={setMetaDiaria} keyboardType="numeric" />

        <View style={styles.switchLinha}>
          <View>
            <Text style={styles.itemTitulo}>Notificações</Text>
            <Text style={styles.itemTexto}>Ativar lembretes de missões</Text>
          </View>
          <Switch value={notificacoes} onValueChange={setNotificacoes} />
        </View>

        <Text style={styles.label}>Horário dos lembretes</Text>
        <TextInput style={styles.input} placeholder="08:00" placeholderTextColor={colors.muted} value={lembreteHorario} onChangeText={setLembreteHorario} />

        <Botao titulo="Salvar configurações" onPress={salvar} />
        <View style={styles.espaco} />
        <Botao titulo="Sair da conta" variante="secundario" onPress={logout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  headerFixo: { backgroundColor: colors.background, borderBottomColor: colors.border, borderBottomWidth: 1, paddingHorizontal: 20, paddingTop: 10 },
  content: { gap: 10, padding: 20, paddingBottom: 28, paddingTop: 16 },
  titulo: { color: colors.text, fontSize: 28, fontWeight: "900", marginBottom: 8 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.text, minHeight: 50, paddingHorizontal: 14 },
  label: { color: colors.text, fontWeight: "900", marginTop: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  chipAtivo: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipTexto: { color: colors.muted, fontWeight: "800", textTransform: "capitalize" },
  chipTextoAtivo: { color: colors.primary },
  paletasGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" },
  paletaBotao: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, minHeight: 112, padding: 12, width: "48%" },
  paletaBotaoAtivo: { backgroundColor: colors.primarySoft, borderColor: colors.primary, borderWidth: 2 },
  paletaTopo: { flexDirection: "row", gap: 6, marginBottom: 10 },
  amostraCor: { borderColor: colors.border, borderRadius: 999, borderWidth: 1, height: 20, width: 20 },
  paletaNome: { color: colors.text, fontSize: 14, fontWeight: "900", lineHeight: 17 },
  paletaResumo: { color: colors.primary, fontSize: 12, fontWeight: "800", marginTop: 4 },
  switchLinha: { alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", padding: 14 },
  itemTitulo: { color: colors.text, fontWeight: "900" },
  itemTexto: { color: colors.muted, marginTop: 2 },
  espaco: { height: 2 },
});
