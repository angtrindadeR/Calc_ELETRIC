export type Phase = "single" | "three";
export type Project = { id: string; name: string; description: string };
export type Circuit = {
  id: string;
  projectId: string;
  name: string;
  voltage: number;
  powerFactor: number;
  phase: Phase;
};
export type Equipment = {
  id: string;
  circuitId: string;
  name: string;
  watts: number;
  quantity: number;
};
export type Database = {
  version: 1;
  projects: Project[];
  circuits: Circuit[];
  equipment: Equipment[];
};
export const emptyDatabase = (): Database => ({
  version: 1,
  projects: [],
  circuits: [],
  equipment: [],
});

export function name(value: string): string {
  const result = value.trim();
  if (!result || result.length > 120)
    throw new Error("Informe um nome com 1 a 120 caracteres.");
  return result;
}
export function finite(
  value: number,
  label: string,
  allowZero = false,
): number {
  if (!Number.isFinite(value) || (allowZero ? value < 0 : value <= 0)) {
    throw new Error(
      `${label} deve ser um número finito ${allowZero ? "maior ou igual a zero" : "maior que zero"}.`,
    );
  }
  return value;
}
export function parseDecimal(value: string, label: string): number {
  const text = value.trim();
  if (!/^\d+(?:[.,]\d+)?$/.test(text))
    throw new Error(
      `${label}: use um número sem separador de milhar (ex.: 12,5).`,
    );
  return finite(Number(text.replace(",", ".")), label, true);
}
export function validateCircuit(circuit: Circuit): Circuit {
  name(circuit.name);
  finite(circuit.voltage, "Tensão");
  finite(circuit.powerFactor, "Fator de potência");
  if (circuit.powerFactor > 1)
    throw new Error(
      "Fator de potência deve ser maior que zero e menor ou igual a 1.",
    );
  if (!["single", "three"].includes(circuit.phase))
    throw new Error("Selecione um sistema válido.");
  return circuit;
}
export function validateEquipment(equipment: Equipment): Equipment {
  name(equipment.name);
  finite(equipment.watts, "Potência");
  if (!Number.isSafeInteger(equipment.quantity) || equipment.quantity <= 0)
    throw new Error("Quantidade deve ser um inteiro positivo seguro.");
  finite(equipment.watts * equipment.quantity, "Potência total");
  return equipment;
}
function exists(items: { id: string }[], id: string, label: string) {
  if (!items.some((item) => item.id === id))
    throw new Error(`${label} não encontrado.`);
}
function upsert<T extends { id: string }>(items: T[], item: T): T[] {
  if (!item.id.trim()) throw new Error("Identificador inválido.");
  return items.some((value) => value.id === item.id)
    ? items.map((value) => (value.id === item.id ? item : value))
    : [...items, item];
}
export function saveProject(db: Database, project: Project): Database {
  if (project.description.length > 2000)
    throw new Error("Descrição deve ter até 2000 caracteres.");
  return {
    ...db,
    projects: upsert(db.projects, {
      ...project,
      name: name(project.name),
      description: project.description.trim(),
    }),
  };
}
export function saveCircuit(db: Database, circuit: Circuit): Database {
  exists(db.projects, circuit.projectId, "Projeto");
  validateCircuit(circuit);
  const previous = db.circuits.find((item) => item.id === circuit.id);
  if (previous && previous.projectId !== circuit.projectId)
    throw new Error("Não é possível transferir um circuito de projeto.");
  return {
    ...db,
    circuits: upsert(db.circuits, { ...circuit, name: name(circuit.name) }),
  };
}
export function saveEquipment(db: Database, equipment: Equipment): Database {
  exists(db.circuits, equipment.circuitId, "Circuito");
  validateEquipment(equipment);
  const previous = db.equipment.find((item) => item.id === equipment.id);
  if (previous && previous.circuitId !== equipment.circuitId)
    throw new Error("Não é possível transferir um equipamento de circuito.");
  return {
    ...db,
    equipment: upsert(db.equipment, {
      ...equipment,
      name: name(equipment.name),
    }),
  };
}
export function deleteEquipment(db: Database, id: string): Database {
  exists(db.equipment, id, "Equipamento");
  return { ...db, equipment: db.equipment.filter((item) => item.id !== id) };
}
export function deleteCircuit(db: Database, id: string): Database {
  exists(db.circuits, id, "Circuito");
  return {
    ...db,
    circuits: db.circuits.filter((item) => item.id !== id),
    equipment: db.equipment.filter((item) => item.circuitId !== id),
  };
}
export function deleteProject(db: Database, id: string): Database {
  exists(db.projects, id, "Projeto");
  const ids = new Set(
    db.circuits.filter((item) => item.projectId === id).map((item) => item.id),
  );
  return {
    ...db,
    projects: db.projects.filter((item) => item.id !== id),
    circuits: db.circuits.filter((item) => item.projectId !== id),
    equipment: db.equipment.filter((item) => !ids.has(item.circuitId)),
  };
}
