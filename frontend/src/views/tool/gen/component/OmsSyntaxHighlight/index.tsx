import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // 代码高亮主题风格

// vscDarkPlus vscode 暗色主题
// darcula  webstorm 暗色主题

type tProps = {
  textContent: string;
  language: string;
  darkMode?: boolean;
};

const them = {
  dark: vscDarkPlus,
  light: null as any,
};

const OmsSyntaxHighlight = (props: tProps) => {
  const { textContent, darkMode, language = 'txt' } = props;
  if (typeof darkMode === 'undefined') {
    them.light = darcula;
  }

  return (
    <div style={{ height: '600px', overflow: 'auto', backgroundColor: '#2b2b2b' }}>
      <SyntaxHighlighter
        showLineNumbers={true} // 是否展示左侧行数
        lineNumberStyle={{ color: '#ddd', fontSize: 10 }} // 左侧行数的样式
        style={darkMode ? them.dark : them.light} // 主题风格
        language={language} // 需要语言类型 如css, jsx , javascript 等
        PreTag="div"
      >
        {String(textContent).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

export default OmsSyntaxHighlight;
