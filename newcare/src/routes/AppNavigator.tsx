import { NavigationContainer, Theme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { AppAlert } from "../components/AppAlert";
import { LoginScreen } from "../screens/LoginScreen";
import { CadastroScreen } from "../screens/CadastroScreen";
import { PreviewHabitosScreen } from "../screens/PreviewHabitosScreen";
import { EscolhaAvatarScreen } from "../screens/EscolhaAvatarScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { HabitosScreen } from "../screens/HabitosScreen";
import { ProgressoScreen } from "../screens/ProgressoScreen";
import { PerfilScreen } from "../screens/PerfilScreen";
import { DetalheMissaoScreen } from "../screens/DetalheMissaoScreen";
import { ConfiguracoesScreen } from "../screens/ConfiguracoesScreen";
import { HidratacaoScreen } from "../screens/HidratacaoScreen";
import { AvatarMapScreen } from "../screens/AvatarMapScreen";
import { useApp } from "../context/AppContext";
import { AppColors } from "../../constants/theme";
import { MainTabParamList, RootStackParamList } from "./types";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function corEscura(hex: string) {
  const limpa = hex.replace("#", "");
  const valor = limpa.length === 3
    ? limpa.split("").map((parte) => parte + parte).join("")
    : limpa;
  const numero = Number.parseInt(valor, 16);
  const r = (numero >> 16) & 255;
  const g = (numero >> 8) & 255;
  const b = numero & 255;
  const brilho = (r * 299 + g * 587 + b * 114) / 1000;

  return brilho < 140;
}

function Tabs() {
  const { colors } = useApp();

  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 8,
          paddingTop: 7,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: "home-outline",
            Habitos: "checkbox-outline",
            Progresso: "stats-chart-outline",
            Perfil: "person-outline",
          };

          return <Ionicons name={icons[route.name]} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Início" }} />
      <Tab.Screen name="Habitos" component={HabitosScreen} options={{ title: "Missões" }} />
      <Tab.Screen name="Progresso" component={ProgressoScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { carregandoInicial, colors, usuario } = useApp();
  const styles = criarStyles(colors);
  const navigationTheme: Theme = {
    dark: corEscura(colors.background),
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
    fonts: {
      regular: { fontFamily: "System", fontWeight: "400" },
      medium: { fontFamily: "System", fontWeight: "500" },
      bold: { fontFamily: "System", fontWeight: "700" },
      heavy: { fontFamily: "System", fontWeight: "900" },
    },
  };

  if (carregandoInicial) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Preparando sua jornada...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!usuario ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
          </>
        ) : !usuario.habitosConfirmados ? (
          <Stack.Screen name="PreviewHabitos" component={PreviewHabitosScreen} />
        ) : !usuario.avatarId || !usuario.onboardingCompleto ? (
          <Stack.Screen name="EscolhaAvatar" component={EscolhaAvatarScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={Tabs} />
            <Stack.Screen name="DetalheMissao" component={DetalheMissaoScreen} />
            <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
            <Stack.Screen name="Hidratacao" component={HidratacaoScreen} />
            <Stack.Screen name="AvatarMap" component={AvatarMapScreen} />
          </>
        )}
      </Stack.Navigator>
      <AppAlert />
    </NavigationContainer>
  );
}

const criarStyles = (colors: AppColors) => StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: colors.muted,
    fontWeight: "800",
    marginTop: 12,
  },
});
