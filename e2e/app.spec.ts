import { test, expect } from "@playwright/test";
test("cadastro, edição, cálculo, recarga e exclusões em cascata", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "+ Novo projeto", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Casa de teste");
  await page
    .getByLabel("Descrição (opcional)", { exact: true })
    .fill("Projeto didático");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page
    .getByRole("button", { name: "Abrir Casa de teste", exact: true })
    .click();
  await page
    .getByRole("button", { name: "+ Novo circuito", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Sala");
  await page.getByLabel("Tensão da carga (V)", { exact: true }).fill("220");
  await page
    .getByLabel("Fator de potência (0 < FP ≤ 1)", { exact: true })
    .fill("0,8");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page.getByRole("button", { name: "Abrir Sala", exact: true }).click();
  await page
    .getByRole("button", { name: "+ Novo equipamento", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Carga didática");
  await page
    .getByLabel("Potência ativa unitária (W)", { exact: true })
    .fill("880");
  await page.getByLabel("Quantidade", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByTestId("calculated-current")).toHaveText("10 A");
  await page
    .getByRole("button", {
      name: "Editar equipamento Carga didática",
      exact: true,
    })
    .click();
  await page.getByLabel("Quantidade", { exact: true }).fill("1,5");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Quantidade deve ser um inteiro positivo seguro." })
      .last(),
  ).toBeVisible();
  await page.getByLabel("Quantidade", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByTestId("calculated-current")).toHaveText("5 A");
  await page.reload();
  await page
    .getByRole("button", { name: "Abrir Casa de teste", exact: true })
    .click();
  await page.getByRole("button", { name: "Abrir Sala", exact: true }).click();
  await expect(page.getByTestId("calculated-current")).toHaveText("5 A");
  await page
    .getByRole("button", {
      name: "Excluir equipamento Carga didática",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Cancelar exclusão", exact: true })
    .click();
  await expect(page.getByTestId("calculated-current")).toHaveText("5 A");
  await page.getByRole("button", { name: "Projetos", exact: true }).click();
  await page
    .getByRole("button", { name: "Excluir projeto Casa de teste", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirmar exclusão", exact: true })
    .click();
  await expect(
    page.getByText("Seu primeiro projeto começa aqui", { exact: true }),
  ).toBeVisible();
  const raw = await page.evaluate(() =>
    localStorage.getItem("eletricalc.database.v1"),
  );
  expect(JSON.parse(raw!)).toEqual({
    version: 1,
    projects: [],
    circuits: [],
    equipment: [],
  });
  expect(errors).toEqual([]);
});
test("dados corrompidos bloqueiam gravação sem sobrescrever armazenamento", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("eletricalc.database.v1", "{corrompido"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText(
    "preservados sem sobrescrita",
  );
  await expect(
    page.getByRole("button", { name: "+ Novo projeto", exact: true }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("eletricalc.database.v1")),
  ).toBe("{corrompido");
});

test("edição de projeto e circuito trifásico; formulário inválido permanece aberto", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "+ Novo projeto", exact: true })
    .click();
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByRole("alert").last()).toContainText("Informe um nome");
  await page.getByLabel("Nome", { exact: true }).fill("Casa");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page
    .getByRole("button", { name: "Editar projeto Casa", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Casa revisada");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page
    .getByRole("button", { name: "Abrir Casa revisada", exact: true })
    .click();
  await page
    .getByRole("button", { name: "+ Novo circuito", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Circuito A");
  await page.getByLabel("Tensão da carga (V)", { exact: true }).fill("220");
  await page
    .getByLabel("Fator de potência (0 < FP ≤ 1)", { exact: true })
    .fill("1");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page
    .getByRole("button", { name: "Editar circuito Circuito A", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Trifásico");
  await page
    .getByRole("button", { name: "Trifásico equilibrado", exact: true })
    .click();
  await expect(
    page.getByLabel("Tensão entre fases (V)", { exact: true }),
  ).toHaveValue("220");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page
    .getByRole("button", { name: "Abrir Trifásico", exact: true })
    .click();
  await page
    .getByRole("button", { name: "+ Novo equipamento", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Carga equilibrada");
  await page
    .getByLabel("Potência ativa unitária (W)", { exact: true })
    .fill("6600");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByTestId("calculated-current")).toHaveText("17,3205 A");
  await expect(
    page.getByText("I = P / (√3 × U_linha × FP)", { exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: test.info().outputPath("circuito-trifasico.png"),
    fullPage: true,
  });
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflows).toBe(false);
  await page
    .getByRole("button", { name: "Casa revisada", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Excluir circuito Trifásico", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirmar exclusão", exact: true })
    .click();
  await expect(
    page.getByText("Comece pelo primeiro circuito", { exact: true }),
  ).toBeVisible();
});

test("falha de gravação não mostra sucesso nem perde campos do formulário", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "+ Novo projeto", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Não gravado");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Armazenamento indisponível");
    };
  });
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(page.getByRole("alert").last()).toContainText(
    "Armazenamento indisponível",
  );
  await expect(page.getByLabel("Nome", { exact: true })).toHaveValue(
    "Não gravado",
  );
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Abrir Não gravado", exact: true }),
  ).toHaveCount(0);
});

test("bundle web reabre sem rede após preparar cache offline", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "+ Novo projeto", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Projeto offline");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("button", { name: "Abrir Projeto offline", exact: true })
    .click();
  await page
    .getByRole("button", { name: "+ Novo circuito", exact: true })
    .click();
  await page.getByLabel("Nome", { exact: true }).fill("Circuito offline");
  await page.getByLabel("Tensão da carga (V)", { exact: true }).fill("127");
  await page
    .getByLabel("Fator de potência (0 < FP ≤ 1)", { exact: true })
    .fill("1");
  await page.getByRole("button", { name: "Salvar", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Abrir Circuito offline", exact: true }),
  ).toBeVisible();
});
