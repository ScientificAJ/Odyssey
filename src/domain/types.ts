export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ProofRule = 'not_needed' | 'optional' | 'required';
export type QuestState =
  | 'scheduled'
  | 'in_progress'
  | 'complete'
  | 'partial'
  | 'rescheduled'
  | 'skipped'
  | 'overdue'
  | 'missed';
export type QuestKind = 'habit' | 'task';
export type IntensityUnit =
  | 'minutes'
  | 'hours'
  | 'pages'
  | 'repetitions'
  | 'items'
  | 'kilometres'
  | 'sessions';

export interface QuestOccurrence {
  id: string;
  templateId: string;
  kind: QuestKind;
  title: string;
  localDate: string;
  startTime: string | null;
  deadlineTime: string | null;
  priority: Priority;
  state: QuestState;
  targetIntensity: number | null;
  minimumWin: number | null;
  unit: IntensityUnit | null;
  proofRule: ProofRule;
  notes: string | null;
  milestoneId: string | null;
  userOrder: number;
  startedAt: string | null;
}

export interface CompletionInput {
  actualIntensity: number | null;
  outcome: 'complete' | 'partial' | 'skipped';
  note?: string;
  proofId?: string;
}

export interface ProgressOccurrence {
  state: QuestState;
  targetIntensity: number | null;
  actualIntensity: number | null;
  priority: Priority;
}

export interface ProgressMetrics {
  consistency: number;
  intensity: number | null;
  momentum: number;
  xp: number;
  showedUp: number;
  due: number;
}
