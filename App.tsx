import React, { useState } from "react";
import { ActivityIndicator, Modal, ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Crypto from "expo-crypto";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useOfflineWeb } from "./src/hooks/useOfflineWeb";
import { useDatabase } from "./src/hooks/useDatabase";
import {
  Database,
  deleteCircuit,
  deleteEquipment,
  deleteProject,
  parseDecimal,
  saveCircuit,
  saveEquipment,
  saveProject,
} from "./src/domain/model";
import { formatNumber } from "./src/domain/calculations";
import { Button, styles } from "./src/components/ui";
import { Editor, EditorConfig } from "./src/components/Editor";
import { CalculationCard } from "./src/components/CalculationCard";

type Removal = { label: string; action(db: Database): Database; after(): void };
export default function App() {
  useOfflineWeb();
  const { db, busy, error, mutate, load } = useDatabase();
  const [projectId, selectProject] = useState<string | null>(null);
  const [circuitId, selectCircuit] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorConfig | null>(null);
  const [removal, setRemoval] = useState<Removal | null>(null);
  const project = db?.projects.find((item) => item.id === projectId);
  const circuit = db?.circuits.find(
    (item) => item.id === circuitId && item.projectId === project?.id,
  );
  const circuits =
    db?.circuits.filter((item) => item.projectId === project?.id) ?? [];
  const equipment =
    db?.equipment.filter((item) => item.circuitId === circuit?.id) ?? [];
  function open(
    kind: EditorConfig["kind"],
    id = "",
    values: Record<string, string> = {},
  ) {
    setEditor({
      kind,
      id,
      values: {
        name: "",
        description: "",
        voltage: "",
        powerFactor: "",
        phase: "single",
        watts: "",
        quantity: "1",
        ...values,
      },
    });
  }
  async function save(values: Record<string, string>): Promise<boolean> {
    if (!editor) return false;
    const id = editor.id || Crypto.randomUUID();
    return mutate((db) => {
      if (editor.kind === "project")
        return saveProject(db, {
          id,
          name: values.name,
          description: values.description,
        });
      if (editor.kind === "circuit" && project)
        return saveCircuit(db, {
          id,
          projectId: project.id,
          name: values.name,
          voltage: parseDecimal(values.voltage, "Tensão"),
          powerFactor: parseDecimal(values.powerFactor, "FP"),
          phase: values.phase as "single" | "three",
        });
      if (editor.kind === "equipment" && circuit)
        return saveEquipment(db, {
          id,
          circuitId: circuit.id,
          name: values.name,
          watts: parseDecimal(values.watts, "Potência"),
          quantity: parseDecimal(values.quantity, "Quantidade"),
        });
      throw new Error("Selecione o projeto ou circuito novamente.");
    });
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.logo}>ϟ EletriCalc</Text>
            <Text style={styles.tag}>V0.1 · DADOS NESTE DISPOSITIVO</Text>
          </View>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          <View style={styles.row}>
            <Button
              title="Projetos"
              secondary
              onPress={() => {
                selectProject(null);
                selectCircuit(null);
              }}
            />
            {project && (
              <Button
                title={project.name}
                secondary
                onPress={() => selectCircuit(null)}
              />
            )}
            {circuit && <Text style={styles.subtitle}>/ {circuit.name}</Text>}
          </View>
          <View style={{ gap: 8 }}>
            <Text style={styles.eyebrow}>
              INSTALAÇÕES RESIDENCIAIS · BAIXA TENSÃO
            </Text>
            <Text accessibilityRole="header" style={styles.title}>
              {circuit
                ? circuit.name
                : project
                  ? project.name
                  : "Seus projetos elétricos"}
            </Text>
            <Text style={styles.subtitle}>
              {circuit
                ? "Organize as cargas e confira a memória de cálculo."
                : project
                  ? project.description ||
                    "Cadastre os circuitos deste projeto."
                  : "Da organização das cargas à corrente estimada. Tudo salvo localmente."}
            </Text>
          </View>
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              Cálculo matemático, sem validação normativa. A NBR 5410 ainda não
              foi verificada nesta versão. Não use os resultados como
              dimensionamento aprovado de cabos ou proteções.
            </Text>
          </View>
          {!!error && (
            <View style={styles.warning}>
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
              {!db && (
                <Button
                  title="Tentar carregar novamente"
                  secondary
                  onPress={() => {
                    void load();
                  }}
                />
              )}
            </View>
          )}
          {!db ? (
            <View style={styles.card}>
              {busy ? (
                <ActivityIndicator accessibilityLabel="Carregando dados" />
              ) : (
                <Text style={styles.subtitle}>
                  A gravação está bloqueada até carregar os dados locais com
                  segurança.
                </Text>
              )}
            </View>
          ) : (
            <>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <Text style={styles.cardTitle}>
                  {circuit
                    ? `${equipment.length} equipamento(s)`
                    : project
                      ? `${circuits.length} circuito(s)`
                      : `${db.projects.length} projeto(s)`}
                </Text>
                <Button
                  title={
                    circuit
                      ? "+ Novo equipamento"
                      : project
                        ? "+ Novo circuito"
                        : "+ Novo projeto"
                  }
                  disabled={busy}
                  onPress={() =>
                    open(
                      circuit ? "equipment" : project ? "circuit" : "project",
                    )
                  }
                />
              </View>
              {circuit && (
                <CalculationCard circuit={circuit} equipment={equipment} />
              )}
              <View style={[styles.row, { alignItems: "stretch" }]}>
                {!project &&
                  db.projects.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.card, { flex: 1, minWidth: 240 }]}
                    >
                      <Text style={styles.eyebrow}>PROJETO RESIDENCIAL</Text>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.subtitle}>
                        {item.description || "Sem descrição"}
                      </Text>
                      <Text style={styles.subtitle}>
                        {
                          db.circuits.filter(
                            (value) => value.projectId === item.id,
                          ).length
                        }{" "}
                        circuito(s)
                      </Text>
                      <Button
                        title={`Abrir ${item.name}`}
                        onPress={() => {
                          selectProject(item.id);
                          selectCircuit(null);
                        }}
                      />
                      <View style={styles.row}>
                        <Button
                          title={`Editar projeto ${item.name}`}
                          secondary
                          disabled={busy}
                          onPress={() =>
                            open("project", item.id, {
                              name: item.name,
                              description: item.description,
                            })
                          }
                        />
                        <Button
                          title={`Excluir projeto ${item.name}`}
                          secondary
                          disabled={busy}
                          onPress={() =>
                            setRemoval({
                              label: `Excluir o projeto “${item.name}”, seus circuitos e equipamentos?`,
                              action: (db) => deleteProject(db, item.id),
                              after: () => {},
                            })
                          }
                        />
                      </View>
                    </View>
                  ))}
                {project &&
                  !circuit &&
                  circuits.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.card, { flex: 1, minWidth: 240 }]}
                    >
                      <Text style={styles.eyebrow}>
                        {item.phase === "single"
                          ? "MONOFÁSICO"
                          : "TRIFÁSICO EQUILIBRADO"}
                      </Text>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.subtitle}>
                        {formatNumber(item.voltage)} V · FP{" "}
                        {formatNumber(item.powerFactor)} ·{" "}
                        {
                          db.equipment.filter(
                            (value) => value.circuitId === item.id,
                          ).length
                        }{" "}
                        equipamento(s)
                      </Text>
                      <Button
                        title={`Abrir ${item.name}`}
                        onPress={() => selectCircuit(item.id)}
                      />
                      <View style={styles.row}>
                        <Button
                          title={`Editar circuito ${item.name}`}
                          secondary
                          disabled={busy}
                          onPress={() =>
                            open("circuit", item.id, {
                              name: item.name,
                              voltage: String(item.voltage),
                              powerFactor: String(item.powerFactor),
                              phase: item.phase,
                            })
                          }
                        />
                        <Button
                          title={`Excluir circuito ${item.name}`}
                          secondary
                          disabled={busy}
                          onPress={() =>
                            setRemoval({
                              label: `Excluir o circuito “${item.name}” e seus equipamentos?`,
                              action: (db) => deleteCircuit(db, item.id),
                              after: () => {},
                            })
                          }
                        />
                      </View>
                    </View>
                  ))}
                {circuit &&
                  equipment.map((item) => (
                    <View
                      key={item.id}
                      style={[styles.card, { flex: 1, minWidth: 240 }]}
                    >
                      <Text style={styles.eyebrow}>CARGA INSTALADA</Text>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.subtitle}>
                        {item.quantity} × {formatNumber(item.watts)} W ={" "}
                        {formatNumber(item.watts * item.quantity)} W
                      </Text>
                      <View style={styles.row}>
                        <Button
                          title={`Editar equipamento ${item.name}`}
                          secondary
                          disabled={busy}
                          onPress={() =>
                            open("equipment", item.id, {
                              name: item.name,
                              watts: String(item.watts),
                              quantity: String(item.quantity),
                            })
                          }
                        />
                        <Button
                          title={`Excluir equipamento ${item.name}`}
                          secondary
                          disabled={busy}
                          onPress={() =>
                            setRemoval({
                              label: `Excluir o equipamento “${item.name}”?`,
                              action: (db) => deleteEquipment(db, item.id),
                              after: () => {},
                            })
                          }
                        />
                      </View>
                    </View>
                  ))}
              </View>
              {((!project && !db.projects.length) ||
                (project && !circuit && !circuits.length) ||
                (circuit && !equipment.length)) && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    {circuit
                      ? "Quais cargas fazem parte deste circuito?"
                      : project
                        ? "Comece pelo primeiro circuito"
                        : "Seu primeiro projeto começa aqui"}
                  </Text>
                  <Text style={styles.subtitle}>
                    {circuit
                      ? "Informe a potência ativa e a quantidade de cada equipamento."
                      : project
                        ? "Informe tensão, sistema de alimentação e fator de potência."
                        : "Crie um projeto para organizar os circuitos de uma residência."}
                  </Text>
                </View>
              )}
            </>
          )}
          <Text style={styles.subtitle}>
            Armazenamento local · Sem conta ou envio de dados · Faça suas
            próprias cópias de segurança. Limpar os dados do navegador ou
            desinstalar o app pode apagar seus projetos.
          </Text>
        </ScrollView>
        {editor && (
          <Editor
            config={editor}
            busy={busy}
            saveError={error}
            onClose={() => setEditor(null)}
            onSave={save}
          />
        )}
        {removal && (
          <Modal
            transparent
            animationType="fade"
            onRequestClose={() => {
              if (!busy) setRemoval(null);
            }}
          >
            <View style={styles.overlay}>
              <View accessibilityViewIsModal style={styles.dialog}>
                <Text style={styles.cardTitle}>Confirmar exclusão</Text>
                {!!error && (
                  <Text accessibilityRole="alert" style={styles.error}>
                    {error}
                  </Text>
                )}
                <Text style={styles.subtitle}>
                  {removal.label} Esta ação não pode ser desfeita.
                </Text>
                <View style={styles.row}>
                  <Button
                    title="Confirmar exclusão"
                    danger
                    disabled={busy}
                    onPress={() => {
                      void mutate(removal.action).then((ok) => {
                        if (ok) {
                          removal.after();
                          setRemoval(null);
                        }
                      });
                    }}
                  />
                  <Button
                    title="Cancelar exclusão"
                    secondary
                    disabled={busy}
                    onPress={() => setRemoval(null)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
