# @zuzjs/ui — Prompt Presets

Ready-to-use generation prompts for Copilot / Claude when building with `@zuzjs/ui`.
Before using any preset, the agent MUST read `AI_SKILL.md` and `component-schema.json`.

---

## How to use

Copy the prompt block → paste into Copilot Chat / Claude → the agent will generate a complete, prop-accurate component.

---

## Generic App Patterns

### 1. Page with data table + search + pagination

```
Using @zuzjs/ui (read AI_SKILL.md first), generate a "ResourceListPage" component:
- Page header: icon + title ("Servers") + primary Button ("Add Server") on the right
- Search bar below the header using <Search> with onChange
- <Table> with columns: name (sortable), status (badge), created_at, actions (icon buttons)
- <Pagination> at the bottom
- useDialog for delete confirmation
- useToast for success/error feedback
- Loading state on the Table
- All layout with <Flex> / <Box> using `as` tokens only — no inline style, no Tailwind
```

### 2. Settings page with tabs

```
Using @zuzjs/ui (read AI_SKILL.md first), generate a "SettingsPage" component with:
- <TabView> with three tabs: Profile, Security, Notifications
- Profile tab: form with name + email <Input>, Save <Button> using <Form action="/api/settings/profile">
- Security tab: <Password> for current + new password, <Switch> for 2FA
- Notifications tab: list of <Switch> toggles with labels, each in a <Flex aic> row
- Danger zone section below tabs: "Delete Account" button with <Dialog> confirmation
- All layout/spacing with `as` tokens (pv:24 gap:20 etc.) — no inline styles
```

### 3. Auth / sign-in page

```
Using @zuzjs/ui (read AI_SKILL.md first), generate a "SignInPage" component:
- Centered card: <Box as="w:[min(100%,420)] p:32 r:16 bg:$surface shadow:0,8,32,rgba[0,0,0,0.08]">
- Logo above the card
- <Form action="/api/auth/signin" onSuccess={...} onError={...}>
  - <Input name="email" placeholder="Email" variant="md">
  - <Password name="password" placeholder="Password">
  - "Forgot password?" link (right-aligned)
  - <Button kind="solid"> Sign In </Button>
- Social login row: Google + GitHub <Button kind="outline"> buttons
- "No account? Sign up" text link at bottom
```

### 4. Dashboard overview / stats cards

```
Using @zuzjs/ui (read AI_SKILL.md first), generate a "DashboardOverview" component:
- <Grid columns={4} gap={16}> of stat cards, each: <Box as="p:20 r:12 bg:$surface border:1,$border,solid">
  - Icon, big number (<Text h={2}>), label (<Text as="s:sm c:$muted">)
  - Optional delta indicator (green/red badge)
- Below: two-column layout — recent activity list on left, quick actions on right
- useDialog for any destructive quick action
- Responsive: @md(columns:2) @ph(columns:1)
```

### 5. Create / Edit form in a Drawer

```
Using @zuzjs/ui (read AI_SKILL.md first), generate a "CreateBackupDrawer" component:
- <Drawer ref={drawerRef} from="right" as="w:480">
- <Form action="/api/backup/create" onSuccess={onCreated} as="flex cols gap:16 p:24 h:100%">
  - Name: <Input name="nm" placeholder="Backup name">
  - Source type: <Select name="type" options={[{label:'Database',value:'db'},{label:'Files',value:'files'}]}>
  - Schedule: <Select name="cron" options={scheduleOptions}>
  - Storage destination: <Select name="storage" options={storageOptions}>
  - <Switch name="enabled" onSwitch={...}> + label "Enable immediately"
  - <Flex jce gap={8} as="mt:auto pt:16 borderTop:1,$border,solid">
      <Button kind="ghost" onClick={close}>Cancel</Button>
      <Button kind="solid">Create Backup</Button>
  - useToast for feedback
```

### 6. Empty state component

```
Using @zuzjs/ui (read AI_SKILL.md first), generate an "EmptyState" component:
- Props: icon (string), title (string), message (string), action? ({ label, onClick })
- Centered <Flex cols aic jcc as="gap:16 p:48">
  - <Icon name={icon} as="s:48 opacity:0.3">
  - <Text h={3} as="s:xl bold tac">{title}</Text>
  - <Text as="s:md c:$muted tac">{message}</Text>
  - Conditional <Button kind="solid">{action.label}</Button>
```

### 7. Confirmation dialog pattern

```
Using @zuzjs/ui (read AI_SKILL.md first), generate a reusable "confirmDelete" utility function:
- Uses useDialog() hook
- Signature: confirmDelete(dialog, { name, onConfirm })
- Shows dialog with: title "Delete {name}", red warning text, action buttons [Cancel, Delete]
- Delete button: setLoading(true) → call onConfirm() → hide
- Returns the DialogHandler so caller can close it manually
```

### 8. Sidebar navigation

```
Using @zuzjs/ui (read AI_SKILL.md first), generate a "Sidebar" component:
- <Box as="w:$sidebar-w flex cols p:$dpadding-h pt:60 gap:15">
- Nav links from a NavItem[] array: { uri, icon, label }
- Each link: Next.js <Link> + css([...]) for active/hover styles
  - Base: flex aic gap:8 tdn p:5,10 r:$radius-lg c:$border-dark
  - Hover: &hover(bg:$surface)
  - Active (pathname.startsWith(link.uri)): bg:$surface c:$text
- <Icon name={link.icon} as="s:16"> + <Text as="s:16">{link.label}</Text>
```

---

## Tips for Agents

1. **Always read `AI_SKILL.md` before generating** — it contains the authoritative `as` prop grammar.
2. **Check `component-schema.json`** for exact prop names and types before using any component.
3. **Use real CSS tokens** from the project (`$surface`, `$border`, `$primary`, `$muted`, `$radius-lg`, etc.) — never hardcode colors.
4. **Never use Tailwind, inline `style={{}}`, or CSS modules** — all styles go in the `as` prop.
5. **Layout order**: use `<Flex>` for 1D, `<Grid>` for 2D, `<Box>` for everything else.
6. **Forms**: always use `<Form action="...">` + `<Input name="...">` pattern — not raw `<form>` / `<input>`.
7. **Dialogs/drawers**: always use the `useDialog()` / `useDrawer()` hooks — not state booleans.
8. **Feedback**: `useToast()` for transient messages, `useDialog()` for confirmations.
