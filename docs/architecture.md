# Plano e arquitetura da versão 0.1

## Requisitos definidos antes da implementação

- Cadastrar, editar e excluir projetos (nome e descrição), circuitos e equipamentos.
- Circuito pertence a um projeto; equipamento pertence a um circuito. Exclusão do pai remove os filhos, com confirmação na interface.
- Circuito informa nome, tensão eficaz em V, monofásico ou trifásico equilibrado e FP comum às cargas. Equipamento informa nome, potência ativa unitária em W e quantidade inteira positiva.
- Calcular potência simultânea e corrente com funções puras; exibir equações, unidades, hipóteses e pendência normativa. Ver docs/technical-references.md.
- Persistir localmente em Android/iOS (AsyncStorage) e web (adaptador localStorage do AsyncStorage). Sem backend, autenticação ou credenciais. Sem sincronização entre dispositivos.
- Carregar e validar antes de gravar; rejeitar esquema desconhecido/corrompido sem sobrescrever; reportar falha de leitura/gravação. Persistir antes de atualizar a tela.
- Interface pt-BR responsiva, formulários com rótulos acessíveis e confirmação de exclusões.

## Camadas

`src/domain`: tipos, validações, operações imutáveis de cadastro e fórmulas. Sem React, Expo ou armazenamento.
`src/storage`: repositório versionado com driver injetável; AsyncStorage é ligado pela UI.
`src/hooks`: hidratação e serialização de mutações, tratamento de erros.
`src/components` e `App.tsx`: interface e navegação local por seleção de projeto/circuito, sem lógica de cálculo elétrica.
`tests`: testes executados com Node/tsx; casos independentes e driver em memória.

## Validação planejada

Testes de fórmulas/entradas/CRUD/persistência, TypeScript estrito, exportação web e smoke test no navegador (cadastro, cálculo, edição e persistência após recarregamento). Android/iOS precisam de Expo Go ou development build e dispositivo/emulador compatíveis; builds assinadas e distribuição não fazem parte desta versão.

## Persistência e limitações

Schema local v1; migrações futuras precisam ser explícitas. Dados locais não são backup e podem ser perdidos ao limpar armazenamento/desinstalar. Não há suporte a edição concorrente em várias abas. A web exportada inclui service worker com cache versionado do app: acesso offline após a primeira carga e conclusão do cache em origem segura (HTTPS ou localhost). Isso não se aplica ao Metro de desenvolvimento. Os apps nativos instalados com bundle embarcado podem funcionar sem rede; Expo Go precisa obter o bundle de desenvolvimento inicialmente.
