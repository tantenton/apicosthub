'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2, Cpu, FileCode } from 'lucide-react';

interface CodeSnippetPlaygroundProps {
  modelId?: string;
  modelName?: string;
  provider?: string;
}

export default function CodeSnippetPlayground({
  modelId = 'deepseek-v3',
  modelName = 'DeepSeek V3',
  provider = 'DeepSeek',
}: CodeSnippetPlaygroundProps) {
  const [activeTab, setActiveTab] = useState<'python' | 'typescript' | 'curl' | 'litellm'>('python');
  const [copied, setCopied] = useState(false);

  const snippets = {
    python: `# Python 3.10+ async client with streaming & prompt cache headers
import os
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key=os.environ.get("AI_API_KEY"),
    base_url="https://api.${provider.toLowerCase()}.com/v1"
)

async def main():
    response = await client.chat.completions.create(
        model="${modelId}",
        messages=[
            {
                "role": "system",
                "content": [
                    {"type": "text", "text": "You are a specialized code analyst.", "cache_control": {"type": "ephemeral"}}
                ]
            },
            {"role": "user", "content": "Analyze the AST tree for memory leaks."}
        ],
        temperature=0.2,
        stream=True
    )
    async for chunk in response:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)

if __name__ == "__main__":
    asyncio.run(main())`,

    typescript: `// TypeScript Next.js 14 Route Handler with Edge Streaming
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: 'https://api.${provider.toLowerCase()}.com/v1',
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: '${modelId}',
    stream: true,
    messages,
    temperature: 0.3,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}`,

    curl: `# cURL Streaming Request with Raw Latency Profiling
curl -s -N -X POST "https://api.${provider.toLowerCase()}.com/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $AI_API_KEY" \\
  -d '{
    "model": "${modelId}",
    "messages": [
      {"role": "system", "content": "You are an expert system."},
      {"role": "user", "content": "Explain KV-cache prefix hits."}
    ],
    "stream": true,
    "temperature": 0.2
  }' \\
  -w "\\n[TTFT: %{time_starttransfer}s | TOTAL: %{time_total}s]\\n"`,

    litellm: `# litellm-proxy config.yaml
model_list:
  - model_name: ${modelId}
    litellm_params:
      model: ${provider.toLowerCase()}/${modelId}
      api_key: os.environ/API_KEY
      tpm: 200000
      rpm: 1000

router_settings:
  routing_strategy: "latency-based-routing"
  redis_host: localhost
  redis_port: 6379
  cache_responses: true`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface-card rounded-2xl border border-slate-200 overflow-hidden shadow-lg my-8">
      {/* Tab Header */}
      <div className="bg-slate-900 text-slate-300 p-3.5 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Developer Integration Playground: {modelName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg font-mono text-[11px]">
            {(['python', 'typescript', 'curl', 'litellm'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="bg-[#0f172a] p-5 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed selection:bg-indigo-500 selection:text-white">
        <pre>{snippets[activeTab]}</pre>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 border-t border-slate-200 px-5 py-2.5 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Ready-to-run copy/paste implementation for production environments.</span>
        <span className="font-mono text-slate-700 font-semibold">SDK Spec: OpenAI v1.40+ / Anthropic v0.34+</span>
      </div>
    </div>
  );
}
