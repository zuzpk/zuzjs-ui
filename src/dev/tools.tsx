"use client"
import React, { useMemo, useState } from 'react';
import { cssDirect, cssProps } from '../builder/stylesheet';
import * as ComponentExports from '../comps';
import Box from '../comps/Box';
import CodeBlock from '../comps/CodeBlock';
import Flex from '../comps/Flex';
import List from '../comps/List';
import ScrollView from '../comps/ScrollView';
import Search from '../comps/Search';
import Table from '../comps/Table';
import Text from '../comps/Text';
import * as HookExports from '../hooks';
import DocumentIcon from './document';

type StyleItem = {
    key: string
    definition: string
    kind: 'prop' | 'direct'
    example: string
}

type DevRowType = 'header' | 'component' | 'hook' | 'style'

type DevRow = {
    key: string
    label: string
    type: DevRowType
    detail?: string
}

type DocPropRow = {
    prop: string
    type: string
    required: 'yes' | 'no'
    default: string
    description: string
}

type ComponentDoc = {
    title: string
    summary: string
    example: string
    props: DocPropRow[]
}

const DOC_TABLE_SCHEMA = [
    { id: 'prop', value: 'Prop', weight: 1.1 },
    { id: 'type', value: 'Type', weight: 1.2 },
    { id: 'required', value: 'Required', weight: 0.7 },
    { id: 'default', value: 'Default', weight: 0.8 },
    { id: 'description', value: 'Description', weight: 2.1 },
] as const

const COMMON_DOC_PROPS: DocPropRow[] = [
    { prop: 'as', type: 'string', required: 'no', default: '-', description: 'Utility style tokens/class bindings.' },
    { prop: 'className', type: 'string', required: 'no', default: '-', description: 'Additional class names.' },
    { prop: 'style', type: 'CSSProperties', required: 'no', default: '-', description: 'Inline styles.' },
]

const COMPONENT_DOCS: Record<string, Partial<ComponentDoc>> = {
    Button: {
        summary: 'Clickable control for user actions.',
        example: `<Button type="primary" onClick={handleSave}>Save</Button>`,
        props: [
            { prop: 'type', type: 'string', required: 'no', default: 'default', description: 'Visual appearance of the button.' },
            { prop: 'disabled', type: 'boolean', required: 'no', default: 'false', description: 'Disables interaction.' },
            { prop: 'loading', type: 'boolean', required: 'no', default: 'false', description: 'Shows a loading state.' },
            { prop: 'icon', type: 'ReactNode', required: 'no', default: '-', description: 'Optional leading icon.' },
            { prop: 'onClick', type: '(event) => void', required: 'no', default: '-', description: 'Click callback.' },
        ],
    },
    Input: {
        summary: 'Text input field with built-in UI behaviors.',
        example: `<Input placeholder="Email" onChange={setEmail} />`,
        props: [
            { prop: 'value', type: 'string', required: 'no', default: '-', description: 'Controlled input value.' },
            { prop: 'defaultValue', type: 'string', required: 'no', default: '-', description: 'Initial uncontrolled value.' },
            { prop: 'placeholder', type: 'string', required: 'no', default: '-', description: 'Hint text.' },
            { prop: 'onChange', type: '(value) => void', required: 'no', default: '-', description: 'Change callback.' },
            { prop: 'disabled', type: 'boolean', required: 'no', default: 'false', description: 'Disables input editing.' },
        ],
    },
    Text: {
        summary: 'Typography primitive for labels and copy.',
        example: `<Text as="s:16 fw:600">Hello @zuzjs/ui</Text>`,
        props: [
            { prop: 'tag', type: 'string', required: 'no', default: 'div', description: 'Rendered HTML tag.' },
            { prop: 'children', type: 'ReactNode', required: 'no', default: '-', description: 'Text or nested nodes.' },
        ],
    },
    Flex: {
        summary: 'Flexible layout wrapper for rows and columns.',
        example: `<Flex aic jcc gap={12}><Text>Left</Text><Text>Right</Text></Flex>`,
        props: [
            { prop: 'cols', type: 'boolean', required: 'no', default: 'false', description: 'Switches to vertical layout.' },
            { prop: 'gap', type: 'number', required: 'no', default: '0', description: 'Spacing between children.' },
            { prop: 'aic', type: 'boolean', required: 'no', default: 'false', description: 'Align items center.' },
            { prop: 'jcc', type: 'boolean', required: 'no', default: 'false', description: 'Justify content center.' },
        ],
    },
    Table: {
        summary: 'Data table with schema-driven columns and rows.',
        example: `<Table schema={[{ id: "name", value: "Name" }]} rows={[{ name: "Jane" }]} />`,
        props: [
            { prop: 'schema', type: 'Column[]', required: 'yes', default: '-', description: 'Column definitions.' },
            { prop: 'rows', type: 'T[]', required: 'yes', default: '-', description: 'Data rows.' },
            { prop: 'pagination', type: 'boolean', required: 'no', default: 'false', description: 'Enable pagination footer.' },
            { prop: 'rowsPerPage', type: 'number', required: 'no', default: '10', description: 'Rows shown per page.' },
            { prop: 'onRowClick', type: '(row) => void', required: 'no', default: '-', description: 'Row click callback.' },
        ],
    },
}

