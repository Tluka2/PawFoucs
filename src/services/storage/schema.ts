export type StoreName = 'users' | 'pets' | 'memos' | 'habits' | 'pomodoro_history' | 'pomodoro_state' | 'outfits' | 'health_records' | 'achievements' | 'settings';

export const DATABASE_SCHEMA = {
  name: 'LearningCompanion',
  version: 1,
  stores: {
    users: {
      keyPath: 'userId',
      indexes: ['username', 'createdAt']
    },
    pets: {
      keyPath: 'id',
      indexes: ['type', 'isSelected']
    },
    memos: {
      keyPath: 'id',
      indexes: ['timestamp', 'isImportant']
    },
    habits: {
      keyPath: 'id',
      indexes: ['createdAt']
    },
    pomodoro_history: {
      keyPath: 'id',
      indexes: ['userId', 'date']
    },
    pomodoro_state: {
      keyPath: 'key'
    },
    outfits: {
      keyPath: 'id',
      indexes: ['category', 'isOwned']
    },
    health_records: {
      keyPath: 'id',
      indexes: ['userId', 'date']
    },
    achievements: {
      keyPath: 'id',
      indexes: ['userId']
    },
    settings: {
      keyPath: 'key'
    }
  }
};
