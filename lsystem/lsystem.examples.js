const examples=[
'',
'S=-!S!F+SFS+F!S!-&=Hilbert&_a=90&_l=3&_n=2',
'S=+WC2F--XC4F---YC4F--ZC2F&F=&W=YC4F++ZC2F----XC4F[-YC4F----WC2F]++&X=+YC4F--ZC2F[---WC2F--XC4F]+&Y=-WC2F++XC4F[+++YC4F++ZC2F]-&Z=--YC4F++++WC2F[+ZC2F++++XC4F]--XC4F&=PenroseColor&_a=36&_n=3',
'S=X&F=&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&=Penrose1&_a=36&_l=9&_n=5',
'S=[Y]++[Y]++[Y]++[Y]++[Y]&F=&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&=Penrose2&_a=36&_l=9&_n=5',
'S=ZF----XF-YF----WF&F=&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&=Penrose3&_a=36&_l=9&_n=5',
'S=WF--XF---YF--ZF&F=&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&=Penrose4&_a=36&_l=9&_n=5',
'S=X&F=&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&=PenroseToBranch&_a=6&_l=6&_n=5',
'S=X&F=F+/f*-F&X=[X]F+[X]F+[X]F+[X]F+&=tilesg1&_a=90&_l=9&_m=1.4142&_n=4',
'S=X&F=F+/f*-F&X=[X]F^[X]F^[X]F^[X]F^&=tilesg2&_a=80&_l=9&_m=1.4142&_n=4',
'S=AX&A=F+F-F&F=&X=[+AX-AX-AX]-AX+AX+AX-&=tilesg5&_a=60&_l=6&_n=4',
'S=AX&A=FfF&F=&X=[+AX-AX-AX]-AX+AX+AX-&=tilesg6&_a=60&_l=6&f=&_n=3',
'S=AX&A=++F--f++F--&B=++F--f++F--&C=++F--f++F--&D=++F--f++F--&E=++F--f++F--&F=&G=++F--f++F--&X=[+AX-BX-CX]-DX+EX+GX-&=tilesg7&_a=60&_l=6&f=&_n=3',
'S=AX&A=F-F-F-F+F+F+F&F=&X=[+AX-AX-AX]-AX+AX+AX-&=tilesgHex&_a=60&_l=6&f=&_n=3',
'S=AX&A=[+AX-AX-AX]-AX+AX+AX-&F=&X=F+F+F+FFF-F-F-F&=tilesgLizard&_a=60&_l=2&_n=3',
'S=+[/A]F/---[-S]F-F---[-S]*F[/|A]&A=[/S]+F/[|A]----F+F----[A]*F&F=f&=kd1&_a=36&_l=99&_m=1.618&_n=4',
'S=[k]++[k]++[k]++[k]++[k]&A=[/k]+F/[|A]----F+F----[A]*F&F=f&=kd2&_a=36&_l=99&_m=1.618&k=+[/A]F/---[-k]F-F---[-k]*F[/|A]&_n=4',
'S=Wf+Xf+Wf+Xf+Wf+Xf+Wf+Xf+Wf+X&F=&W=[F][++*F][++f---/f|X-Y|f|W]&X=[F+++*F][++/fZ|X|-f|W]&Y=[+F][*F][+f/|Y+X]&Z=[-F][*F][/f--Wf|+Z]&=kd3&_a=36&_l=99&_m=1.618&_n=4',
'S=FB&A=FBFA+HFA+FB-FA&B=FB+FA-FB-JFBFA&F=&H=-&J=+&=Quartet&_a=90&_n=4',
'S=X&F=F+f-F&X=[X]F+[X]F+[X]F+[X]F+[X]F+[X]F+&=tilesg4&_a=60&_l=6&f=F&_n=5',
'S=F&F=FF-[-F+F+F]+[+F-F-F]&=plant00&_a=22.5&_n=3',
'S=+[F]++[F]++[F]++F&F=F[+F][-F]&=lars2&_a=62&_n=6',
'S=[+++Z][---Z]TS&H=-Z[+H]L&L=[-FFF][+FFF]F&T=TL&Z=+H[-Z]L&=plant01&_a=18&_n=6',
'S=f----f----f&=Vlinders1&_a=30&_l=160&_m=1.732&f=[F]/+f--f+*&_n=7',
'S=f----f----f&=Vlinders3__&_a=30&_l=160&_m=1.732&f=[F]/[-(2)F]+f--[--F]f[----(2)F]+*&_n=7',
'S=[--F]f--[--F]f--[--F]f--[--F]f--[--F]f--[--F]f&=Vlinders4__&_a=30&_l=160&_m=1.732&f=/[-(2)F]+f--[--]f[----(2)F]+*&_n=3',
'S=[--F]f--[--F]f--[--F]f--[--F]f--[--F]f--[--F]f&=Vlinders6__&_a=30&_l=160&_m=1.732&f=/[-(2)F++(0.5)F]+f--[--]f[----(2)F--(0.5)F]+*&_n=3',
'S=AAAAAA&A=[--F]f--&B=-(2)F&=Vlinders2__&_a=30&_l=160&_m=1.732&f=/[B]+f--f[---B]+*&_n=7',
'S=A&A=F-[(0.5)-F]F-[(0.5)-F]F-[(0.5)-F]F-[(0.5)-F]F-[(0.5)-F]F--(0.5)F<90>/f(2)-A&=Vlinders5__&_a=60&_l=160&_m=1.732&_n=7',
'S=YF&X=YF+XF+Y&Y=XF-YF-X&=Sierpinski3&_a=60&_n=5',
'S=--X&F=FF&X=++FXF++FXF++FXF&=sierpin&_a=60&_n=5',
'S=FS+&F=SF-&=demo2&_a=45&_l=4&_n=14',
'S=X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X&X=[F+F+F+F[---X-Y]+++++F++++++++F-F-F-F]&Y=[F+F+F+F[---Y]+++++F++++++++F-F-F-F]&=CircularTile&_a=15&_n=3',
'S=--X&F=FF&X=++FXF++FXF++FXF>1&=ColorTriangGasket&_a=60&_n=3',
'S=A&A=F[+X]FB&B=F[-Y]FA&F=*F/&X=A&Y=B&=plantLeaf2&_a=45&_m=1.3&_n=13',
'S=F-F-F-F-&F=F-FF--F-F&=curve2&_a=90&_l=6&_n=5',
'S=F-F-F-F-&F=FF-F+F-F-FF&=curve3&_a=90&_l=6&_n=4',
'S=F-F-F-F-&F=FF-F-F-F-F-F+F&=curve4&_a=90&_l=6&_n=4',
'S=F^F^F^F^&F=+!F!--!F!+&=Cesaro&_a=42&_n=5',
'S=FX&F=&X=----F!X!++++++++F!X!----&=Cezaro&_a=10.588&_n=8',
'S=XY|XY&A=-F++F-&X=XYA^XY|XY&Y=A^XY&=Cesa&_a=30&_l=6&_n=4',
'S=FX&F=&X=-FX++FY-&Y=+FX--FY+&=Dragon&_a=43&_n=10',
'S=+FX&F=&X=-FX++FY-&Y=+FX--FY+&=Dragon&_a=45&_n=10',
'S=X&X=X-YF-&Y=+FX+Y&=DragonCurve&_a=90&_n=5',
'S=L&L=LF+RFR+FL-F-LFLFL-FRFR+&R=-LFLF+RFRFR+F+RF-LFL-FR&=Fass1&_a=90&_l=6&_n=3',
'S=L&L=LFLF+RFR+FLFL-FRF-LFL-FR+F+RF-LFL-FRFRFR+&R=-LFLFLF+RFR+FL-F-LF+RFR+FLF+RFRF-LFL-FRFR&=Fass2&_a=90&_l=6&_n=2',
'S=X&X=F[+X]-FX&=fibonacci&_a=90&_l=6&_n=10',
'S=FL&F=&L=FL-FR--FR+FL++FLFL+FR-&R=+FL-FRFR--FR-FL++FL+FR&=FlowSnake&_a=60&_n=3',
'S=F-F-F-F-F&F=F-F++F+F-F-F&=Pentigree&_a=72&_n=5',
'S=w&=Lace2&_a=30&_l=4&w=+++x--F--zFx+&x=---w++F++yFw-&y=+zFx--F--z+++&z=-yFw++F++y---&_n=6',
'S=F+F+F+F&F=FFFF-F+F+F-F[-fFF+F+FF+F]FF&=Island1&_a=90&_m=6&f=*f/&_n=2',
'S=F+F+F+F&F=F+gF-FF-F-FF+g+FF-gF+FF+F+FF-g-FFF&=Island2&_a=90&_m=6&g=*f/&_n=3',
'S=A&A=/[F+A]|F+A&F=f&=ize1&_a=30&_l=234&_m=1.4142&_n=12',
'S=XY++XY&X=XYF+XY++XY&Y=F+XY&=ize2&_a=90&_l=6&_n=4',
'S=Z++Z&Z=ZF+Z++ZF+ZF+ZF+Z++ZF+Z++ZF+Z++ZF+ZF+ZF+Z++ZF+Z&=ize2b&_a=90&_l=6&_n=3',
'S=F----F----F&F=[-F]+F--F+&=ize3&_a=30&_l=6&_n=9',
'S=XY++++XY++++XY&A=-F++F-&X=XYA++XY++++XY&Y=A++XY&=ize8&_a=45.02195&_l=6&_n=5',
'S=F--F--F&F=F+F--F+F&=Koch1&_a=60&_l=2&_n=5',
'S=F&F=F+F-F&=Dragonka&_a=120&_l=22&_n=10',
'S=F+F+F+F&F=F+F-F-FFF+F+F-F&=Koch5&_a=90&_n=3',
'S=FU--1FP++++1FQ--&F=&P=--FR++++1FS--1FU&Q=FT++1FR----1FS++&R=++FP----1FQ++1FT&X=P&T=+FU--1FP+&U=-FQ++1FT-&=XmasColor!_&_a=36&_n=8',
'S=F++F++F++F&F=F+++F---F+F---F++F--F++F&=Lace&_a=45&_n=3',
'S=F++F++F++F&F=-F-FF+++F+FF-F&=man&_a=45&_n=5',
'S=FXY++F++FXY++F&X=XY*-F/-FXY++F++FXY&Y=-*F-/FXY&=Peano1&_a=45&_m=1.41&_n=3',
'S=X&X=XFYFX+F+YFXFY-F-XFYFX&Y=YFXFY-F-XFYFX+F+YFXFY&=Peano2&_a=90&_n=3',
'S=F-F-F-F&F=F-F+F+F+F-F-F-F+F&=Peano3&_a=88&_n=3',
'S=FX++FX++FX++FX++FX&X=[++++/F/F!X!*F]&=Pentagram&_a=36&_l=222&_m=1.618&_n=3',
'S=F++F++F++F++F&F=F++F++F+++++F-F++F&=PentaPlexy&_a=36&_n=3',
'S=Fr&F=&L=FLFL-Fr-Fr+FL+FL-Fr-FrFL+Fr+FLFLFr-FL+Fr+FLFL+Fr-FLFr-Fr-FL+FL+FrFr-&=QuadGosper&_a=90&_l=6&r=+FLFL-Fr-Fr+FL+FLFr+FL-FrFr-FL-Fr+FLFrFr-FL-FrFL+FL+Fr-Fr-FL+FL+FrFr&_n=2',
'S=F-F-F-F-&F=F+FF-FF-F-F+F+FF-F-F+F+FF+FF-F&=QuadKoch&_a=90&_n=3',
'S=F-F-F&F=F[-F]F&=Sierpinski1&_a=120&_n=3',
'S=X&F=FF&X=++FXF++FXF++FXF&=Sierpinski2&_a=60&_n=6',
'S=F&F=FXF&X=+FXF-FXF-FXF+&=Sierpinski4&_a=120&_n=3',
'S=FXF--FF--FF&F=FF&X=--FXF++FXF++FXF--&=Sierpinski5&_a=60&_n=3',
'S=F+F+F+F&F=FF+F+F+F+FF&=sierpinskiSquare1&_a=90&_n=3',
'S=A&A=AFAFAF-FAFAF-FAFAF-FAFF-&F=fff&=sierpinskiSquare2&_a=90&f=fff&_n=5',
'S=A&A=AfAfA-f+A-f+A|f|A|f|A+f-AfF-F-F-Ff+f|&F=FFF&=sierpinskiSquare3&_a=90&f=fff&_n=3',
'S=FR&F=&R=++!FRFU++FU++FU!---*FU|-/!FRFU!&U=!FRFU!|+*FR/+++!FR--FR--FRFU!--&=SnowFlake1&_a=30&_m=1.732&_n=5',
'S=F&F=++!F!F--F--F/|+F!F--F--F!+++*F/|+F!F*|+F!F&=Snowflake2!&_a=30&_l=92&_m=1.732&_n=3',
'S=Fx&F=&=SnowFlake3&_a=30&_m=1.732&x=++F!x!Fy--Fx--Fy|+/FyF!x!++F!y!++F!y!Fx*+++F!y!Fx&y=FyF!x!+++/FyF!x!++F!x!++F!y!Fx*|+Fx--Fy--FxF!y!++&_n=4',
'S=F&1=1&X=--!F1!F1++F1++F1*|-F1!F1++&F=F1++F1!---/F1*|-F1!F1/|-F1!F1&=SnowflakeColor!&_a=30&_m=1.732&_n=3',
'S=X&F=ff&X=+FF-YFF+FF--FFF|X|F--YFFFYFFF|&Y=-FF+XFF-FF++FFF|Y|F++XFFFXFFF|&=Sphinx1&_a=60&_l=6&f=ff&_n=3',
'S=X&F=ff&X=+FF-YFF+FF--FFF+++X+++F--YFFFYFFF+++&Y=-FF+XFF-FF++FFF+++Y+++F++XFFFXFFF+++&=Sphinx2&_a=60&_l=6&f=ff&_n=3',
'S=X++X++X++X++|G|X++X++X++X&X=[FX+++++*F/[-----Y]+++++F]&Y=[F+++++*F/[-----Y]+++++F]&=SpiralTile&_a=22.5&_m=0.7653668647&_n=8',
'S=X&F=FF&X=+FXF+FXF+FXF+FXF&=SquareGasket&_a=90&_n=3',
'S=+++FX&X=*[-FX]+FX&=valami5&_a=16.3636&_m=0.85&_l=99&_n=6',
'S=x&A=c&F=*F/&=plantLeaf4__&_a=45&_m=1.18&b=e&c=o&e=h&h=j&j=y&o=p&p=x&x=F[+A(4)]Fy&y=F[-b(4)]Fx&_n=26',
'S=A&A=F[+x]Fb&F=*F/&=plantLeaf5&_a=45&_m=1.36&b=F[-y]FA&x=A&y=b&_n=3',
'S=A&A=F[////////+A]F/B&B=F[////////-B]F/A&=plantLeaf6&_a=45&_m=1.1&_n=14',
'S=F&F=F[+F]F[-F]F&=plant02&_a=25&_l=6&_n=5',
'S=F&F=F[+F]F[-F][F]&=plant03&_a=20&_l=6&_n=5',
'S=X&F=FF&X=F[+X][-X]FX&=plant04&_a=25&_l=6&_n=5',
'S=X&F=FF&X=F[+X]F[-X]+X&=plant05&_a=20&_l=6&_n=5',
'S=X&F=FF&X=F-[[X]+X]+F[+FX]-X&=plant08&_a=22&_l=6&_n=5',
'S=----F&F=FF-[XY]+[XY]&X=+FY&Y=-FX&=plant09&_a=22&_l=6&_n=5',
'S=Z&X=X[-FFF][+FFF]FX&Z=ZFX[+Z][-Z]&=plant10&_a=25&_l=6&_n=5',
'S=F-F-F-F-F-F-F-F-F-F&F=FF+F+F+F+FF&=ize4&_a=89.8536&_l=6&_n=4',
'S=A&A=FA+B&B=FA-B&F=FA&=ize5&_a=45&_l=6&_n=13',
];
