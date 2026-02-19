# Mascot SVG Implementation Guide

## Current Implementation

Your mascot system now uses a **master SVG** (`mascot.svg`) that contains all parts as layers. The `MascotDisplay` component dynamically shows/hides layers based on selection.

## What You Need from Your Designer

### Master SVG Structure (`mascot.svg`)

Ask your designer to provide **ONE master SVG file** with the following structure:

```xml
<svg viewBox="0 0 1800 2750" xmlns="http://www.w3.org/2000/svg">
  <!-- Example structure - organized by layer type -->
  
  <!-- All Heads (10 total) - each in its own group -->
  <g id="Head 01">
    <g id="1 neck">...</g>
    <g id="1 head">...</g>
    <!-- facial features, etc. -->
  </g>
  <g id="Head 02">...</g>
  <g id="Head 03">...</g>
  ...
  <g id="Head 10">...</g>
  
  <!-- All Bodies (15 total) - each in its own group -->
  <g id="Body 01">
    <g id="collar back">...</g>
    <g id="body">...</g>
    <g id="collar front">...</g>
    <!-- Remember: collar front should be on top! -->
  </g>
  <g id="Body 02">...</g>
  ...
  <g id="Body 15">...</g>
  
  <!-- All Hair Styles (13 total) - each in its own group -->
  <g id="Hair 1">...</g>
  <g id="Hair 2">...</g>
  ...
  <g id="Hair 13">...</g>
</svg>
```

### Critical Requirements

1. **Layer Naming Convention:**
   - Heads: `"Head 01"`, `"Head 02"`, ..., `"Head 10"` (with leading zero for 01-09)
   - Hair: `"Hair 1"`, `"Hair 2"`, ..., `"Hair 13"` (NO leading zero)
   - Bodies: `"Body 01"`, `"Body 02"`, ..., `"Body 15"` (with leading zero for 01-09)

2. **Proper Z-Index (Layering Order in SVG):**
   ```
   Bottom → Top:
   1. Body back (collar back, main body)
   2. Head with neck
   3. Hair
   4. Collar front (top layer!)
   ```

3. **All Parts in Same Coordinate System:**
   - All heads should be positioned at the same coordinates
   - All hair should align with heads at the same coordinates
   - All bodies should be positioned at the same coordinates
   - **NO absolute positioning** - everything uses relative positioning within the SVG viewBox

4. **Hair Color Requirements:**
   - Hair should be **single-color** (ideally grayscale or a base color)
   - CSS filters will be applied to change hair color dynamically

## How It Works

### The `MascotDisplay` Component

```tsx
<MascotDisplay
  headId="head1"    // Converted to "Head 01"
  hairId="hair10"   // Converted to "Hair 10"
  bodyId="body8"    // Converted to "Body 08"
  hairColor="#E451FE"  // Applied as CSS filter
  className="..."
/>
```

### Under the Hood

1. **Loads the master SVG** from `/assets/icons/mascots/mascot.svg`
2. **Hides all layers** by setting `display: none`
3. **Shows only selected layers** by setting `display: block`
4. **Applies hair color** using CSS `hue-rotate`, `saturate`, and `brightness` filters

### For Selection Thumbnails

You can still use your individual SVG files in the selection grid:

```tsx
<Image
  src="/assets/icons/heads/head1.svg"
  alt="Head 1"
  fill
  className="object-contain p-[7px]"
/>
```

## Benefits of This Approach

✅ **Single source of truth** - one master SVG with all variations  
✅ **No positioning issues** - designer controls alignment in Figma  
✅ **Proper layering** - collar front always on top  
✅ **Dynamic switching** - instant part changes without loading new files  
✅ **Better performance** - one SVG load vs. multiple Image components  

## Alternative: Keep Individual SVGs

If you want to keep using separate SVG files, you'll need:

### For Each Body Part:

**Heads (10 files):**
- `head1.svg` to `head10.svg` - WITH neck (for display)
- `head1-thumb.svg` to `head10-thumb.svg` - WITHOUT neck (for selection grid)

**Hair (13 files):**
- `hair1.svg` to `hair13.svg` - grayscale for color filters

**Bodies (15 files with 2 layers each):**
- Option A: Separate files
  - `body1-back.svg` to `body15-back.svg`
  - `body1-collar.svg` to `body15-collar.svg`
  
- Option B: Combined with IDs
  - `body1.svg` with `<g id="body-back">` and `<g id="collar-front">`

## Recommended: Use Master SVG

The master SVG approach is cleaner, more maintainable, and avoids positioning issues. Just ensure your designer:

1. Exports the master SVG with all parts as groups
2. Uses the correct naming convention
3. Positions everything correctly (no transforms needed)
4. Maintains proper layer order

## Files Changed

- ✅ `next.config.ts` - Added SVGR webpack configuration
- ✅ `components/MascotDisplay.tsx` - New component for master SVG rendering
- ✅ `components/MascotCreation.tsx` - Updated to use MascotDisplay

## Next Steps

1. **Get the updated `mascot.svg`** from your designer with all 10 heads, 13 hairs, and 15 bodies
2. **Replace** `/public/assets/icons/mascots/mascot.svg` with the new master file
3. **Test** - The mascot should switch parts dynamically!

If parts don't show up, check browser console for the exact IDs in the SVG and adjust the formatting logic in `MascotDisplay.tsx`.

