- quickhelp for `_*`
- if only dots and gaussianblured: draw once each (aka. path from grid)
- fix / replace longtap
- bop it, twist it, STROKE IT!!! firefox clipping blurs eg background
- performance
  - compare generator and arrays: Really same?!WTF!
  - SegmentSet
- _o vs _cc ? (opacity vs alpha-channel)
- leave input vals as-is (string) including R._n
  - set defaults int R
- add IFS guessing: show first iter rectangles?
  - add iteration overlay or multi svg?
- feature: colored fill
- webkit blur bug/feGaussianBlur?
- turbulence in svg? (no use if segments have same turb at path joints)
- UI: [+-] buttons more obvious eg: [<|>]
- 3D, HigherDImensionalProjections (IFS?)
- pinchzoom, dragmouse
- use pointer~ instead of mouse~ and touch~
- `_m` optionally scale stroke-width too
- shift+enter
- canvas
- ?webgl ? copy UI from typical threejs
- overview {message,show,console.log,minilog} (async?)


lsystem.js:
async function lsystemSvg(R = 'S=F', svg){...}

lsystem.svg:
<svg onload='e(event)' xmlns='http://www.w3.org/2000/svg'><script>//<![CDATA[
const e=e=>{const svg=e.target;(onhashchange=(e, R = location.href.split(/[?#]/)[1] || 'S=F')=>{...})(e)}//]]></script></svg>

lsystem.attr.svg: dontforget [" & < "] -> [' &amp; &lt; &quot;]
<svg onload="const svg=event.target;(onhashchange=(e, R = location.href.split(/[?#]/)[1] || 'S=F')=>{...})()" xmlns="http://www.w3.org/2000/svg"></svg>