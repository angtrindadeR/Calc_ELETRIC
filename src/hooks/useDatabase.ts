import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "../domain/model";
import { createRepository } from "../storage/repository";
const repository = createRepository(AsyncStorage);
export function useDatabase() {
  const [db, setDb] = useState<Database | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const current = useRef<Database | null>(null);
  async function load() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const next = await repository.load();
      current.current = next;
      setDb(next);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível ler os dados locais.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function mutate(update: (db: Database) => Database): Promise<boolean> {
    if (lock.current || !current.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const next = update(current.current);
      await repository.save(next);
      current.current = next;
      setDb(next);
      return true;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Falha ao salvar no dispositivo.",
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return { db, busy, error, mutate, load };
}
