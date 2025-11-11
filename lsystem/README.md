# L-System Fractals
## Logo Turtle with Context-Free Grammar

[Editor](lsystem.html)

Standalone svg file example: [lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3](lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3)

### UI:
**Important: If textarea behaves oddly (e.g., after pasting), use the Update (triangle) button or ctrl+enter.**
Sorry, UI is inconsistent, it is just for experimenting things.
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

### Rule's key-value pairs:
Keys starting with `_` are "string" rather then "chars", eg: number
- `_n`: Number of iterations
- `_m`: Line length multiplier
- `_a`: Angle in degrees
- Single char: A rule
- Single char + `2`: One more iteration
- Empty key: Title

### Rule Value Characters:
- `S`: Starting sentence
- `F`, `f`: Move forward with/without drawing
- `+`, `-`, `^`, `|`: Rotate +`_a`, -`_a`, +90°, 180°
- `!`: Toggle rotation parity
- `*`, `/`: Multiply/divide line length by `_m`
- `[`, `]`: Push/pop (position, length, direction),
  pop empty stack is allowed.

### Additional parameters for svg:
- `_l`: Initial line length (width=1)
- `_k`: dot size
- `_j`: dot blur
- `_o`: stroke-opacity
- `_c...`: colors eg: `#[0-9a-f]{3,8}`
  - `_cb`: background
  - `_cc`: line
  - `_cd`: dot
- `_x`, `_y`, `_w`, `_h`, `_z`: viewBox, padding

### Syntax
- Plaintext and url:
  - Rule separators: `,` or `&`. Plaintext: `\n` works too.
  - Key-value separator: `=`
- Url: preceed with `#` or `?` (fragment/queryparams)
- JSON: straightforward key-values

### Files (not exatly)
- `lsystem.html` - an example app
- `lsystem.svg`
  - embedable with `<object>` or `<embed>`, not with `<img>`.
  - browser opens as standalone image with parameters
  - editable svg in urlbar
- function `lsystemSvg`
  - generates img capable plain svg
  - use in app
- `lsystem.examples.js`- example rules

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