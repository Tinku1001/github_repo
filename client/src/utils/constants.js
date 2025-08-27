export const API_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'stargazersCount', label: 'Stars' },
  { value: 'name', label: 'Name' }
];

export const DEBOUNCE_DELAY = 500;