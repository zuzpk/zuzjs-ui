import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import remarkDeflist from 'remark-deflist';
import rehypeKatex from 'rehype-katex';
import { Box, CodeBlock } from '../..';
import React, { Component, ErrorInfo, ReactNode, useMemo, useState } from 'react';
import { _, copyToClipboard } from '@zuzjs/core';
import Flex from '../Flex';
import Text from '../Text';
import Button from '../Button';
import Span from '../Span';

function language(className?: string): string {
  const match = /language-([\w+-]+)/.exec(className ?? '');
  return match?.[1] || 'text';
}

// ============================================================================
// LANGUAGE DETECTION & MAPPING
// ============================================================================

type CodeLanguage = 
  | 'bash' | 'css' | 'diff' | 'go' | 'html' | 'javascript' | 'json' 
  | 'jsx' | 'plain' | 'python' | 'rust' | 'sql' | 'tsx' | 'typescript' 
  | 'yaml' | 'mermaid' | 'markdown';

const LANG_DISPLAY_NAMES: Record<string, string> = {
  'plaintext': 'Text',
  'plain': 'Text',
  'text': 'Text',
  'bash': 'Bash',
  'shell': 'Shell',
  'sh': 'Shell',
  'zsh': 'Zsh',
  'css': 'CSS',
  'scss': 'SCSS',
  'sass': 'Sass',
  'less': 'Less',
  'diff': 'Diff',
  'patch': 'Patch',
  'go': 'Go',
  'golang': 'Go',
  'html': 'HTML',
  'htm': 'HTML',
  'xml': 'XML',
  'svg': 'SVG',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'cjs': 'JavaScript',
  'mjs': 'JavaScript',
  'json': 'JSON',
  'jsonc': 'JSON with Comments',
  'json5': 'JSON5',
  'jsx': 'JSX',
  'react': 'React',
  'python': 'Python',
  'py': 'Python',
  'py3': 'Python',
  'rust': 'Rust',
  'rs': 'Rust',
  'sql': 'SQL',
  'mysql': 'MySQL',
  'postgresql': 'PostgreSQL',
  'sqlite': 'SQLite',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'tsx': 'TSX',
  'yaml': 'YAML',
  'yml': 'YAML',
  'toml': 'TOML',
  'ini': 'INI',
  'dockerfile': 'Dockerfile',
  'docker': 'Docker',
  'makefile': 'Makefile',
  'mk': 'Makefile',
  'cmake': 'CMake',
  'graphql': 'GraphQL',
  'gql': 'GraphQL',
  'markdown': 'Markdown',
  'md': 'Markdown',
  'mdx': 'MDX',
  'mermaid': 'Mermaid',
  'vim': 'Vim',
  'viml': 'Vim',
  'lua': 'Lua',
  'ruby': 'Ruby',
  'rb': 'Ruby',
  'php': 'PHP',
  'perl': 'Perl',
  'pl': 'Perl',
  'r': 'R',
  'julia': 'Julia',
  'scala': 'Scala',
  'kotlin': 'Kotlin',
  'dart': 'Dart',
  'swift': 'Swift',
  'objective-c': 'Objective-C',
  'objc': 'Objective-C',
  'c': 'C',
  'cpp': 'C++',
  'cplusplus': 'C++',
  'cc': 'C++',
  'cxx': 'C++',
  'csharp': 'C#',
  'cs': 'C#',
  'c-sharp': 'C#',
  'java': 'Java',
  'groovy': 'Groovy',
  'clojure': 'Clojure',
  'clj': 'Clojure',
  'elm': 'Elm',
  'erlang': 'Erlang',
  'erl': 'Erlang',
  'elixir': 'Elixir',
  'ex': 'Elixir',
  'haskell': 'Haskell',
  'hs': 'Haskell',
  'ocaml': 'OCaml',
  'ml': 'OCaml',
  'fsharp': 'F#',
  'fs': 'F#',
  'f-sharp': 'F#',
  'powershell': 'PowerShell',
  'ps1': 'PowerShell',
  'ps': 'PowerShell',
  'batch': 'Batch',
  'bat': 'Batch',
  'cmd': 'Batch',
};

const LANG_MAPPING: Record<string, CodeLanguage> = {
  'bash': 'bash', 'shell': 'bash', 'sh': 'bash', 'zsh': 'bash',
  'css': 'css', 'scss': 'css', 'sass': 'css', 'less': 'css',
  'diff': 'diff', 'patch': 'diff',
  'go': 'go', 'golang': 'go',
  'html': 'html', 'htm': 'html',
  'javascript': 'javascript', 'js': 'javascript', 'cjs': 'javascript', 'mjs': 'javascript',
  'json': 'json', 'jsonc': 'json', 'json5': 'json',
  'jsx': 'jsx', 'react': 'jsx',
  'python': 'python', 'py': 'python', 'py3': 'python',
  'rust': 'rust', 'rs': 'rust',
  'sql': 'sql', 'mysql': 'sql', 'postgresql': 'sql', 'sqlite': 'sql',
  'typescript': 'typescript', 'ts': 'typescript',
  'tsx': 'tsx',
  'yaml': 'yaml', 'yml': 'yaml',
  'mermaid': 'mermaid',
  'markdown': 'markdown', 'md': 'markdown', 'mdx': 'markdown',
};

