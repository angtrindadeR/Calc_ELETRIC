import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createRepository,
  STORAGE_KEY,
  validateDatabase,
} from "../src/storage/repository";
import {
  emptyDatabase,
  saveProject,
  saveCircuit,
  saveEquipment,
} from "../src/domain/model";
function fixture() {
  let db = saveProject(emptyDatabase(), {
    id: "p",
    name: "Casa",
    description: "Teste",
  });
  db = saveCircuit(db, {
    id: "c",
    projectId: "p",
    name: "Sala",
    voltage: 220,
    powerFactor: 0.8,
    phase: "single",
  });
  return saveEquipment(db, {
    id: "e",
    circuitId: "c",
    name: "Lâmpada",
    watts: 12,
    quantity: 2,
  });
}
test("armazenamento vazio carrega sem gravar; ida e volta preserva os cadastros", async () => {
  const data = new Map<string, string>();
  const repository = createRepository({
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => {
      data.set(key, value);
    },
  });
  assert.deepEqual(await repository.load(), emptyDatabase());
  assert.equal(data.size, 0);
  await repository.save(fixture());
  assert.ok(data.has(STORAGE_KEY));
  assert.deepEqual(await repository.load(), fixture());
});
for (const raw of [
  "{broken",
  "",
  "null",
  JSON.stringify({ ...fixture(), version: 2 }),
  JSON.stringify({ ...fixture(), circuits: [] }),
  JSON.stringify({
    ...fixture(),
    equipment: [{ ...fixture().equipment[0], watts: "12" }],
  }),
  JSON.stringify({
    ...fixture(),
    projects: [fixture().projects[0], fixture().projects[0]],
  }),
]) {
  test(`dados inválidos são preservados: ${raw.slice(0, 25)}`, async () => {
    let writes = 0;
    const repository = createRepository({
      getItem: async () => raw,
      setItem: async () => {
        writes++;
      },
    });
    await assert.rejects(repository.load(), /preservados/);
    assert.equal(writes, 0);
  });
}
test("falha do driver de gravação propaga e não altera modelo", async () => {
  const db = fixture();
  const original = JSON.stringify(db);
  const repository = createRepository({
    getItem: async () => null,
    setItem: async () => {
      throw new Error("Quota excedida");
    },
  });
  await assert.rejects(repository.save(db), /Quota/);
  assert.equal(JSON.stringify(db), original);
});
test("falha de leitura não é confundida com banco vazio", async () => {
  const repository = createRepository({
    getItem: async () => {
      throw new Error("Sem acesso");
    },
    setItem: async () => {},
  });
  await assert.rejects(repository.load(), /Sem acesso/);
});
test("gravação de banco inválido é bloqueada antes do driver", async () => {
  let writes = 0;
  const repository = createRepository({
    getItem: async () => null,
    setItem: async () => {
      writes++;
    },
  });
  const db = fixture();
  db.circuits[0].powerFactor = 0;
  await assert.rejects(repository.save(db));
  assert.equal(writes, 0);
});
test("rejeita ID duplicado entre entidades e campos de tipos errados", () => {
  const db = fixture();
  db.equipment[0].id = "p";
  assert.throws(() => validateDatabase(db));
  assert.throws(() =>
    validateDatabase({
      ...fixture(),
      projects: [{ id: "x", name: 123, description: "" }],
    }),
  );
});
