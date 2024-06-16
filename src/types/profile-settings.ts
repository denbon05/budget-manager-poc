import type { Ref } from 'vue';

export interface ICategoryGroupItem {
  key: string;
  title: string;
  subtitle?: string;
  icon?: string;
  tooltip?: string;
  isEnabled: Ref<boolean>;
  onToggle: () => void;
}

export interface ICategoryGroup {
  value: string;
  title: string;
  items: ICategoryGroupItem[];
  icon?: string;
}
