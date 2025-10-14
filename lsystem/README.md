#  Logo Turtle with Context Free grammar - L-System fractals


[Editor](editor.html)

Standalone svg file example: [lsystem.js.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3](lsystem.js.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3)

### How it Works
Start with a sentence 'S'. Each iteration replaces characters in the sentence using key-value rules. The resulting sentence instructs a Logo turtle.

### Rule Key-Value Pairs
Keys starting with `_` have numeric values:
- `_n`: Number of iterations
- `_l`: Initial line length (width=1)
- `_m`: Line length multiplier
- `_a`: Angle in degrees
- Single char: A rule
- Single char + `2`: Rule for n+1 iteration
- Empty key: Title

### Rule Value Characters
- `S`: Starting sentence
- `F`, `f`: Move forward with/without drawing
- `+`, `-`, `^`, `|`: Rotate by _a, -_a, right, or straight
- `!`: Toggle rotation parity
- `*`, `/`: Multiply/divide line length by _m
- `[`, `]`: Push/pop position, length, direction

### Syntax
- Plaintext and url:
  - Rule separators: `,` or `&`. Plaintext: `\n` works too.
  - Key-value separator: `=`
- Url: preceed with `#` or `?` (fragment/queryparams)
- JSON: straightforward key-values

### Files
- `lsystem.js.svg`
  - embedable with `<object>` or `<embed>`, not with `<img>`.
  - browser can open as standalone image
- `lsystem.svg.js`
  - generates img capable plain svg
  - browser can not open as standalone image

### Some fibonacci:
```
 2;  2a(n-1)+a(n-2) 2,5,12,29,70,169,408,985,2378
 3;  4a(n-1)-a(n-2) 4,15,56,209,780,2911
 5;  4a(n-1)+a(n-2) 4,17,72,305,1292
 6; 10a(n-1)-a(n-2) 2,20,198,1960
 7; 16a(n-1)-a(n-2) 3,48,765
 8;  6a(n-1)-a(n-2) 6,35,204,1189
10;
```