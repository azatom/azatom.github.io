# L-System Fractals
## Logo Turtle with Context-Free Grammar

[Editor](src)

Standalone SVG file example: [lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3](src/lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3)

### UI (not up-to-date):
**Important: If the textarea behaves oddly (e.g., after pasting), use the Update (triangle) button or Ctrl+Enter.**
- `?` - Show documentation
- `>` - (triangle) Update rules and render (square: stop)
- `dots` - Show endpoints only
- `n--` - Shift or LongTap to increment iterations
- `transparent` - Toggle transparent background
- `*`, `next` - Show all examples or next example
- `reset` - Clear local storage and reload
- `export`
  - `url` - Export rules as URL
  - `svg` - Download generated SVG
  - `png` - Download as PNG
  - `copy...` - Copy to clipboard
- SVG retains zoom level and includes rules/statistics in its description.

### How It Works:
Start with a sentence 'S'. Each iteration replaces characters in the sentence using key-value rules. The resulting sentence instructs a Logo turtle which direction to turn, how far to move, and whether to draw its path.

### Syntax:
Rules can be in plaintext, URL fragment, query parameters, or JSON format:
- Rules separated by `,`, `&`, or `\n` (newline)
- Rule key-value pairs separated by `=` or `:`

### Keys:
- Single character: A rule (e.g., `F`, `A`)
- Single character + `2`: Alternative rule for 1 additional iteration
- Empty key: Page title

### Values:
- Empty value: Use calculated or default value
- `S`: Starting sentence
- `F`, `f`: Move forward with/without drawing
- `+`, `-`, `^`, `|`: Rotate +`_a`, -`_a`, +90°, 180°
- `!`: Toggle rotation (`+-^`) parity (swaps left and right)
- `*`, `/`: Multiply/divide line length by `_m`
- `[`, `]`: Push/pop stack (save/restore) of (position, length, direction)

### Numbers, range:
- `_n`: Number of iterations, `0+`
- `_m`: Line length multiplier, `+`
- `_a`: Angle in degrees, `-0+`
- `_l`: Initial line length width=1, `+`
- `_k`: Dot size, `0+`
- `_j`: Dot blur, `0+`
- `_o`: Stroke-opacity, `0..1`
- `_cb`: Color background, `#[0-9a-f]{3,8}`
- `_cc`: Color line, `#[0-9a-f]{3,8}`
- `_cd`: Color dot, `#[0-9a-f]{3,8}`
- `_x`, `_y`, `_w`, `_h`: ViewBox, `-0+`
- `_z`: Padding, `0+`

### Rule Format:
- **Plaintext and URL:**
  - Rule separators: `,`, `&`, or `\n` (newline)
  - Key-value separator: `=`
- **URL:** Precede with `#` (fragment) or `?` (query parameters)
- **JSON:** Standard key-value pairs

### Build:
- Necessary only for app on file:// and *building* svg file,
  not for http:// or *using* the svg file

### Some fibonacci:
```
f(0) = 0
f(n) = a*f(n-1) + b*f(n-2)
i     1  2  3  4  5  6  7
x     2  3  5  6  7  8 10
a     2  4  4 10 16  6
b    +1 -1 +1 -1 -1 -1
f(1)  2  3  4  2  3  2
x = i + round(√i)
```