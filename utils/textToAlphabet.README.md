# Text to Alphabet SVG Converter

This utility converts text (words, sentences, or single letters) into alphabet SVG components.

## Setup

### 1. Add Alphabet SVG Files

Place your alphabet SVG files in the following directory:
```
public/assets/icons/alphabets/
```

File naming convention:
- Lowercase letters: `a.svg`, `b.svg`, `c.svg`, ..., `z.svg`
- The function automatically converts uppercase letters to lowercase for file lookup

Example structure:
```
public/
  assets/
    icons/
      alphabets/
        a.svg
        b.svg
        c.svg
        ...
        z.svg
```

## Usage

### Option 1: Using the Component (Recommended)

```tsx
import { AlphabetDisplay } from "@/components/AlphabetDisplay";

// Simple word
<AlphabetDisplay text="apple" letterWidth={60} letterHeight={60} />

// Sentence with spaces
<AlphabetDisplay 
  text="I have car" 
  letterWidth={50} 
  letterHeight={50} 
  gap={8}
  spaceHandling="spacer"
/>

// Single letter
<AlphabetDisplay text="A" letterWidth={80} letterHeight={80} />
```

### Option 2: Using the Hook

```tsx
import { useAlphabet } from "@/hooks/useAlphabet";

function MyComponent() {
  const letters = useAlphabet("apple");
  
  return (
    <div>
      {letters.map((letter, index) => (
        <Image
          key={index}
          src={letter.svgPath}
          alt={letter.char}
          width={50}
          height={50}
        />
      ))}
    </div>
  );
}
```

### Option 3: Using the Utility Function Directly

```tsx
import { textToAlphabet } from "@/utils/textToAlphabet";

const letters = textToAlphabet("apple");
// Returns: [
//   { char: "a", isLetter: true, isSpace: false, svgPath: "/assets/icons/alphabets/a.svg" },
//   { char: "p", isLetter: true, isSpace: false, svgPath: "/assets/icons/alphabets/p.svg" },
//   { char: "p", isLetter: true, isSpace: false, svgPath: "/assets/icons/alphabets/p.svg" },
//   { char: "l", isLetter: true, isSpace: false, svgPath: "/assets/icons/alphabets/l.svg" },
//   { char: "e", isLetter: true, isSpace: false, svgPath: "/assets/icons/alphabets/e.svg" },
// ]
```

## Component Props

### `AlphabetDisplay`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **required** | The text to display (e.g., "apple", "I have car") |
| `letterWidth` | `number` | `50` | Width of each letter SVG in pixels |
| `letterHeight` | `number` | `50` | Height of each letter SVG in pixels |
| `gap` | `number` | `4` | Gap between letters in pixels |
| `lettersOnly` | `boolean` | `false` | If true, only shows letters (skips spaces/punctuation) |
| `spaceHandling` | `"skip" \| "spacer" \| "dash"` | `"spacer"` | How to handle spaces: skip, show empty space, or show dash |
| `className` | `string` | `undefined` | Custom className for container |
| `style` | `React.CSSProperties` | `undefined` | Custom style for container |
| `letterClassName` | `string` | `undefined` | Custom className for each letter |
| `letterStyle` | `React.CSSProperties` | `undefined` | Custom style for each letter |

## Examples

### Example 1: Word Display
```tsx
<AlphabetDisplay text="apple" letterWidth={60} letterHeight={60} />
```

### Example 2: Sentence with Spaces
```tsx
<AlphabetDisplay 
  text="I have car" 
  letterWidth={50} 
  letterHeight={50} 
  gap={8}
  spaceHandling="spacer"
/>
```

### Example 3: Letters Only (No Spaces)
```tsx
<AlphabetDisplay 
  text="hello world" 
  letterWidth={45} 
  letterHeight={45} 
  lettersOnly={true}
/>
```

### Example 4: Custom Styled
```tsx
<AlphabetDisplay
  text="HELLO"
  letterWidth={70}
  letterHeight={70}
  gap={12}
  className="bg-purple-500/20 p-4 rounded-lg"
  letterStyle={{
    filter: "drop-shadow(0 0 4px #E451FE)",
  }}
/>
```

### Example 5: In Lesson Page
```tsx
// In your lesson page component
<AlphabetDisplay 
  text={task.word || ""} 
  letterWidth={80} 
  letterHeight={80} 
  gap={10}
/>
```

## Space Handling Options

1. **`"spacer"`** (default): Shows empty space between words
   - "I have car" → `[I] [space] [have] [space] [car]`

2. **`"skip"`**: Skips spaces entirely
   - "I have car" → `[I][have][car]`

3. **`"dash"`**: Shows a dash for spaces
   - "I have car" → `[I] [-] [have] [-] [car]`

## Fallback Behavior

If an alphabet SVG file doesn't exist, the component will:
1. Hide the broken image
2. Display the letter as text as a fallback

## File Structure

```
alle_frontend/
  components/
    AlphabetDisplay.tsx          # Main component
    AlphabetDisplay.example.tsx  # Usage examples
  hooks/
    useAlphabet.ts               # Hook version
  utils/
    textToAlphabet.ts            # Core utility function
  public/
    assets/
      icons/
        alphabets/
          a.svg
          b.svg
          ...
          z.svg
```

## Notes

- The function is case-insensitive for file lookup (converts to lowercase)
- Punctuation marks are displayed as text, not SVGs
- Spaces can be handled in three ways (see Space Handling Options)
- The component uses Next.js `Image` for optimized SVG loading
- Missing SVG files will fallback to text display




