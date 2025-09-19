import type { Meta, StoryObj } from '@storybook/react'
import { TopNavBar } from '@/components/nav/TopNavBar'
import { NavProvider } from '@/context/NavContext'

const meta: Meta<typeof TopNavBar> = {
  title: 'Navigation/TopNavBar',
  component: TopNavBar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <NavProvider>
        <Story />
      </NavProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof TopNavBar>

export const Default: Story = {
  args: {},
}

export const WithUnreadCounts: Story = {
  args: {},
  parameters: {
    mockData: [
      {
        url: '/api/notifications/unread-counts',
        method: 'GET',
        status: 200,
        response: {
          notifications: 5,
          chat: 3
        }
      }
    ]
  }
}

export const SellerUser: Story = {
  args: {},
  parameters: {
    mockData: [
      {
        url: '/api/user',
        method: 'GET',
        status: 200,
        response: {
          id: '1',
          name: 'John Seller',
          email: 'john@example.com',
          role: 'company',
          sellerEnabled: true,
          avatarUrl: '/avatars/john.jpg',
          permissions: ['read', 'write', 'sell']
        }
      }
    ]
  }
}
