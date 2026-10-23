import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
export const colors = {
  ink: "#172C3B",
  muted: "#546773",
  teal: "#006B60",
  bg: "#F3F6F5",
  border: "#D9E3DF",
};
export function Button({
  title,
  onPress,
  secondary = false,
  danger = false,
  disabled = false,
}: {
  title: string;
  onPress(): void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        danger && styles.danger,
        (pressed || disabled) && { opacity: 0.55 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.ink }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChangeText,
  numeric = false,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText(value: string): void;
  numeric?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={numeric ? "decimal-pad" : "default"}
        multiline={multiline}
        maxLength={multiline ? 2000 : numeric ? 32 : 120}
        style={[styles.input, multiline && { minHeight: 80 }]}
      />
    </View>
  );
}
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  container: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    padding: 24,
    gap: 24,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  header: { backgroundColor: "#102F32", padding: 24 },
  headerInner: {
    width: "100%",
    maxWidth: 1072,
    alignSelf: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: "#FFF", fontSize: 25, fontWeight: "800" },
  tag: { color: "#B6DED1", fontSize: 12, letterSpacing: 1 },
  eyebrow: {
    color: colors.teal,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  title: { color: colors.ink, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 23 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    gap: 14,
  },
  cardTitle: { color: colors.ink, fontSize: 20, fontWeight: "700" },
  label: { color: colors.ink, fontSize: 14, fontWeight: "600" },
  button: {
    borderRadius: 10,
    backgroundColor: colors.teal,
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "700", fontSize: 14 },
  secondary: {
    backgroundColor: "#EDF3F0",
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: { backgroundColor: "#A72D2D" },
  input: {
    borderWidth: 1,
    borderColor: "#9BAEAA",
    borderRadius: 9,
    padding: 12,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: "white",
    minHeight: 46,
  },
  warning: {
    backgroundColor: "#FFF5DC",
    borderColor: "#E7CF8B",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  warningText: { color: "#674C13", lineHeight: 21, fontSize: 14 },
  error: { color: "#A01F26", fontSize: 14, lineHeight: 22 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,30,34,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  dialog: {
    width: "100%",
    maxWidth: 520,
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    gap: 16,
  },
  metric: { color: colors.teal, fontSize: 32, fontWeight: "800" },
  divider: { height: 1, backgroundColor: colors.border },
});
