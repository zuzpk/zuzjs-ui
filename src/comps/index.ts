/**
 * Collapsible content container.
 * @example
 * ```tsx
 * <Accordion items={[{ title: "General", body: "Content" }]} />
 * ```
 */
export { default as Accordion } from './Accordion';
export * from './Accordion/types';

/**
 * Horizontal actions container.
 * @example
 * ```tsx
 * <ActionBar>{actions}</ActionBar>
 * ```
 */
export { default as ActionBar } from './Actionbar';
export * from './Actionbar/types';

export {
    default as AgentChat
} from "./AgentChat"
export type {
    AgentActivityBlock,
    AgentActivityOptions,
    AgentApprovalOptions,
    AgentChatBrand,
    AgentToolInvocation,
    AgentChatProps,
    AgentComposerControls,
    AgentComposerModel,
} from "./AgentChat"

/**
 * Inline alert feedback.
 * @example
 * ```tsx
 * <Alert title="Saved" message="Your changes were stored." />
 * ```
 */
export { default as Alert } from './Alert';
export * from './Alert/types';

/**
 * Input with suggestions.
 * @example
 * ```tsx
 * <AutoComplete options={["Apple", "Banana"]} />
 * ```
 */
export { default as AutoComplete } from './AutoComplete';
export * from './AutoComplete/types';

/**
 * User avatar display.
 * @example
 * ```tsx
 * <Avatar name="Kamran" />
 * ```
 */
export { default as Avatar } from './Avatar';
export * from './Avatar/types';

/**
 * Compact status badge.
 * @example
 * ```tsx
 * <Badge>Active</Badge>
 * ```
 */
export { default as Badge, type BadgeProps } from "./Badge";

/**
 * Primitive layout wrapper.
 * @example
 * ```tsx
 * <Box as="p:12">Container</Box>
 * ```
 */
export { default as Box } from "./Box";

/**
 * Clickable button control.
 * @example
 * ```tsx
 * <Button onClick={save}>Save</Button>
 * ```
 */
export { default as Button } from "./Button";
export type * from "./Button/types";

/**
 * Calendar date UI.
 * @example
 * ```tsx
 * <Calendar />
 * ```
 */
export { default as Calendar } from './Calendar';
export * from './Calendar/types';

/**
 * Carousel/slider for items.
 * @example
 * ```tsx
 * <Carousel>{slides}</Carousel>
 * ```
 */
export { default as Carousel } from './Carousel';
export * from './Carousel/types';

/**
 * Chart visualization wrapper.
 * @example
 * ```tsx
 * <Chart data={data} />
 * ```
 */
export { default as Chart } from './Chart';
export * from './Chart/types';

/**
 * Chat-style message bubble.
 * @example
 * ```tsx
 * <ChatBubble side="left">Hello</ChatBubble>
 * ```
 */
export { default as ChatBubble } from './ChatBubble';
export * from './ChatBubble/types';
export { default as ChatList } from './ChatList';
export * from './ChatList/types';

/**
 * Checkbox input control.
 * @example
 * ```tsx
 * <CheckBox name="tos" label="Accept terms" />
 * ```
 */
export { default as CheckBox } from './CheckBox';
export * from './CheckBox/types';

/**
 * Syntax highlighted code viewer.
 * @example
 * ```tsx
 * <CodeBlock code="const x = 1" language="ts" />
 * ```
 */
export { default as CodeBlock } from './CodeBlock';
export * from './CodeBlock/types';

/**
 * Theme toggle/display component.
 * @example
 * ```tsx
 * <ColorScheme />
 * ```
 */
export { default as ColorScheme } from './ColorScheme';

/**
 * Color picker input.
 * @example
 * ```tsx
 * <ColorPicker onColorChange={(c) => console.log(c.hex)} />
 * ```
 */
export { default as ColorPicker } from './ColorPicker';
export * from './ColorPicker/types';

/**
 * Right-click or trigger menu.
 * @example
 * ```tsx
 * <ContextMenu items={menuItems} />
 * ```
 */
export { default as ContextMenu } from './ContextMenu';
export * from './ContextMenu/types';

/**
 * Cookie consent prompt.
 * @example
 * ```tsx
 * <CookiesConsent />
 * ```
 */
export { default as CookiesConsent } from './CookiesConsent';
export * from './CookiesConsent/types';

/**
 * Loading or blocking cover layer.
 * @example
 * ```tsx
 * <Cover show message="Loading" />
 * ```
 */
export { default as Cover, type CoverProps } from './Cover';

/**
 * Image crop editor.
 * @example
 * ```tsx
 * <Cropper src={imageUrl} />
 * ```
 */
export { default as Cropper } from './Cropper';
export * from './Cropper/types';

/**
 * Breadcrumb navigation.
 * @example
 * ```tsx
 * <Crumb items={items} />
 * ```
 */
export { default as Crumb } from './Crumb';
export * from './Crumb/types';

/**
 * Date picking input.
 * @example
 * ```tsx
 * <DatePicker name="startDate" />
 * ```
 */
export { default as DatePicker } from './DatePicker';

