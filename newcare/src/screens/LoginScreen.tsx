import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import { AppScrollView } from "../components/AppScrollView";
import { Botao } from "../components/Botao";
import { AppColors } from "../../constants/theme";
import { RootStackParamList } from "../routes/types";

type Props = StackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { colors, login, mostrarAlerta } = useApp();
  const styles = criarStyles(colors);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [tentouEnviar, setTentouEnviar] = useState(false);

  async function entrar() {
    setTentouEnviar(true);

    if (!email.trim() || !senha.trim()) {
      mostrarAlerta("erro", "Campos obrigatórios", "Preencha o e-mail e a senha para entrar.");
      return;
    }

    try {
      setCarregando(true);
      await login(email, senha);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Tente novamente em alguns instantes.";
      mostrarAlerta("erro", "Não foi possível entrar", message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AppScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoArea}>
            <Image
              source={require("../../assets/images/MapLogo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitulo}>Evolua cuidando da sua saúde e bem-estar.</Text>

          <TextInput
            style={[styles.input, tentouEnviar && !email.trim() && styles.inputErro]}
            placeholder="Email"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {tentouEnviar && !email.trim() && <Text style={styles.erroTexto}>Informe seu e-mail</Text>}
          <TextInput
            style={[styles.input, tentouEnviar && !senha.trim() && styles.inputErro]}
            placeholder="Senha"
            placeholderTextColor={colors.muted}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          {tentouEnviar && !senha.trim() && <Text style={styles.erroTexto}>Informe sua senha</Text>}

          <Botao titulo="Entrar" onPress={entrar} carregando={carregando} />
          <View style={styles.cadastroArea}>
            <Text style={styles.cadastroTexto}>Ainda não personalizou o app?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Cadastro")}
              accessibilityRole="button"
              accessibilityLabel="Ir para o cadastro"
            >
              <Text style={styles.cadastroLink}>Criar cadastro</Text>
            </TouchableOpacity>
          </View>
        </AppScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
    minHeight: 0,
  },
  keyboardArea: {
    flex: 1,
    minHeight: 0,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.background,
  },
  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: colors.text,
  },
  logoArea: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    width: "100%",
  },
  logoImage: {
    height: 160,
    width: 260,
    maxWidth: "90%",
  },
  subtitulo: {
    color: colors.muted,
    marginTop: 0,
    marginBottom: 36,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
    shadowColor: colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  cadastroArea: {
    alignItems: "center",
    gap: 6,
    marginTop: 18,
  },
  cadastroTexto: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  cadastroLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },
  inputErro: {
    borderColor: colors.danger ?? "#D6455D",
    borderWidth: 2,
  },
  erroTexto: {
    color: colors.danger ?? "#D6455D",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    marginTop: -8,
  },
});
