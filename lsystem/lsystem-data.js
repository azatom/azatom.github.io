examples=[
'S=X&X=-YF+XFX+FY-&Y=+XF-YFY-FX+&_=Hilbert&_a=90&_l=2&_n=3',
'S=F+XFX+F+XFX&X=-YF+XFX+FY-&Y=+XF-YFY-FX+&_=Moore&_a=90&_l=2&_n=2',
'A=FBFA+HFA+FB-FA&B=FB+FA-FB-JFBFA&F=&H=-&J=+&S=FB&_=Quartet&_a=90&_n=4',
'A=F[+X]FB&B=F[-Y]FA&F=*F/&S=A&X=A&Y=B&_=plantLeaf2&_a=45&_m=1.3&_n=13',
'F=&S=X&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&_=Penrose1&_a=36&_l=9&_n=5',
'F=&S=X&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&_=PenroseToBranch&_a=6&_l=6&_n=5',
'F=F+f-F&S=X&X=[X]F+[X]F+[X]F+[X]F+[X]F+[X]F+&_=tilesg4&_a=60&_l=6&_n=5&f=F',
'F=FF-[-F+F+F]+[+F-F-F]&S=F&_=plant00&_a=22.5&_n=3',
'F=F[+F][-F]&S=+[F]++[F]++[F]++F&_=lars2&_a=62&_n=6',
'H=-Z[+H]L&L=[-FFF][+FFF]F&S=[+++Z][---Z]TS&T=TL&Z=+H[-Z]L&_=plant01&_a=18&_n=6',
'S=f----f----f&_=Vlinders1&_a=30&_l=160&_m=1.732&_n=7&f=[F]/+f--f+*',
'S=f----f----f&_=Vlinders3__&_a=30&_l=160&_m=1.732&_n=7&f=[F]/[-(2)F]+f--[--F]f[----(2)F]+*',
'S=YF&X=YF+XF+Y&Y=XF-YF-X&_=Sierpinski3&_a=60&_n=5',
'F=FF&S=--X&X=++FXF++FXF++FXF&_=sierpin&_a=60&_n=5',
'S=[--F]f--[--F]f--[--F]f--[--F]f--[--F]f--[--F]f&_=Vlinders4__&_a=30&_l=160&_m=1.732&_n=3&f=/[-(2)F]+f--[--]f[----(2)F]+*',
'S=[--F]f--[--F]f--[--F]f--[--F]f--[--F]f--[--F]f&_=Vlinders6__&_a=30&_l=160&_m=1.732&_n=3&f=/[-(2)F++(0.5)F]+f--[--]f[----(2)F--(0.5)F]+*',
'F=SF-&S=FS+&_=demo2&_a=45&_l=4&_n=14',
'F=&S=+WC2F--XC4F---YC4F--ZC2F&W=YC4F++ZC2F----XC4F[-YC4F----WC2F]++&X=+YC4F--ZC2F[---WC2F--XC4F]+&Y=-WC2F++XC4F[+++YC4F++ZC2F]-&Z=--YC4F++++WC2F[+ZC2F++++XC4F]--XC4F&_=PenroseColor&_a=36&_n=3',
'F=&S=[Y]++[Y]++[Y]++[Y]++[Y]&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&_=Penrose2&_a=36&_l=9&_n=5',
'F=&S=ZF----XF-YF----WF&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&_=Penrose3&_a=36&_l=9&_n=5',
'F=&S=WF--XF---YF--ZF&W=YF++ZF----XF[-YF----WF]++&X=+YF--ZF[---WF--XF]+&Y=-WF++XF[+++YF++ZF]-&Z=--YF++++WF[+ZF++++XF]--XF&_=Penrose4&_a=36&_l=9&_n=5',
'A=[/S]+F/[|A]----F+F----[A]*F&F=f&S=+[/A]F/---[-S]F-F---[-S]*F[/|A]&_=kd1&_a=36&_l=99&_m=1.618&_n=4',
'A=[/k]+F/[|A]----F+F----[A]*F&F=f&S=[k]++[k]++[k]++[k]++[k]&_=kd2&_a=36&_l=99&_m=1.618&_n=4&k=+[/A]F/---[-k]F-F---[-k]*F[/|A]',
'F=&S=Wf+Xf+Wf+Xf+Wf+Xf+Wf+Xf+Wf+X&W=[F][++*F][++f---/f|X-Y|f|W]&X=[F+++*F][++/fZ|X|-f|W]&Y=[+F][*F][+f/|Y+X]&Z=[-F][*F][/f--Wf|+Z]&_=kd3&_a=36&_l=99&_m=1.618&_n=4',
'S=X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X+X&X=[F+F+F+F[---X-Y]+++++F++++++++F-F-F-F]&Y=[F+F+F+F[---Y]+++++F++++++++F-F-F-F]&_=CircularTile&_a=15&_n=3',
'F=FF&S=--X&X=++FXF++FXF++FXF>1&_=ColorTriangGasket&_a=60&_n=3',
'F=F+/f*-F&S=X&X=[X]F+[X]F+[X]F+[X]F+&_=tilesg1&_a=90&_l=9&_n=4',
'F=F+/f*-F&S=X&X=[X]F^[X]F^[X]F^[X]F^&_=tilesg2&_a=80&_l=9&_n=4',
'A=F+F-F&F=&S=AX&X=[+AX-AX-AX]-AX+AX+AX-&_=tilesg5&_a=60&_l=6&_n=4',
'A=FfF&F=&S=AX&X=[+AX-AX-AX]-AX+AX+AX-&_=tilesg6&_a=60&_l=6&_n=3&f=',
'A=++F--f++F--&B=++F--f++F--&C=++F--f++F--&D=++F--f++F--&E=++F--f++F--&F=&G=++F--f++F--&S=AX&X=[+AX-BX-CX]-DX+EX+GX-&_=tilesg7&_a=60&_l=6&_n=3&f=',
'A=F-F-F-F+F+F+F&F=&S=AX&X=[+AX-AX-AX]-AX+AX+AX-&_=tilesgHex&_a=60&_l=6&_n=3&f=',
'A=[+AX-AX-AX]-AX+AX+AX-&F=&S=AX&X=F+F+F+FFF-F-F-F&_=tilesgLizard&_a=60&_l=2&_n=3',
'F=FF+F+F+F+FF&S=F+F+F+F+F+F+F+F+F+F+F+F+F+F+F+F&_=Csillag&_a=89.989958&_l=6&_n=5',
'F=FF+F+F+F+FF&S=F-F-F-F-F-F-F-F-F-F&_=Csillag2&_a=89.8536&_l=6&_n=4',
'F=F-FF--F-F&S=F-F-F-F-&_=curve2&_a=90&_l=6&_n=5',
'F=FF-F+F-F-FF&S=F-F-F-F-&_=curve3&_a=90&_l=6&_n=5',
'F=FF-F-F-F-F-F+F&S=F-F-F-F-&_=curve4&_a=90&_l=6&_n=5',
'F=+!F!--!F!+&S=F^F^F^F^&_=Cesaro&_a=42&_n=5',
'F=&S=FX&X=----F!X!++++++++F!X!----&_=Cezaro&_a=10.588&_n=8',
'A=-F++F-&S=XY|XY&X=XYA^XY|XY&Y=A^XY&_=Cesa&_a=30&_l=6&_n=4',
'F=&S=FX&X=-FX++FY-&Y=+FX--FY+&_=Dragon&_a=43&_n=10',
'F=&S=+FX&X=-FX++FY-&Y=+FX--FY+&_=Dragon&_a=45&_n=10',
'S=X&X=X-YF-&Y=+FX+Y&_=DragonCurve&_a=90&_n=5',
'L=LF+RFR+FL-F-LFLFL-FRFR+&R=-LFLF+RFRFR+F+RF-LFL-FR&S=L&_=Fass1&_a=90&_l=6&_n=3',
'L=LFLF+RFR+FLFL-FRF-LFL-FR+F+RF-LFL-FRFRFR+&R=-LFLFLF+RFR+FL-F-LF+RFR+FLF+RFRF-LFL-FRFR&S=L&_=Fass2&_a=90&_l=6&_n=2',
'S=X&X=F[+X]-FX&_=fibonacci&_a=90&_l=6&_n=10',
'F=&L=FL-FR--FR+FL++FLFL+FR-&R=+FL-FRFR--FR-FL++FL+FR&S=FL&_=FlowSnake&_a=60&_n=3',
'F=F-F++F+F-F-F&S=F-F-F-F-F&_=Pentigree&_a=72&_n=5',
'S=w&_=Lace2&_a=30&_l=4&_n=6&w=+++x--F--zFx+&x=---w++F++yFw-&y=+zFx--F--z+++&z=-yFw++F++y---',
'F=FFFF-F+F+F-F[-fFF+F+FF+F]FF&S=F+F+F+F&_=Island1&_a=90&_m=6&_n=2&f=*f/',
'F=F+gF-FF-F-FF+g+FF-gF+FF+F+FF-g-FFF&S=F+F+F+F&_=Island2&_a=90&_m=6&g=*f/&_n=3',
'A=/[F+A]|F+A&F=f&S=A&_=Ize1&_a=30&_l=234&_m=1.4142&_n=16',
'S=XY++XY&X=XYF+XY++XY&Y=F+XY&_=Ize2&_a=90&_l=6&_n=4',
'F=[-F]+F--F+&S=F----F----F&_=Ize3&_a=30&_l=6&_n=10',
'A=FA+B&B=FA-B&F=FA&S=A&_=Ize4&_a=45&_l=6&_n=13',
'S=Z++Z&Z=ZF+Z++ZF+ZF+ZF+Z++ZF+Z++ZF+Z++ZF+ZF+ZF+Z++ZF+Z&_=Ize7&_a=90&_l=6&_n=3',
'A=-F++F-&S=XY++++XY++++XY&X=XYA++XY++++XY&Y=A++XY&_=Ize8&_a=45.02195&_l=6&_n=5',
'F=F+F--F+F&S=F--F--F&_=Koch1&_a=60&_l=2&_n=5',
'F=F+F-F&S=F&_=Dragonka&_a=120&_l=22&_n=10',
'F=F-F+F+FF-F-F+F&S=F&_=Koch3&_a=111&_n=6',
'F=F+F-F-FFF+F+F-F&S=F+F+F+F&_=Koch5&_a=90&_n=3',
'F=&P=--FR++++1FS--1FU&Q=FT++1FR----1FS++&R=++FP----1FQ++1FT&X=P&S=FU--1FP++++1FQ--&T=+FU--1FP+&U=-FQ++1FT-&_=XmasColor!_&_a=36&_n=8',
'F=F+++F---F+F---F++F--F++F&S=F++F++F++F&_=Lace&_a=45&_n=3',
'F=-F-FF+++F+FF-F&S=F++F++F++F&_=man&_a=45&_n=5',
'F=FF-[XY]+[XY]&S=++++F&X=+FY&Y=-FX&_=MyTree&_a=22.5&_n=3',
'F=F+F--F+F&S=F^F^F^F&_=NegyzetMajdnem&_a=88.5&_n=7',
'S=FXY++F++FXY++F&X=XY*-F/-FXY++F++FXY&Y=-*F-/FXY&_=Peano1&_a=45&_m=1.41&_n=3',
'S=X&X=XFYFX+F+YFXFY-F-XFYFX&Y=YFXFY-F-XFYFX+F+YFXFY&_=Peano2&_a=90&_n=3',
'F=F-F+F+F+F-F-F-F+F&S=F-F-F-F&_=Peano3&_a=88&_n=3',
'S=FX++FX++FX++FX++FX&X=[++++/F/F!X!*F]&_=Pentagram&_a=36&_l=222&_m=1.618&_n=3',
'F=F++F++F+++++F-F++F&S=F++F++F++F++F&_=PentaPlexy&_a=36&_n=3',
'F=&L=FLFL-Fr-Fr+FL+FL-Fr-FrFL+Fr+FLFLFr-FL+Fr+FLFL+Fr-FLFr-Fr-FL+FL+FrFr-&S=Fr&_=QuadGosper&_a=90&_l=6&_n=2&r=+FLFL-Fr-Fr+FL+FLFr+FL-FrFr-FL-Fr+FLFrFr-FL-FrFL+FL+Fr-Fr-FL+FL+FrFr',
'F=F+FF-FF-F-F+F+FF-F-F+F+FF+FF-F&S=F-F-F-F-&_=QuadKoch&_a=90&_n=3',
'F=F[-F]F&S=F-F-F&_=Sierpinski1&_a=120&_n=3',
'F=FF&S=X&X=++FXF++FXF++FXF&_=Sierpinski2&_a=60&_n=6',
'F=FXF&S=F&X=+FXF-FXF-FXF+&_=Sierpinski4&_a=120&_n=3',
'F=FF&S=FXF--FF--FF&X=--FXF++FXF++FXF--&_=Sierpinski5&_a=60&_n=3',
'F=FF+F+F+F+FF&S=F+F+F+F&_=sierpinskiSquare1&_a=90&_n=3',
'A=AFAFAF-FAFAF-FAFAF-FAFF-&F=fff&S=A&_=sierpinskiSquare2&_a=90&_n=5&f=fff',
'A=AfAfA-f+A-f+A|f|A|f|A+f-AfF-F-F-Ff+f|&F=FFF&S=A&_=sierpinskiSquare3&_a=90&f=fff&_n=3',
'F=&R=++!FRFU++FU++FU!---*FU|-/!FRFU!&S=FR&U=!FRFU!|+*FR/+++!FR--FR--FRFU!--&_=SnowFlake1&_a=30&_m=1.732&_n=5',
'F=++!F!F--F--F/|+F!F--F--F!+++*F/|+F!F*|+F!F&S=F&_=Snowflake2!&_a=30&_l=92&_m=1.732&_n=3',
'F=&S=Fx&_=SnowFlake3&_a=30&_m=1.732&_n=5&x=++F!x!Fy--Fx--Fy|+/FyF!x!++F!y!++F!y!Fx*+++F!y!Fx&y=FyF!x!+++/FyF!x!++F!x!++F!y!Fx*|+Fx--Fy--FxF!y!++',
'1=1&X=--!F1!F1++F1++F1*|-F1!F1++&F=F1++F1!---/F1*|-F1!F1/|-F1!F1&S=F&_=SnowflakeColor!&_a=30&_m=1.732&_n=3',
'F=ff&S=X&X=+FF-YFF+FF--FFF|X|F--YFFFYFFF|&Y=-FF+XFF-FF++FFF|Y|F++XFFFXFFF|&_=Sphinx1&_a=60&_l=6&f=ff&_n=3',
'F=ff&S=X&X=+FF-YFF+FF--FFF+++X+++F--YFFFYFFF+++&Y=-FF+XFF-FF++FFF+++Y+++F++XFFFXFFF+++&_=Sphinx2&_a=60&_l=6&f=ff&_n=3',
'S=X++X++X++X++|G|X++X++X++X&X=[FX+++++*F/[-----Y]+++++F]&Y=[F+++++*F/[-----Y]+++++F]&_=SpiralTile&_a=22.5&_m=0.7653668647&_n=8',
'F=FF&S=X&X=+FXF+FXF+FXF+FXF&_=SquareGasket&_a=90&_n=3',
'S=+++FX&X=*[-FX]+FX&_=valami5&_a=16.3636&_m=0.85&_n=6&_l=99',
'A=[--F]f--&B=-(2)F&S=AAAAAA&_=Vlinders2__&_a=30&_l=160&_m=1.732&_n=7&f=/[B]+f--f[---B]+*',
'A=F-[(0.5)-F]F-[(0.5)-F]F-[(0.5)-F]F-[(0.5)-F]F-[(0.5)-F]F--(0.5)F<90>/f(2)-A&S=A&_=Vlinders5__&_a=60&_l=160&_m=1.732&_n=7',
'A=c&F=*F/&S=x&_=plantLeaf4__&_a=45&_m=1.18&_n=26&b=e&c=o&e=h&h=j&j=y&o=p&p=x&x=F[+A(4)]Fy&y=F[-b(4)]Fx',
'A=F[+x]Fb&F=*F/&S=A&_=plantLeaf5&_a=45&_m=1.36&b=F[-y]FA&x=A&y=b&_n=3',
'A=F[////////+A]F/B&B=F[////////-B]F/A&S=A&_=plantLeaf6&_a=45&_m=1.1&_n=14',
'F=F[+F]F[-F]F&S=F&_=plant02&_a=25&_l=6&_n=5',
'F=F[+F]F[-F][F]&S=F&_=plant03&_a=20&_l=6&_n=5',
'F=FF&S=X&X=F[+X][-X]FX&_=plant04&_a=25&_l=6&_n=5',
'F=FF&S=X&X=F[+X]F[-X]+X&_=plant05&_a=20&_l=6&_n=5',
'F=F[+FF][-FF]F[+FF][-FF]F&S=F&_=plant07&_a=36&_l=6&_n=5',
'F=FF&S=X&X=F-[[X]+X]+F[+FX]-X&_=plant08&_a=22&_l=6&_n=5',
'F=FF-[XY]+[XY]&S=----F&X=+FY&Y=-FX&_=plant09&_a=22&_l=6&_n=5',
'S=Z&X=X[-FFF][+FFF]FX&Z=ZFX[+Z][-Z]&_=plant10&_a=25&_l=6&_n=5',
'F=F[+F[+F][-F]F][-F[+F][-F]F]F[+F][-F]F&S=F&_=plant11&_a=30&_l=6&_n=5',
];
