#  Logo Turtle with Context Free grammar - L-System fractals


[Editor](editor.html)

Standalone svg file example: [lsystem.js.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3](lsystem.js.svg#S=AX,X=F+F+F+FFF-F-F-F,F=,A=[+AX-AX-AX]-AX+AX+AX-,_a=60,_n=3)

##  How it works:
Starting sentence is 'S'. In an iteration every character of the
sentence replaced by the key-value rule set. A key's default value is the
key itself. The resulted sentence says to the logo turtle what to do.

##  Rula key - value pairs:
If key starts with `_`, than value is a number.
- `_n` - iterations
- `_l` - initial length of line (width=1)
- `_m` - multiply linelength
- `_a` - angle in degrees
- 1char - a rule
- 1char`2` - n+1 iteration
- empty - title 

##  Meaining of characters:
- `S`: starting sentence
- `F`, `f`: forward with, without drawing a line
- `+`, `-`, `^`, `|`: rotate _a, -_a, right, straight
- `!`: change parity of rotation
- `*`, `/`: multiply, divide length of line with m
- `[`, `]`: store, load (position, length, direction)

##  Syntax
The rule used different places, accepts more variants.
- `?`, `#`: in url preceds the rule set
- `=`, `:`: key-value separator
- `,`, `&`, `\n`: rule separator
- Or full json format.

##  Files
- `lsystem.js.svg`
  - embedable with `<object>` or `<embed>`, not with `<img>`.
  - browser can open as standalone image
- `lsystem.svg.js`
  - generates img capable svg
  - accuracy: within eps merges points
  - faster: draw segments one time
  - browser can not open as standalone image

##  Some fibonacci:
```
 2;  2a(n-1)+a(n-2) 2,5,12,29,70,169,408,985,2378
 3;  4a(n-1)-a(n-2) 4,15,56,209,780,2911
 5;  4a(n-1)+a(n-2) 4,17,72,305,1292
 6; 10a(n-1)-a(n-2) 2,20,198,1960
 7; 16a(n-1)-a(n-2) 3,48,765
 8;  6a(n-1)-a(n-2) 6,35,204,1189
10;
```