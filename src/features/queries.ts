import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { odysseyRepository } from '@/data/repositories/odysseyRepository';

export const queryKeys = {
  activeBoss: ['active-boss'] as const,
  today: (date: string) => ['occurrences', date, date] as const,
  range: (start: string, end: string) => ['occurrences', start, end] as const,
  boss: ['boss-summary'] as const,
  milestones: ['milestones'] as const,
  progress: ['progress'] as const,
  history: ['history'] as const,
  settings: ['settings'] as const,
};

export function useOccurrences(start: string, end = start) {
  return useQuery({
    queryKey: queryKeys.range(start, end),
    queryFn: () => odysseyRepository.getOccurrences(start, end),
  });
}

export function useBoss() {
  return useQuery({
    queryKey: queryKeys.boss,
    queryFn: () => odysseyRepository.getBossSummary(),
  });
}

export function useMilestones() {
  return useQuery({
    queryKey: queryKeys.milestones,
    queryFn: () => odysseyRepository.getMilestones(),
  });
}

export function useProgress() {
  return useQuery({
    queryKey: queryKeys.progress,
    queryFn: () => odysseyRepository.getProgress(),
  });
}

export function useHistory() {
  return useQuery({
    queryKey: queryKeys.history,
    queryFn: () => odysseyRepository.getHistory(),
  });
}

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => odysseyRepository.getSettings(),
  });
}

export function useRefreshOdyssey() {
  const client = useQueryClient();
  return () => client.invalidateQueries();
}

export function useBeginQuest() {
  const refresh = useRefreshOdyssey();
  return useMutation({
    mutationFn: (id: string) => odysseyRepository.beginQuest(id),
    onSuccess: refresh,
  });
}

export function useToggleMilestone() {
  const refresh = useRefreshOdyssey();
  return useMutation({
    mutationFn: (id: string) => odysseyRepository.toggleMilestone(id),
    onSuccess: refresh,
  });
}
