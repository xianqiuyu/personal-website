# EmailJS 邮件发送配置指南

## 简介

本项目使用 EmailJS 实现联系表单的邮件发送功能。EmailJS 是一个免费的前端邮件服务，无需后端即可发送邮件。

## 配置步骤

### 1. 注册 EmailJS 账号

访问 [https://www.emailjs.com/](https://www.emailjs.com/) 并注册账号（免费版每月可发送 200 封邮件）。

### 2. 创建邮件服务（Service）

1. 登录后，进入 **Email Services** 页面
2. 点击 **Add New Service**
3. 选择邮件服务提供商（推荐 Gmail 或 QQ 邮箱）
4. 按照提示连接你的邮箱账号
5. 创建完成后，记住 **Service ID**

### 3. 创建邮件模板（Template）

1. 进入 **Email Templates** 页面
2. 点击 **Create New Template**
3. 设置模板内容，使用以下变量：
   - `{{from_name}}` - 发送者姓名
   - `{{from_email}}` - 发送者邮箱
   - `{{subject}}` - 邮件主题
   - `{{message}}` - 邮件内容
   - `{{to_email}}` - 接收邮箱
   - `{{reply_to}}` - 回复地址

4. 示例模板内容：

```
主题：{{subject}}

来自：{{from_name}} ({{from_email}})

消息内容：
{{message}}

---
此邮件来自个人网站联系表单
回复地址：{{reply_to}}
```

5. 创建完成后，记住 **Template ID**

### 4. 获取 Public Key

1. 进入 **Account** > **General** 页面
2. 找到 **Public Key**，复制它

### 5. 配置到项目中

打开 `src/views/ContactView.vue` 文件，找到以下配置：

```typescript
const EMAILJS_CONFIG = {
  serviceId: 'service_default', // 替换为你的 Service ID
  templateId: 'template_default', // 替换为你的 Template ID
  publicKey: 'your_public_key' // 替换为你的 Public Key
}
```

将对应的值替换为你刚才获取的值。

## 测试

配置完成后，访问联系页面，填写表单并发送测试邮件。如果配置正确，你应该能收到邮件。

## 备用方案

如果未配置 EmailJS，系统会自动使用 `mailto:` 链接作为备用方案，会打开用户的默认邮件客户端。

## 注意事项

1. **免费版限制**：免费版每月限制 200 封邮件
2. **安全性**：Public Key 会暴露在前端代码中，这是正常的，EmailJS 设计如此
3. **垃圾邮件**：建议添加验证码（reCAPTCHA）防止垃圾邮件
4. **接收邮箱**：确保接收邮箱（2535462360@qq.com）已正确配置

## 故障排查

如果邮件发送失败：

1. 检查 EmailJS 配置是否正确
2. 检查浏览器控制台是否有错误信息
3. 确认邮件服务（Service）连接正常
4. 检查模板变量是否正确
5. 查看 EmailJS 仪表板的日志

## 更多信息

访问 [EmailJS 文档](https://www.emailjs.com/docs/) 了解更多信息。
