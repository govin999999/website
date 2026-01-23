"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Github, 
  Twitter, 
  ExternalLink, 
  Code2, 
  Sparkles,
  Search
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 1. 数据配置
const PROFILE = {
  name: "govin的百宝箱",
  bio: "收录自写及社区优秀的 Web3 工具，涵盖交易、分析、预测市场等领域。",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=govin",
  socials: [
    { icon: Twitter, href: "https://x.com/govin999999", label: "Twitter" },
    { icon: Github, href: "https://github.com/govin999999", label: "GitHub" },
  ],
};

const CATEGORIES = [
  "全部",
  "PerpDex",
  "预测市场",
  "meme",
  "新品",
  "社区系列",
  "实验测试",
  "策略分析"
];

const PROJECTS = [
  {
    title: "TradeGenius Auto Swap",
    description: "全自动 USDC/USDT 交易脚本，支持智能余额检测与循环执行。",
    icon: Code2,
    href: "/Genius",
    tag: "SCRIPT",
    category: "PerpDex"
  }
];

// 2. 动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("全部");

  const filteredProjects = activeCategory === "全部" 
    ? PROJECTS 
    : PROJECTS.filter(project => project.category === activeCategory);

  return (
    <>
      <main className="min-h-screen selection:bg-cyan-500/20 overflow-hidden relative z-10 font-sans text-slate-900 bg-white">
        <div className="relative z-10 max-w-7xl mx-auto pt-12 pb-24 px-6 sm:px-8 lg:px-12">
          
          {/* 🚀 Header Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center space-y-6 mb-10"
          >
            {/* Avatar */}
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition duration-700 animate-pulse" />
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white bg-slate-50 shadow-xl ring-1 ring-slate-200">
                <Image 
                  src={PROFILE.avatar} 
                  alt={PROFILE.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                  unoptimized
                />
              </div>
            </div>
            
            <div className="space-y-6 max-w-4xl">
              {/* Gradient Title - Blue/Cyan */}
              <h1 className="relative z-50 w-fit mx-auto text-6xl md:text-8xl font-black tracking-tighter pb-2">
                <span 
                  style={{
                    backgroundImage: 'linear-gradient(to right, #06b6d4, #2563eb)', // Cyan-500 to Blue-600
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  {PROFILE.name}
                </span>
              </h1>
              <p className="text-slate-600 text-2xl leading-relaxed font-medium max-w-3xl mx-auto">
                {PROFILE.bio}
              </p>
            </div>

            {/* Social Links - Fully Separated & Hardcoded */}

            <div className="flex items-center justify-center w-full mt-8">

            {/* Twitter Button */}
            <Link 
              href="https://x.com/govin999999"
              target="_blank"
              // 关键点：mx-24 (水平方向外边距) 和 flex-shrink-0 (防止被挤压)
              className="mx-24 flex-shrink-0 group flex items-center justify-center w-20 h-20 rounded-full bg-white border border-slate-200 hover:border-cyan-500 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Twitter size={40} className="text-slate-500 group-hover:text-cyan-600 transition-colors" />
            </Link>

            {/* GitHub Button */}
            <Link 
              href="https://github.com/govin999999"
              target="_blank"
              // 关键点：mx-24
              className="mx-24 flex-shrink-0 group flex items-center justify-center w-20 h-20 rounded-full bg-white border border-slate-200 hover:border-cyan-500 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Github size={40} className="text-slate-500 group-hover:text-cyan-600 transition-colors" />
            </Link>

          </div>
          </motion.div>

          {/* 🧭 Navigation / Filter - Clean Pill Style */}
          <div className="sticky top-8 z-40 flex justify-center mb-40">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full p-2.5 shadow-lg shadow-slate-200/50">
              <div className="flex overflow-x-auto gap-4 no-scrollbar max-w-[90vw] sm:max-w-none px-4 py-1 items-center">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`
                      relative px-8 py-3.5 rounded-full text-lg font-bold transition-all duration-300 whitespace-nowrap z-10 tracking-wide
                      ${activeCategory === category 
                        ? "text-white shadow-md shadow-blue-500/30" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}
                    `}
                  >
                    {activeCategory === category && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 📦 Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-20 px-4"
            >
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={`${project.title}-${idx}`}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className={`h-full ${idx % 2 === 1 ? 'md:translate-y-16' : ''} ${idx % 3 === 1 ? 'lg:translate-y-24' : ''}`}
                >
                  <Link
                    href={project.href}
                    className="group relative block h-full bg-white border border-slate-200 rounded-3xl p-6 overflow-hidden hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                  >
                    
                    <div className="relative z-10 flex flex-col h-full space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-blue-600 group-hover:text-cyan-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
                          <project.icon size={40} strokeWidth={1.5} />
                        </div>
                        
                        {/* Tag */}
                        <span className="px-6 py-2 rounded-full text-sm font-bold tracking-wide text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-md shadow-blue-500/20">
                          {project.tag}
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                        {project.title}
                      </h3>
                      
                      <p className="text-slate-600 text-lg leading-relaxed flex-grow font-medium">
                        {project.description}
                      </p>
                      
                      <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                         <span className="flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                          <Sparkles size={18} className="text-yellow-500" />
                          EXPLORE NOW
                        </span>
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-100">
                          <ExternalLink size={20} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-slate-500 space-y-6"
            >
              <div className="p-8 rounded-full bg-slate-50 border border-slate-200 shadow-inner">
                <Search size={48} className="text-slate-400" />
              </div>
              <p className="text-2xl font-bold text-slate-400 tracking-wide">NO SIGNALS DETECTED</p>
            </motion.div>
          )}

          {/* Footer */}
          <footer className="text-center py-16 border-t border-slate-200 relative z-10">
            <p className="text-slate-500 text-base font-medium tracking-wide">
              © {new Date().getFullYear()} {PROFILE.name.toUpperCase()} — PROTOCOL V2.0
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}