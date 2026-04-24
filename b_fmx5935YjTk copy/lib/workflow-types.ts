export type BlockType = 
  | "email-reader"
  | "ai-generator"
  | "calendar"
  | "study-room"
  | "notification";

export interface WorkflowBlock {
  id: string;
  type: BlockType;
  title: string;
  description: string;
  position: { x: number; y: number };
}

export interface BlockConfig {
  type: BlockType;
  title: string;
  description: string;
  icon: string;
  color: string;
  fields: SettingsField[];
}

export interface SettingsField {
  id: string;
  label: string;
  type: "text" | "select" | "textarea";
  placeholder?: string;
  options?: string[];
}

export const blockConfigs: Record<BlockType, BlockConfig> = {
  "email-reader": {
    type: "email-reader",
    title: "邮件读取器",
    description: "读取并解析收件箱邮件",
    icon: "mail",
    color: "bg-blue-500",
    fields: [
      { id: "email", label: "邮箱账户", type: "text", placeholder: "your@email.com" },
      { id: "filter", label: "过滤条件", type: "select", options: ["全部邮件", "未读邮件", "重要邮件", "今日邮件"] },
      { id: "subject", label: "主题关键词", type: "text", placeholder: "输入关键词过滤..." },
    ],
  },
  "ai-generator": {
    type: "ai-generator",
    title: "AI 生成器",
    description: "使用 AI 处理和生成内容",
    icon: "sparkles",
    color: "bg-purple-500",
    fields: [
      { id: "model", label: "AI 模型", type: "select", options: ["GPT-4", "Claude 3", "Gemini Pro", "Llama 3"] },
      { id: "prompt", label: "提示词", type: "textarea", placeholder: "输入您的提示词..." },
      { id: "temperature", label: "创意度", type: "select", options: ["保守 (0.3)", "平衡 (0.7)", "创意 (1.0)"] },
    ],
  },
  "calendar": {
    type: "calendar",
    title: "日历调度器",
    description: "安排和管理日程事件",
    icon: "calendar",
    color: "bg-green-500",
    fields: [
      { id: "calendar", label: "日历账户", type: "select", options: ["Google Calendar", "Outlook", "Apple Calendar"] },
      { id: "action", label: "操作类型", type: "select", options: ["创建事件", "查询空闲时间", "更新事件", "删除事件"] },
      { id: "duration", label: "默认时长", type: "select", options: ["30 分钟", "1 小时", "2 小时", "全天"] },
    ],
  },
  "study-room": {
    type: "study-room",
    title: "自习室预约",
    description: "预约和管理自习室",
    icon: "book-open",
    color: "bg-orange-500",
    fields: [
      { id: "room", label: "房间选择", type: "select", options: ["A101 静音区", "B202 讨论室", "C303 电脑室", "D404 VIP室"] },
      { id: "time", label: "预约时段", type: "select", options: ["上午 (8:00-12:00)", "下午 (13:00-17:00)", "晚间 (18:00-22:00)"] },
      { id: "seats", label: "座位数量", type: "select", options: ["1 人", "2 人", "4 人", "6 人"] },
    ],
  },
  "notification": {
    type: "notification",
    title: "通知发送器",
    description: "发送通知到多个渠道",
    icon: "bell",
    color: "bg-pink-500",
    fields: [
      { id: "channel", label: "通知渠道", type: "select", options: ["邮件", "短信", "微信", "钉钉", "Slack"] },
      { id: "template", label: "消息模板", type: "textarea", placeholder: "输入通知内容..." },
      { id: "priority", label: "优先级", type: "select", options: ["普通", "重要", "紧急"] },
    ],
  },
};
