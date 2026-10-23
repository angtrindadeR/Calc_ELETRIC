import {
  Circuit,
  Equipment,
  finite,
  validateCircuit,
  validateEquipment,
} from "./model";
export const RULE_VERSION = "MAT-POWER-1/1.0; MAT-POWER-3/1.0; MAT-SUM/1.0";
export type Calculation = {
  watts: number;
  amps: number;
  formula: string;
  substitution: string;
  assumptions: string[];
  reference: string;
};
export const formatNumber = (value: number): string =>
  value.toLocaleString("pt-BR", { maximumFractionDigits: 4 });
export function calculateCurrent(
  circuit: Circuit,
  equipment: Equipment[],
): Calculation {
  validateCircuit(circuit);
  let watts = 0;
  for (const item of equipment) {
    validateEquipment(item);
    if (item.circuitId !== circuit.id)
      throw new Error("Equipamento não pertence ao circuito.");
    watts += item.watts * item.quantity;
    finite(watts, "Potência acumulada", true);
  }
  const multiplier = circuit.phase === "three" ? Math.sqrt(3) : 1;
  const denominator = multiplier * circuit.voltage * circuit.powerFactor;
  finite(denominator, "Produto da tensão pelo fator de potência");
  const amps = finite(watts / denominator, "Corrente calculada", true);
  if (watts > 0 && amps === 0)
    throw new Error("Valores fora da precisão numérica suportada.");
  const factor = circuit.phase === "three" ? "√3 × " : "";
  return {
    watts,
    amps,
    formula:
      circuit.phase === "three"
        ? "I = P / (√3 × U_linha × FP)"
        : "I = P / (U × FP)",
    substitution: `I = ${formatNumber(watts)} W / (${factor}${formatNumber(circuit.voltage)} V × ${formatNumber(circuit.powerFactor)}) = ${formatNumber(amps)} A`,
    assumptions: [
      "Todas as cargas simultâneas; sem fator de demanda.",
      "Mesmo fator de potência para todas as cargas; regime senoidal.",
      circuit.phase === "three"
        ? "Três fases equilibradas; tensão entre fases; potência total das três fases."
        : "Tensão eficaz nos terminais da carga monofásica.",
      "Estimativa matemática; não constitui dimensionamento aprovado.",
    ],
    reference: RULE_VERSION,
  };
}
