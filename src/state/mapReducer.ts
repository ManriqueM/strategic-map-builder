import { makeId } from "../lib/id";
import type { InitiativeProgress, ObjectiveStatus, StrategyMap } from "../types";

export type MapAction =
  | { type: "SET_TITLE"; text: string }
  | { type: "SET_SUBTITLE"; text: string }
  | { type: "SET_MISSION_TEXT"; text: string }
  | { type: "SET_VISION_TEXT"; text: string }
  | { type: "TOGGLE_SECTION"; section: "mission" | "vision" | "values" }
  | { type: "ADD_VALUE" }
  | { type: "REMOVE_VALUE"; id: string }
  | { type: "SET_VALUE_TEXT"; id: string; text: string }
  | { type: "TOGGLE_PERSPECTIVE"; id: string }
  | { type: "ADD_PERSPECTIVE" }
  | { type: "REMOVE_PERSPECTIVE"; id: string }
  | { type: "RENAME_PERSPECTIVE"; id: string; name: string }
  | { type: "MOVE_PERSPECTIVE"; id: string; direction: "up" | "down" }
  | { type: "ADD_OBJECTIVE"; perspectiveId: string }
  | { type: "REMOVE_OBJECTIVE"; perspectiveId: string; objectiveId: string }
  | { type: "SET_OBJECTIVE_TEXT"; perspectiveId: string; objectiveId: string; text: string }
  | {
      type: "SET_OBJECTIVE_STATUS";
      perspectiveId: string;
      objectiveId: string;
      status: ObjectiveStatus;
    }
  | { type: "ADD_INITIATIVE"; perspectiveId: string; objectiveId: string }
  | {
      type: "REMOVE_INITIATIVE";
      perspectiveId: string;
      objectiveId: string;
      initiativeId: string;
    }
  | {
      type: "SET_INITIATIVE_TEXT";
      perspectiveId: string;
      objectiveId: string;
      initiativeId: string;
      text: string;
    }
  | {
      type: "SET_INITIATIVE_PROGRESS";
      perspectiveId: string;
      objectiveId: string;
      initiativeId: string;
      progress: InitiativeProgress;
    }
  | { type: "ADD_CONNECTION"; from: string; to: string }
  | { type: "REMOVE_CONNECTION"; id: string };

export function mapReducer(state: StrategyMap, action: MapAction): StrategyMap {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.text };

    case "SET_SUBTITLE":
      return { ...state, subtitle: action.text };

    case "SET_MISSION_TEXT":
      return {
        ...state,
        sections: {
          ...state.sections,
          mission: { ...state.sections.mission, text: action.text },
        },
      };

    case "SET_VISION_TEXT":
      return {
        ...state,
        sections: {
          ...state.sections,
          vision: { ...state.sections.vision, text: action.text },
        },
      };

    case "TOGGLE_SECTION":
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: {
            ...state.sections[action.section],
            visible: !state.sections[action.section].visible,
          },
        },
      };

    case "ADD_VALUE":
      return {
        ...state,
        sections: {
          ...state.sections,
          values: {
            ...state.sections.values,
            items: [
              ...state.sections.values.items,
              { id: makeId("value"), text: "New value" },
            ],
          },
        },
      };

    case "REMOVE_VALUE":
      return {
        ...state,
        sections: {
          ...state.sections,
          values: {
            ...state.sections.values,
            items: state.sections.values.items.filter((v) => v.id !== action.id),
          },
        },
      };

    case "SET_VALUE_TEXT":
      return {
        ...state,
        sections: {
          ...state.sections,
          values: {
            ...state.sections.values,
            items: state.sections.values.items.map((v) =>
              v.id === action.id ? { ...v, text: action.text } : v,
            ),
          },
        },
      };

    case "TOGGLE_PERSPECTIVE":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.id ? { ...p, visible: !p.visible } : p,
        ),
      };

    case "ADD_PERSPECTIVE":
      return {
        ...state,
        perspectives: [
          ...state.perspectives,
          {
            id: makeId("persp"),
            name: "New Perspective",
            visible: true,
            objectives: [],
          },
        ],
      };

    case "REMOVE_PERSPECTIVE":
      return {
        ...state,
        perspectives: state.perspectives.filter((p) => p.id !== action.id),
      };

    case "RENAME_PERSPECTIVE":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.id ? { ...p, name: action.name } : p,
        ),
      };

    case "MOVE_PERSPECTIVE": {
      const index = state.perspectives.findIndex((p) => p.id === action.id);
      if (index === -1) return state;
      const targetIndex = action.direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= state.perspectives.length) return state;
      const next = [...state.perspectives];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return { ...state, perspectives: next };
    }

    case "ADD_OBJECTIVE":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? {
                ...p,
                objectives: [
                  ...p.objectives,
                  { id: makeId("obj"), text: "New objective", status: "none", initiatives: [] },
                ],
              }
            : p,
        ),
      };

    case "REMOVE_OBJECTIVE":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? { ...p, objectives: p.objectives.filter((o) => o.id !== action.objectiveId) }
            : p,
        ),
      };

    case "SET_OBJECTIVE_TEXT":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? {
                ...p,
                objectives: p.objectives.map((o) =>
                  o.id === action.objectiveId ? { ...o, text: action.text } : o,
                ),
              }
            : p,
        ),
      };

    case "SET_OBJECTIVE_STATUS":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? {
                ...p,
                objectives: p.objectives.map((o) =>
                  o.id === action.objectiveId ? { ...o, status: action.status } : o,
                ),
              }
            : p,
        ),
      };

    case "ADD_INITIATIVE":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? {
                ...p,
                objectives: p.objectives.map((o) =>
                  o.id === action.objectiveId
                    ? {
                        ...o,
                        initiatives: [
                          ...o.initiatives,
                          { id: makeId("init"), text: "New initiative", progress: "not-on-track" },
                        ],
                      }
                    : o,
                ),
              }
            : p,
        ),
      };

    case "REMOVE_INITIATIVE":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? {
                ...p,
                objectives: p.objectives.map((o) =>
                  o.id === action.objectiveId
                    ? {
                        ...o,
                        initiatives: o.initiatives.filter(
                          (i) => i.id !== action.initiativeId,
                        ),
                      }
                    : o,
                ),
              }
            : p,
        ),
      };

    case "SET_INITIATIVE_TEXT":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? {
                ...p,
                objectives: p.objectives.map((o) =>
                  o.id === action.objectiveId
                    ? {
                        ...o,
                        initiatives: o.initiatives.map((i) =>
                          i.id === action.initiativeId ? { ...i, text: action.text } : i,
                        ),
                      }
                    : o,
                ),
              }
            : p,
        ),
      };

    case "SET_INITIATIVE_PROGRESS":
      return {
        ...state,
        perspectives: state.perspectives.map((p) =>
          p.id === action.perspectiveId
            ? {
                ...p,
                objectives: p.objectives.map((o) =>
                  o.id === action.objectiveId
                    ? {
                        ...o,
                        initiatives: o.initiatives.map((i) =>
                          i.id === action.initiativeId
                            ? { ...i, progress: action.progress }
                            : i,
                        ),
                      }
                    : o,
                ),
              }
            : p,
        ),
      };

    case "ADD_CONNECTION": {
      const { from, to } = action;
      if (from === to) return state;
      const exists = state.connections.some(
        (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from),
      );
      if (exists) return state;
      return {
        ...state,
        connections: [...state.connections, { id: makeId("conn"), from, to }],
      };
    }

    case "REMOVE_CONNECTION":
      return {
        ...state,
        connections: state.connections.filter((c) => c.id !== action.id),
      };

    default:
      return state;
  }
}
