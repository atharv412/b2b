import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    // Mock mention suggestions
    const suggestions = [
      { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: '/avatars/john.jpg', type: 'user' },
      { id: 'user2', name: 'Sarah Wilson', email: 'sarah@example.com', avatar: '/avatars/sarah.jpg', type: 'user' },
      { id: 'user3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '/avatars/mike.jpg', type: 'user' },
      { id: 'group1', name: 'Design Team', email: 'design@company.com', type: 'group' },
      { id: 'group2', name: 'Marketing Team', email: 'marketing@company.com', type: 'group' }
    ]

    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.name.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.email.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json(filteredSuggestions)
  } catch (error) {
    console.error('Error fetching mention suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mention suggestions' },
      { status: 500 }
    )
  }
}
