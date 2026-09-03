# Input Mask Quick Reference

## Pattern Characters (Easy Memorization)

| Pattern | Meaning | Validation | Example Usage |
|---------|---------|------------|---------------|
| **`0`** | **Zero** tolerance for non-numbers | Numeric only (0-9) | Phone, SSN, dates |
| **`A`** | **A**lphabetic characters | Letters only (a-z, A-Z) | Names, codes |
| **`Z`** | **Z**ero-to-Zulu (anything goes) | Alphanumeric (a-z, A-Z, 0-9) | Serial numbers |
| **`S`** | **S**pecial/anything | Any character | Free-form input |

**Remember:**
- `0` = Only numbers
- `A` = Only letters (Alphabetic)
- `Z` = Letters OR numbers (alphanumeric, like a ZIP code)
- `S` = Super flexible (anything)

## Common Patterns

### Phone Numbers
```tsx
// US Phone: (123) 456-7890
<Input mask={{ mask: '(000) 000-0000' }} />

// International: +1 123-456-7890
<Input mask={{ mask: '+0 000-000-0000' }} />
```

### Identification Numbers
```tsx
// SSN: 123-45-6789
<Input mask={{ mask: '000-00-0000' }} />

// Credit Card: 1234 5678 9012 3456
<Input mask={{ mask: '0000 0000 0000 0000' }} />
```

### Dates
```tsx
// MM/DD/YYYY
<Input mask={{ mask: '00/00/0000' }} />

// YYYY-MM-DD
<Input mask={{ mask: '0000-00-00' }} />
```

### Custom Codes
```tsx
// Product: ABC-123-XYZ
<Input mask={{ mask: 'AAA-000-ZZZ' }} />

// License: XXXX-YYYY-ZZZZ-9999
<Input mask={{ mask: 'AAAA-BBBB-CCCC-0000' }} />

// Mixed: 123A-AB456-CD7890
<Input mask={{ mask: '000A-AA000-BB0000' }} />
```

## Quick Examples

### Example 1: Phone Number
```tsx
<Input 
  mask={{ 
    mask: '(000) 000-0000',
    clearMaskOnBlur: true
  }}
  placeholder="Phone Number"
/>
```

### Example 2: Your Custom Pattern (000A-BB123-BBBB9)
```tsx
<Input 
  mask={{ 
    mask: '000A-BB123-BBBB9',
    placeholder: '___A-BB123-BBBB9'
  }}
/>
```

**What this validates:**
- `000` → 3 numeric digits
- `A` → 1 alphabetic letter
- `-` → fixed separator
- `BB` → 2 alphabetic letters
- `123` → LITERAL (shown as-is, not validated)
- `-` → fixed separator
- `BBBB` → 4 alphabetic letters
- `9` → Wait, this is wrong! `9` would be a literal. Use `0` for numeric.

**Corrected version:**
```tsx
<Input 
  mask={{ 
    mask: '000A-BB123-BBBB0',  // Changed 9 to 0
    placeholder: '___A-BB123-BBBB_'
  }}
/>
```

### Example 3: ZIP Code
```tsx
// US ZIP: 12345 or 12345-6789
<Input 
  mask={{ 
    mask: '00000-0000',
    clearMaskOnBlur: false
  }}
/>
```

### Example 4: Date with Separator
```tsx
<Input 
  mask={{ 
    mask: '00/00/0000',
    showMaskOnFocus: true
  }}
  placeholder="MM/DD/YYYY"
/>
```

## Pattern Cheat Sheet

```
Phone:      (000) 000-0000
SSN:        000-00-0000
Credit:     0000 0000 0000 0000
Date:       00/00/0000
Time:       00:00
Product:    AAA-000-AAA
Serial:     ZZZZ-ZZZZ-ZZZZ
License:    AAAA-AAAA-AAAA-AAAA
Mixed:      000AAA-ZZZZ
```

## IntelliSense Support

VSCode will show you these pattern hints automatically when you use the `mask` prop:

```tsx
<Input 
  mask={{
    mask: '|  // ← IntelliSense shows: 0=numeric, A=alpha, Z=alphanumeric, S=any
    placeholder: '',
    showMaskOnFocus: true,
    clearMaskOnBlur: false
  }}
/>
```

The JSDoc comments in the component provide full documentation hover in VSCode!
