export const projectStatuses = ['active', 'published', 'reference', 'paused'] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const workKinds = ['independent', 'public', 'research'] as const;

export type WorkKind = (typeof workKinds)[number];

export function workKindLabel(kind: WorkKind): string {
  switch (kind) {
    case 'independent':
      return 'Independent investigation';
    case 'public':
      return 'Public technical work';
    case 'research':
      return 'Research project';
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

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
