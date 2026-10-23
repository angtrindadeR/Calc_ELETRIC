import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateCurrent } from "../src/domain/calculations";
import { Circuit, Equipment } from "../src/domain/model";
const circuit: Circuit = {
  id: "c",
  projectId: "p",
  name: "Tomadas",
  voltage: 220,
  powerFactor: 1,
  phase: "single",
};
const load = (watts: number, quantity = 1): Equipment => ({
  id: "e",
  circuitId: "c",
  name: "Carga",
  watts,
  quantity,
});
function near(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
}
test("monofásico: 2200 W / 220 V = 10 A e memória com unidades", () => {
  const result = calculateCurrent(circuit, [load(2200)]);
  assert.equal(result.amps, 10);
  assert.equal(result.watts, 2200);
  assert.match(result.formula, /FP/);
  assert.match(result.substitution, /220 V/);
  assert.match(result.reference, /1\.0/);
});
test("FP 0,8: 1760 W em 220 V resulta em 10 A", () =>
  near(
    calculateCurrent({ ...circuit, powerFactor: 0.8 }, [load(1760)]).amps,
    10,
  ));
test("trifásico equilibrado: 6600 W, 220 V e FP 1 resulta em 10√3 A", () =>
  near(
    calculateCurrent({ ...circuit, phase: "three" }, [load(6600)]).amps,
    17.320508075688775,
  ));
test("trifásico com FP 0,5: 3300 W, 220 V resulta em 10√3 A", () =>
  near(
    calculateCurrent({ ...circuit, phase: "three", powerFactor: 0.5 }, [
      load(3300),
    ]).amps,
    17.320508075688775,
  ));
test("quantidades e equipamentos somam potência sem demanda", () => {
  const result = calculateCurrent(circuit, [
    load(100, 3),
    { ...load(1900), id: "e2" },
  ]);
  assert.equal(result.watts, 2200);
  assert.equal(result.amps, 10);
});
test("circuito sem equipamento tem zero W e zero A", () =>
  assert.equal(calculateCurrent(circuit, []).amps, 0));
for (const value of [0, -1, NaN, Infinity, -Infinity]) {
  test(`rejeita tensão ${value}`, () =>
    assert.throws(() => calculateCurrent({ ...circuit, voltage: value }, [])));
  test(`rejeita FP ${value}`, () =>
    assert.throws(() =>
      calculateCurrent({ ...circuit, powerFactor: value }, []),
    ));
  test(`rejeita potência ${value}`, () =>
    assert.throws(() => calculateCurrent(circuit, [load(value)])));
}
test("rejeita FP acima de 1", () =>
  assert.throws(() => calculateCurrent({ ...circuit, powerFactor: 1.01 }, [])));
for (const quantity of [0, -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1])
  test(`rejeita quantidade ${quantity}`, () =>
    assert.throws(() => calculateCurrent(circuit, [load(10, quantity)])));
test("rejeita equipamento de outro circuito", () =>
  assert.throws(() =>
    calculateCurrent(circuit, [{ ...load(100), circuitId: "outro" }]),
  ));
test("overflow na soma é reportado", () =>
  assert.throws(() =>
    calculateCurrent(circuit, [load(1e308), { ...load(1e308), id: "e2" }]),
  ));
test("overflow no produto é reportado", () =>
  assert.throws(() => calculateCurrent(circuit, [load(1e308, 10)])));
test("underflow no denominador e overflow na corrente são reportados", () => {
  assert.throws(() =>
    calculateCurrent(
      { ...circuit, voltage: Number.MIN_VALUE, powerFactor: 0.1 },
      [load(1)],
    ),
  );
  assert.throws(() =>
    calculateCurrent({ ...circuit, voltage: Number.MIN_VALUE }, [load(1e308)]),
  );
});
