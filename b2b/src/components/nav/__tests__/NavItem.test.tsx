import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { NavItem } from '../NavItem'
import { User } from 'lucide-react'

const mockItem = {
  id: 'test',
  label: 'Test Item',
  icon: User,
  href: '/test',
  visible: () => true
}

describe('NavItem', () => {
  it('renders correctly', () => {
    render(
      <NavItem
        item={mockItem}
        isActive={false}
        onClick={() => {}}
      />
    )
    
    expect(screen.getByText('Test Item')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test')
  })

  it('shows active state', () => {
    render(
      <NavItem
        item={mockItem}
        isActive={true}
        onClick={() => {}}
      />
    )
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('shows badge when provided', () => {
    const itemWithBadge = { ...mockItem, badge: 5 }
    
    render(
      <NavItem
        item={itemWithBadge}
        isActive={false}
        onClick={() => {}}
      />
    )
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    
    render(
      <NavItem
        item={mockItem}
        isActive={false}
        onClick={handleClick}
      />
    )
    
    fireEvent.click(screen.getByRole('link'))
    expect(handleClick).toHaveBeenCalled()
  })
})
