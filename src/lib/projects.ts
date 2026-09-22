export const projectStatuses = ['active', 'published', 'reference', 'paused'] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export function statusLabel(status: ProjectStatus): string {
  switch (status) {
    case 'active':
      return 'In progress';
    case 'published':
      return 'Published';
    case 'reference':
      return 'Reference';
    case 'paused':
      return 'Paused';
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
