---
name: calculation-testing
description: Verificar fórmulas, decisões, cadastros e armazenamento do EletriCalc com testes automatizados.
---
Leia AGENTS.md, docs/architecture.md e docs/technical-references.md.
Use testes independentes com valores calculados analiticamente; não derive o esperado chamando a função sob teste.
Cubra corrente monofásica, trifásica equilibrada, FP, quantidades, soma de potências, zero, limites, NaN, infinito e overflow.
Cubra validação de formulários e relacionamentos, edição, exclusão em cascata, ida e volta do armazenamento e dados corrompidos/versão desconhecida.
Não afrouxe tolerâncias nem desabilite testes para passar. Distinga falha de ambiente de defeito da aplicação.
Execute npm test e npm run typecheck; use o build web e um smoke test real do navegador para o fluxo completo e recarregamento.
Registre o que não foi executado (especialmente Android/iOS reais). Não declare validação normativa a partir de teste matemático.
