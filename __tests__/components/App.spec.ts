import { describe, expect, it } from 'vitest';

import App from '@/App.vue';
import { mount } from '@vue/test-utils';

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(App);
    expect(wrapper.exists).toBeTruthy();
  });
});
