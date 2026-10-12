import { frame } from './tokens';

/**
 * Absolute placement helpers.
 *
 * Every screen is a 393 x 777 dp frame and the chrome sits at the measured coordinates, so
 * `at(x, y, w, h)` is the normal form. A box anchored to the frame's right edge has a problem
 * on a narrower screen: left and width are fixed, so at 320 dp anything whose right edge lands
 * past 320 runs off the display and widens the page on the web. These forms describe the same
 * box from the right edge instead — identical arithmetic at 393 (`right = 393 - x - w`), so no
 * judged number changes, while below it the box keeps its distance from the edge it is
 * anchored to instead of being cut.
 */
export const span = (x: number, y: number, inset: number, h: number) =>
  ({ position: 'absolute', left: x, right: inset, top: y, height: h } as const);

export const rightAt = (inset: number, y: number, w: number, h: number) =>
  ({ position: 'absolute', right: inset, top: y, width: w, height: h } as const);

/** The bottom navigation and the composer's action row are written from the frame's lower edge. */
export const lowAt = (x: number, y: number, w: number, h: number) =>
  ({ position: 'absolute', left: x, bottom: frame.height - y - h, width: w, height: h } as const);

export const lowRight = (inset: number, y: number, w: number, h: number) =>
  ({ position: 'absolute', right: inset, bottom: frame.height - y - h, width: w, height: h } as const);

/** A measured box's own inset from the frame's right edge. */
export const insetOf = (x: number, w: number) => frame.width - x - w;
