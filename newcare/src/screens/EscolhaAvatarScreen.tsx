import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../../constants/theme";
import { AppScrollView } from "../components/AppScrollView";
import { Botao } from "../components/Botao";
import { BrandHeader } from "../components/BrandHeader";
import { useApp } from "../context/AppContext";
import { AVATAR_NIVEIS, ESSENCIAS_AVATAR } from "../data/avatarMap";

export function EscolhaAvatarScreen() {
  const { escolherAvatar, colors } = useApp();
  const styles = criarStyles(colors);
  const [selecionado, setSelecionado] = useState(ESSENCIAS_AVATAR[0].id);

  return (
    <SafeAreaView style={styles.container}>
      <AppScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <BrandHeader compact align="left" />
        <Text style={styles.titulo}>Conheça seu AvatarMAP</Text>
        <Text style={styles.subtitulo}>
          Seu mascote evolui do nível 1 ao 6 conforme você completa missões de autocuidado.
        </Text>

        <View style={styles.mascoteCard}>
          <View style={styles.mascoteDecoracaoUm} />
          <View style={styles.mascoteDecoracaoDois} />
          <View style={styles.mascoteHalo}>
            <Image source={AVATAR_NIVEIS[0].imagem} style={styles.mascoteImagem} resizeMode="contain" />
          </View>
          <View style={styles.mascoteInfo}>
            <View style={styles.pill}>
              <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              <Text style={styles.pillTexto}>AVATARMAP</Text>
            </View>
            <Text style={styles.mascoteTitulo}>Mascote base</Text>
            <Text style={styles.mascoteNivel}>Nível 1 • 0 XP</Text>
            <Text style={styles.mascoteDescricao}>Escolha uma essência para iniciar sua jornada.</Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Escolha sua essência</Text>
        <View style={styles.grid}>
          {ESSENCIAS_AVATAR.map((avatar) => {
            const ativo = selecionado === avatar.id;
            return (
              <Pressable
                key={avatar.id}
                style={[styles.card, ativo && styles.cardAtivo]}
                onPress={() => setSelecionado(avatar.id)}
              >
                <View style={[styles.icone, ativo && styles.iconeAtivo]}>
                  <Ionicons
                    name={avatar.icone as keyof typeof Ionicons.glyphMap}
                    size={28}
                    color={ativo ? "#FFFFFF" : colors.primary}
                  />
                </View>
                <Text style={styles.nome}>{avatar.nome}</Text>
                <Text style={styles.descricao}>{avatar.descricao}</Text>
                {ativo && (
                  <View style={styles.check}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Botao titulo="Começar jornada" onPress={() => escolherAvatar(selecionado)} />
        </View>
      </AppScrollView>
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scroll: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minHeight: 0,
  },
  content: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  titulo: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "900",
    marginTop: 8,
  },
  subtitulo: {
    color: colors.muted,
    fontWeight: "700",
    lineHeight: 20,
    marginBottom: 18,
    marginTop: 6,
  },
  mascoteCard: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 220,
    overflow: "hidden",
    padding: 16,
  },
  mascoteDecoracaoUm: {
    backgroundColor: colors.accentSoft,
    borderRadius: 80,
    height: 160,
    position: "absolute",
    right: -40,
    top: -35,
    width: 160,
  },
  mascoteDecoracaoDois: {
    backgroundColor: colors.surface,
    borderRadius: 60,
    bottom: -50,
    height: 120,
    left: -30,
    opacity: 0.35,
    position: "absolute",
    width: 120,
  },
  mascoteHalo: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.55)",
    borderColor: "#FFFFFF",
    borderRadius: 82,
    borderWidth: 2,
    height: 156,
    justifyContent: "center",
    width: 156,
  },
  mascoteImagem: {
    height: 146,
    width: 146,
  },
  mascoteInfo: {
    flex: 1,
  },
  pill: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 999,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  pillTexto: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  mascoteTitulo: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },
  mascoteNivel: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
    marginTop: 2,
  },
  mascoteDescricao: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 7,
  },
  secaoTitulo: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 11,
    marginTop: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 165,
    justifyContent: "center",
    padding: 13,
    position: "relative",
    width: "48%",
  },
  cardAtivo: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  icone: {
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: 17,
    height: 58,
    justifyContent: "center",
    marginBottom: 10,
    width: 58,
  },
  iconeAtivo: {
    backgroundColor: colors.primary,
  },
  nome: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  descricao: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 5,
    textAlign: "center",
  },
  check: {
    alignItems: "center",
    backgroundColor: colors.success,
    borderRadius: 999,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 8,
    width: 24,
  },
  footer: {
    marginTop: 22,
  },
});
