# Input Mask Feature

The Input component now supports customizable input masking with pattern validation - **no external dependencies required**.

## Pattern Characters

The mask system uses special characters to define validation rules:

| Character | Validation | Example |
|-----------|-----------|---------|
| `0` | Numeric (0-9) | Phone numbers, dates, IDs |
| `A` | Alphabetic (a-z, A-Z) | Names, codes |
| `Z` | Alphanumeric (a-z, A-Z, 0-9) | Product codes, serials |
| `S` | Any character | Free-form input |
| Any other | Fixed separator | `-`, `/`, `(`, `)`, etc. |

## Basic Usage

```tsx
import { Input } from '@zuzjs/ui';

// Phone number with numeric validation
<Input 
  mask={{ mask: '(000) 000-0000' }} 
  placeholder="(___) ___-____"
/>

// Date with numeric validation
<Input 
  mask={{ mask: '00/00/0000' }} 
  placeholder="MM/DD/YYYY"
/>

// Social Security Number
<Input 
  mask={{ mask: '000-00-0000' }} 
  placeholder="SSN"
/>
```

## Advanced Pattern Examples

### Custom Product Code: `000A-BB123-BBBB9`

```tsx
<Input 
  mask={{ 
    mask: '000A-BB123-BBBB9',
    placeholder: '___A-BB123-BBBB9'
  }} 
  placeholder="Product Code"
/>
```

**Pattern Breakdown:**
- `000` - First 3 characters must be digits (0-9)
- `A` - Next character must be a letter (a-z, A-Z)
- `-` - Fixed separator
- `BB` - Next 2 characters must be letters
- `123` - Next 3 are fixed literals (not validated, shown as-is)
- `-` - Fixed separator
- `BBBB` - Next 4 characters must be letters
- `9` - Last character must be a digit

**Valid Input Example:** `123X-AB123-BCDF5`

### License Key: `AAAA-BBBB-CCCC-DDDD`

```tsx
<Input 
  mask={{ mask: 'AAAA-BBBB-CCCC-DDDD' }}
  placeholder="____-____-____-____"
/>
```

### Serial Number: `ZZZ-0000-AAAA`

```tsx
<Input 
  mask={{ mask: 'ZZZ-0000-AAAA' }}
  placeholder="Serial Number"
/>
```

### Mixed Validation Pattern

```tsx
// Product code: 3 digits, 3 letters, separator, 4 alphanumeric
<Input 
  mask={{ 
    mask: '000AAA-ZZZZ',
    clearMaskOnBlur: true  // Clear if incomplete
  }}
/>
```

## Mask Options

```typescript
interface InputMaskOptions {
  /**
   * Mask pattern with validation:
   * - `0` → numeric (0-9)
   * - `A` → alphabetic (a-z, A-Z)
   * - `Z` → alphanumeric (a-z, A-Z, 0-9)
   * - `S` → any character
   * - Any other character → fixed separator
   */
  mask?: string;
  
  /**
   * Custom placeholder display (optional)
   * If not provided, pattern chars are shown
   */
  placeholder?: string;
  
  /**
   * Whether to show mask on focus (default: true)
   */
  showMaskOnFocus?: boolean;
  
  /**
   * Whether to clear incomplete mask on blur (default: false)
   */
  clearMaskOnBlur?: boolean;
}
```

## Complete Examples

### 1. Phone Number with Validation

```tsx
<Input 
  mask={{ 
    mask: '(000) 000-0000',
    clearMaskOnBlur: true
  }}
  placeholder="(___) ___-____"
/>
```

Only accepts digits, automatically formats with parentheses and dash.

### 2. Credit Card

```tsx
<Input 
  mask={{ 
    mask: '0000 0000 0000 0000',
    placeholder: '____ ____ ____ ____'
  }}
/>
```

### 3. Custom ID with Mixed Characters

```tsx
<Input 
  mask={{ 
    mask: 'AAA-000/ZZZ',
    showMaskOnFocus: false
  }}
  placeholder="Type your ID"
/>
```

### 4. Form Integration

```tsx
import { Form } from '@zuzjs/ui';

<Form onSubmit={(data) => console.log(data)}>
  <Input 
    name="phone"
    mask={{ mask: '(000) 000-0000' }}
    placeholder="Phone Number"
    required
  />
  
  <Input 
    name="productCode"
    mask={{ 
      mask: '000A-BB123-BBBB9',
      placeholder: '___A-BB123-BBBB9',
      clearMaskOnBlur: true
    }}
    placeholder="Product Code"
  />
</Form>
```

### 5. Serial Number with Alphanumeric

```tsx
<Input 
  mask={{ 
    mask: 'ZZZZ-ZZZZ-ZZZZ',
    placeholder: '_______________'
  }}
/>
```

Accepts letters OR numbers in any position.

## Features

✅ **Pattern Validation** - Enforce numeric, alphabetic, or alphanumeric rules
✅ **Smart Backspace** - Intelligently handles deletion through separators  
✅ **Fixed Separators** - Automatic insertion of dashes, slashes, etc.
✅ **Form Integration** - Works seamlessly with form state
✅ **TypeScript Support** - Full type safety for mask options
✅ **Zero Dependencies** - Pure implementation, no external packages
✅ **Customizable Display** - Control placeholder text appearance

## Notes

- Pattern characters (`0`, `A`, `Z`, `S`) are validated strictly
- Fixed separators (non-pattern chars) are auto-inserted during typing
- Backspace skips over separators automatically
- Works alongside existing `numeric` prop (but only one should be used at a time)
- Pattern chars in the mask that aren't validation chars become fixed literals

## Difference from Placeholder

The `mask.placeholder` is what users see:
- `mask='000A-BB123'` 
- `placeholder='___A-BB123'` ← Shows underscores for validation positions

If you omit `placeholder`, the pattern characters themselves are shown (`0`, `A`, `Z`).
