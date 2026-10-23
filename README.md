
# EletriCalc

Aplicativo de apoio ao dimensionamento de instalações elétricas residenciais brasileiras.

## Tecnologias previstas

- React Native
- Expo
- TypeScript

## Funcionalidades planejadas


- Cadastro de projetos residenciais
- Dimensionamento assistido de circuitos
- Cálculos elétricos
- Organização de quadros de distribuição
- Verificação de condutores e proteções
- Geração de relatórios técnicos

## Versão 0.1 — desenvolvimento

O cadastro de projetos, circuitos e equipamentos, a memória de cálculo de corrente e o armazenamento local estão implementados. O roteiro acima descreve também funcionalidades futuras; dimensionamento de condutores/proteções e conformidade normativa **ainda não estão implementados**.

### Executar

Requisitos: Node.js 24 (ver `.nvmrc`) e npm. As versões do SDK Expo e das dependências estão em `package.json` e `package-lock.json`.

```sh
npm ci
npm start
# Ou diretamente:
npm run web
npm run android
npm run ios
```

Use Expo Go compatível com o SDK indicado no `package.json` e leia o QR code do Metro. Android exige dispositivo ou emulador com Android SDK/ADB; iOS Simulator exige macOS/Xcode. Não é necessário gerar pastas nativas para desenvolver com Expo. Os identificadores `com.eletricalc.app` são iniciais de desenvolvimento; revisar titularidade antes de uma futura distribuição.

No ambiente de nuvem restrito, use as instruções em [docs/development.md](docs/development.md). Não há backend nem segredo necessário.

### Verificar

```sh
npm run typecheck
npm test
npm run build:web
# Uma vez, instale o navegador de testes:
npx playwright install chromium
npm run test:e2e
```

Se já houver Chromium instalado, use `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/caminho/do/chromium npm run test:e2e`.

Consulte [arquitetura e requisitos](docs/architecture.md), [fórmulas, referências e limitações](docs/technical-references.md) e [instruções de desenvolvimento](docs/development.md).

As especializações locais estão em `.agents/skills/expo-development`, `.agents/skills/electrical-calculations` e `.agents/skills/calculation-testing`. Leia seus `SKILL.md` ao desenvolver as respectivas áreas, sempre junto do `AGENTS.md` da raiz.
