# mTab 新标签页 🚀

![logo](https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/192.png)

### [mTab书签官网](https://mtab.cc) | [安装文档](https://mtab.cc/document.html) | [作者Blog](https://blog.mcecy.com) | QQ群：694155153

![](https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/1.png?x-image-process=image/resize,m_lfit,w_900)

## 项目特点 ✨

- **跨设备同步** 🔄：书签和笔记在所有设备上同步
- **跨浏览器支持** 🌐：支持所有主流浏览器（Chrome、Firefox、Edge、Safari）
- **多功能一体** 🎯：集书签、笔记、在线工具于一体
- **私有部署** 🔒：支持私有化部署，完全掌控数据
- **免费无广告** 🎉：清爽的使用体验，无任何干扰
- **高性能** ⚡：基于 Cloudflare Workers 和 D1 数据库
- **安全防护** 🛡️：集成 Cloudflare Turnstile 和 DDoS 防护

## 技术栈 🛠️

- **后端**：Cloudflare Workers
- **数据库**：Cloudflare D1 (SQLite)
- **缓存**：Cloudflare KV
- **安全**：Cloudflare Turnstile, DDoS 防护
- **框架**：Hono
- **ORM**：Drizzle ORM

## 部署方式 📦

### 方式一：GitHub + Cloudflare Workers 部署（推荐）⭐

#### 1. 准备工作

