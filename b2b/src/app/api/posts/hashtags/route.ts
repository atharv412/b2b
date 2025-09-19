import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    // Mock hashtag suggestions
    const suggestions = [
      { tag: 'innovation', count: 1250, trending: true },
      { tag: 'productlaunch', count: 890, trending: false },
      { tag: 'B2B', count: 2100, trending: true },
      { tag: 'entrepreneurs', count: 1560, trending: false },
      { tag: 'conference', count: 980, trending: false },
      { tag: 'technology', count: 3200, trending: true },
      { tag: 'business', count: 4500, trending: false },
      { tag: 'networking', count: 1200, trending: false }
    ]

    const filteredSuggestions = suggestions.filter(suggestion =>
      suggestion.tag.toLowerCase().includes(query.toLowerCase())
    )

    return NextResponse.json(filteredSuggestions)
  } catch (error) {
    console.error('Error fetching hashtag suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hashtag suggestions' },
      { status: 500 }
    )
  }
}
