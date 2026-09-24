import type { TextStyle } from 'react-native';
type WeightStop = Extract<NonNullable<TextStyle['fontWeight']>, string>;
export type Weight = WeightStop;
const stop = (value: string): WeightStop => value as WeightStop;
export const frame = {
    width: 393,
    height: 777,
    status: 49.5,
    navHeight: 80,
    navTop: 697,
};
export const colors = {
    page: '#FCFCFC',
    surface: '#FFFFFF',
    ink: '#000000',
    secondary: '#989898',
    tertiary: '#B3B3B3',
    navIdle: '#A8A8A8',
    surfaceAlt: '#F4F4F4',
    hairline: '#ECECEC',
    border: '#D4D4D4',
    field: '#F4F4F4',
    disabled: '#E8E8E8',
    onDark: '#FFFFFF',
    verified: '#0094F4',
    unread: '#FC3040',
    danger: '#E0010D',
    dialog: '#FFFFFF',
    igBlue: '#0868E0',
    chip: '#F1F1F1',
    chipInk: '#666666',
    marker: '#FAEA4E',
    markerInk: '#002A06',
    menuInk: '#999999',
    searchInk: '#A8A8A8',
    overflowInk: '#999999',
    fieldInk: '#666A72',
    hintLight: '#E0E0E0',
    pickerGrey: '#B3B3B3',
    navPlate: '#F5F5F5',
    footer: '#FAFAFA',
};
export const type = {
    body: 15,
    bodyLine: 18.3,
    field: 16,
    title: 17,
    name: 24,
    nameLine: 28,
    caption: 13,
    captionLine: 17,
    display: 24,
};
export const weight = {
    regular: stop('400'),
    soft: stop('450'),
    medium: stop('500'),
    strong: stop('550'),
    semibold: stop('600'),
    bold: stop('700'),
};
export const tracking = {
    body: -0.2,
    title: -0.3,
    name: -0.4,
};
export const space = {
    gutter: 60,
    avatarLeft: 6.2,
    avatar: 48,
    avatarGap: 60 - (6.2 + 48),
    headerRow: 48,
    actionSlot: 72,
    actionLeft: 16,
    navSlot: 72.4,
    navLeft: 16,
};
export type ActionBoxToken = {
    left: number;
    height: number;
    widths: readonly number[];
    heights?: readonly number[];
};
export const actions: Record<'feed' | 'detailRoot' | 'detailReply1' | 'detailReply2' | 'detailReply3', ActionBoxToken> = {
    feed: { left: 48, height: 43.3, widths: [61.5, 54.2, 51.3, 48.0] },
    detailRoot: { left: 0, height: 44.8, widths: [73.1, 68.8, 68.8, 68.8] },
    detailReply1: { left: 40, height: 42.6, widths: [61.5, 54.2, 51.3, 48.0], heights: [48.0, 42.6, 42.6, 42.6] },
    detailReply2: { left: 74.2, height: 40.4, widths: [61.5, 51.3, 42.2, 48.0] },
    detailReply3: { left: 74.2, height: 42.6, widths: [58.6, 42.2, 42.2, 48.0] },
};
export const feedRows: Array<{
    handleLeft: number;
    handleWidth: number;
    timeLeft: number;
    verifiedLeft: number | null;
    verifiedGlyphLeft?: number;
}> = [
    { handleLeft: 50.6, handleWidth: 47.7, timeLeft: 98.2, verifiedLeft: null },
    { handleLeft: 60.0, handleWidth: 87.3, timeLeft: 171.8, verifiedLeft: 130.6, verifiedGlyphLeft: 151.5 },
];
export const radius = {
    avatar: 24,
    media: 12,
    pill: 18,
    key: 12,
    card: 16,
};
export const shadow = {
    card: {
        shadowColor: '#000000',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
};
export const rhythm = {
    post: {
        hairlineToHeader: 0,
        headerToBody: 43.6,
        bodyToMedia: 8,
        bodyToActions: 8,
        mediaToActions: 0,
        actionsToHairline: 3.9,
    },
};
export const connector = {
    width: 2,
    indent: 34.2,
    lineGap: 22,
};
export const icons = {
    nav: 24,
    topBar: 24,
    more: 16,
    verified: 16,
    action: 20,
};
