import fs from 'fs/promises';
import path from 'path';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Link from 'next/link';
import { ArrowLeft, FileJson } from 'lucide-react';
import '../style.css';

export default async function CodePage() {
  const filePath = path.join(process.cwd(), 'src/app/Genius/tradegenius.js');
  const content = await fs.readFile(filePath, 'utf-8');

  return (
    <div className="min-h-screen p-8">
      <div className="container space-y-6">
         {/* Navigation */}
         <div className="flex items-center justify-between">
            <Link 
                href="/Genius" 
                className="btn btn-secondary"
            >
                <ArrowLeft size={20} />
                <span>返回详情</span>
            </Link>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
                <FileJson size={16} />
                <span>tradegenius.js</span>
            </div>
        </div>

        {/* Code Block Card */}
        <div className="card !p-0 overflow-hidden">
             <div className="flex items-center gap-2 px-4 py-3 bg-[#0f172a] border-b border-white/10">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="ml-2 text-xs text-slate-400 font-mono">tradegenius.js</span>
             </div>
             <div className="text-sm font-mono overflow-auto max-h-[80vh]">
                <SyntaxHighlighter 
                    language="javascript" 
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                    showLineNumbers={true}
                >
                    {content}
                </SyntaxHighlighter>
             </div>
        </div>
      </div>
    </div>
  );
}
