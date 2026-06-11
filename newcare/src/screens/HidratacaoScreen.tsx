import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { AppColors } from "../../constants/theme";
import { Botao } from "../components/Botao";

const medidas = [250, 300, 500, 750, 1000];

export function HidratacaoScreen() {
  const { colors, hidratacao, registrarAguaBebida, selecionarMedidaAgua } = useApp();
  const styles = criarStyles(colors);
  const [peso, setPeso] = useState("70");
  const [temperatura, setTemperatura] = useState("25");
  const [umidade] = useState("62");
  const pesoKg = Number(peso.replace(",", "."));
  const temp = Number(temperatura.replace(",", "."));
  const metaMl = Number.isFinite(pesoKg) && pesoKg > 0 ? Math.round(pesoKg * 35 + Math.max(0, temp - 24) * 80) : 0;
  const restanteMl = Math.max(0, metaMl - hidratacao.consumidoMl);
  const coposRestantes = metaMl > 0 ? Math.ceil(restanteMl / hidratacao.medidaPadraoMl) : 0;
  const progresso = metaMl > 0 ? Math.min((hidratacao.consumidoMl / metaMl) * 100, 100) : 0;

  async function registrar() {
    if (metaMl <= 0) {
      Alert.alert("Informe seu peso", "O peso é necessário para calcular a meta diária.");
      return;
    }

    await registrarAguaBebida(metaMl);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Hidratação Inteligente</Text>
        <Text style={styles.subtitulo}>Detalhes do consumo de água e simulação IoT.</Text>

        <View style={styles.card}>
          <Text style={styles.valor}>{metaMl ? `${(metaMl / 1000).toFixed(2)} L` : "--"}</Text>
          <Text style={styles.label}>Meta diária</Text>
          <View style={styles.barra}><View style={[styles.barraInterna, { width: `${progresso}%` }]} /></View>
          <Text style={styles.texto}>{hidratacao.consumidoMl}/{metaMl || "--"} ml consumidos • {coposRestantes} copos restantes</Text>
        </View>

        <View style={styles.linha}>
          <TextInput style={styles.input} placeholder="Peso kg" placeholderTextColor={colors.muted} value={peso} onChangeText={setPeso} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Temperatura" placeholderTextColor={colors.muted} value={temperatura} onChangeText={setTemperatura} keyboardType="numeric" />
        </View>

        <View style={styles.grid}>
          <View style={styles.info}><Text style={styles.infoValor}>{temperatura}°C</Text><Text style={styles.infoLabel}>Temperatura</Text></View>
          <View style={styles.info}><Text style={styles.infoValor}>{umidade}%</Text><Text style={styles.infoLabel}>Umidade</Text></View>
          <View style={styles.info}><Text style={styles.infoValor}>online</Text><Text style={styles.infoLabel}>Sensor</Text></View>
          <View style={styles.info}><Text style={styles.infoValor}>agora</Text><Text style={styles.infoLabel}>Atualização</Text></View>
        </View>

        <Text style={styles.labelForte}>Medida padrão</Text>
        <View style={styles.chips}>
          {medidas.map((medida) => (
            <TouchableOpacity key={medida} style={[styles.chip, hidratacao.medidaPadraoMl === medida && styles.chipAtivo]} onPress={() => selecionarMedidaAgua(medida)}>
              <Text style={[styles.chipTexto, hidratacao.medidaPadraoMl === medida && styles.chipTextoAtivo]}>{medida >= 1000 ? `${medida / 1000} L` : `${medida} ml`}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Botao titulo="Registrar água" onPress={registrar} />
      </ScrollView>
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 20, paddingBottom: 28 },
  titulo: { color: colors.text, fontSize: 28, fontWeight: "900" },
  subtitulo: { color: colors.muted, fontWeight: "700", marginBottom: 18, marginTop: 6 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, marginBottom: 12, padding: 16 },
  valor: { color: colors.primary, fontSize: 34, fontWeight: "900" },
  label: { color: colors.muted, fontWeight: "900", marginTop: 4 },
  texto: { color: colors.muted, fontWeight: "700", marginTop: 10 },
  barra: { backgroundColor: colors.background, borderRadius: 999, height: 10, marginTop: 14, overflow: "hidden" },
  barraInterna: { backgroundColor: colors.primary, height: "100%" },
  linha: { flexDirection: "row", gap: 10, marginBottom: 12 },
  input: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, color: colors.text, flex: 1, minHeight: 48, paddingHorizontal: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  info: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 14, borderWidth: 1, padding: 12, width: "48%" },
  infoValor: { color: colors.text, fontSize: 17, fontWeight: "900" },
  infoLabel: { color: colors.muted, fontSize: 12, fontWeight: "800", marginTop: 2 },
  labelForte: { color: colors.text, fontWeight: "900", marginBottom: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 9 },
  chipAtivo: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipTexto: { color: colors.muted, fontWeight: "900" },
  chipTextoAtivo: { color: colors.primary },
});
