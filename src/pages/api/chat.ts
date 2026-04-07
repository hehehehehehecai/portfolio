// 极其关键：强制 Astro 将此文件作为服务端点处理，禁止静态预渲染！
export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. 安全解析 JSON（防止空请求头导致的崩溃）
    const text = await request.text();
    const body = text ? JSON.parse(text) : {};
    const userMessages = body.messages || [];

    // 2. 获取 API Key
    const apiKey = import.meta.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.error("❌ 致命错误: 未找到 DEEPSEEK_API_KEY 环境变量");
      return new Response(JSON.stringify({ error: 'API Key 未配置' }), { status: 500 });
    }

    // 3. 构建 System Prompt
    const systemPrompt = { 
      role: "system", 
      content: "你现在是『何晓宇的数字助理』。何晓宇是一名南开大学应用化学专业的22岁大学生，但他同时也是一位拥有极强产品思维的全栈开发者和 Bilibili UP主。他的技术栈包括 React Native, Astro, Tailwind CSS, Zustand, Supabase。他的代表作包括：《灵感公墓》、《赛博求签》、《平行信箱》以及《勇者酒馆》。你的语气要专业、自信、带一点极客的幽默感。绝对不要编造他没有做过的事情，如果不知道细节，请引导访客联系他本人。" 
    };

    // 4. 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${apiKey}` 
      }, 
      body: JSON.stringify({ 
        model: 'deepseek-chat', 
        messages: [systemPrompt, ...userMessages], 
        temperature: 0.7, 
      }) 
    });

    // 5. 处理返回数据
    const data = await response.json();

    if (!response.ok) { 
      console.error("❌ DeepSeek API 请求失败:", data);
      return new Response(JSON.stringify({ error: data.error?.message || 'API 请求失败' }), { status: 500 }); 
    } 

    // 6. 成功返回给前端
    return new Response(JSON.stringify({ 
      reply: data.choices[0].message.content 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }); 

  } catch (error: any) { 
    console.error("❌ 后端服务发生异常:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 }); 
  }
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
};
