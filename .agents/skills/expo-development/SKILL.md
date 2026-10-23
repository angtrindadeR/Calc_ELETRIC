---
name: expo-development
description: Desenvolver o EletriCalc em React Native, Expo e TypeScript para Android, iOS e web.
---
Leia o AGENTS.md da raiz e docs/architecture.md antes de implementar.
Use o checkout existente e uma branch de desenvolvimento; não crie worktrees sem solicitação.
Mantenha cálculos em src/domain, persistência em src/storage e apresentação em componentes React Native.
Use componentes acessíveis, mensagens em pt-BR e formulários que aceitem vírgula decimal sem aceitar entradas ambíguas.
Não ponha segredos no app. Garanta hidratação antes de gravar e preserve dados inválidos para recuperação.
Antes de concluir, execute npm test, npm run typecheck e npm run build:web. Não publique automaticamente.
Documente separadamente testes em navegador, emulador e dispositivo real; exportar bundle não valida comportamento nativo.
