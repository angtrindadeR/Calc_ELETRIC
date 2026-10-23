# Referências e limites técnicos — v0.1

## Registro de regras

| ID / versão | Relação matemática / fonte | Hipóteses e estado |
| --- | --- | --- |
| MAT-POWER-1 / 1.0 | Fonte matemática interna, v1.0: média temporal de u(t) × i(t), com u=√2 U cos(ωt), i=√2 I cos(ωt−φ), resulta em P = U_rms × I_rms × cos(φ). Neste modelo senoidal FP=cos(φ). Sem atribuição à NBR. | Monofásico; tensão eficaz nos terminais da carga. I = P/(U × FP). Não cobre harmônicos/corrente de partida. |
| MAT-POWER-3 / 1.0 | Soma da potência de três fases equilibradas e relação U_linha = √3 × U_fase: P = √3 × U_linha × I_linha × FP. Derivação algébrica a partir de MAT-POWER-1. | Trifásico equilibrado e senoidal; tensão entre fases; potência ativa total das três fases. |
| MAT-SUM / 1.0 | P_total = Σ(potência nominal ativa unitária × quantidade). Aritmética, sem regra normativa. | Todas as cargas ligadas simultaneamente; mesmo FP informado no circuito; sem diversidade ou fator de demanda. |

O FP é adimensional, maior que zero e menor ou igual a 1. Potência é em W, tensão em V e corrente em A. A UI exige que o usuário informe a tensão e o FP; não pressupõe tensões normativas nem FP típico. Um circuito sem equipamentos tem potência e corrente zero.

## ABNT NBR 5410: pendência explícita

Não foi fornecido texto autorizado da norma nem foi verificada edição vigente, emendas, cláusulas ou tabelas. **Nenhuma regra normativa foi implementada na v0.1.** As derivações matemáticas internas acima não substituem consulta a uma norma. Não foi usada nenhuma tabela de dimensionamento externa.

Antes de implementar qualquer validação, registrar fonte autorizada, edição, emendas, cláusula/tabela, condições de aplicação, responsável e data de conferência. Não inferir limites, ampacidades, seções, proteções, fatores de correção, demanda ou conformidade. O resultado atual é uma estimativa matemática, não dimensionamento aprovado.

## Fora do escopo

Queda de tensão, curto-circuito, ampacidade, temperatura, agrupamento, método de instalação, balanceamento real de fases, cargas não lineares, motores/partida, demanda, DR/DPS, aterramento e dimensionamento de cabos/disjuntores. Não some correntes de circuitos com tensões, FP ou fases diferentes para selecionar alimentadores.
