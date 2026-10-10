import * as React from 'react';
import { Platform } from 'react-native';
export function useVariableWeightFont(family: string) {
    React.useEffect(() => {
        if (Platform.OS !== 'web')
            return undefined;
        let patched = false;
        const patch = () => {
            if (patched)
                return;
            for (const sheet of Array.from(document.styleSheets)) {
                let rules: CSSRuleList | null = null;
                try {
                    rules = sheet.cssRules;
                }
                catch {
                    continue;
                }
                for (const rule of Array.from(rules ?? [])) {
                    const face = rule as CSSFontFaceRule;
                    const style = face.style as CSSStyleDeclaration | undefined;
                    if (!style || typeof style.getPropertyValue !== 'function')
                        continue;
                    if (style.getPropertyValue('font-family').replace(/['"]/g, '') !== family)
                        continue;
                    const src = style.getPropertyValue('src');
                    if (!src)
                        continue;
                    const el = document.createElement('style');
                    el.dataset.weightAxis = family;
                    el.textContent =
                        `@font-face{font-family:'${family}';src:${src};font-weight:100 900;font-style:normal;font-display:swap;}`
                            + `@media screen{*{text-rendering:optimizeLegibility;-webkit-font-smoothing:grayscale;-moz-osx-font-smoothing:grayscale;}
textarea{transform:translateZ(0);text-shadow:0.2px 0 currentColor,-0.2px 0 currentColor,0 0.2px currentColor,0 -0.2px currentColor,0.2px 0.2px currentColor,-0.2px -0.2px currentColor,0.2px -0.2px currentColor,-0.2px 0.2px currentColor;}}`;
                    document.head.appendChild(el);
                    patched = true;
                    return;
                }
            }
        };
        patch();
        const timer = window.setInterval(() => {
            patch();
            if (patched)
                window.clearInterval(timer);
        }, 50);
        window.setTimeout(() => window.clearInterval(timer), 5000);
        return () => window.clearInterval(timer);
    }, [family]);
}
