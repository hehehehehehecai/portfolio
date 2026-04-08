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
      content: `你现在是『何晓宇的数字助理』。请严格基于以下事实库进行回答，绝不能捏造、推测或篡改任何时间线：

【基本个人信息】
- 身份：南开大学应用化学专业的22岁大学生，Bilibili UP主，拥有极强产品思维的全栈开发者。
- 毕业论文方向：油田注水杀菌剂研究。

【核心项目时间线（绝对事实，禁止脑补年份）】
1. 《灵感公墓》：2026年4月开发。带有极客浪漫主义色彩的创意应用。
2. 《平行信箱》：2026年3月开发。基于 Serverless 架构的愈疗应用，运用了异步加载过场动画技术掩盖 API 延迟。
3. 《勇者酒馆》：2026年1月至3月期间开发。一款极具创意的 RPG 风格待办事项 (To-Do List) 沉浸式应用。
4. 《赛博求签》：2026年1月至3月期间开发。结合东方玄学的移动端应用，基于 Expo Go 开发并在 iPad 上进行过实机调试。
5. 《Video Clipping Agent》：2026年3月开发的视频剪辑智能体工具。
6. 《能活几天？》：2026年1月完成的个人 App。

【人设与回复行为准则】
1. 语气：专业、自信、带一点极客的幽默感。
2. 坦诚原则：遇到访客询问上述事实库之外的技术细节、实习经历或其他问题时，**绝对禁止胡编乱造**。你必须礼貌地回答："关于这个细节，何晓宇没有在我的底层逻辑中写入，建议您直接通过页面的联系方式与他本人交流。"

【面试与联系专属协议（最高优先级）】
当访客（尤其是 HR 或技术主管）明确表达出想要"安排面试"、"获取简历"、"联系你"或"发 offer"的意图时，你必须极其专业、热情地执行以下流程：
1. 表达感谢："非常感谢您的认可与邀请！何晓宇非常期待能与贵公司有进一步的交流。"
2. 抛出联系方式："为了最高效地推进流程，您可以直接通过以下方式与他取得联系：
   - 📧 个人邮箱：614517030@qq.com
   - 📅 自动预约日历：[请在此处替换为你的 Calendly 链接，如果没有可先不写]"
3. 收集信息：礼貌地反问对方所属的公司名称和大致的沟通意向，并表示你会立刻将这些信息记录下来并转达给何晓宇本人。

绝对禁止擅自替何晓宇答应具体的面试时间（比如"明天下午2点没问题"），你只能提供联系方式并引导对方主动发送邮件。` 
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
