# L-System Fractals
## Logo Turtle with Context-Free Grammar

[Editor](src)

Standalone svg file example: [lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3](src/lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3)

### UI (not uptodate):
**Important: If textarea behaves oddly (e.g., after pasting), use the Update (triangle) button or ctrl+enter.**
- `?` - Show documentation
- `>` - (triangle) Update rules and render (square: stops)
- `dots` - Show endpoints only
- `n--` - Shift or LongTap add iteration
- `transparent` - ...
- `*`, `next` - All/next examples
- `reset` - localstorage+reload
- `export`
  - `url` - Export rules as URL
  - `svg` - Download generated SVG
  - `png` - Download as PNG
  - `copy...` - to clipboard
- SVG retains zoom and includes rules/stats in its description.

### How it Works:
Start with a sentence 'S'. Each iteration replaces
characters in the sentence using key-value rules.
The resulting sentence instructs a Logo turtle in
which direction, ho much go and draw or not its path.

### Syntax:
Rules can be in plaintext, URL fragment, query params, or JSON:
- Rules separated by `,` or `&` or `\n`
- Rule's key-value separated by `=` or `:`

### Keys:
- Single char: A rule
- Single char + `2`: One more iteration
- Empty key: Title

### Values:
- Empty value: use calulated or default
- `S`: Starting sentence
- `F`, `f`: Move forward with/without drawing
- `+`, `-`, `^`, `|`: Rotate +`_a`, -`_a`, +90°, 180°
- `!`: Toggle rotation (`+-^`) parity (swaps left and right)
- `*`, `/`: Multiply/divide line length by `_m`
- `[`, `]`: Push/pop (position, length, direction),

### Numbers, range:
- `_n`: Number of iterations, `0+`
- `_m`: Line length multiplier, `+`
- `_a`: Angle in degrees, `-0+`
- `_l`: Initial line length width=1, `+`
- `_k`: dot size, `0+`
- `_j`: dot blur, `0+`
- `_o`: stroke-opacity, `0..1`
- `_cb`: color background, `#[0-9a-f]{3,8}`
- `_cc`: color line, `#[0-9a-f]{3,8}`
- `_cd`: color dot, `#[0-9a-f]{3,8}`
- `_x`, `_y`, `_w`, `_h`: viewBox, `-0+`
- `_z`: padding, `0+`

### Format of rules:
- Plaintext and url:
  - Rule separators: `,` or `&`. Plaintext: `\n` works too.
  - Key-value separator: `=`
- Url: preceed with `#` or `?` (fragment/queryparams)
- JSON: straightforward key-values

### Build:
- build: necessary only for app on file:// and *creating* svg file,
  not for *using* the svg file or http:// in src folder

### Some fibonacci:
```
f(0) = 0
f(n) = a*f(n-1)+b*f(n-2)
i     1  2  3  4  5  6  7
x     2  3  5  6  7  8 10
a     2  4  4 10 16  6
b    +1 -1 +1 -1 -1 -1
f(1)  2  3  4  2  3  2
x = i + round sqrt i
```