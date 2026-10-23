import React from "react";
import { Text, View } from "react-native";
import { Circuit, Equipment } from "../domain/model";
import { calculateCurrent, formatNumber } from "../domain/calculations";
import { styles } from "./ui";
export function CalculationCard({
  circuit,
  equipment,
}: {
  circuit: Circuit;
  equipment: Equipment[];
}) {
  try {
    const result = calculateCurrent(circuit, equipment);
    return (
      <View style={styles.card}>
        <Text style={styles.eyebrow}>MEMÓRIA DE CÁLCULO</Text>
        <View style={styles.row}>
          <View style={{ flex: 1, minWidth: 130 }}>
            <Text style={styles.subtitle}>Corrente estimada</Text>
            <Text testID="calculated-current" style={styles.metric}>
              {formatNumber(result.amps)} A
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 130 }}>
            <Text style={styles.subtitle}>Potência instalada</Text>
            <Text style={styles.cardTitle}>{formatNumber(result.watts)} W</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.label}>{result.formula}</Text>
        <Text style={styles.subtitle}>{result.substitution}</Text>
        <Text style={styles.subtitle}>
          P = Σ(potência unitária × quantidade)
          {equipment.length
            ? ` = ${equipment.map((item) => `${formatNumber(item.watts)} W × ${item.quantity}`).join(" + ")}`
            : ""}{" "}
          = {formatNumber(result.watts)} W
        </Text>
        {result.assumptions.map((item) => (
          <Text key={item} style={styles.subtitle}>
            • {item}
          </Text>
        ))}
        <Text style={styles.subtitle}>
          Referências internas: {result.reference}. Ver
          docs/technical-references.md.
        </Text>
      </View>
    );
  } catch (e) {
    return (
      <View style={styles.warning}>
        <Text accessibilityRole="alert" style={styles.error}>
          {e instanceof Error ? e.message : "Não foi possível calcular."}
        </Text>
      </View>
    );
  }
}
