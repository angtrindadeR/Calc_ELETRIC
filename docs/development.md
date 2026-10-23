# Desenvolvimento e ambiente

## Preparação

Use o checkout existente, em branch de desenvolvimento, sem criar worktree por padrão. A branch da v0.1 nasce da main após a integração de AGENTS.md. Nunca alterar main diretamente ou publicar o aplicativo automaticamente.

Instalação repetível: `npm ci`, com Node 24. `package-lock.json` é a fonte das versões resolvidas. Em máquinas que restringem escrita no diretório pessoal, prefixe os comandos npm com `npm_config_cache=/tmp/eletricalc-npm`.

O Expo tenta consultar serviços de compatibilidade que podem estar bloqueados neste ambiente. Nesse caso, use `EXPO_OFFLINE=1 EXPO_NO_CACHE=1 EXPO_NO_TELEMETRY=1` nos comandos Expo. A seleção de versões usa o mapa embarcado `expo/bundledNativeModules.json`; isso não equivale a uma consulta online ao Expo Doctor. A verificação TLS e as integridades do npm permanecem ativas.

## Iniciar no ambiente de nuvem

Na raiz `/workspace/Calc_ELETRIC`:

```sh
EXPO_OFFLINE=1 EXPO_NO_CACHE=1 EXPO_NO_TELEMETRY=1 npm_config_cache=/tmp/eletricalc-npm npm run web -- --host localhost --port 8081
```

Aguarde o Metro e faça uma requisição HTTP local. Confirme a aplicação pelo fluxo do navegador (projeto → circuito → equipamento → corrente → recarga) ou pelo `npm run test:e2e`, que usa o bundle exportado. Não trate só um processo/porta como prova de funcionamento.

Para testes web com bundle de produção:

```sh
EXPO_OFFLINE=1 EXPO_NO_CACHE=1 EXPO_NO_TELEMETRY=1 npm run build:web
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

O Playwright inicia e encerra seu próprio servidor Python em 127.0.0.1:4173, com dados isolados em cada teste. Requer Python 3 e Chromium; fora deste ambiente, use `npx playwright install chromium` e omita a variável do caminho.

## Android e iOS

`npm run android` inicia Metro e tenta abrir o dispositivo/emulador disponível. `npm run ios` precisa de macOS para o simulador; um iPhone pode usar um Expo Go compatível pela rede. Para trabalhar remotamente, use sua própria conectividade entre o dispositivo e o servidor; nenhum túnel é criado automaticamente.

O empacotamento JavaScript pode ser verificado sem compilar binários:

```sh
EXPO_OFFLINE=1 EXPO_NO_CACHE=1 EXPO_NO_TELEMETRY=1 npx expo export --platform android --platform ios --output-dir /tmp/eletricalc-native-bundles
```

Isso não compila APK/IPA nem executa testes em Android/iOS. Nenhuma conta de distribuição, assinatura, EAS ou publicação é configurada nesta etapa.

## Dados e recuperação

A chave é `eletricalc.database.v1`. O banco contém projetos, circuitos e equipamentos. Sem servidor nem envio de dados. Dados corrompidos ou com versão desconhecida bloqueiam gravação e permanecem no armazenamento; recuperar uma cópia antes de qualquer limpeza manual. Não há rotina de reparo automático, exportação de backup nem sincronização entre abas/dispositivos nesta versão.

Use ponto ou vírgula como separador decimal, sem separador de milhar. A tensão e o fator de potência são obrigatórios; o usuário deve conhecer os dados de entrada. As limitações do modelo e a pendência de revisão normativa aparecem no app e no registro técnico.

## Uso offline na web

`npm run build:web` exporta o app e gera `dist/sw.js` com os arquivos e uma versão derivada de SHA-256. Em HTTPS ou localhost, a primeira carga prepara o cache. Depois disso, o app pode reabrir sem rede e continuar salvando cadastros no mesmo navegador. Isso não torna o servidor Metro offline nem transfere projetos entre dispositivos. Se o navegador bloquear service workers/cache, a reabertura offline não estará disponível; a persistência local continua independente.

## Automação

`.github/workflows/ci.yml` executa instalação com lockfile, TypeScript, testes, exportação web, Chromium e empacotamento JavaScript Android/iOS. O workflow não publica o app. Sua execução hospedada no GitHub deve ser conferida após o envio da branch; os resultados registrados no relatório são da máquina de desenvolvimento.

O Metro pode avisar que a atualização automática do React Native DevTools não foi possível e usar a versão de fallback fornecida pela dependência. Esse debugger nativo opcional não impede o desenvolvimento web nem os testes; não se deve desativar verificação TLS/checksum para atualizar essa ferramenta.
