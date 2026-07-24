export interface Initiative {
  id: string;
  text: string;
}

export type ObjectiveStatus = "none" | "on-track" | "needs-attention" | "off-track";

export interface Objective {
  id: string;
  text: string;
  status: ObjectiveStatus;
  initiatives: Initiative[];
}

export interface Perspective {
  id: string;
  name: string;
  visible: boolean;
  objectives: Objective[];
}

export interface Sections {
  mission: { visible: boolean; text: string };
  vision: { visible: boolean; text: string };
  values: { visible: boolean; items: { id: string; text: string }[] };
}

export interface Connection {
  id: string;
  from: string;
  to: string;
}

export interface StrategyMap {
  title: string;
  subtitle: string;
  sections: Sections;
  perspectives: Perspective[];
  connections: Connection[];
}
