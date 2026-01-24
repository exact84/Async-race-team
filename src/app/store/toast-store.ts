import { createStore } from '@ripetchor/ssm';

export interface Toast {
  id: string;
  message: string;
  timeout?: number;
  type: 'error' | 'info' | 'success';
}

const initialState: { toasts: Toast[] } = { toasts: [] };

export const toastStore = createStore(initialState);
