- el.left.style.width js/css/fixate
! turbulence in svg? (no use if segments have same turb at path joints)
! quickhelp _*
- if only dots and gaussianblured: draw once each (aka. path from grid)
+ replace longtap ? button: [<|>]
? compare generator and arrays: Really same?!WTF!
? performance: SegmentSet
? _o vs _cc ? (opacity vs alpha-channel)
- make R immutable
- make R mutable
+ add IFS guessing: show first iter rectangles?
+ add iteration overlay or multi svg?
+ colored fill
? webkit blur bug/feGaussianBlur?
+ 3D, HigherDImensionalProjections (IFS?)
+ pinchzoom, dragmouse
- use pointer~ instead of mouse~ and touch~
? shift+enter
+ canvas
+ ?webgl ? copy UI from typical threejs

---

lsystem.js:
async function lsystemSvg(R='S=F',svg){...}

lsystem.svg.tag:
<svg onload="e(event)" xmlns="http://www.w3.org/2000/svg"><script>//<![CDATA[...//]]></script></svg>
const e=e=>{const svg=e.target;(onhashchange=(e,R=decodeURIComponent(location.href.split(/[?#]/)[1]))=>{...})(e)}//]]></script></svg>

lsystem.svg.attr: dontforget [" & < "] -> [' &amp; &lt; &quot;]
<svg onload="..." xmlns="http://www.w3.org/2000/svg"></svg>
const svg=event.target;(onhashchange=(e,R=decodeURIComponent(location.href.split(/[?#]/)[1]))=>{...})()
((e,s=e.target)=>(onhashchange=e=>lsystemSvg(decodeURIComponent(location.href.split(/[?#]/)[1]),s))())(event)
