import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Base prompt for code analysis
const BASE_PROMPT = 'You are an AI specialized in debugging and optimizing code. Analyze the following code and provide:\n' +
  '1. A corrected/optimized version\n' +
  '2. Identify and fix any bugs\n' +
  '3. Suggest performance improvements\n' +
  '4. Address security concerns\n' +
  '5. Improve code readability and maintainability\n\n' +
  'Please respond in the following format:\n' +
  '```[language]\n' +
  '[optimized code]\n' +
  '```';

// Mode-specific instructions
const MODE_INSTRUCTIONS = {
  default: "Focus on general improvements and bug fixes.",
  security: "Focus primarily on security vulnerabilities and their fixes.",
  performance: "Focus on performance optimizations and efficiency improvements.",
  readability: "Focus on improving code readability, documentation, and maintainability.",
  all: "Provide comprehensive improvements across all aspects: security, performance, readability, and bug fixes.",
};

export async function POST(request: Request) {
  try {
    const { code, language, analysisMode } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "No code provided" },
        { status: 400 }
      );
    }

    const modeInstruction = MODE_INSTRUCTIONS[analysisMode as keyof typeof MODE_INSTRUCTIONS];
    const prompt = BASE_PROMPT + '\n\n' +
      'Additional request: ' + modeInstruction + '\n\n' +
      'Code:\n' +
      '```' + language + '\n' +
      code + '\n' +
      '```';

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const optimizedCode = completion.choices[0]?.message?.content || "";

    // Extract code from markdown code block if present
    const codeMatch = optimizedCode.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
    const extractedCode = codeMatch ? codeMatch[1].trim() : optimizedCode.trim();

    return NextResponse.json({ optimizedCode: extractedCode });
  } catch (error) {
    console.error("Analysis failed:", error);
    return NextResponse.json(
      { error: "Failed to analyze code" },
      { status: 500 }
    );
  }
} 