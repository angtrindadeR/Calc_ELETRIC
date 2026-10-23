# AGENTS.md — EletriCalc

## Objetivo
Desenvolver uma calculadora profissional para eletricistas
brasileiros, com foco em instalações residenciais de baixa tensão.

## Tecnologias
- React Native, Expo e TypeScript.
- Biblioteca de cálculos independente da interface.
- Persistência local e funcionamento offline.
- Código modular, testável e documentado.

## Regras obrigatórias
1. Não inventar requisitos ou valores de tabelas normativas.
2. Manter registro da fonte e versão de cada regra técnica.
3. Distinguir cálculo matemático de validação normativa.
4. Não recomendar cabos ou proteções sem os dados necessários.
5. Exibir hipóteses, unidades e memória de cálculo.
6. Validar entradas e tratar dados inconsistentes.
7. Criar testes automatizados para as fórmulas e decisões.
8. Utilizar português brasileiro na interface.
9. Manter as alterações versionadas.
10. Não publicar ou distribuir o aplicativo automaticamente.

## Qualidade
- Interface clara e responsiva.
- Evitar lógica elétrica dentro dos componentes visuais.
- Preferir funções puras para cálculos.
- Testar situações normais, limites e erros.
- Informar pendências de validação técnica.
- Nunca tratar exemplos didáticos como dimensionamento aprovado.

## Fluxo de trabalho
Antes de cada funcionalidade complexa:
1. Definir requisitos.
2. Identificar dados de entrada.
3. Definir fórmulas e referências.
4. Implementar.
5. Executar testes.
6. Revisar os resultados.
7. Documentar as limitações.
