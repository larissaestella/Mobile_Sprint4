import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useApp } from "../context/AppContext";

interface Props {
  compact?: boolean;
  showBackButton?: boolean;
  align?: "left" | "center";
}

export function BrandHeader({ compact = false, showBackButton = false, align = "center" }: Props) {
  const navigation = useNavigation();
  const { colors } = useApp();
  const canGoBack = navigation.canGoBack();

  return (
    <View
      style={[
        styles.container,
        compact && styles.compact,
        align === "left" ? styles.left : styles.center,
      ]}
    >
      {showBackButton && (
        <TouchableOpacity
          style={[
            styles.backButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: canGoBack ? 1 : 0.45,
            },
          ]}
          onPress={() => canGoBack && navigation.goBack()}
          disabled={!canGoBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela anterior"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
      )}
      <Image
        source={require("../../assets/images/MapLogo.png")}
        style={[styles.logo, compact && styles.logoCompact]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
    minHeight: 44,
  },
  compact: {
    marginBottom: 12,
    minHeight: 36,
  },
  left: {
    justifyContent: "flex-start",
  },
  center: {
    justifyContent: "center",
  },
  logo: {
    height: 43,
    width: 220,
  },
  logoCompact: {
    height: 34,
    width: 65,
  },
  backButton: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
});
