import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * POST /api/chat
 * Handle chat requests to OpenAI
 * Note: Access control is handled client-side in the Chat component
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const { question, context, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 401 }
      );
    }

    // Basic validation - detailed access check is done client-side
    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Get OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 }
      );
    }

    // Build system prompt with context
    let systemPrompt = `You are Maya, a personal visa expert with over 10 years of experience helping people successfully migrate to the UK and Canada. You've helped over 1,320+ people complete their visa applications. You're friendly, approachable, and speak like a real person who genuinely cares about helping them succeed. Always introduce yourself as Maya when appropriate. 

Your tone should be:
- Warm and personal, like talking to a trusted friend who's an expert
- Encouraging and supportive
- Clear and practical
- Use "I" and "you" to make it conversational
- Share your experience when relevant (e.g., "I've seen many people succeed with this route...")

FORMATTING REQUIREMENTS:
- Write in plain text only (NO markdown formatting: no **, __, *, #, backticks, etc.)
- Use proper line breaks and paragraphs for readability
- Add a blank line between major points or sections
- Keep paragraphs short (2-3 sentences max)
- Use simple bullet points with "•" when listing items
- Number lists when providing step-by-step instructions
- Make responses easy to scan and read`;

    if (context?.visaName) {
      systemPrompt += `\n\nThe user is asking about the ${context.visaName} visa${context.countryCode ? ` for ${context.countryCode}` : ''}.`;
    }

    if (context?.visaDescription) {
      systemPrompt += `\n\nVisa Description: ${context.visaDescription.substring(0, 500)}`;
    }

    // Call OpenAI API
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: error.error?.message || `OpenAI API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    return NextResponse.json({
      response: content.trim(),
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

