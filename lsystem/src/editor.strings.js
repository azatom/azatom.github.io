export const strings = {
  lsystemsvg: 'lsystem.svg',
  textarea: {
    placeholder: " Type here: S=S+F,_n=3 or click 'next'.\n" +
      " Reformat: Ctrl+Enter or Triangle (sorry edit is hectic).\n" +
      " Shift or LongTap reverses '++/--', 'next/prev'.\n" +
      " Autosave: localstorage.",
  },
  errors: {
    format: `_n Number of iterations, 0+
_m Line length multiplier, +
_a Angle in degrees, -0+
_l Initial line length width=1, +
_k Dot size, 0+
_j Dot blur, 0+
_o Stroke-opacity, 0..1
_cb Color background, #[0-9a-f]{3,8}
_cc Color line, #[0-9a-f]{3,8}
_cd Color dot, #[0-9a-f]{3,8}
_x _y, _w, _h: ViewBox, -0+
_z Padding, 0+`,
    e: 'error',
    blob: "Blob creation failed",
  },
  copied: "copied",
  pngPrompt: "Larger size [px]? max safe 16384, def 3840",
  exportUntitled: "untiteled",
  processing: "Processing...",
};
