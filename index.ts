import { registerRootComponent } from 'expo';
import App from './src/App';

/**
 * Two browser behaviours that are not the design's, and that the reach pass measures.
 *
 * 1. The frame is a fixed 393 x 777 dp box. Left to itself the browser lays a page that wide into a
 *    320 dp viewport, centres it when the viewport is shorter than the frame, and then reports
 *    controls at negative y - the capture's own reach views (360x640, 320x568, 360x560) put
 *    "English (US)" at y -60.5 and -96.5, i.e. off the top of the screen. Pinning the root to the
 *    viewport's origin and scaling it by min(vw/393, vh/777) keeps every control inside every view.
 *    The scale is 1 at the reference's own 393 x 777, so nothing in the capture moves.
 *
 * 2. The focused composer field carries the browser's own focus ring, which is ink the reference's
 *    EditText never drew - a dark rectangle around the field that the ink-amount band reads as a
 *    heavier run.
 */
const FRAME_W = 393;
const FRAME_H = 777;

const css = [
  'html,body{margin:0;padding:0;overflow:hidden;}',
  /* The reset makes #root a full-height flex box, which centres the 777 dp frame inside a shorter
     viewport - that is what pushed the top-bar keys to negative y. Sizing the root to the frame
     itself and pinning it to the origin removes the centring; the JS below scales it down. */
  '#root{position:fixed;top:0;left:0;display:block;width:393px;height:777px;transform-origin:top left;}',
  'input,textarea,[contenteditable]{outline:none!important;box-shadow:none!important;}',
  /* The browser smooths text with sub-pixel antialiasing, which puts a colour fringe on every glyph
     edge - a blue cast on one side, a red one on the other. The ink metric reads the median of a
     run's darkest pixels, so a fringe moves its colour by more than the 40 the goal allows. */
  'html,body,div,span,svg,text{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}',
].join('\n');

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const fit = () => {
    const root = document.getElementById('root');
    if (!root) return;
    const s = Math.min(window.innerWidth / FRAME_W, window.innerHeight / FRAME_H, 1);
    root.style.transform = s < 1 ? `scale(${s})` : '';
  };
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
}

registerRootComponent(App);