export { default as DependencyTree } from './DependencyTree';
export type * from "./DependencyTree/types";

/**
 * Modal dialog component.
 * @example
 * ```tsx
 * <Dialog open title="Confirm" />
 * ```
 */
export { default as Dialog, DialogContext, useDialogDirty } from "./Dialog";
export type * from "./Dialog/types";

/**
 * Slide-in drawer panel.
 * @example
 * ```tsx
 * <Drawer open>Content</Drawer>
 * ```
 */
export { default as Drawer, DrawerContext, useDrawerDirty } from './Drawer';
export * from './Drawer/types';

/**
 * Floating action button.
 * @example
 * ```tsx
 * <Fab icon="plus" onClick={createItem} />
 * ```
 */
export { default as Fab } from './Fab';
export * from './Fab/types';

export { default as Fieldset } from './Fieldset';
export * from './Fieldset/types';

/**
 * Filter helpers UI.
 * @example
 * ```tsx
 * <Filters filters={filters} onChange={setFilters} />
 * ```
 */
export { default as Filters, type FilterProps } from './Filters';

/**
 * Flexbox layout primitive.
 * @example
 * ```tsx
 * <Flex aic jcb>...</Flex>
 * ```
 */
export { default as Flex } from './Flex';
export * from './Flex/types';

/**
 * Form state and validation wrapper.
 * @example
 * ```tsx
 * <Form onSubmit={handleSubmit}>{children}</Form>
 * ```
 */
export { default as Form } from './Form';
export * from './Form/types';
export { useForm } from './Form/context';

/**
 * Grid layout primitive.
 * @example
 * ```tsx
 * <Grid cols={3}>{items}</Grid>
 * ```
 */
export { default as Grid } from './Grid';
export * from './Grid/types';

/**
 * Grouped input/content helper.
 * @example
 * ```tsx
 * <Group>{children}</Group>
 * ```
 */
export { default as Group, type GroupProps } from './Group';

/**
 * Icon renderer.
 * @example
 * ```tsx
 * <Icon name="check" />
 * ```
 */
export { default as Icon } from "./Icon";
export type * from "./Icon/types";

/**
 * Image element wrapper.
 * @example
 * ```tsx
 * <Image src="/banner.png" alt="Banner" />
 * ```
 */
export { default as Image, type ImageProps } from './Image';

/**
 * Text input field.
 * @example
 * ```tsx
 * <Input name="email" placeholder="Email" />
 * ```
 */
export { default as Input } from "./Input";
export type * from "./Input/types";

/**
 * Keyboard shortcut keycaps.
 * @example
 * ```tsx
 * <KeyboardKeys keys={["cmd", "k"]} />
 * ```
 */
export { default as KeyboardKeys } from './KeyboardKeys';
export * from './KeyboardKeys/types';

/**
 * Field label component.
 * @example
 * ```tsx
 * <Label htmlFor="name">Name</Label>
 * ```
 */
export { default as Label, type LabelProps } from './Label';

/**
 * Layer management provider.
 * @example
 * ```tsx
 * <LayersProvider>{children}</LayersProvider>
 * ```
 */
export { default as LayersProvider } from './Layers';

export { default as Lightbox } from "./Lightbox";
export * from "./Lightbox/types";

/**
 * List container with items.
 * @example
 * ```tsx
 * <List items={items} />
 * ```
 */
export { default as List } from './List';
export * from './List/types';

export { default as MagneticGrid, type MagneticGridProps } from './MagneticGrid';

/**
 * Media player wrapper.
 * @example
 * ```tsx
 * <MediaPlayer src={videoUrl} />
 * ```
 */
export { default as MediaPlayer } from './MediaPlayer';
export * from './MediaPlayer/types';

/**
 * Network status indicator.
 * @example
 * ```tsx
 * <NetworkStatus />
 * ```
 */
export { default as NetworkStatus } from './Network';
export * from './Network/types';

/**
 * Fullscreen/page overlay.
 * @example
 * ```tsx
 * <Overlay show />
 * ```
 */
export { default as Overlay, type OverlayProps } from './Overlay';

/**
 * Pagination controls.
 * @example
 * ```tsx
 * <Pagination page={1} total={20} onChange={setPage} />
 * ```
 */
export { default as Pagination } from './Pagination';
export * from './Pagination/types';

/**
 * Password input with optional helpers.
 * @example
 * ```tsx
 * <Password name="password" />
 * ```
 */
export { default as Password, type PasswordProps } from './Password';

export { default as PhoneInput } from "./PhoneInput";
export type * from "./PhoneInput/types";

/**
 * Multi-cell pin/otp input.
 * @example
 * ```tsx
 * <PinInput length={6} />
 * ```
 */
export { default as PinInput, type PinInputProps } from './PinInput';

/**
 * Linear progress indicator.
 * @example
 * ```tsx
 * <ProgressBar value={60} />
 * ```
 */
export { default as ProgressBar } from './ProgressBar';
export * from './ProgressBar/types';

/**
 * Radio selection control.
 * @example
 * ```tsx
 * <Radio name="plan" value="pro" />
 * ```
 */
