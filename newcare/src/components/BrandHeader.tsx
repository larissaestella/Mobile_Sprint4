import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useApp } from "../context/AppContext";

interface Props {
  compact?: boolean;
  showBackButton?: boolean;
}

export function BrandHeader({ compact = false, showBackButton = false }: Props) {
  const navigation = useNavigation();
  const { colors } = useApp();
  const canGoBack = navigation.canGoBack();

  return (
    <View style={[styles.container, compact && styles.compact]}>
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
          accessibilityLabel="Voltar para a aba anterior"
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
      )}
      <Image
        source={require("../../assets/images/NewCareLogoHorizontal.png")}
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
    justifyContent: "center",
    marginBottom: 18,
    minHeight: 44,
  },
  compact: {
    minHeight: 36,
    marginBottom: 14,
  },
  logo: {
    height: 43,
    width: 220,
  },
  logoCompact: {
    height: 34,
    width: 175,
  },
  backButton: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
});
