import { makeId } from "./id";
import type { Initiative, Objective, Perspective, StrategyMap } from "../types";

function makeInitiative(text: string): Initiative {
  return { id: makeId("init"), text, progress: "not-on-track" };
}

function makeObjective(text: string, initiativeTexts: string[]): Objective {
  return {
    id: makeId("obj"),
    text,
    status: "none",
    initiatives: initiativeTexts.map(makeInitiative),
  };
}

function makePerspective(name: string, objectiveTexts: string[]): Perspective {
  return {
    id: makeId("persp"),
    name,
    visible: true,
    objectives: objectiveTexts.map((text) => makeObjective(text, ["New initiative"])),
  };
}

export function createDefaultMap(): StrategyMap {
  return {
    title: "Untitled Strategy Map",
    subtitle: "Add a short description of this strategy.",
    sections: {
      mission: { visible: true, text: "Add your mission statement here." },
      vision: { visible: true, text: "Add your vision statement here." },
      values: {
        visible: true,
        items: [
          { id: makeId("value"), text: "Value 1" },
          { id: makeId("value"), text: "Value 2" },
          { id: makeId("value"), text: "Value 3" },
          { id: makeId("value"), text: "Value 4" },
        ],
      },
    },
    perspectives: [
      makePerspective("Financial", ["New objective", "New objective"]),
      makePerspective("Customer", ["New objective", "New objective"]),
      makePerspective("Internal Process", ["New objective", "New objective"]),
      makePerspective("Learning & Growth", ["New objective", "New objective"]),
    ],
    connections: [],
  };
}
