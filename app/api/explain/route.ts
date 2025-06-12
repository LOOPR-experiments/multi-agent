import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client with error handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }
  return new OpenAI({ apiKey });
};

const EXPLAIN_PROMPT = 'Analyze the following code and provide:\n' +
  '1. A brief summary of what the code does\n' +
  '2. Time and space complexity analysis\n' +
  '3. A mermaid.js flowchart showing the code\'s logic (use graph TD for top-down flow diagrams)\n' +
  '4. A list of specific recommendations for improvement\n\n' +
  'Format your response as a JSON object with the following structure:\n' +
  '{\n' +
  '  "summary": "Brief explanation of the code\'s purpose and functionality",\n' +
  '  "complexity": "Detailed complexity analysis",\n' +
  '  "flowchart": "graph TD\\nA[Start] --> B[Process]\\nB --> C[End]",\n' +
  '  "recommendations": ["recommendation1", "recommendation2", ...]\n' +
  '}\n\n' +
  'Important: For the flowchart, use valid mermaid.js syntax with graph TD direction. Use simple node names (A, B, C, etc.) and clear labels in square brackets. Connect nodes with arrows (-->).';

export async function POST(request: Request) {
  try {
    // Initialize OpenAI client
    const openai = getOpenAIClient();

    // Parse request body
    const { code, language } = await request.json().catch(() => ({}));

    // Validate input
    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    // Construct prompt
    const prompt = [
      EXPLAIN_PROMPT,
      `Code in ${language}:`,
      '```' + language,
      code,
      '```'
    ].join('\n');

    // Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    // Parse and validate response
    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    const explanation = JSON.parse(response);

    // Validate explanation structure
    if (!explanation.summary || !explanation.complexity || !explanation.flowchart || !explanation.recommendations) {
      throw new Error('Invalid response format from OpenAI');
    }

    // Process flowchart
    if (!explanation.flowchart.trim().startsWith('graph TD')) {
      explanation.flowchart = 'graph TD\n' + explanation.flowchart;
    }

    // Add default flowchart if invalid
    if (!explanation.flowchart.includes('-->')) {
      explanation.flowchart = `graph TD
        A[Code Analysis] --> B[Function Start]
        B --> C[Process Data]
        C --> D[Function End]`;
    }

    return NextResponse.json(explanation);
  } catch (error) {
    console.error("Explanation failed:", error);
    const message = error instanceof Error ? error.message : 'Failed to generate explanation';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 