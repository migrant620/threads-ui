import { registerRootComponent } from 'expo';
import App from './src/App';
const FRAME_W = 393;
const FRAME_H = 777;
const css = [
    'html,body{margin:0;padding:0;overflow:hidden;}',
    '#root{position:fixed;top:0;left:0;display:block;width:393px;height:777px;transform-origin:top left;}',
    'input,textarea,[contenteditable]{outline:none!important;box-shadow:none!important;}',
    'html,body,div,span,svg,text{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}',
    '@media (min-width:800px){html,body{background:radial-gradient(1200px 820px at 50% 28%, #1c1c24 0%, #0a0a0d 72%);}'
        + '#root{border-radius:44px;overflow:hidden;'
        + 'box-shadow:0 0 0 10px #1b1b20,0 0 0 11px rgba(255,255,255,0.10),0 42px 110px rgba(0,0,0,0.62);}}',
].join('\n');
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    const fit = () => {
        const root = document.getElementById('root');
        if (!root)
            return;
        const s = Math.min(window.innerWidth / FRAME_W, window.innerHeight / FRAME_H, 1);
        root.style.transform = s < 1 ? `scale(${s})` : '';
        const wide = window.innerWidth >= 800;
        root.style.left = wide ? `${(window.innerWidth - FRAME_W * s) / 2}px` : '0px';
        root.style.top = wide ? `${(window.innerHeight - FRAME_H * s) / 2}px` : '0px';
    };
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', fit);
}
registerRootComponent(App);
