import {
  Database,
  emptyDatabase,
  saveProject,
  saveCircuit,
  saveEquipment,
} from "../domain/model";
export const STORAGE_KEY = "eletricalc.database.v1";
export type StorageDriver = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};
function object(value: unknown): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Registro inválido.");
}
function text(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new Error("Texto inválido.");
}
function number(value: unknown): asserts value is number {
  if (typeof value !== "number") throw new Error("Número inválido.");
}
export function validateDatabase(value: unknown): Database {
  object(value);
  if (
    value.version !== 1 ||
    !Array.isArray(value.projects) ||
    !Array.isArray(value.circuits) ||
    !Array.isArray(value.equipment)
  )
    throw new Error("Versão ou estrutura de dados não suportada.");
  let db = emptyDatabase();
  const ids = new Set<string>();
  function id(value: unknown): asserts value is string {
    text(value);
    if (!value.trim() || ids.has(value))
      throw new Error("Identificador ausente ou duplicado.");
    ids.add(value);
  }
  for (const item of value.projects) {
    object(item);
    id(item.id);
    text(item.name);
    text(item.description);
    db = saveProject(db, {
      id: item.id,
      name: item.name,
      description: item.description,
    });
  }
  for (const item of value.circuits) {
    object(item);
    id(item.id);
    text(item.projectId);
    text(item.name);
    number(item.voltage);
    number(item.powerFactor);
    if (item.phase !== "single" && item.phase !== "three")
      throw new Error("Sistema inválido.");
    db = saveCircuit(db, {
      id: item.id,
      projectId: item.projectId,
      name: item.name,
      voltage: item.voltage,
      powerFactor: item.powerFactor,
      phase: item.phase,
    });
  }
  for (const item of value.equipment) {
    object(item);
    id(item.id);
    text(item.circuitId);
    text(item.name);
    number(item.watts);
    number(item.quantity);
    db = saveEquipment(db, {
      id: item.id,
      circuitId: item.circuitId,
      name: item.name,
      watts: item.watts,
      quantity: item.quantity,
    });
  }
  return db;
}
export function createRepository(driver: StorageDriver) {
  return {
    async load(): Promise<Database> {
      const raw = await driver.getItem(STORAGE_KEY);
      if (raw === null) return emptyDatabase();
      try {
        return validateDatabase(JSON.parse(raw));
      } catch {
        throw new Error(
          "Dados locais inválidos ou de versão incompatível. Foram preservados sem sobrescrita.",
        );
      }
    },
    async save(db: Database): Promise<void> {
      const checked = validateDatabase(db);
      await driver.setItem(STORAGE_KEY, JSON.stringify(checked));
    },
  };
}
