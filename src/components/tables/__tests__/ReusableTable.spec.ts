import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ReusableTable from '@/components/tables/ReusableTable.vue'

const columns = [
  { key: 'name', label: 'Name', type: 'text' }
]

const data = [
  { id: 1, name: 'Alpha' }
]

describe('ReusableTable.vue', () => {
  it('shows skeleton rows when loading is true', () => {
    const wrapper = mount(ReusableTable, {
      props: {
        title: 'Test Table',
        columns,
        data,
        actions: [],
        loading: true,
        selectable: false,
        showHeader: true
      }
    })

    // Skeleton rows use animate-pulse class
    const skeletonRows = wrapper.findAll('tr.animate-pulse')
    expect(skeletonRows.length).toBeGreaterThan(0)
  })

  it('invokes action handler and emits action event on click', async () => {
    const handler = vi.fn()
    const wrapper = mount(ReusableTable, {
      props: {
        title: 'Test Table',
        columns,
        data,
        actions: [
          { label: 'Test', handler }
        ],
        loading: false,
        selectable: false,
        showHeader: true
      }
    })

    const toggleButton = wrapper.find('button[title="More options"]')
    expect(toggleButton.exists()).toBe(true)
    toggleButton.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    const firstAction = wrapper.find('.absolute .py-1 button')
    expect(firstAction.exists()).toBe(true)
    await firstAction.trigger('click')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(data[0])

    const emitted = wrapper.emitted('action')
    expect(emitted).toBeTruthy()
    // Emitted as: (action label, item)
    expect(emitted?.[0]).toEqual(['Test', data[0]])
  })
})