import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '@/components/forms/FormElements/Input.vue'

describe('FormElements/Input.vue', () => {
  it('renders with type and step attributes', () => {
    const wrapper = mount(Input, {
      props: {
        type: 'number',
        step: '0.01',
        modelValue: ''
      }
    })

    const inputEl = wrapper.find('input')
    expect(inputEl.exists()).toBe(true)
    expect(inputEl.attributes('type')).toBe('number')
    expect(inputEl.attributes('step')).toBe('0.01')
  })

  it('emits update:modelValue, input, and clear-error on input', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'text',
        modelValue: ''
      }
    })

    const inputEl = wrapper.find('input')
    await inputEl.setValue('Hello')

    const updateEvents = wrapper.emitted('update:modelValue')
    const inputEvents = wrapper.emitted('input')
    const clearErrorEvents = wrapper.emitted('clear-error')

    expect(updateEvents).toBeTruthy()
    expect(updateEvents?.[0]).toEqual(['Hello'])
    expect(inputEvents).toBeTruthy()
    expect(inputEvents?.[0]).toEqual(['Hello'])
    expect(clearErrorEvents).toBeTruthy()
  })

  it('emits blur on losing focus', async () => {
    const wrapper = mount(Input, {
      props: {
        type: 'text',
        modelValue: ''
      }
    })

    const inputEl = wrapper.find('input')
    await inputEl.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })
})