/**
 * Parse language from code block class name
 */
function parseLanguage(className?: string): { lang: CodeLanguage; displayName: string } {
  const match = /language-(\w+)/.exec(className || '');
  const rawLang = (match?.[1] || 'text').toLowerCase();
  
  const mappedLang = LANG_MAPPING[rawLang] || 'plain';
  const displayName = LANG_DISPLAY_NAMES[rawLang] || LANG_DISPLAY_NAMES[mappedLang] || _(rawLang).ucfirst()._;
  
  return { lang: mappedLang, displayName };
}

/**
 * Detect if text contains RTL (Right-to-Left) content.
 * Checks for Arabic, Hebrew, Persian, Urdu, and other RTL scripts.
 */
function hasRTLContent(text: string): boolean {
  const rtlRegex = /[\u0590-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
}

/** Flatten react-markdown children; skip empty text nodes that break list layouts. */
function cleanChildren(children: ReactNode): ReactNode[] {
  const arr = React.Children.toArray(children);
  return arr.filter((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child).trim() !== '';
    }
    return child != null;
  });
}

/**
 * Extract list-item body only. Nested ul/ol must not re-enter the parent List
 * mapper as fake "li" rows (that caused nested-li crashes).
 */
function listItemBody(child: ReactNode): ReactNode {
  if (!React.isValidElement(child)) {
    return child;
  }
  const props = child.props as { children?: ReactNode; node?: { tagName?: string } };
  const tag = props?.node?.tagName;
  if (child.type === 'li' || tag === 'li') {
    return <>{props.children}</>;
  }
  return child;
}

// ============================================================================
// DIFF CODE BLOCK COMPONENT
// ============================================================================

interface DiffCodeBlockProps {
  code: string;
}

