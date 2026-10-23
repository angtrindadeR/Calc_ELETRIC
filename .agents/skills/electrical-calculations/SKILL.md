---
name: electrical-calculations
description: Implementar cálculos elétricos residenciais com rastreabilidade e sem inventar regras da NBR 5410.
---
Leia AGENTS.md e docs/technical-references.md.
Defina entradas, unidades, equações, hipóteses e limites antes de implementar funções puras.
Diferencie resultado matemático de validação normativa. Nunca atribua uma equação genérica a uma cláusula normativa não conferida.
Para usar regra da ABNT NBR 5410, obtenha uma fonte autorizada, confira edição, emendas, cláusula/tabela e condições de aplicação, e registre a conferência. Na ausência disso, marque a validação como pendente e não invente valores.
Não recomende seção de condutor, proteção ou dimensionamento aprovado sem todos os dados e regras verificadas.
Na v0.1 somente corrente por potência ativa e fator de potência comum ao circuito: monofásico I=P/(U·FP), trifásico equilibrado I=P/(√3·U_linha·FP).
Exiba memória, hipóteses e unidades; não aplique fatores de demanda presumidos. Não agregue correntes de fases/circuitos distintos.
Teste valores normais, limites, entradas não finitas, unidades e erros.
