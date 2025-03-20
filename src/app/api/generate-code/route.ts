import { NextRequest, NextResponse } from "next/server";

// Simulated delay to mimic AI processing time
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple mock for an AI code generation endpoint
export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 },
            );
        }

        // Simulate processing time
        await delay(2000);

        // Generate a simple React app based on the prompt
        // In a real implementation, this would call an actual AI service
        const files = {
            "App.js": `
import React, { useState } from 'react';
import './styles.css';

// Generated based on prompt: "${prompt}"
export default function App() {
  const [message, setMessage] = useState('Hello from AI-generated app!');
  
  return (
    <div className="app-container">
      <h1>AI-Generated App</h1>
      <p>Your prompt: "${prompt}"</p>
      <div className="content">
        <p>{message}</p>
        <button onClick={() => setMessage('You clicked the button!')}>
          Click me
        </button>
      </div>
    </div>
  );
}`,
            "styles.css": `
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #2c3e50;
}

.content {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}
`,
        };

        return NextResponse.json({ files });
    } catch (error) {
        console.error("Error generating code:", error);
        return NextResponse.json(
            { error: "Failed to generate code" },
            { status: 500 },
        );
    }
}
