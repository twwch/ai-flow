'use client';

import { useChat } from '@ai-sdk/react';
import { 
  Bubble, 
  Sender,
  XProvider,
  Conversations
} from '@ant-design/x';
import { 
  UserOutlined, 
  RobotOutlined, 
  ToolOutlined,
  PlusOutlined,
  MessageOutlined,
  SendOutlined,
  DownOutlined,
  RightOutlined
} from '@ant-design/icons';
import { Flex, Typography, Button, Collapse } from 'antd';
import { GeistMono } from 'geist/font/mono';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { Title, Text } = Typography;
const { Panel } = Collapse;

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, status } = useChat({
    streamProtocol: 'data',
    maxSteps: 3,
  });

  // 转换消息格式为 Ant Design X 所需的格式
  const bubbleItems = messages.map((message, index) => ({
    key: message.id,
    content: (
      <div className="flex flex-col gap-3">
        {/* 工具调用展示 - 放在前面 */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="flex flex-col gap-3 mb-4">
            {message.toolInvocations.map(toolInvocation => (
              <div key={toolInvocation.toolCallId} className="border border-gray-200 rounded-lg">
                {/* 工具标题 */}
                <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
                    <ToolOutlined className="text-white text-xs" />
                  </div>
                  <Text className="font-medium text-gray-800">{toolInvocation.toolName}</Text>
                </div>
                
                {/* 可折叠的参数和结果 */}
                <Collapse 
                  ghost 
                  size="small" 
                  className="bg-white"
                  expandIcon={({ isActive }) => 
                    isActive ? <DownOutlined className="text-xs" /> : <RightOutlined className="text-xs" />
                  }
                >
                  <Panel 
                    header={<Text className="text-sm font-medium">Process</Text>} 
                    key="process"
                    className="border-0"
                  >
                    <div className="bg-gray-50 rounded p-3 -mt-2">
                      <pre className={`${GeistMono.className} text-xs text-gray-700 m-0 whitespace-pre-wrap`}>
                        {JSON.stringify(toolInvocation.args, null, 2)}
                      </pre>
                    </div>
                  </Panel>
                  
                  <Panel 
                    header={<Text className="text-sm font-medium">Result</Text>} 
                    key="result"
                    className="border-0"
                  >
                    <div className="bg-gray-50 rounded p-3 -mt-2">
                      <pre className={`${GeistMono.className} text-xs text-gray-700 m-0 whitespace-pre-wrap`}>
                        {JSON.stringify('result' in toolInvocation ? toolInvocation.result : 'No result available', null, 2)}
                      </pre>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            ))}
          </div>
        )}
        
        {/* 消息内容 */}
        {message.content && (
          <div className="text-sm leading-relaxed text-gray-800 prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // 自定义代码块样式
                code: ({ inline, className, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code 
                        className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono text-gray-800" 
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
                      <code className={`${GeistMono.className} text-xs text-gray-800`} {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                // 自定义段落样式
                p: ({ children }: any) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                // 自定义标题样式
                h1: ({ children }: any) => (
                  <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>
                ),
                h2: ({ children }: any) => (
                  <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>
                ),
                h3: ({ children }: any) => (
                  <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>
                ),
                // 自定义列表样式
                ul: ({ children }: any) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }: any) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                ),
                // 自定义链接样式
                a: ({ children, href }: any) => (
                  <a 
                    href={href} 
                    className="text-blue-600 hover:text-blue-800 underline" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // 自定义引用样式
                blockquote: ({ children }: any) => (
                  <blockquote className="border-l-4 border-gray-300 pl-3 ml-2 text-gray-600 italic">
                    {children}
                  </blockquote>
                ),
                // 自定义表格样式
                table: ({ children }: any) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }: any) => (
                  <thead className="bg-gray-50">{children}</thead>
                ),
                tbody: ({ children }: any) => (
                  <tbody className="divide-y divide-gray-200">{children}</tbody>
                ),
                tr: ({ children }: any) => (
                  <tr className="hover:bg-gray-50">{children}</tr>
                ),
                th: ({ children }: any) => (
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    {children}
                  </th>
                ),
                td: ({ children }: any) => (
                  <td className="px-3 py-2 text-sm text-gray-900 border-b border-gray-100">
                    {children}
                  </td>
                ),
                // 删除线支持
                del: ({ children }: any) => (
                  <del className="line-through text-gray-500">{children}</del>
                )
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    ),
    placement: message.role === 'user' ? 'end' as const : 'start' as const,
    avatar: message.role === 'user' ? {
      icon: <UserOutlined />,
      style: { backgroundColor: '#1677ff', color: '#fff', fontSize: '14px' }
    } : {
      icon: <RobotOutlined />,
      style: { backgroundColor: '#52c41a', color: '#fff', fontSize: '14px' }
    },
    variant: 'borderless' as const,
    styles: {
      content: {
        backgroundColor: '#f8f9fa',
        color: '#000',
        borderRadius: '16px',
        padding: '16px 20px',
        maxWidth: '80%',
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }
    }
  }));

  const handleFormSubmit = (value: string) => {
    if (!value.trim() || status !== 'ready') return;
    
    const event = {
      preventDefault: () => {},
      target: { elements: { message: { value } } }
    } as any;
    
    handleSubmit(event);
  };

  const handleSenderChange = (value: string) => {
    const event = {
      target: { value }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(event);
  };

  return (
    <XProvider 
      theme={{ 
        token: { 
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontSize: 14
        } 
      }}
    >
      <div className="h-screen flex bg-white">
        {/* 左侧边栏 */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <Flex align="center" justify="space-between">
              <Title level={4} className="m-0">AI编排Demo</Title>
              <Button type="text" icon={<PlusOutlined />} size="small" />
            </Flex>
          </div>

          <div className="flex-1 overflow-hidden">
            <Conversations
              style={{ height: '100%', border: 'none' }}
              items={[
                {
                  key: '1',
                  label: '当前对话',
                  icon: <MessageOutlined />,
                },
              ]}
              defaultActiveKey="1"
            />
          </div>

          <div className="p-4 border-t border-gray-200">
            <Text type="secondary" className="text-xs">
              支持工具调用的AI助手
            </Text>
          </div>
        </div>

        {/* 主聊天区域 */}
        <div className="flex-1 flex flex-col">
          {/* 聊天消息区域 */}
          <div className="flex-1 overflow-hidden bg-white">
            {messages.length === 0 ? (
              <Flex 
                vertical 
                align="center" 
                justify="center" 
                className="h-full px-8"
              >
                <div className="text-center max-w-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RobotOutlined className="text-blue-500 text-xl" />
                  </div>
                  <Title level={4} className="mb-2 text-gray-800">开始新对话</Title>
                  <Text type="secondary" className="mb-6 block">
                    我是您的AI助手，可以帮助您解答问题、获取信息，并支持工具调用功能。
                  </Text>
                </div>
              </Flex>
            ) : (
              <div className="h-full overflow-y-auto">
                <div className="max-w-4xl mx-auto px-4 py-6">
                  <Bubble.List
                    items={bubbleItems}
                    style={{ background: 'transparent' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-100 bg-white p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gray-50 rounded-xl border border-gray-200 p-1">
                <div className="flex items-end gap-2 p-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="AI自动编排"
                      className="w-full resize-none border-0 bg-transparent text-sm leading-6 placeholder-gray-400 focus:outline-none min-h-[24px] max-h-32"
                      rows={1}
                      style={{ lineHeight: '1.5' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleFormSubmit(input);
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center">
                    <Button
                      type="primary"
                      size="small"
                      icon={status === 'streaming' ? undefined : <SendOutlined />}
                      loading={status === 'streaming'}
                      onClick={() => handleFormSubmit(input)}
                      disabled={!input.trim() || status !== 'ready'}
                      className="rounded-lg"
                    >
                      {status !== 'streaming' && '发送'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </XProvider>
  );
}
