export interface ComponentSnippet {
    prefix: string;
    body: string[];
    description: string;
    scope: string;
}

export type SnippetMap = Record<string, ComponentSnippet>;

/**
 * VS Code snippet definitions for every @zuzjs/ui component.
 * Generated from JSDoc @example blocks in src/comps/index.ts.
 * Scope is restricted to TSX/JSX so completions don't fire in unrelated files.
 */
const componentSnippets: SnippetMap = {
    "Zuz Accordion": {
        prefix: "ui-accordion",
        body: ['<Accordion items={[{ title: "$1", body: "$2" }]} />'],
        description: "Collapsible content container.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ActionBar": {
        prefix: "ui-actionbar",
        body: ['<ActionBar>$1</ActionBar>'],
        description: "Horizontal actions container.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Alert": {
        prefix: "ui-alert",
        body: ['<Alert title="$1" message="$2" />'],
        description: "Inline alert feedback.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz AutoComplete": {
        prefix: "ui-autocomplete",
        body: ['<AutoComplete options={[$1]} />'],
        description: "Input with suggestions.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Avatar": {
        prefix: "ui-avatar",
        body: ['<Avatar name="$1" />'],
        description: "User avatar display.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Badge": {
        prefix: "ui-badge",
        body: ['<Badge>$1</Badge>'],
        description: "Compact status badge.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Box": {
        prefix: "ui-box",
        body: ['<Box as="$1">$2</Box>'],
        description: "Primitive layout wrapper.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Button": {
        prefix: "ui-button",
        body: ['<Button onClick={$1}>$2</Button>'],
        description: "Clickable button control.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Calendar": {
        prefix: "ui-calendar",
        body: ['<Calendar />'],
        description: "Calendar date UI.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Carousel": {
        prefix: "ui-carousel",
        body: ['<Carousel>$1</Carousel>'],
        description: "Carousel/slider for items.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Chart": {
        prefix: "ui-chart",
        body: ['<Chart data={$1} />'],
        description: "Chart visualization wrapper.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ChatBubble": {
        prefix: "ui-chatbubble",
        body: ['<ChatBubble side="${1|left,right|}">$2</ChatBubble>'],
        description: "Chat-style message bubble.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz CheckBox": {
        prefix: "ui-checkbox",
        body: ['<CheckBox name="$1" label="$2" />'],
        description: "Checkbox input control.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz CodeBlock": {
        prefix: "ui-codeblock",
        body: ['<CodeBlock code="$1" language="${2|ts,tsx,js,jsx,bash,json|}" />'],
        description: "Syntax highlighted code viewer.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ColorScheme": {
        prefix: "ui-colorscheme",
        body: ['<ColorScheme />'],
        description: "Theme toggle/display component.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ContextMenu": {
        prefix: "ui-contextmenu",
        body: ['<ContextMenu items={$1} />'],
        description: "Right-click or trigger menu.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz CookiesConsent": {
        prefix: "ui-cookiesconsent",
        body: ['<CookiesConsent />'],
        description: "Cookie consent prompt.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Cover": {
        prefix: "ui-cover",
        body: ['<Cover show message="$1" />'],
        description: "Loading or blocking cover layer.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Cropper": {
        prefix: "ui-cropper",
        body: ['<Cropper src={$1} />'],
        description: "Image crop editor.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Crumb": {
        prefix: "ui-crumb",
        body: ['<Crumb items={$1} />'],
        description: "Breadcrumb navigation.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz DatePicker": {
        prefix: "ui-datepicker",
        body: ['<DatePicker name="$1" />'],
        description: "Date picking input.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Dialog": {
        prefix: "ui-dialog",
        body: ['<Dialog open title="$1" />'],
        description: "Modal dialog component.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Drawer": {
        prefix: "ui-drawer",
        body: ['<Drawer open>$1</Drawer>'],
        description: "Slide-in drawer panel.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Fab": {
        prefix: "ui-fab",
        body: ['<Fab icon="$1" onClick={$2} />'],
        description: "Floating action button.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Filters": {
        prefix: "ui-filters",
        body: ['<Filters filters={$1} onChange={$2} />'],
        description: "Filter helpers UI.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Flex": {
        prefix: "ui-flex",
        body: ['<Flex $1>$2</Flex>'],
        description: "Flexbox layout primitive.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Form": {
        prefix: "ui-form",
        body: ['<Form onSubmit={$1}>$2</Form>'],
        description: "Form state and validation wrapper.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Grid": {
        prefix: "ui-grid",
        body: ['<Grid cols={$1}>$2</Grid>'],
        description: "Grid layout primitive.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Group": {
        prefix: "ui-group",
        body: ['<Group>$1</Group>'],
        description: "Grouped input/content helper.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Icon": {
        prefix: "ui-icon",
        body: ['<Icon name="$1" />'],
        description: "Icon renderer.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Image": {
        prefix: "ui-image",
        body: ['<Image src="$1" alt="$2" />'],
        description: "Image element wrapper.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Input": {
        prefix: "ui-input",
        body: ['<Input name="$1" placeholder="$2" />'],
        description: "Text input field.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz KeyboardKeys": {
        prefix: "ui-keyboardkeys",
        body: ['<KeyboardKeys keys={[$1]} />'],
        description: "Keyboard shortcut keycaps.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Label": {
        prefix: "ui-label",
        body: ['<Label htmlFor="$1">$2</Label>'],
        description: "Field label component.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz LayersProvider": {
        prefix: "ui-layersprovider",
        body: ['<LayersProvider>$1</LayersProvider>'],
        description: "Layer management provider.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz List": {
        prefix: "ui-list",
        body: ['<List items={$1} />'],
        description: "List container with items.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz MediaPlayer": {
        prefix: "ui-mediaplayer",
        body: ['<MediaPlayer src={$1} />'],
        description: "Media player wrapper.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz NetworkStatus": {
        prefix: "ui-networkstatus",
        body: ['<NetworkStatus />'],
        description: "Network status indicator.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Overlay": {
        prefix: "ui-overlay",
        body: ['<Overlay show />'],
        description: "Fullscreen/page overlay.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Pagination": {
        prefix: "ui-pagination",
        body: ['<Pagination page={$1} total={$2} onChange={$3} />'],
        description: "Pagination controls.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Password": {
        prefix: "ui-password",
        body: ['<Password name="$1" />'],
        description: "Password input with optional helpers.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz PinInput": {
        prefix: "ui-pininput",
        body: ['<PinInput length={$1} />'],
        description: "Multi-cell pin/otp input.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ProgressBar": {
        prefix: "ui-progressbar",
        body: ['<ProgressBar value={$1} />'],
        description: "Linear progress indicator.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Radio": {
        prefix: "ui-radio",
        body: ['<Radio name="$1" value="$2" />'],
        description: "Radio selection control.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ScrollView": {
        prefix: "ui-scrollview",
        body: ['<ScrollView>$1</ScrollView>'],
        description: "Scrollable viewport container.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Search": {
        prefix: "ui-search",
        body: ['<Search onChange={$1} />'],
        description: "Search input with clear action.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz SelectTabs": {
        prefix: "ui-selecttabs",
        body: ['<SelectTabs options={$1} />'],
        description: "Segmented single-select tabs.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Select": {
        prefix: "ui-select",
        body: ['<Select options={[{ label: "$1", value: "$2" }]} />'],
        description: "Select/dropdown control.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Sheet": {
        prefix: "ui-sheet",
        body: ['<Sheet open>$1</Sheet>'],
        description: "Bottom sheet container.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Slider": {
        prefix: "ui-slider",
        body: ['<Slider min={$1} max={$2} />'],
        description: "Numeric range slider.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Span": {
        prefix: "ui-span",
        body: ['<Span as="$1">$2</Span>'],
        description: "Inline text span primitive.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Spinner": {
        prefix: "ui-spinner",
        body: ['<Spinner />'],
        description: "Loading spinner.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Switch": {
        prefix: "ui-switch",
        body: ['<Switch name="$1" />'],
        description: "On/off switch control.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Table": {
        prefix: "ui-table",
        body: ['<Table columns={$1} data={$2} />'],
        description: "Data table component.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz TableOfContents": {
        prefix: "ui-tableofcontents",
        body: ['<TableOfContents items={$1} />'],
        description: "Generated table of contents.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz TabView": {
        prefix: "ui-tabview",
        body: ['<TabView tabs={$1} />'],
        description: "Tab navigation container.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Terminal": {
        prefix: "ui-terminal",
        body: ['<Terminal lines={$1} />'],
        description: "Terminal-like output renderer.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Text": {
        prefix: "ui-text",
        body: ['<Text>$1</Text>'],
        description: "Typography text component.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz Textarea": {
        prefix: "ui-textarea",
        body: ['<Textarea name="$1" rows={$2} />'],
        description: "Multiline textarea input.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz TextWheel": {
        prefix: "ui-textwheel",
        body: ['<TextWheel items={$1} />'],
        description: "Wheel-style picker.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ToastProvider": {
        prefix: "ui-toastprovider",
        body: ['<ToastProvider>$1</ToastProvider>'],
        description: "Toast notifications provider.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ToolTip": {
        prefix: "ui-tooltip",
        body: ['<ToolTip content="$1">$2</ToolTip>'],
        description: "Hover/click tooltip helper.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz TreeView": {
        prefix: "ui-treeview",
        body: ['<TreeView nodes={$1} />'],
        description: "Tree view hierarchy renderer.",
        scope: "typescriptreact,javascriptreact"
    },
    "Zuz ThemeProvider": {
        prefix: "ui-themeprovider",
        body: ['<ThemeProvider>$1</ThemeProvider>'],
        description: "App-wide theme provider.",
        scope: "typescriptreact,javascriptreact"
    }
};

export default componentSnippets;
