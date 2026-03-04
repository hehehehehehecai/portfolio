import os
import re

# 定义文件路径
PROJECTS_DIR = 'src/content/projects'
OUTPUT_FILE = 'public/llms.txt'

# 确保输出目录存在
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

# 读取所有项目文件
projects = []

for filename in os.listdir(PROJECTS_DIR):
    if filename.endswith('.md'):
        file_path = os.path.join(PROJECTS_DIR, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 提取 Frontmatter 中的信息
        frontmatter_match = re.search(r'---(.*?)---', content, re.DOTALL)
        if frontmatter_match:
            frontmatter = frontmatter_match.group(1)
            
            # 提取标题
            title_match = re.search(r'title:\s*["\'](.*?)["\']', frontmatter)
            title = title_match.group(1) if title_match else ''
            
            # 提取描述
            description_match = re.search(r'description:\s*["\'](.*?)["\']', frontmatter)
            description = description_match.group(1) if description_match else ''
            
            # 提取标签（作为技术栈）
            tags_match = re.search(r'tags:\s*\[(.*?)\]', frontmatter)
            tags = tags_match.group(1).replace('"', '').replace("'", '').split(',') if tags_match else []
            tags = [tag.strip() for tag in tags]
            
            # 提取正文中的技术栈信息
            tech_stack_match = re.search(r'技术栈\s*:\s*(.*?)(?:\n|$)', content)
            if tech_stack_match:
                tech_stack = tech_stack_match.group(1).strip()
            else:
                tech_stack = ''
            
            projects.append({
                'title': title,
                'description': description,
                'tags': tags,
                'tech_stack': tech_stack
            })

# 生成输出内容
output = "This is the personal digital garden of a full-stack developer. Projects summary:\n\n"

for project in projects:
    output += f"Project: {project['title']}\n"
    output += f"Description: {project['description']}\n"
    if project['tags']:
        output += f"Tags: {', '.join(project['tags'])}\n"
    if project['tech_stack']:
        output += f"Tech Stack: {project['tech_stack']}\n"
    output += "\n"

# 写入输出文件
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(output)

print(f"LLMs context generated successfully at {OUTPUT_FILE}")