const buildComponentDoc = (name: string): ComponentDoc => {
    const preset = COMPONENT_DOCS[name]

    return {
        title: name,
        summary: preset?.summary || `${name} component from @zuzjs/ui.`,
        example: preset?.example || `<${name} />`,
        props: [...(preset?.props || []), ...COMMON_DOC_PROPS],
    }
}

const cleanCssOutput = (value: string) => {
    return value
        .replaceAll('__VALUE__', '12px')
        .replaceAll('__CURVE__', 'ease')
        .replaceAll('__DELAY__', '0ms')
        .trim();
}

const DevToolsBox : React.FC = (_props) => {

    const [query, setQuery] = useState('')
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null)


    const components = useMemo(() => {

        return Object.entries(ComponentExports)
            .filter(([name, value]) => {
                if (name[0] !== name[0]?.toUpperCase()) {
                    return false
                }

                const valueType = typeof value
                return valueType === 'function' || valueType === 'object'
            })
            .map(([name]) => name)
            .sort((a, b) => a.localeCompare(b))

    }, [])

    const hooks = useMemo(() => {
        return Object.entries(HookExports)
            .filter(([name, value]) => name.startsWith('use') && typeof value === 'function')
            .map(([name]) => name)
            .sort((a, b) => a.localeCompare(b))
    }, [])

    const stylesheet = useMemo<StyleItem[]>(() => {
        const propItems: StyleItem[] = Object.entries(cssProps).map(([key, value]) => ({
            key,
            definition: cleanCssOutput(String(value)),
            kind: 'prop',
            example: ``, // buildStyleExample(key, 'prop')
        }))

        const directItems: StyleItem[] = Object.entries(cssDirect).map(([key, value]) => ({
            key,
            definition: cleanCssOutput(String(value)),
            kind: 'direct',
            example: ``, // buildStyleExample(key, 'direct')
        }))

        return [...propItems, ...directItems].sort((a, b) => a.key.localeCompare(b.key))
    }, [])

    const normalizedQuery = query.trim().toLowerCase()

    const filteredComponents = useMemo(() => {
        if (!normalizedQuery) {
            return components
        }
        return components.filter((name) => name.toLowerCase().includes(normalizedQuery))
    }, [components, normalizedQuery])

    const filteredHooks = useMemo(() => {
        if (!normalizedQuery) {
            return hooks
        }
        return hooks.filter((name) => name.toLowerCase().includes(normalizedQuery))
    }, [hooks, normalizedQuery])

    const filteredStylesheet = useMemo(() => {
        if (!normalizedQuery) {
            return stylesheet.slice(0, 60)
        }

        return stylesheet
            .filter((item) => {
                return [item.key, item.definition, item.example]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedQuery)
            })
            .slice(0, 120)
    }, [stylesheet, normalizedQuery])

    const selectedComponentDoc = useMemo(() => {
        if (!selectedComponent) {
            return null
        }
        return buildComponentDoc(selectedComponent)
    }, [selectedComponent])

    const listItems = useMemo<DevRow[]>(() => {
        return [
            { key: `__components__`, label: `Components`, type: 'header' },
            ...filteredComponents.map((name) => ({ key: name, label: name, type: 'component' as const })),

            { key: `__hooks__`, label: `Hooks`, type: 'header' },
            ...filteredHooks.map((name) => ({ key: `hook-${name}`, label: name, type: 'hook' as const })),

            { key: `__stylesheet__`, label: `Stylesheet`, type: 'header' },
            ...filteredStylesheet.map((item) => ({
                key: `style-${item.key}`,
                label: item.key,
                detail: item.definition,
                type: 'style' as const,
            })),
        ]
    }, [filteredComponents, filteredHooks, filteredStylesheet])

    return <Flex 
        cols
        as={`--devtools-box rel`}>

        <Flex cols as={`--devtools-head`}>
            <Search 
                as={`--devtools-search`}
                autoFocus
                onChange={setQuery}
                placeholder={`Search @zuzjs/ui`} />
        </Flex>

        <Flex cols as={`--devtools-content ${selectedComponent ? `--has-doc` : ``}`}>
            <Flex as={`--devtools-panels`}>
                <Flex cols as={`--devtools-panel --devtools-list-panel`}>
                    <ScrollView
                        as={`--devtools-scroll`}>
                        <List 
                            render={(row: DevRow) => {

                                if ( row.type === 'header') {
                                    return <Text as={`--devtools-item-section`}>{row.label}</Text>
                                }

                                if (row.type === 'component') {
                                    return <Flex
                                        aic
                                        gap={8}
                                        onClick={() => setSelectedComponent(row.label)}
                                        as={`--devtools-item rel ${selectedComponent === row.label ? `--active` : ``}`}>
                                        <Box as={`--devtools-icon --${row.type}`}>
                                            <DocumentIcon />
                                        </Box>
                                        <Text as={`--devtools-label`}>{row.label}</Text>
                                    </Flex>
                                }

                                return <Flex aic gap={8} as={`--devtools-item --devtools-item-passive rel`}>
                                    <Box as={`--devtools-icon --${row.type}`}>
                                        <DocumentIcon />
                                    </Box>
                                    <Flex cols gap={2} as={`w:100%`}>
                                        <Text as={`--devtools-label`}>{row.label}</Text>
                                        {row.detail && <Text as={`--devtools-detail`}>{row.detail}</Text>}
                                    </Flex>
                                </Flex>
                            }}
                            items={listItems}
                        />
                    </ScrollView>
                </Flex>

                <Flex cols as={`--devtools-panel --devtools-doc-panel`}>
                    {selectedComponentDoc && <ScrollView as={`--devtools-scroll --devtools-doc-scroll`}>
                        <Flex cols gap={10} as={`--devtools-doc-head`}>
                            <Text onClick={() => setSelectedComponent(null)} as={`--devtools-back`}>Back to list</Text>
                            <Text as={`--devtools-doc-title`}>{selectedComponentDoc.title}</Text>
                            <Text as={`--devtools-doc-summary`}>{selectedComponentDoc.summary}</Text>
                        </Flex>

                        <Flex cols gap={6} as={`--devtools-doc-example`}>
                            <Text as={`--devtools-doc-caption`}>Example</Text>
                            <CodeBlock lang={`tsx`} code={selectedComponentDoc.example} />
                            {/* <CodeBlock lang={`tsx`} code={selectedComponentDoc.example} /> */}
                            {/* <Text as={`--devtools-doc-code`}>{selectedComponentDoc.example}</Text> */}
                        </Flex>

                        <Flex cols gap={8} as={`--devtools-doc-table`}>
                            <Text as={`--devtools-doc-caption`}>Props</Text>
                            <Table
                                schema={DOC_TABLE_SCHEMA as any}
                                rows={selectedComponentDoc.props}
                                pagination={false}
                                hoverable
                            />
                        </Flex>
                    </ScrollView>}
                </Flex>
            </Flex>
        </Flex>
        

    </Flex>
}

export default DevToolsBox;