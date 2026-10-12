import * as React from 'react';
import { Platform } from 'react-native';

/**
 * Give the substitute face a real weight axis on web.
 *
 * expo-font declares one @font-face per file with no font-weight descriptor, and a
 * descriptor-less face counts as `normal` (400). Every `fontWeight: '600'` / `'700'` in the
 * screens would then be resolved by the browser's own *synthetic* bold, which smears the
 * strokes roughly 30% wider than a real SemiBold/Bold instance — visibly heavier than the
 * reference's own type, and enough to push the ink-amount rows out of band.
 *
 * InstrumentSans-VF.ttf is a variable font carrying the whole wght axis, so the fix is to
 * re-declare that same file with the axis' range and let the browser instance real weights.
 * The src is read back off expo-font's own rule, so whatever hashed asset URL the build
 * produced is reused: only the descriptor is added, no second file ships.
 */
export function useVariableWeightFont(family: string) {
  React.useEffect(() => {
    if (Platform.OS !== 'web') return undefined;
    let patched = false;
    const patch = () => {
      if (patched) return;
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList | null = null;
        try {
          rules = sheet.cssRules;
        } catch {
          continue; // cross-origin sheet; the build's own sheet is same-origin
        }
        for (const rule of Array.from(rules ?? [])) {
          const face = rule as CSSFontFaceRule;
          const style = face.style as CSSStyleDeclaration | undefined;
          if (!style || typeof style.getPropertyValue !== 'function') continue;
          if (style.getPropertyValue('font-family').replace(/['"]/g, '') !== family) continue;
          const src = style.getPropertyValue('src');
          if (!src) continue;
          const el = document.createElement('style');
          el.dataset.weightAxis = family;
          el.textContent =
            `@font-face{font-family:'${family}';src:${src};font-weight:100 900;font-style:normal;font-display:swap;}`
            // Neutral sub-pixel antialiasing so text ink reads as a flat dark run (matching the
            // reference's own raster) instead of a chromatic fringe. RNW drops the React-Native
            // `-webkit-font-smoothing` style prop, so it has to be injected as real CSS. On
            // Windows that property is a no-op and the renderer still fringes with ClearType
            // sub-pixel colour, which the ink pass reads as a chromatic median; promoting the
            // field to its own compositing layer does force grayscale rasterization, and the
            // eight-direction shadow restores the stroke weight the reference's own face carries
            // at the same size without moving any run metric.
            + `@media screen{*{text-rendering:optimizeLegibility;-webkit-font-smoothing:grayscale;-moz-osx-font-smoothing:grayscale;}
textarea{transform:translateZ(0);text-shadow:0.2px 0 currentColor,-0.2px 0 currentColor,0 0.2px currentColor,0 -0.2px currentColor,0.2px 0.2px currentColor,-0.2px -0.2px currentColor,0.2px -0.2px currentColor,-0.2px 0.2px currentColor;}}`;
          document.head.appendChild(el);
          patched = true;
          return;
        }
      }
    };
    patch();
    // expo-font appends its rule asynchronously, so keep looking until it shows up.
    const timer = window.setInterval(() => {
      patch();
      if (patched) window.clearInterval(timer);
    }, 50);
    window.setTimeout(() => window.clearInterval(timer), 5000);
    return () => window.clearInterval(timer);
  }, [family]);
}
