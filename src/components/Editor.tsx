import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button, Field, styles } from "./ui";
export type EditorConfig = {
  kind: "project" | "circuit" | "equipment";
  id: string;
  values: Record<string, string>;
};
export function Editor({
  config,
  busy,
  saveError,
  onClose,
  onSave,
}: {
  config: EditorConfig;
  busy: boolean;
  saveError: string;
  onClose(): void;
  onSave(values: Record<string, string>): Promise<boolean>;
}) {
  const [values, setValues] = useState(config.values);
  const [error, setError] = useState("");
  const set = (key: string) => (value: string) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  const field = (
    key: string,
    label: string,
    numeric = false,
    multiline = false,
  ) => (
    <Field
      label={label}
      value={values[key] ?? ""}
      onChangeText={set(key)}
      numeric={numeric}
      multiline={multiline}
    />
  );
  async function submit() {
    setError("");
    try {
      if (await onSave(values)) onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Confira os dados informados.");
    }
  }
  return (
    <Modal
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!busy) onClose();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <View accessibilityViewIsModal style={styles.dialog}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 18 }}
          >
            <Text accessibilityRole="header" style={styles.cardTitle}>
              {config.id ? "Editar" : "Novo"}{" "}
              {config.kind === "project"
                ? "projeto"
                : config.kind === "circuit"
                  ? "circuito"
                  : "equipamento"}
            </Text>
            {field("name", "Nome")}
            {config.kind === "project" &&
              field("description", "Descrição (opcional)", false, true)}
            {config.kind === "circuit" && (
              <>
                <Text style={styles.label}>Sistema de alimentação</Text>
                <View style={styles.row}>
                  <Button
                    title="Monofásico"
                    secondary={values.phase !== "single"}
                    onPress={() => set("phase")("single")}
                  />
                  <Button
                    title="Trifásico equilibrado"
                    secondary={values.phase !== "three"}
                    onPress={() => set("phase")("three")}
                  />
                </View>
                {field(
                  "voltage",
                  values.phase === "three"
                    ? "Tensão entre fases (V)"
                    : "Tensão da carga (V)",
                  true,
                )}
                {field("powerFactor", "Fator de potência (0 < FP ≤ 1)", true)}
                <Text style={styles.subtitle}>
                  Informe o FP comum às cargas. No trifásico, informe cargas
                  equilibradas e potência total das três fases. Nenhum valor
                  normativo é presumido.
                </Text>
              </>
            )}
            {config.kind === "equipment" && (
              <>
                {field("watts", "Potência ativa unitária (W)", true)}
                {field("quantity", "Quantidade", true)}
                <Text style={styles.subtitle}>
                  Use potência elétrica ativa de entrada, em W; não VA nem
                  potência mecânica. Todas as unidades serão consideradas
                  ligadas.
                </Text>
              </>
            )}
            {!!(error || saveError) && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error || saveError}
              </Text>
            )}
            <View style={styles.row}>
              <Button
                title={busy ? "Salvando…" : "Salvar"}
                disabled={busy}
                onPress={() => {
                  void submit();
                }}
              />
              <Button
                title="Cancelar"
                secondary
                disabled={busy}
                onPress={onClose}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
