import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import CustomerDetails from '@/views/Customers/CustomerDetails.vue'

// Mock router to provide route params
vi.mock('@/router', () => ({
  default: {
    currentRoute: { value: { params: { id: '1' } } },
  },
}))

// Mock guest API to return a minimal customer profile
vi.mock('@/services/guestApi', () => ({
  getCustomerProfile: vi.fn().mockResolvedValue({
    status: 200,
    data: {
      data: {
        guest: {
          id: 1,
          title: 'Mr',
          firstName: 'John',
          lastName: 'Doe',
          guestType: 'Regular',
          blacklisted: false,
        },
      },
    },
  }),
  getGuestsActivityLogs: vi.fn().mockResolvedValue({ data: { data: [] } }),
  deleteGuest: vi.fn(),
  toggleGuestBlacklist: vi.fn(),
}))

// Mock stores and toast
vi.mock('@/composables/user', () => ({
  useAuthStore: () => ({ hasPermission: () => true }),
}))

vi.mock('@/composables/serviceStore', () => ({
  useServiceStore: () => ({ serviceId: 123 }),
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

// Mock external PDF viewer library used indirectly by nested components
vi.mock('vue3-pdf-app', () => ({
  default: {},
}))

describe('CustomerDetails Dark Mode', () => {
  beforeEach(() => {
    document.documentElement.classList.add('dark')
  })

  it('applies dark mode classes to header and basic info card', async () => {
    const wrapper = shallowMount(CustomerDetails, {
      global: {
        stubs: {
          AdminLayout: {
            template: '<div><slot /></div>',
          },
          FullScreenLayout: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    // Wait for onMounted async calls to resolve
    await flushPromises()

    // Header should have dark background class
    const header = wrapper.find('[data-testid="customer-header"]')
    expect(header.exists()).toBe(true)
    expect(header.attributes('class') || '').toContain('dark:bg-gray-800')

    // Basic info card should have dark card class
    const basicInfoCard = wrapper.find('[data-testid="basic-info-card"]')
    expect(basicInfoCard.exists()).toBe(true)
    expect(basicInfoCard.attributes('class') || '').toContain('dark:bg-white/[0.03]')
  })
})