export { default as Radio } from './Radio';
export * from './Radio/types';

/**
 * Scrollable viewport container.
 * @example
 * ```tsx
 * <ScrollView>{content}</ScrollView>
 * ```
 */
export { default as ScrollView } from './ScrollView';
export * from './ScrollView/types';

/**
 * Search input with clear action.
 * @example
 * ```tsx
 * <Search onChange={setQuery} />
 * ```
 */
export { default as Search } from './Search';
export * from './Search/types';

/**
 * Segmented single-select tabs.
 * @example
 * ```tsx
 * <SelectTabs options={options} />
 * ```
 */
export { default as SelectTabs } from './Segmented';
export * from './Segmented/types';

/**
 * Select/dropdown control.
 * @example
 * ```tsx
 * <Select options={[{ label: "One", value: "1" }]} />
 * ```
 */
export { default as Select } from "./Select";
export type * from "./Select/types";

/**
 * Bottom sheet container.
 * @example
 * ```tsx
 * <Sheet open>Content</Sheet>
 * ```
 */
export { default as Sheet, type SheetHandler, type SheetProps } from './Sheet';


/**
 * Numeric range slider.
 * @example
 * ```tsx
 * <Slider min={0} max={100} />
 * ```
 */
export { default as Slider } from './Slider';
export type * from "./Slider/types";

/**
 * Step progress indicator.
 * @example
 * ```tsx
 * <Steps steps={[{ label: "Step 1" }, { label: "Step 2" }]} current={0} />
 * ```
 */
export { default as Steps } from './Steps';
export * from './Steps/types';

/**
 * Inline text span primitive.
 * @example
 * ```tsx
 * <Span as="bold">Important</Span>
 * ```
 */
export { default as Span } from "./Span";
export type * from "./Span/types";

/**
 * Loading spinner.
 * @example
 * ```tsx
 * <Spinner />
 * ```
 */
export { default as Spinner } from "./Spinner";
export { SPINNER, type SpinnerProps } from "./Spinner/types";

export { default as Stack } from "./Stack";
export type * from "./Stack/types";

/**
 * On/off switch control.
 * @example
 * ```tsx
 * <Switch name="enabled" />
 * ```
 */
export { default as Switch } from './Switch';

/**
 * Data table component.
 * @example
 * ```tsx
 * <Table columns={columns} data={rows} />
 * ```
 */
export { default as Table } from './Table';
export * from './Table/types';

/**
 * Generated table of contents.
 * @example
 * ```tsx
 * <TableOfContents items={items} />
 * ```
 */
export { default as TableOfContents } from './TableOfContents';
export * from './TableOfContents/types';

/**
 * Tab navigation container.
 * @example
 * ```tsx
 * <TabView tabs={tabs} />
 * ```
 */
export { default as TabView } from './TabView';
export * from './TabView/types';

/**
 * Terminal-like output renderer.
 * @example
 * ```tsx
 * <Terminal lines={lines} />
 * ```
 */
export { default as Terminal } from './Terminal';
export * from './Terminal/types';

/**
 * Typography text component.
 * @example
 * ```tsx
 * <Text>Hello world</Text>
 * ```
 */
export { P, default as Text } from "./Text";

/**
 * Multiline textarea input.
 * @example
 * ```tsx
 * <Textarea name="notes" rows={5} />
 * ```
 */
export { default as Textarea } from './TextArea';
export type { TextAreaProps } from './TextArea/types';

/**
 * Wheel-style picker.
 * @example
 * ```tsx
 * <TextWheel items={items} />
 * ```
 */
export { default as TextWheel } from './TextWheel';
export * from './TextWheel/types';

/**
 * Context-based timeline orchestration wrapper.
 * @example
 * ```tsx
 * <TimelineProvider timeline={{ mode: "scroll", layers: [...] }}>
 *   {children}
 * </TimelineProvider>
 * ```
 */
export { TimelineProvider, useTimelineContext } from './Timeline';
export type { TimelineProviderProps } from './Timeline';

/**
 * Toast notifications provider.
 * @example
 * ```tsx
 * <ToastProvider>{children}</ToastProvider>
 * ```
 */
export { default as ToastProvider } from './Toast';
export * from './Toast/types';

/**
 * Hover/click tooltip helper.
 * @example
 * ```tsx
 * <ToolTip content="Info">Hover me</ToolTip>
 * ```
 */
export { default as Token } from './Token';
export * from './Token/types';

/**
 * Hover/click tooltip helper.
 * @example
 * ```tsx
 * <ToolTip content="Info">Hover me</ToolTip>
 * ```
 */
export { default as ToolTip } from './Tooltip';
export * from './Tooltip/types';

/**
 * Tree view hierarchy renderer.
 * @example
 * ```tsx
 * <TreeView nodes={nodes} />
 * ```
 */
export { default as TreeView } from './Treeview';
export * from './Treeview/types';

/**
 * App-wide theme provider.
 * @example
 * ```tsx
 * <ThemeProvider>{children}</ThemeProvider>
 * ```
 */
export { ThemeProvider } from "../hooks/useColorScheme";
