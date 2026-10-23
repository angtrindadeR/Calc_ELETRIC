import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptyDatabase,
  saveProject,
  saveCircuit,
  saveEquipment,
  deleteProject,
  deleteCircuit,
  deleteEquipment,
  parseDecimal,
} from "../src/domain/model";
export function populated() {
  let db = saveProject(emptyDatabase(), {
    id: "p",
    name: " Casa ",
    description: "",
  });
  db = saveProject(db, { id: "p2", name: "Apartamento", description: "" });
  db = saveCircuit(db, {
    id: "c",
    projectId: "p",
    name: "Sala",
    voltage: 127,
    powerFactor: 1,
    phase: "single",
  });
  return saveEquipment(db, {
    id: "e",
    circuitId: "c",
    name: "Lâmpada",
    watts: 10,
    quantity: 2,
  });
}
test("cadastro é imutável e remove espaços", () => {
  const base = emptyDatabase();
  const db = saveProject(base, { id: "p", name: " Casa ", description: " x " });
  assert.equal(base.projects.length, 0);
  assert.equal(db.projects[0].name, "Casa");
  assert.equal(db.projects[0].description, "x");
});
test("edita projeto, circuito e equipamento sem duplicar", () => {
  let db = populated();
  db = saveProject(db, { ...db.projects[0], name: "Reforma" });
  db = saveCircuit(db, { ...db.circuits[0], voltage: 220 });
  db = saveEquipment(db, { ...db.equipment[0], quantity: 3 });
  assert.equal(db.projects.length, 2);
  assert.equal(db.circuits.length, 1);
  assert.equal(db.equipment.length, 1);
  assert.equal(db.projects[0].name, "Reforma");
  assert.equal(db.circuits[0].voltage, 220);
  assert.equal(db.equipment[0].quantity, 3);
});
test("exclusão de projeto em cascata preserva outro projeto", () => {
  const db = deleteProject(populated(), "p");
  assert.deepEqual(
    db.projects.map((p) => p.id),
    ["p2"],
  );
  assert.equal(db.circuits.length, 0);
  assert.equal(db.equipment.length, 0);
});
test("exclusão de circuito remove cargas e preserva projetos", () => {
  const db = deleteCircuit(populated(), "c");
  assert.equal(db.projects.length, 2);
  assert.equal(db.equipment.length, 0);
});
test("exclusão de equipamento preserva circuito", () => {
  const db = deleteEquipment(populated(), "e");
  assert.equal(db.circuits.length, 1);
  assert.equal(db.equipment.length, 0);
});
test("rejeita nomes vazios, descrições longas e ID vazio", () => {
  for (const p of [
    { id: "p", name: " ", description: "" },
    { id: "", name: "Casa", description: "" },
    { id: "p", name: "Casa", description: "a".repeat(2001) },
  ])
    assert.throws(() => saveProject(emptyDatabase(), p));
});
test("rejeita referências inexistentes e transferência de circuito", () => {
  const db = populated();
  assert.throws(() =>
    saveCircuit(db, { ...db.circuits[0], projectId: "missing" }),
  );
  assert.throws(() => saveCircuit(db, { ...db.circuits[0], projectId: "p2" }));
  assert.throws(() =>
    saveEquipment(db, { ...db.equipment[0], circuitId: "missing" }),
  );
});
test("aceita vírgula, ponto e espaços externos", () => {
  assert.equal(parseDecimal(" 12,5 ", "Valor"), 12.5);
  assert.equal(parseDecimal("12.5", "Valor"), 12.5);
  assert.equal(parseDecimal("0", "Valor"), 0);
});
for (const input of [
  "",
  " ",
  "1.000,5",
  "1,000.5",
  "1e3",
  "-1",
  "Infinity",
  "12 W",
  "1 000",
  ".5",
])
  test(`rejeita entrada ambígua/inválida: ${JSON.stringify(input)}`, () =>
    assert.throws(() => parseDecimal(input, "Valor")));
