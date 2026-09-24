import { frame } from './tokens';
export const span = (x: number, y: number, inset: number, h: number) => ({ position: 'absolute', left: x, right: inset, top: y, height: h } as const);
export const rightAt = (inset: number, y: number, w: number, h: number) => ({ position: 'absolute', right: inset, top: y, width: w, height: h } as const);
export const lowAt = (x: number, y: number, w: number, h: number) => ({ position: 'absolute', left: x, bottom: frame.height - y - h, width: w, height: h } as const);
export const lowRight = (inset: number, y: number, w: number, h: number) => ({ position: 'absolute', right: inset, bottom: frame.height - y - h, width: w, height: h } as const);
export const insetOf = (x: number, w: number) => frame.width - x - w;