const DiffCodeBlock: React.FC<DiffCodeBlockProps> = ({ code }) => {
  const lines = code.split('\n');
  const processedLines = useMemo(() => {
    return lines.map((line, index) => {
      const trimmed = line.trimStart();
      let type: 'added' | 'removed' | 'unchanged' | 'header' = 'unchanged';
      let content = line;
      
      if (trimmed.startsWith('+')) {
        type = 'added';
        content = line;
      } else if (trimmed.startsWith('-')) {
        type = 'removed';
        content = line;
      } else if (trimmed.startsWith('@@')) {
        type = 'header';
      } else if (trimmed.startsWith('+++ ') || trimmed.startsWith('--- ')) {
        type = 'header';
      }
      
      return { type, content, index };
    });
  }, [code]);

  return (
    <Box as={`p:20 r:10 rel bg:#24292e overflow-x:auto`}>
      <Flex cols as={`mono s:xs`}>
        {processedLines.map(({ type, content, index }) => {
          const bgColor = 
            type === 'added' ? 'rgba[46,160,67,0.15]' :
            type === 'removed' ? 'rgba[248,81,73,0.15]' :
            type === 'header' ? 'rgba[139,148,158,0.15]' :
            'transparent';
          
          const prefixColor =
            type === 'added' ? '#3fb950' :
            type === 'removed' ? '#f85149' :
            type === 'header' ? '#8b949e' :
            '#6e7681';

          return (
            <Flex key={index} as={`w:full`} style={{ backgroundColor: bgColor }}>
              <Box as={`w:40 text-align:right pr:8 flex-shrink:0 c:#6e7681 user-select:none`}>
                {index + 1}
              </Box>
              <Flex as={`flex:1`}>
                <Text as={`white-space:pre`} style={{ color: type === 'added' ? '#3fb950' : type === 'removed' ? '#f85149' : 'inherit' }}>
                  {content || ' '}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

// ============================================================================
// THINKING BLOCK COMPONENT
// ============================================================================

interface ThinkingBlockProps {
  content: string;
}

const VISIBLE_THOUGHTS = 3;

const ThinkingBlock: React.FC<ThinkingBlockProps> = ({ content }) => {
  const [expanded, setExpanded] = useState(false);

  // Split by lines and filter out empty ones
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) return null;

  const extra = lines.length - VISIBLE_THOUGHTS;
  const visible = expanded ? lines : lines.slice(-VISIBLE_THOUGHTS);

  return (
    <Flex cols gap={8} as={`p:12 r:10 bg:$surface`}>
      <Flex aic gap={8}>
        <Box as={`w:8 h:8 r:50% bg:$accent`} />
        <Text as={`s:xs dim-50 upper`}>Thinking</Text>
      </Flex>

      {lines.length > VISIBLE_THOUGHTS && !expanded && (
        <Button
          kind="ghost"
          as={`s:xs self:start pl:0`}
          onClick={() => setExpanded(true)}
        >
          Show {extra} earlier thought{extra === 1 ? '' : 's'}
        </Button>
      )}

      <Flex cols gap={4} as={`pl:16`}>
        {visible.map((line, i) => (
          <Text key={i} as={`s:sm dim-70 italic`}>
            {line}
          </Text>
        ))}
      </Flex>

      {expanded && lines.length > VISIBLE_THOUGHTS && (
        <Button
          kind="ghost"
          as={`s:xs self:start pl:0`}
          onClick={() => setExpanded(false)}
        >
          Collapse thoughts
        </Button>
      )}
    </Flex>
  );
};

// ============================================================================
// AGENT OUTPUT BLOCK COMPONENTS
// ============================================================================

interface ShellBlockProps {
  shellId: string;
  running: boolean;
  exitCode?: number;
  output: string;
}

const ShellBlock: React.FC<ShellBlockProps> = ({ shellId, running, exitCode, output }) => {
  const [expanded, setExpanded] = useState(true);
  const isError = exitCode !== undefined && exitCode !== 0;

  return (
    <Flex cols as={`mv:10 p:12 r:8 bg:$bg`}>
      <Flex aic gap={10}>
        <Text as={`--shell mono s:xs ${isError ? 'c:$danger' : 'c:$text-dim'}`}>{shellId}</Text>
        {running && <Text as={`s:xs c:$text-dim`}>running…</Text>}
        {exitCode !== undefined && (
          <Text as={`s:xs ${isError ? 'c:$danger' : 'c:$success'}`}>exit {exitCode}</Text>
        )}
        <Button
          kind="ghost"
          icon={expanded ? 'chevronUp' : 'chevronDown'}
          as={`s:xs! ml:auto`}
          onClick={() => setExpanded(!expanded)}
        />
      </Flex>
      {expanded && output && (
        <Box as={`p:10 r:6 bg:$surface mono s:xs white-space:pre-wrap overflow-x:auto`}>
          {output}
        </Box>
      )}
    </Flex>
  );
};

interface CommandBlockProps {
  command: string;
}

const CommandBlock: React.FC<CommandBlockProps> = ({ command }) => (
  <Flex aic gap={8} as={`mv:8 p:10 r:6 bg:$surface`}>
    <Text as={`--cmd-1 mono s:sm c:$text-dim`}>$</Text>
    <Text as={`--cmd-2 mono s:sm`}>{command}</Text>
  </Flex>
);

interface TaskStepProps {
  name: string;
  duration?: string;
}

const TaskStep: React.FC<TaskStepProps> = ({ name, duration }) => (
  <Flex aic gap={8} as={`mv:6`}>
    <Text as={`s:xs c:$text-dim`}>{name}</Text>
    {duration && <Text as={`s:xs dim-50`}>· {duration}</Text>}
  </Flex>
);

// ============================================================================
// CONTENT PARSER FOR AI-SPECIFIC MARKDOWN
// ============================================================================

interface LogBlock {
  type: 'prose' | 'thinking' | 'shell' | 'command' | 'task_step';
  content?: string;
  command?: string;
  shellId?: string;
  running?: boolean;
  exitCode?: number;
  output?: string;
  name?: string;
  duration?: string;
}

/**
 * Parse agent response for special markers:
 * - <think>...</think> for reasoning content
 * - ⟦cmd⟧...⟦/cmd⟧ for commands
 * - ⟦shell id="..." running="1/0" exit="N"⟧...⟦/shell⟧ for shell output
 * - "Thought for..." / "Focused:" lines
 */
function parseAgentContent(raw: string): LogBlock[] {
  const blocks: LogBlock[] = [];
  let remaining = raw;

  const cmdRegex = /⟦cmd⟧([\s\S]*?)⟦\/cmd⟧/;
  const shellRegex = /⟦shell\s+id="?([^"\s]+)"?\s+running="?([01])"?(?:\s+exit="?(\d+)"?)?⟧([\s\S]*?)⟦\/shell⟧/;
  const thinkRegex = /<think>([\s\S]*?)<\/think>/;
  const thoughtLineRegex = /^(Thought for\s+[^\n]+)/m;
  const focusedRegex = /Focused:\s*([^\n]+)/;
  const stepRegex = /^(Completed|Failed|Done|Self-heal)[^\n·]*·\s*(?:worked for\s*)?([^\n]*)/im;

  while (remaining.length > 0) {
    // 1. Match <think> blocks (highest priority)
    const thinkMatch = remaining.match(thinkRegex);
    if (thinkMatch && thinkMatch.index === 0) {
      blocks.push({
        type: 'thinking',
        content: thinkMatch[1].trim()
      });
      remaining = remaining.slice(thinkMatch[0].length).trimStart();
      continue;
    }

    // 2. Match ⟦cmd⟧ blocks
    const cmdMatch = remaining.match(cmdRegex);
    if (cmdMatch && cmdMatch.index === 0) {
      let inner = cmdMatch[1].trim();
      // Check if cmd contains a shell block
      const shellInCmd = inner.match(shellRegex);
      if (shellInCmd) {
        blocks.push({
          type: 'shell',
          shellId: shellInCmd[1],
          running: shellInCmd[2] === '1',
          exitCode: shellInCmd[3] ? parseInt(shellInCmd[3], 10) : undefined,
          output: shellInCmd[4].trim()
        });
      } else {
        // Regular command
        const cmdExtract = inner.match(/`([^`]+)`/);
        blocks.push({
          type: 'command',
          command: cmdExtract ? cmdExtract[1] : inner
        });
      }
      remaining = remaining.slice(cmdMatch[0].length).trimStart();
      continue;
    }

    // 3. Match ⟦shell⟧ blocks directly
    const shellMatch = remaining.match(shellRegex);
    if (shellMatch && shellMatch.index === 0) {
      blocks.push({
        type: 'shell',
        shellId: shellMatch[1],
        running: shellMatch[2] === '1',
        exitCode: shellMatch[3] ? parseInt(shellMatch[3], 10) : undefined,
        output: shellMatch[4].trim()
      });
      remaining = remaining.slice(shellMatch[0].length).trimStart();
      continue;
    }

    // 4. Match "Thought for..." lines directly in prose
    const thoughtMatch = remaining.match(thoughtLineRegex);
    if (thoughtMatch && thoughtMatch.index === 0) {
      const thoughtLine = thoughtMatch[1];
      const focusedMatch = remaining.match(focusedRegex);
      blocks.push({
        type: 'thinking',
        content: thoughtLine + (focusedMatch ? `\nFocused: ${focusedMatch[1]}` : '')
      });
      remaining = remaining.slice(thoughtMatch[1].length).trimStart();
      continue;
    }

    // 5. Match task step markers
    const stepMatch = remaining.match(stepRegex);
    if (stepMatch && stepMatch.index === 0) {
      blocks.push({
        type: 'task_step',
        name: stepMatch[0].trim(),
        duration: stepMatch[2]?.trim()
      });
      remaining = remaining.slice(stepMatch[0].length).trimStart();
      continue;
    }

    // 6. Collect prose until next special marker
    const nextSpecial = Math.min(
      ...[
        remaining.match(thinkRegex)?.index ?? Infinity,
        remaining.match(cmdRegex)?.index ?? Infinity,
        remaining.match(shellRegex)?.index ?? Infinity,
        remaining.match(thoughtLineRegex)?.index ?? Infinity,
        remaining.match(stepRegex)?.index ?? Infinity,
      ].filter(n => n !== undefined && n > 0)
    );

    const sliceEnd = nextSpecial === Infinity ? remaining.length : nextSpecial;
    const prose = remaining.slice(0, sliceEnd).trim();

    if (prose) {
      const lastBlock = blocks[blocks.length - 1];
      if (lastBlock && lastBlock.type === 'prose') {
        lastBlock.content = (lastBlock.content || '') + '\n' + prose;
      } else {
        blocks.push({ type: 'prose', content: prose });
      }
    }

    remaining = remaining.slice(sliceEnd).trimStart();
  }

  return blocks;
}

// ============================================================================
// AGENT CONTENT RENDERER
// ============================================================================

const AgentContentBlock: React.FC<{ block: LogBlock }> = ({ block }) => {
  switch (block.type) {
    case 'thinking':
      return <ThinkingBlock content={block.content || ''} />;
    case 'shell':
      return (
        <ShellBlock
          shellId={block.shellId || 'shell'}
          running={block.running || false}
          exitCode={block.exitCode}
          output={block.output || ''}
        />
      );
    case 'command':
      return <CommandBlock command={block.command || ''} />;
    case 'task_step':
      return <TaskStep name={block.name || ''} duration={block.duration} />;
    case 'prose':
    default:
      // Prose blocks need markdown rendering for tables, lists, etc.
      if (!block.content) return null;
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={comps as any}
        >
          {block.content}
        </ReactMarkdown>
      );
  }
};

// ============================================================================
// MARKDOWN COMPONENTS
// ============================================================================

// ============================================================================
// HELPER: Auto-link URLs in text
// ============================================================================

const AUTO_LINK_PATTERN = /(https?:\/\/[^\s<>)"{}|\^`\[\]]+)/gi;

const autoLinkText = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = AUTO_LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a key={match.index} href={match[1]} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

// ============================================================================
// HELPER: Unescape markdown characters
// ============================================================================

const unescapeMarkdown = (text: string): string => {
  return text
    .replace(/\\([\\`*_{}\[\]()#+\-.!])/g, '$1')
    .replace(/\\(<)/g, '<')
    .replace(/\\(>)/g, '>');
};

// ============================================================================
// HELPER: Parse reference links
// ============================================================================

interface ReferenceLink {
  label: string;
  url: string;
  title?: string;
}

const parseReferenceLinks = (content: string): Map<string, ReferenceLink> => {
  const refs = new Map<string, ReferenceLink>();
  // Support [ref]: url and [ref]: url "title"
  const refPattern = /^\[([^\]]+)\]:\s*([^\s]+)(?:\s+["']([^"']+)["'])?\s*$/gim;
  let match;
  while ((match = refPattern.exec(content)) !== null) {
    refs.set(match[1].toLowerCase(), {
      label: match[1],
      url: match[2],
      title: match[3]
    });
  }
  return refs;
};

const removeReferenceDefinitions = (content: string): string => {
  return content.replace(/^\[[^\]]+\]:\s*\S+.*$/gim, '').replace(/\n{3,}/g, '\n\n');
};

const comps: Record<string, React.FC<any>> = {
  h1: (props) => {
    const { node, ...rest } = props;
    return <Text kind="h1" {...rest} as={`bold`} />;
  },
  h2: (props) => {
    const { node, ...rest } = props;
    return <Text kind="h2" {...rest} as={`bold`} />;
  },
  h3: (props) => {
    const { node, ...rest } = props;
    return <Text kind="h3" {...rest} as={`bold`} />;
  },
  h4: (props) => {
    const { node, ...rest } = props;
    return <Text kind="h4" {...rest} as={`bold`} />;
  },
  h5: (props) => {
    const { node, ...rest } = props;
    return <Text kind="h5" {...rest} as={`bold`} />;
  },
  h6: (props) => {
    const { node, ...rest } = props;
    return <Text kind="h6" {...rest} as={`bold`} />;
  },
  p: (props) => {
    const { node, ...rest } = props;
    return <Text kind="p" {...rest} />;
  },
  strong: (props) => {
    const { node, ...rest } = props;
    return <Span as={`bold`} {...rest} />;
  },
  em: (props) => {
    const { node, ...rest } = props;
    return <Span as={`italic`} {...rest} />;
  },
  del: (props) => {
    const { node, ...rest } = props;
    return <Span as={`td:line-through dim-60`} {...rest} />;
  },
  sup: (props) => {
    const { node, ...rest } = props;
    return <Span as={`s:xs vertical-align:super`} {...rest} />;
  },
  sub: (props) => {
    const { node, ...rest } = props;
    return <Span as={`s:xs vertical-align:sub`} {...rest} />;
  },
  kbd: (props) => {
    const { node, ...rest } = props;
    return (
      <Span
        as={`mono s:xs ph:6 pv:2 r:4 bg:$surface border:1,$border-primary,solid`}
        {...rest}
      />
    );
  },
  mark: (props) => {
    const { node, ...rest } = props;
    return <Span as={`bg:yellow-300 c:black ph:2`} {...rest} />;
  },
  details: (props) => {
    const { node, children, ...rest } = props;
    return <details {...rest}>{children}</details>;
  },
  summary: (props) => {
    const { node, children, ...rest } = props;
    return <summary {...rest}>{children}</summary>;
  },
  li: (props) => {
    const { node, children, ordered, index, ...rest } = props;
    // Strip nested list props that confuse our Flex layout
    return (
      <Flex aic gap={10} as={`mb:6 --li`} {...rest}>
        <Flex as={`ass pt:4 shrink:0`}>
          {ordered ? (
            <Text>{typeof index === 'number' ? index + 1 : '•'}.</Text>
          ) : (
            <Box as={`bg:$text-primary dim-75 w:6 r:50% ratio-square mt:4`} />
          )}
        </Flex>
        <Flex cols as={`flex:1 ass minW:0`} wrap>
          {children}
        </Flex>
      </Flex>
    );
  },
  ul: (props) => {
    const { node, children, ...rest } = props;
    const items = cleanChildren(children).map((child, i) => (
      <Flex aic gap={5} key={`ul-${i}`} as={`w:full`}>
        <Flex as={`flex ass w:6 m:5,0,0,0 ratio-square border:2,$text-primary,solid --round radius:10`} />
        <Flex as={`flex:1 ass`} wrap>
          {listItemBody(child)}
        </Flex>
      </Flex>
    ));
    return (
      <Flex cols as={`--ul w:full mv:20`} {...rest} gap={7}>
        {items}
      </Flex>
    );
  },
  ol: (props) => {
    const { node, children, ...rest } = props;
    const items = cleanChildren(children).map((child, i) => (
      <Flex gap={5} key={`ol-${i}`} as={`w:full`}>
        <Flex as={`flex ass w:2.5em`}>{i+1}.</Flex>
        <Flex as={`flex:1 ass`}>
        {listItemBody(child)}
        </Flex>
      </Flex>
    ));
    return (
      <Flex cols as={`--ol w:full mv:20`} {...rest} gap={7}>
        {items}
      </Flex>
    );
  },
  blockquote: (props) => {
    const { node, children, ...rest } = props;
    return (
      <Box as={`borderLeft:3,$border-primary,solid pl:14 dim-80`} {...rest}>
        {children}
      </Box>
    );
  },
  a: (props) => {
    const { node, href, children, title, ...rest } = props;
    return (
      <a href={href} target="_blank" rel="noreferrer" title={title} {...rest}>
        {children}
      </a>
    );
  },
  img: (props) => {
    const { node, src, alt, ...rest } = props;
    if (!src) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ''}
        style={{ maxWidth: '100%', borderRadius: 10, margin: '12px 0' }}
        {...rest}
      />
    );
  },
  code: (props) => {
    const { node, inline, className, children, ...rest } = props;
    if (inline !== false && !String(className || '').includes('language-')) {
      const content = String(children || '');
      
      // Check if content looks like a file path (contains / or \ or ends with .ext)
      const isLikelyFilePath = /[\/\\]/.test(content) || /\.[a-zA-Z0-9]{1,10}$/.test(content);
      
      if (isLikelyFilePath && typeof window !== 'undefined' && (window as any).__vscode__) {
        const handleClick = () => {
          const vscode = (window as any).__vscode__;
          if (vscode) {
            vscode.postMessage({
              type: 'open_file',
              path: content
            });
          }
        };
        
        return (
          <Span 
            as={`--code mono ph:3 r:5 cursor:pointer hover:underline`} 
            title="Click to open file"
            onClick={handleClick}
            {...rest}
          >
            {children}
          </Span>
        );
      }
      
      return (
        <Span as={`--code mono ph:3 r:5`} {...rest}>
          {children}
        </Span>
      );
    }
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    );
  },
  pre: (props) => {
    const { node, children, ...rest } = props;

    if (!React.isValidElement(children)) {
      return <pre {...rest}>{children}</pre>;
    }

    const { children: codeString, className } = children.props as {
      children?: string;
      className?: string;
    };
    
    const { lang, displayName } = parseLanguage(className);
    const extractedCode = codeString;

    const codeText =
      typeof extractedCode === 'string'
        ? extractedCode
        : Array.isArray(extractedCode)
          ? (extractedCode as string[]).join('')
          : String(extractedCode ?? '');

    // Check if this is a diff block
    const isDiff = lang === 'diff';
    
    return (
      <Flex cols
        as={`--zuz-code-pre`}
        {...rest}>
        <Flex as={`--za-code-head`} aic>
          <Flex as={`flex:1`}>
            <Text as={`--za-ch-title`}>{displayName}</Text>
          </Flex>
          <Flex aic gap={10}>
            <Button
                  icon={`copy`}
                  kind={`ghost`}
                  as={`s:sm! ratio-square p:4! &hover(bg:rgba[255,255,255,0.2]!)`}
                  style={{
                    [`--icon-color-1` as any]: `var(--za-copy, var(--text-primary))`,
                    [`--icon-color-2` as any]: `rgb(from var(--icon-color-1) r g b / 0.5)`,
                  }}
                  onClick={() => {
                      copyToClipboard(codeText)
                      .then(() => {
                        // pubsub.emit(Events.CodeCopied)
                      });
                  }}
              />
          </Flex>
        </Flex>
        {isDiff ? (
          <DiffCodeBlock code={codeText} />
        ) : (
          <CodeBlock
            as={`p:20 r:10 rel`}
            showLines={false}
            code={codeText}
            lang={lang}
          />
        )}
      </Flex>
    );
  },
  hr: () => <Box as={`--hr h:5`} />,
  table: (props) => {
    const { node, children, ...rest } = props;
    return (
      <Box as={`--tbl ov:auto w:full maxW:100% mv:20`}>
        <table
          style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}
          {...rest}
        >
          {children}
        </table>
      </Box>
    );
  },
  thead: (props) => {
    const { node, ...rest } = props;
    return <thead {...rest} />;
  },
  tbody: (props) => {
    const { node, ...rest } = props;
    return <tbody {...rest} />;
  },
  tr: (props) => {
    const { node, ...rest } = props;
    return <tr {...rest} />;
  },
  th: (props) => {
    const { node, children, style, ...rest } = props;
    // Parse alignment from style prop passed by remark-gfm
    const align = (style as any)?.textAlign as 'left' | 'center' | 'right' | undefined;
    return (
      <th
        style={{
          textAlign: align || 'left',
          padding: '8px 10px',
          borderBottom: '1px solid var(--border-primary)',
          fontWeight: 600,
          backgroundColor: 'var(--surface)',
          color: 'var(--text-primary)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
        {...rest}
      >
        {children}
      </th>
    );
  },
  td: (props) => {
    const { node, children, style, ...rest } = props;
    // Parse alignment from style prop passed by remark-gfm
    const align = (style as any)?.textAlign as 'left' | 'center' | 'right' | undefined;
    return (
      <td
        style={{
          padding: '8px 10px',
          verticalAlign: 'top',
          textAlign: align || 'left',
          color: 'var(--text-primary)',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
        {...rest}
      >
        {children}
      </td>
    );
  },
};

/** Soft-fail so a single bad markdown AST never unmounts the chat. */
class MarkdownErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('Markdown render error', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <Box as={`p:12 r:10 bg:$surface s:14 mono white-space:pre-wrap`}>
            Could not render markdown.
          </Box>
        )
      );
    }
    return this.props.children;
  }
}

/** Light sanitization before parse — reduces pathological nesting crashes. */
function prepMarkdown(src: string): string {
  if (!src) return '';
  let s = src.replace(/\r\n/g, '\n');
  // Preserve intentional soft line breaks outside fenced code blocks.
  // remark-breaks handles this, but restored chat history sometimes arrives with
  // single newlines that CommonMark would otherwise collapse to spaces.
  s = preserveSoftLineBreaks(s);
  // Collapse accidental blank lines inside tight lists (helps GFM) - but not in tables
  s = s.replace(/(\n[ \t]*[-*+][^\n]*)\n{2,}(?=[ \t]*[-*+])/g, '$1\n');
  // Cap extreme depth markers that some models emit (skip table rows that start with |)
  s = s.replace(/^(\s{0,3})([-*+])\s+\2\s+(?!\|)/gm, '$1$2 ');
  // Avoid nested list bullets glued: "* * item" → "* item" (skip table rows)
  s = s.replace(/^(\s*)([-*+])\s+([-*+])\s+(?!\|)/gm, '$1$2 ');
  return s;
}

/** Convert single newlines to markdown hard-breaks outside ``` fences.
 *  Skips list/heading/blockquote lines so GFM structure stays intact.
 */
function preserveSoftLineBreaks(src: string): string {
  const parts = src.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => {
      if (part.startsWith('```')) return part;
      // "  \n" is a CommonMark hard line break. Do not insert before list/heading lines.
      return part.replace(
        /([^\n])\n(?!\n)(?![ \t]*(?:[-*+] |\d+\. |#{1,6} |>))/g,
        '$1  \n'
      );
    })
    .join('');
}

// ============================================================================
// FOOTNOTE COMPONENTS
// ============================================================================

interface FootnoteRefProps {
  id: string;
  backContent?: ReactNode;
}

const FootnoteDefinition: React.FC<{ id: string; children: ReactNode }> = ({ id, children }) => {
  return (
    <Flex id={`fn-${id}`} as={`mv:8 gap:8`}>
      <Text as={`s:xs c:$accent`}>[{id}]</Text>
      <Flex as={`flex:1`}>{children}</Flex>
      <a href={`#fnref-${id}`} style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>↩</a>
    </Flex>
  );
};

// ============================================================================
// DEFINITION LIST COMPONENTS
// ============================================================================

const DefList: React.FC<{ children: ReactNode }> = ({ children }) => (
  <dl style={{ margin: '16px 0', padding: 0 }}>{children}</dl>
);

const DefTerm: React.FC<{ children: ReactNode }> = ({ children }) => (
  <dt style={{ fontWeight: 600, marginTop: '12px', marginBottom: '4px' }}>{children}</dt>
);

const DefDescription: React.FC<{ children: ReactNode }> = ({ children }) => (
  <dd style={{ marginLeft: '20px', marginBottom: '4px', color: 'var(--text-secondary)' }}>{children}</dd>
);

// ============================================================================
// MAIN MARKDOWN COMPONENT
// ============================================================================

/**
 * Check if content contains AI-specific markup that needs special rendering
 */
function hasAIMarkers(content: string): boolean {
  // Only check for explicit AI block markers, not content that might appear in tables
  return (
    /<think[\s>]/i.test(content) ||
    /⟦cmd⟧/.test(content) ||
    /⟧cmd⟦/.test(content) ||
    /⟦shell/.test(content) ||
    /⟧shell/.test(content) ||
    /^Thought for\s+/im.test(content)
  );
}

/**
 * Split content into segments that are either:
 * - Regular markdown (to be rendered by ReactMarkdown)
 * - AI special blocks (rendered by custom components)
 */
function segmentContent(raw: string): Array<{ type: 'markdown' | 'agent'; content: string }> {
  const segments: Array<{ type: 'markdown' | 'agent'; content: string }> = [];

  // Combined regex for all AI blocks - must have 'g' flag for iterative matching
  const aiBlockRegex = /(<think[\s\S]*?<\/think>|⟦cmd⟧[\s\S]*?⟦\/cmd⟧|⟦shell\s+[^⟧]+⟧[\s\S]*?⟦\/shell⟧)/gi;

  // Find all matches first
  const matches: Array<{ index: number; length: number; content: string }> = [];
  let match;
  while ((match = aiBlockRegex.exec(raw)) !== null) {
    matches.push({ index: match.index, length: match[0].length, content: match[0] });
  }

  // No AI blocks found - return as single markdown segment
  if (matches.length === 0) {
    if (raw.trim()) {
      return [{ type: 'markdown', content: raw }];
    }
    return [];
  }

  // Build segments based on matches
  let lastEnd = 0;
  for (const m of matches) {
    // Add prose before this AI block (preserve original spacing)
    if (m.index > lastEnd) {
      const prose = raw.slice(lastEnd, m.index);
      if (prose) {
        segments.push({ type: 'markdown', content: prose });
      }
    }

    // Add the AI block
    segments.push({ type: 'agent', content: m.content });
    lastEnd = m.index + m.length;
  }

  // Add any remaining prose after last AI block
  if (lastEnd < raw.length) {
    const prose = raw.slice(lastEnd);
    if (prose.trim()) {
      segments.push({ type: 'markdown', content: prose });
    }
  }

  return segments;
}

/**
 * Default, host-neutral Markdown rendering for agent responses. Hosts can
 * still replace it through AgentChat's renderMarkdown prop when they need a
 * richer policy (for example math, mermaid, or a custom link handler).
 */
export function AgentMarkdown({ content }: { content: string }) {

  // Extract reference links definitions before processing
  const refs = useMemo(() => parseReferenceLinks(content || ''), [content]);
  const contentWithoutRefs = useMemo(() => removeReferenceDefinitions(content || ''), [content]);
  const safe = prepMarkdown(contentWithoutRefs);

  // Detect RTL content for proper text alignment
  const isRTL = hasRTLContent(safe);
  const dir = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'right' : 'left';

  // Check if content has AI-specific markers
  const hasAI = hasAIMarkers(safe);

  // Extended components with footnote and definition list support
  const extendedComponents: Record<string, React.FC<any>> = {
    ...comps,
    // GFM footnotes (supported by remark-gfm)
    sup: (props: any) => {
      // Handle superscript (for GFM ^superscript^ and footnote references)
      const { node, ...rest } = props;
      return <Span as={`s:xs vertical-align:super`} {...rest} />;
    },
    // Custom components for definition lists (remark-deflist)
    dl: (props: any) => <DefList {...props} />,
    dt: (props: any) => <DefTerm {...props} />,
    dd: (props: any) => <DefDescription {...props} />,
    // Math components
    math: (props: any) => {
      const { value } = props;
      return (
        <Box as={`overflow-x:auto mv:20`}>
          <span dangerouslySetInnerHTML={{ __html: value }} />
        </Box>
      );
    },
    inlineMath: (props: any) => {
      const { value } = props;
      return <span dangerouslySetInnerHTML={{ __html: value }} />;
    },
  };

  if (!hasAI) {
    // Standard markdown - no AI markers
    return (
      <Box as={`--markdown w:full minW:0`} style={{ direction: dir, textAlign: align }}>
        <MarkdownErrorBoundary
          fallback={
            <Box as={`p:12 r:10 bg:$surface s:14 white-space:pre-wrap`}>{safe}</Box>
          }
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkDeflist]}
            rehypePlugins={[rehypeKatex]}
            components={extendedComponents as any}
          >
            {safe}
          </ReactMarkdown>
        </MarkdownErrorBoundary>
      </Box>
    );
  }

  // Content has AI markers - segment and render appropriately
  const segments = segmentContent(safe);

  return (
    <Box as={`--za-markdown w:full minW:0`} style={{ direction: dir, textAlign: align }}>
      <MarkdownErrorBoundary
        fallback={
          <Box as={`p:12 r:10 bg:$surface s:14 white-space:pre-wrap`}>{safe}</Box>
        }
      >
        {segments.map((segment, index) => {
          if (segment.type === 'agent') {
            const blocks = parseAgentContent(segment.content);
            return (
              <React.Fragment key={`agent-${index}`}>
                {blocks.map((block, blockIndex) => (
                  <AgentContentBlock
                    key={`block-${index}-${blockIndex}`}
                    block={block}
                  />
                ))}
              </React.Fragment>
            );
          }
          // Render markdown segment
          return (
            <React.Fragment key={`md-${index}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath, remarkBreaks, remarkDeflist]}
                rehypePlugins={[rehypeKatex]}
                components={extendedComponents as any}
              >
                {segment.content}
              </ReactMarkdown>
            </React.Fragment>
          );
        })}
      </MarkdownErrorBoundary>
    </Box>
  );
}
