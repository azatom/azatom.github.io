#  Logo Turtle with Context Free Grammar - L-System fractals

##  Example:
`lsystem.svg?S=AX&X=F+F+F+FFF-F-F-F&F=&A=[+AX-AX-AX]-AX+AX+AX-&_a=60`

[lsystem.svg](lsystem.svg)  really [lots](lsystem-lots.html)

##  How it works:
Starting sentence (axiom) is 'S' and every iteration every character as a rule key, if exists, is replaced by the rule value. The resulted sentence - context-free grammar - says to the logo turtle what to do. Embeding with `<img>` not works, only `<object>`.

##  Parameter keys - values:
- `_` - string: title
- `_n` - number: iterations
- `_l` - number: initial length of line (width=1)
- `_m` - number: multiply linelength
- `_a` - number: angle in degrees
- 1char - string: other key than above means a rule

##  Characters of rule value:
- `F`, `f`: forward with, without drawing a line
- `+`, `-`, `^`, `|`: rotate a, -a, right, straight
- `!`: change parity of rotation
- `*`, /: multiply, divide length of line with m
- `[`, `]`: state (position, line length and direction) store, load

##  Some fibonacci:
```
  2; 2,5,12,29,70,169,408,985,2378; 2a(n-1)+a(n-2)
  3; 4,15,56,209,780,2911;          4a(n-1)-a(n-2)
  5; 4,17,72,305,1292;              4a(n-1)+a(n-2)
  6; 2,20,198,1960;                10a(n-1)-a(n-2)
  7; 3,48,765;                     16a(n-1)-a(n-2)
  8; 6,35,204,1189;                 6a(n-1)-a(n-2)
  10;
```