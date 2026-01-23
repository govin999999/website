// ==UserScript==
// @name         TradeGenius Auto Swap - Professional Edition
// @namespace    https://www.tradegenius.com
// @version      1.1.0
// @description  Automated USDC/USDT swap with enhanced stability and safety
// @author       @ferdie_jhovie & AI Partner
// @match        https://www.tradegenius.com/trade
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) return;

    // ==================== 配置参数 ====================
    const CONFIG = {
        delays: {
            short: [800, 1500],   // 按钮点击后的短等待
            medium: [2000, 3500], // 弹窗开启后的中等待
            long: [5000, 8000],   // 交易确认后的长等待
            retry: 3000
        },
        thresholds: {
            minBalance: 0.1,      // 最低余额限制，低于此值不操作
            maxConsecutiveErrors: 5 // 连续报错 5 次自动停止
        },
        tokens: {
            pairs: ['USDC', 'USDT'],
            chain: 'Optimism'
        }
    };

    // ==================== 状态管理 ====================
    let state = {
        isRunning: false,
        consecutiveErrors: 0,
        currentFromToken: null,
        stats: { total: 0, success: 0, failed: 0 }
    };

    // ==================== 工具函数 ====================
    // 生成随机等待时间（模拟人类行为）
    const jitterSleep = async (range) => {
        const [min, max] = range;
        const ms = Math.floor(Math.random() * (max - min + 1) + min);
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    const log = (msg, type = 'info') => {
        const colors = { info: '#3b82f6', success: '#10b981', error: '#ef4444', warn: '#f59e0b' };
        console.log(`%c[${new Date().toLocaleTimeString()}] ${msg}`, `color: ${colors[type] || '#fff'}`);
        if (UI.logEl) {
            const entry = document.createElement('div');
            entry.textContent = `> ${msg}`;
            entry.style.color = colors[type];
            UI.logEl.prepend(entry);
            if (UI.logEl.childNodes.length > 50) UI.logEl.lastChild.remove();
        }
    };

    // 增强型元素查找：支持多重文本匹配
    const findElementByText = (selector, textArr) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).find(el => 
            textArr.some(t => el.innerText.trim().toUpperCase().includes(t.toUpperCase()))
        );
    };

    // ==================== 自动化逻辑 ====================

    async function selectTokenFlow() {
        const chooseBtns = Array.from(document.querySelectorAll('button'))
            .filter(b => b.innerText.includes('Choose') || b.innerText.includes('选择'));

        if (chooseBtns.length === 0) return false;

        // 1. 选择 From Token
        chooseBtns[0].click();
        await jitterSleep(CONFIG.delays.medium);
        
        const rows = document.querySelectorAll('[role="dialog"] .cursor-pointer');
        let bestToken = { el: null, symbol: '', balance: 0 };

        rows.forEach(row => {
            const symbol = row.querySelector('.text-xs')?.innerText?.trim();
            if (CONFIG.tokens.pairs.includes(symbol)) {
                const balMatch = row.innerText.match(/(\d+\.?\d*)/);
                const bal = balMatch ? parseFloat(balMatch[0]) : 0;
                if (bal > bestToken.balance) {
                    bestToken = { el: row, symbol, balance: bal };
                }
            }
        });

        if (bestToken.balance < CONFIG.thresholds.minBalance) {
            log(`余额不足 (${bestToken.balance})，停止操作`, 'warn');
            return false;
        }

        bestToken.el.click();
        state.currentFromToken = bestToken.symbol;
        log(`已选 ${bestToken.symbol} (余额: ${bestToken.balance})`, 'success');
        
        await jitterSleep(CONFIG.delays.short);

        // 2. 选择 To Token
        const targetSymbol = state.currentFromToken === 'USDC' ? 'USDT' : 'USDC';
        const secondChoose = Array.from(document.querySelectorAll('button'))
            .filter(b => b.innerText.includes('Choose') || b.innerText.includes('选择'))[0];
        
        if (secondChoose) {
            secondChoose.click();
            await jitterSleep(CONFIG.delays.medium);
            
            // 点击 Stable 标签
            const stableTab = findElementByText('div, span', ['Stable', '稳定']);
            if (stableTab) stableTab.click();
            await jitterSleep([500, 800]);

            // 查找目标币种行
            const targetRow = Array.from(document.querySelectorAll('[role="dialog"] .cursor-pointer'))
                .find(row => row.innerText.includes(targetSymbol) && row.innerText.includes('$'));

            if (targetRow) {
                targetRow.click();
                await jitterSleep([1000, 1500]);
                
                // 确保选择 Optimism
                const optBtn = Array.from(document.querySelectorAll('*'))
                    .find(el => el.innerText === 'Optimism' && el.getBoundingClientRect().height > 0);
                if (optBtn) optBtn.click();
                
                log(`目标已设为 ${targetSymbol} (Optimism)`, 'success');
                return true;
            }
        }
        return false;
    }

    async function startLogic() {
        while (state.isRunning) {
            try {
                // 异常处理：连续错误熔断
                if (state.consecutiveErrors >= CONFIG.thresholds.maxConsecutiveErrors) {
                    log("连续错误过多，安全停止", 'error');
                    stopBot();
                    break;
                }

                // 流程 1: 关闭残留弹窗
                const closeBtn = findElementByText('button', ['Close', '关闭']);
                if (closeBtn) {
                    closeBtn.click();
                    await jitterSleep(CONFIG.delays.short);
                }

                // 流程 2: 选币检查
                const isNeedSelection = document.body.innerText.includes('Choose');
                if (isNeedSelection) {
                    const ok = await selectTokenFlow();
                    if (!ok) { await jitterSleep([3000, 5000]); continue; }
                }

                // 流程 3: MAX 
                const maxBtn = findElementByText('button', ['MAX']);
                if (maxBtn && !maxBtn.disabled) {
                    maxBtn.click();
                    await jitterSleep(CONFIG.delays.short);
                }

                // 流程 4: Confirm
                const confirmBtn = findElementByText('button', ['Confirm', '确认', 'Place']);
                if (confirmBtn && !confirmBtn.disabled) {
                    log("正在提交交易...", 'info');
                    confirmBtn.click();
                    
                    // 模拟等待上链
                    await jitterSleep(CONFIG.delays.long);
                    state.stats.success++;
                    state.consecutiveErrors = 0;
                    log(`交易完成 [总计: ${state.stats.success}]`, 'success');
                } else {
                    state.consecutiveErrors++;
                    await jitterSleep([2000, 4000]);
                }

            } catch (e) {
                state.consecutiveErrors++;
                log(`循环异常: ${e.message}`, 'error');
                await jitterSleep([5000, 10000]);
            }
        }
    }

    // ==================== UI 模块 (极简版) ====================
    const UI = {
        logEl: null,
        mount() {
            const container = document.createElement('div');
            container.style.cssText = `position:fixed;bottom:20px;right:20px;width:280px;background:#1a1a1a;color:#fff;z-index:10000;padding:15px;border-radius:10px;font-family:monospace;border:1px solid #333;box-shadow:0 4px 15px rgba(0,0,0,0.5);`;
            
            const header = document.createElement('div');
            header.innerHTML = `<b style="color:#00ff88">TradeGenius Pro</b> <small>v1.1</small>`;
            header.style.marginBottom = '10px';
            
            const startBtn = document.createElement('button');
            startBtn.innerText = 'START BOT';
            startBtn.style.cssText = `width:100%;padding:8px;background:#0066ff;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;`;
            
            const logBox = document.createElement('div');
            logBox.style.cssText = `height:120px;overflow-y:auto;background:#000;margin-top:10px;padding:5px;font-size:11px;border:1px solid #222;`;
            
            container.appendChild(header);
            container.appendChild(startBtn);
            container.appendChild(logBox);
            document.body.appendChild(container);
            
            this.logEl = logBox;

            startBtn.onclick = () => {
                state.isRunning = !state.isRunning;
                startBtn.innerText = state.isRunning ? 'STOP BOT' : 'START BOT';
                startBtn.style.background = state.isRunning ? '#ff3300' : '#0066ff';
                if (state.isRunning) startLogic();
            };
        }
    };

    function stopBot() {
        state.isRunning = false;
        location.reload(); // 简单粗暴的复位
    }

    UI.mount();
    log("脚本就绪，等待启动...");

})();