1. 创建 GitHub 仓库
   - 访问 [GitHub](https://github.com)
   - 点击"New repository"
   - 仓库名称填写：`mtab-cloudflare`
   - 选择"Public"或"Private"
   - 点击"Create repository"

2. 上传项目代码
   ```bash
   # 克隆项目到本地
   git clone https://github.com/your-username/mtab-cloudflare.git
   cd mtab-cloudflare

   # 复制项目文件到仓库目录
   # 确保包含以下文件：
   # - src/
   # - package.json
   # - wrangler.toml
   # - README.md

   # 提交代码
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

#### 2. 配置 Cloudflare Workers

1. 登录 Cloudflare
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 使用你的账号登录

2. 创建 Worker
   - 在左侧菜单找到"Workers & Pages"
   - 点击"创建应用程序"
   - 选择"连接到 Git"
   - 选择你的 GitHub 仓库
   - 点击"开始设置"

3. 配置构建设置
   - 构建命令：`npm install && npm run build`
   - 输出目录：`dist`
   - 根目录：`/`
   - 环境变量：
     ```
     DB_ID: 你的D1数据库ID
     KV_ID: 你的KV命名空间ID
     TURNSTILE_SITE_KEY: 你的Turnstile Site Key
     TURNSTILE_SECRET_KEY: 你的Turnstile Secret Key
     ```

4. 配置部署设置
   - 分支：`main`
   - 自动部署：开启
   - 预览部署：开启

5. 点击"保存并部署"

#### 3. 创建 D1 数据库

1. 进入 D1 控制台
   - 在左侧菜单找到"Workers & Pages"
   - 点击"D1"选项
   - 点击"创建数据库"

2. 配置数据库
   - 数据库名称填写：`mtab_db`
   - 选择区域（建议选择离你最近的）
   - 点击"创建"

3. 记录数据库 ID
   - 创建完成后会显示数据库 ID
   - 复制这个 ID，更新到 Worker 的环境变量中

#### 4. 创建 KV 命名空间

1. 进入 KV 控制台
   - 在左侧菜单找到"Workers & Pages"
   - 点击"KV"选项
   - 点击"创建命名空间"

2. 配置 KV
   - 命名空间名称填写：`CACHE`
   - 点击"创建"

3. 记录 KV ID
   - 创建完成后会显示命名空间 ID
   - 复制这个 ID，更新到 Worker 的环境变量中

#### 5. 配置 Turnstile

1. 进入 Turnstile 控制台
   - 在左侧菜单找到"安全"
   - 点击"Turnstile"选项
   - 点击"添加站点"

2. 配置 Turnstile
   - 站点名称填写：`mtab`
   - 选择验证模式（建议选择"Managed Challenge"）
   - 在"域名"部分添加：
     - 你的 Workers 域名（例如：`mtab.your-username.workers.dev`）
     - 如果后续添加了自定义域名，也需要添加
   - 点击"创建"

3. 记录密钥
   - 创建完成后会显示 Site Key 和 Secret Key
   - 复制这两个密钥，更新到 Worker 的环境变量中

#### 6. 获取访问地址

1. 部署成功后
   - 你会得到一个类似 `mtab.your-username.workers.dev` 的地址
   - 这个地址就是你的 API 访问地址

2. 更新前端配置
   ```javascript
   // 在你的前端项目中
   const API_BASE_URL = 'https://mtab.your-username.workers.dev';
   ```

### 方式二：Docker 部署 🐳

镜像： itushan/mtab

视频教程： https://www.bilibili.com/video/BV1ee411B7fY/

部署命令： docker run -itd --name mtab -p 9200:80 -v /opt/mtab:/app itushan/mtab

命令解释： 其中 9200 可改为你服务器的其他端口。 /opt/mtab 可改为是你服务器的目录挂载路径，容器内目录和端口必须是 80 和 /app，--name为自定义容器名称。

可视化部署： 群晖等其他管理面板请拉取 itushan/mtab 镜像。服务器端口请自己填写，容器请填写 80 ，服务器目录请填写自己想挂载的目录，容器部分请填写 /app。

程序数据库安装： 部署完docker后访问您设置的端口，然后填写一些数据库配置后点击 安装 按钮即可等待安装完成， 注意的是容器部署下数据库地址请不要填写127.0.0.1,因为容器内127.0.0.1不指向宿主机网络。

最后事项： 最后如果要使用外网访问，为了安全请使用Nginx反向代理或者CDN来代理您创建时填写的端口，并且配置SSL证书启用HTTPS，纯内网环境请随意啦。

### docker-compose.yml

在你想安装的目录创建docker-compose.yml，然后安装的目录执行`docker-compose  up -d `即可

```yml
version: '3'
services:
  mtabServer:
    image: itushan/mtab
    container_name: mtabServer
    user: "${USER_ID}:${GROUP_ID}"
    ports:
      - "9200:80"
    volumes:
      - ./:/app
    restart: always
```

## 维护和监控 🔧

### 1. 日志管理
```bash
# 查看 PM2 日志
pm2 logs mtab

# 查看 Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. 性能监控
- 使用 PM2 监控面板
- 配置 Nginx 访问日志
- 设置告警阈值

### 3. 数据库维护
```bash
# 备份数据库
mysqldump -u your_username -p mtab_db > backup.sql

# 恢复数据库
mysql -u your_username -p mtab_db < backup.sql
```

## 安全特性 🔐

### 1. Cloudflare Turnstile
- 防止自动化攻击 🛡️
- 验证用户真实性 ✅
- 可配置的验证难度 ⚙️

### 2. DDoS 防护
- 基于 IP 的速率限制 🚫
- 自动阻止异常请求 ⚠️
- 详细的请求日志 📝

### 3. 数据安全
- 端到端加密 🔒
- 安全的数据库访问 🔑
- 定期数据备份 💾

## 性能优化 ⚡

### 1. 缓存策略
- KV 存储热点数据 🔥
- 智能缓存失效 🔄
- 批量缓存操作 📦

### 2. 数据库优化
- 查询性能监控 📊
- 自动索引优化 📈
- 连接池管理 🔄

### 3. 监控系统
- 实时性能监控 📊
- 详细的日志记录 📝
- 异常告警机制 ⚠️

## 前端集成 🎨

### 1. Turnstile 集成
```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<div class="cf-turnstile" data-sitekey="your-site-key"></div>
```

### 2. API 调用示例
```javascript
async function fetchBookmarks() {
  const token = await turnstile.getResponse();
  const response = await fetch('/api/bookmarks', {
    headers: {
      'CF-Turnstile-Token': token
    }
  });
  return response.json();
}
```

## 维护和监控 🔧

### 1. 日志查看
```bash
wrangler tail
```

### 2. 性能监控
- 访问 Cloudflare Dashboard 📊
- 查看 Workers 性能指标 📈
- 分析请求模式 🔍

### 3. 数据库维护
```bash
wrangler d1 execute mtab_db --file=./schema.sql
```

## 故障排除 🚨

### 1. 常见问题
- 检查环境变量配置 ⚙️
- 验证数据库连接 🔌
- 确认缓存状态 💾

### 2. 错误处理
- 查看错误日志 📝
- 检查速率限制 ⚠️
- 验证 Turnstile 配置 ✅

## 贡献指南 🤝

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证 📄

本项目采用 Apache-2.0 许可证

## 联系方式 📞

- 官网：https://mtab.cc
- 文档：https://mtab.cc/document.html
- 作者博客：https://blog.mcecy.com
- QQ群：694155153

## Demo演示站 🎮

#### **[演示站Demo入口](https://demo.mtab.cc)**

演示账号：admin

演示密码：123456

## 预览图

![](https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/1.png)
<img src="https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/2.png" width="50%"><img src="https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/3.png" width="50%">
<img src="https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/4.png" width="33.3%"><img src="https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/5.png" width="33.3%"><img src="https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/6.png" width="33.3%">
<img src="https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/8.png" width="50%"><img src="https://raw.githubusercontent.com/tsxcw/imagesHouse/itushan/mTabReadme/7.png" width="50%">

