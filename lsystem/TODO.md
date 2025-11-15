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
- shift+enter
- canvas
- ?webgl ? copy UI from typical threejs
- overview {message,show,console.log,minilog} (async?)


lsystem.js:
async function lsystemSvg(R='S=F',svg){...}

lsystem.svg.tag:
<svg onload="e(event)" xmlns="http://www.w3.org/2000/svg"><script>//<![CDATA[...//]]></script></svg>
const e=e=>{const svg=e.target;(onhashchange=(e,R=decodeURIComponent(location.href.split(/[?#]/)[1]))=>{...})(e)}//]]></script></svg>

lsystem.svg.attr: dontforget [" & < "] -> [' &amp; &lt; &quot;]
<svg onload="..." xmlns="http://www.w3.org/2000/svg"></svg>
const svg=event.target;(onhashchange=(e,R=decodeURIComponent(location.href.split(/[?#]/)[1]))=>{...})()
((e,s=e.target)=>(onhashchange=e=>lsystemSvg(decodeURIComponent(location.href.split(/[?#]/)[1]),s))())(event)
