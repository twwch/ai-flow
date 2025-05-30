# AI编排框架

## 安装配置

```
git clone https://github.com/twwch/ai-flow.git
cd ai-flow
```

### 后端安装（目前支持AzureOpenAI）
```
cp .env.local.example api/.env.local
```

将API信息填入


安装环境
```
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

启动后端
```
python index.py
```

### 前端安装

```
pnpm install
pnpm dev 
```

访问 http://127.0.0.1:3000, 效果如下

<img width="1512" alt="image" src="https://github.com/user-attachments/assets/77bd8662-1379-4d7d-851a-1ed6054e08f2" />

