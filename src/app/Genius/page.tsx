import fs from 'fs/promises';
import path from 'path';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { ArrowLeft, Code } from 'lucide-react';
import './style.css';

export default async function GeniusPage() {
  const filePath = path.join(process.cwd(), 'src/app/Genius/genius.md');
  const content = await fs.readFile(filePath, 'utf-8');

  return (
    <div className="min-h-screen p-8 font-sans detail-container">
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <Link 
                    href="/" 
                    className="flex items-center gap-2 transition-colors hover:text-indigo-400"
                >
                    <ArrowLeft size={20} />
                    <span>返回首页</span>
                </Link>
                <Link 
                    href="https://github.com/govin999999/Genius"
                    className="btn shadow-md"
                >
                    <Code size={20} />
                    <span>查看代码库</span>
                </Link>
            </div>

            {/* Content Card */}
            <div className="card">
                <div className="flex items-start gap-4">
                    <img 
                        src="/bg/genius.jpg" 
                        alt="Genius Icon" 
                        className="w-10 h-10 rounded-lg object-cover shadow-sm flex-shrink-0 mt-1"
                        width="40"
                        height="40"
                    />
                    <article className="flex-grow">
                        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
                    </article>
                </div>
            </div>
        </div>
    </div>
  );
}
