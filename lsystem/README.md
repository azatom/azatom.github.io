#  Logo Turtle with Context Free grammar - L-System fractals


[Editor](lsystem.html)

Standalone svg file example: [lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3](lsystem.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3)

### How it Works
Start with a sentence 'S'. Each iteration replaces
characters in the sentence using key-value rules.
The resulting sentence instructs a Logo turtle in
which direction, ho much go and draw or not its path.

### Syntax:
As ruleset can be in url fragment, queryparam, json
or plaintext:
- Rules separated by `,` or `&` or `\n`
- Rule's key-value separated by `=` or `:`

### Rule's key-value pairs:
Keys starting with `_` have numeric values:
- `_n`: Number of iterations
- `_l`: Initial line length (width=1)
- `_m`: Line length multiplier
- `_a`: Angle in degrees
- Single char: A rule
- Single char + `2`: Rule for n+1 iteration
- Empty key: Title

### Rule Value Characters:
- `S`: Starting sentence
- `F`, `f`: Move forward with/without drawing
- `+`, `-`, `^`, `|`: Rotate +a, -a, +90, 180
- `!`: Toggle rotation parity
- `*`, `/`: Multiply/divide line length by _m
- `[`, `]`: Push/pop position, length, direction
  note: empty stack pop leaves as is

### Syntax
- Plaintext and url:
  - Rule separators: `,` or `&`. Plaintext: `\n` works too
  - Key-value separator: `=`
- Url: preceed with `#` or `?` (fragment/queryparams)
- JSON: straightforward key-values

### Files
- `lsystem.svg`
  - embedable with `<object>` or `<embed>`, not with `<img>`
  - browser can open as standalone image
- `lsystem.js`
  - generates img capable plain svg
  - browser can not open as standalone image

### Some fibonacci:
```
 x  a b f1 f(n)=a*f(n-1)+b*f(n-2)
 2  2 +1 2 5,12,29,70,169,408,985
 3  4 -1 4 15,56,209,780,2911
 5  4 +1 4 17,72,305,1292
 6 10 -1 2 20,198,1960
 7 16 -1 3 48,765
 8  6 -1 6 35,204,1189
10
```