# Verificação da versão 0.1

Validação executada no ambiente Linux de desenvolvimento em 23/10/2026, com Node 24.19.0, npm 11.9.0, Expo SDK 58 e Chromium instalado no sistema.

| Verificação | Resultado observado |
| --- | --- |
| Sincronização inicial | Branch develop/v0.1 criada de origin/main em 2b9cee7, após merge do AGENTS.md. |
| Instalação | npm ci --no-audit --no-fund passou usando package-lock.json; scripts/setup-cloud.sh completo executado com sucesso. |
| TypeScript | npm run typecheck passou, incluindo código, testes e configuração Playwright. |
| Fórmulas, cadastros, armazenamento | npm test: 61 testes passaram, zero falhas, zero ignorados. |
| Web | npm run build:web gerou bundle e service worker com cache versionado. |
| Chromium desktop e celular | 10 testes E2E passaram (5 cenários em 2 tamanhos de tela), sem falhas. |
| Metro de desenvolvimento | Iniciado e acessado via localhost; Chromium executou o bundle, cadastrou um projeto e não registrou erro JavaScript. Processo encerrado após a verificação. |
| Android e iOS | Expo export gerou os dois bundles Hermes, sem APK/IPA, compilação nativa ou execução em dispositivos. |
| Repositório | AGENTS.md preservado; README original mantido com orientações acrescentadas; main não modificada. |

## O que os testes exercitam

- Monofásico e trifásico equilibrado, FP, quantidade, potência acumulada e circuito vazio.
- Tensão/FP/potência inválidos, quantidades fracionárias, NaN, infinito, overflow e precisão extrema.
- Cadastro e edição imutáveis, relacionamentos e exclusão em cascata.
- Leitura/gravação versionada, dados corrompidos, IDs duplicados, versão desconhecida e falhas de driver.
- Fluxo de interface, edição de projeto/circuito/equipamento, corrente e memória, cancelamento/confirmação de exclusão e recarregamento com retenção de dados.
- Falha de gravação mantendo formulário aberto sem sucesso falso; dados corrompidos não são sobrescritos.
- Reabertura e cadastro sem rede após completar o cache da versão web exportada.
- Layout sem overflow horizontal na tela de circuito testada em 390 px; captura de tela inspecionada.

## Limitações e pendências

- Nenhuma regra/tabela da NBR 5410 implementada: faltam fonte autorizada, edição/emendas e conferência das condições de aplicação. As fórmulas matemáticas estão derivadas e versionadas no registro técnico; não representam aprovação normativa.
- Não foram executados testes em emulador ou dispositivo Android/iOS, nem gerados binários assinados.
- Expo Doctor online não foi validado: destinos de compatibilidade não estavam disponíveis no ambiente. Foram usadas versões do template oficial e do mapa embarcado do SDK; os três bundles foram gerados com sucesso.
- A atualização automática opcional do React Native DevTools encontrou restrição de escrita no cache pessoal e utilizou o fallback. O fluxo web do Metro foi validado mesmo assim.
- CI no GitHub está configurada, mas os resultados de sua execução hospedada não fazem parte desta verificação local.
- Não há dimensionamento de condutores/proteções, validação de queda de tensão, demanda normativa, backup/exportação de projetos nem sincronização multiaba/dispositivo.
- Nenhum aplicativo foi publicado ou distribuído. O rascunho da configuração de nuvem salvo nesta tarefa não equivale à publicação/restauração validada de um novo ambiente.
