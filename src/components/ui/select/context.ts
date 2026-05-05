import type { InjectionKey, Ref } from 'vue';

export interface SelectContext {
  modelValue: Ref<string | undefined>;
  isOpen: Ref<boolean>;
  onSelect: (value: string) => void;
  toggle: () => void;
  close: () => void;
}

export const SELECT_INJECTION_KEY: InjectionKey<SelectContext> = Symbol('select');
