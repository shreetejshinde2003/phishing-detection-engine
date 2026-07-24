export interface Indicator {
  description: string;
  mitreId: string;
}

export interface AnalysisResult {
  riskScore: number;
  explanation: string;
  indicators: Indicator[];
  latencyMs?: number;
  model?: string;
}

export interface MaliciousElement {
  element: string;
  reason: string;
}

export interface TrainingScenario {
  sender: string;
  subject: string;
  body: string;
  maliciousElements: MaliciousElement[];
}
