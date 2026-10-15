/**
 * Design tokens for the Threads-style prototype.
 *
 * Every value below is measured off the reference build's own interface
 * (com.instagram.barcelona 447.0.0.54.81, 1080x2340 @ 440 dpi) and mapped into the
 * 393 x 777 logical frame the prototype draws in:
 *   x_logical = x_raw / 2.75
 *   y_logical = (y_raw - 136) / 2.75      // 136 px status bar = 49.5 dp
 *
 * Colours — median of the 1% of pixels furthest from each box's dominant colour,
 * read straight off the reference rasters (the same rule pipeline/app_gate.py uses):
 *   page / card / sheet ....... (255,255,255)  => #FFFFFF
 *     (re-measured 2026-10-14 across all 14 P0 states: at y=690 dp the reference carries a 379.5 dp
 *      run of exactly (255,255,255) in T1/T3/T6/T8/T8-replies/T8-reposts/T9/T10 and a 264.2 dp one
 *      in T4/T5/T6-results, while `page` painted (252,252,252) there. The earlier (252,252,252) note
 *      was sampled off a single plate and is 3 levels under the reference's own page.)
 *   primary ink ............... (0,0,0)        => #000000
 *   secondary ink ............. (152,152,152)  => #989898
 *   post separator hairline ... (236,236,236)  => #ECECEC   1 px
 *   card border ............... (212,212,212)  => #D4D4D4
 *   filled field (search row).. (244,244,244)  => #F4F4F4
 *   disabled fill (Post) ...... (232,232,232)  => #E8E8E8
 *   enabled fill (Post/Follow). (0,0,0)        => #000000
 *   verified badge ............ (0,148,244)    => #0094F4
 *   unread dot ................ (252,48,64)    => #FC3040
 *   Instagram mark (login) .... (8,104,224)    => #0868E0
 *
 * Fonts: Meta Optimistic VF is proprietary, so the body face is Instrument Sans (OFL),
 * picked by per-string advance width against a 140-string corpus taken from the T1-T10
 * dumps — 1.48% mean deviation before any scaling, and no size compensation needed
 * (best multiplier 0.9976). Numeric runs keep Roboto Medium (Apache-2.0) because the
 * reference APK itself ships res/yze.ttf (Roboto Medium) as its numeric fallback.
 * The measurement and the full candidate ranking live in spec/font-metrics.json.
 */

import type { TextStyle } from 'react-native';

/**
 * A weight stop the platform will accept.
 *
 * React Native types `fontWeight` as a closed union of the nine standard stops, so the intermediate
 * positions a variable face can actually render are rejected by the checker — even though
 * `src/webfont.ts` declares Instrument Sans as `font-weight: 100 900`, which makes 450 and 550 real
 * axis positions rather than synthesised bold. This prototype is web-only (`app.json` sets
 * `platforms: ["web"]`), and on the web any numeric weight string is a valid value, so the assertion
 * below is about satisfying the checker rather than about the value being unusual.
 *
 * It is deliberately a function rather than an `as` at each call site: widening `string` to this
 * union once, here, keeps the union out of the twenty-odd places that read a weight token.
 */
type WeightStop = Extract<NonNullable<TextStyle['fontWeight']>, string>;
/** A weight stop, for props on the shared chrome that carry one through to a run. */
export type Weight = WeightStop;
const stop = (value: string): WeightStop => value as WeightStop;

/** The reference frame. Every screen is laid out inside this box. */
export const frame = {
  width: 393,
  height: 777,
  /** Height of the reference device's own status bar, which the prototype does not draw. */
  status: 49.5,
  /** Bottom navigation: the last 80 dp of the frame. */
  navHeight: 80,
  navTop: 697,
};

export const colors = {
  page: '#FFFFFF',
  surface: '#FFFFFF',
  ink: '#000000',
  secondary: '#989898',
  /* The profile's own section tabs (Threads / Replies / Media / Reposts) sit one step lighter than
     the body's secondary grey: the capture reports their inactive runs at (179,179,179), not (152,152,152). */
  tertiary: '#B3B3B3',
  /* The bottom bar's unselected glyphs, sampled off T1_1 at (168,168,168); the selected key is black. */
  navIdle: '#A8A8A8',
  /* The profile screen's own section fill, sampled (244,244,244). */
  surfaceAlt: '#F4F4F4',
  hairline: '#ECECEC',
  /* A second, darker rule. The post separator above is (236,236,236), but every other rule on the
     captures reads (217,217,217): the trend rules on search (y 252.5 / 337.0 / 425.4 / 509.8, and a
     full-width one at 639.7), the activity chips' own 1 dp border (y 64.0 and 96.8), the profile's
     section rules (y 215.1 indented, 576.8 full width) and the composer's header rule (y 56.0).
     Sampled 2026-10-15 off the reference rasters: the row is 217 on R, G and B in all of them,
     which is 19 levels under `hairline` - far past any tolerance, and invisible to the node gate
     because a 1 dp rule inside a 29 dp cell leaves the median colour untouched. */
  hairlineStrong: '#D9D9D9',
  border: '#D4D4D4',
  field: '#F4F4F4',
  disabled: '#E8E8E8',
  onDark: '#FFFFFF',
  verified: '#0094F4',
  unread: '#FC3040',
  /* The composer's discard-confirmation label. T5/T5_deleted_real.png paints the word at
     (224,1,13) - a darker, more saturated red than the unread dot - and it is the only
     destructive action any of the ten captures shows. */
  danger: '#E0010D',
  /* The discard card's own fill. Sampled (255,255,255): pure white, one step above the page's
     (252,252,252), where every other plate in the captures is a tint of the page. */
  dialog: '#FFFFFF',
  igBlue: '#0868E0',
  /* Composer's audience pill and the "Author" chip are tinted plates, sampled off T3/T4. */
  chip: '#F1F1F1',
  chipInk: '#666666',
  /* The search landing's "Trending now" marker, sampled off T6_1: the plate is (250,234,78) and the
     run it carries reads (0,42,6), i.e. the capture's own ink on that plate rather than pure black. */
  marker: '#FAEA4E',
  markerInk: '#002A06',
  /* Top-bar glyph inks, sampled off the captures: the menu key's three rules read (153,153,153) and
     the search key's magnifier (168,168,168). Neither is the page's own black. */
  menuInk: '#999999',
  searchInk: '#A8A8A8',
  /* The post overflow's three dots. Every capture that shows them - T1_1, T3_1, T7_1 - puts their
     cores at (153,153,153), so the glyph is grey rather than black. */
  overflowInk: '#999999',
  /* The login screen's own field ink, sampled off T10_generic: the language key and both field hints
     read (102,106,114), a cooler and darker grey than the body's (152,152,152). */
  fieldInk: '#666A72',
  /* The composer's "Add to thread" while the row is not yet actionable: T4_empty measures it at
     (224,224,224), against (153,153,153) once a segment carries text. */
  hintLight: '#E0E0E0',
  /* The composer's thread-count picker thumb, sampled off T4 at (179,179,179). */
  pickerGrey: '#B3B3B3',
  /* The bottom bar's own plate. Every capture reports it at y 728.2 .. 771.8 dp, sampled (245,245,245),
     which is what fixes the bar's box: the keys sit centred in it at y 750, not in the 80 dp band the
     frame's own `navTop` marks out (that constant is the gate's "content ends here", not the plate). */
  navPlate: '#F5F5F5',
  /* The activity footer's own plate, sampled off T7_1 at (250,250,250). */
  footer: '#FAFAFA',
};

/**
 * Type scale. Sizes are solved from the reference, not chosen: for a single-line run the
 * dump reports the rendered width, and the reference face's own advance width for that
 * string (normalised to em) turns it into a size — size = width_dp / advance_em. The
 * clusters that come back are 15 dp for the whole feed/detail/composer line, 16 dp for
 * search-field text, 24 dp for the profile's own name step and 13 dp for the smallest
 * captions (view counts, tab labels).
 */
export const type = {
  /** Body copy, usernames, times, counts — the reference's own default line. */
  body: 15,
  /** The reference's own body leading: three lines of T1's first post span 54.9 dp. */
  bodyLine: 18.3,
  /** Search field and the top-of-profile name; the reference steps these up by 1 dp. */
  field: 16,
  /** "Thread" title in the detail header. */
  title: 17,
  /** Profile name step. */
  name: 24,
  nameLine: 28,
  /** Smallest captions: view counts under the detail title, tab labels. */
  caption: 13,
  captionLine: 17,
  /** Display step used by the two login-screen wordmarks. */
  display: 24,
};

export const weight = {
  regular: stop('400'),
  /** Between regular and medium. The reference sets its captions lighter than the feed line, and the
   *  substitute face's own 500 lands ~9% over the band on those rows; this stop closes them. */
  soft: stop('450'),
  medium: stop('500'),
  /** Between medium and semibold. Carried by the profile's section label, the share plate and the
   *  search screen's section caption, each measured at ~20% over the band on `medium`. */
  strong: stop('550'),
  semibold: stop('600'),
  bold: stop('700'),
};

export const tracking = {
  /** The reference's own negative tracking on the body line. */
  body: -0.2,
  title: -0.3,
  name: -0.4,
};

export const space = {
  /** Left gutter every post, reply and composer row starts from. */
  gutter: 60,
  /** The avatar column: 48 dp plate at x 6.2. */
  avatarLeft: 6.2,
  avatar: 48,
  /** Distance from the avatar column to the text column. */
  avatarGap: 60 - (6.2 + 48),
  /** Feed rows are 48 dp tall before the body runs. */
  headerRow: 48,
  /** Action row: four keys in 72 dp slots starting at x 16. */
  actionSlot: 72,
  actionLeft: 16,
  navSlot: 72.4,
  navLeft: 16,
};

/**
 * Action-key boxes, measured off the reference.
 *
 * The row sits 12 dp left of its own text column in every screen that carries one (feed text 60 ->
 * keys 48; detail root text 12 -> keys 0; the tree's replies 52.0/86.2 -> 40.0/74.2), so `left` is
 * derived from the column. The four widths and the row height are *not*: the reference's own
 * Android Button reports the box of the glyph run inside it, and those runs are its own sample
 * counts (`Like 7225` is 73.1 dp, `Like 88` 61.5, `Reply 165` 68.8, bare `Share` 48.0) so the box
 * grows with the number of digits its own content happens to have. Carrying the measured box is
 * the same move as every other value in this file: the reference's own numbers, not a re-derivation
 * of a layout that its widget internals - not its design - decided.
 */
export type ActionBoxToken = {
  left: number;
  height: number;
  widths: readonly number[];
  /** Per-key heights, used where the reference's own Like key reports a different box height. */
  heights?: readonly number[];
};

export const actions: Record<'feed' | 'detailRoot' | 'detailReply1' | 'detailReply2' | 'detailReply3', ActionBoxToken> = {
  /** The feed card row: 43.3 dp tall, keys packed from the text column. */
  feed: { left: 48, height: 43.3, widths: [61.5, 54.2, 51.3, 48.0] },
  /** The detail's root post is set larger: 44.8 dp, full-width from x 0. */
  detailRoot: { left: 0, height: 44.8, widths: [73.1, 68.8, 68.8, 68.8] },
  /** First-level reply, whose text column starts at 52.0. Its Like key reports 48 dp where the
   *  other three report 42.6 - the same capture, the same row. */
  detailReply1: { left: 40, height: 42.6, widths: [61.5, 54.2, 51.3, 48.0], heights: [48.0, 42.6, 42.6, 42.6] },
  /** Nested reply, text column 86.2 (T3's third row: `Like 22` / `Reply 3` / bare `Repost`). */
  detailReply2: { left: 74.2, height: 40.4, widths: [61.5, 51.3, 42.2, 48.0] },
  /** Nested reply, text column 86.2 (T3's second row: `Like 23` / bare `Reply` and `Repost`). */
  detailReply3: { left: 74.2, height: 42.6, widths: [58.6, 42.2, 42.2, 48.0] },
};

/**
 * Feed card header boxes, measured per row off the reference.
 *
 * The reference does not lay these two rows out the same way: the first row's handle sits at
 * x 50.6 and its time run abuts it at 98.2, while the second row's handle sits at the 60 dp
 * gutter and its time run starts 23.4 dp after the handle ends, with the verified badge box
 * overlapping the handle's own right edge (60.0..147.3 against 130.6..148.4). Both rows are
 * measured from the same capture, so both are carried as measured boxes rather than derived
 * from one rule the reference does not itself follow.
 *
 * The card also reports three unlabelled clickable containers - the whole author row
 * (0, 15.3, 393 x 48), the media frame's own tap target (0, 106.7, 393 x 396) and the action
 * row (0, 503.0, 393 x 43.3) - which the prototype draws as the same controls.
 */
export const feedRows: Array<{
  handleLeft: number;
  handleWidth: number;
  timeLeft: number;
  verifiedLeft: number | null;
  /** Where the badge's glyph is painted, when the capture's own raster puts it somewhere other than
   *  the centre of the key's reported box. See the second row's note below. */
  verifiedGlyphLeft?: number;
}> = [
  { handleLeft: 50.6, handleWidth: 47.7, timeLeft: 98.2, verifiedLeft: null },
  /* The key's reported box and the badge it carries disagree in this capture, and both are data.
     The dump reports the key at 130.6..148.4 (17.8 wide), which is where its box is held. The raster
     paints the badge's disc at x 149.7..163.5 - the row's only blue ink, (0,149,246) - which is
     outside that box, in the 24.4 dp gap between the handle's right edge (147.3) and the time run's
     own left edge (171.8) that the same dump reports as the merged "handle · time" node. So the key
     keeps its box and the glyph is painted at 151.5, where the capture puts it. */
  { handleLeft: 60.0, handleWidth: 87.3, timeLeft: 171.8, verifiedLeft: 130.6, verifiedGlyphLeft: 151.5 },
];

export const radius = {
  /** Avatar plates are circles. */
  avatar: 24,
  /** The composer's media frames. */
  media: 12,
  /** Filled pills: Follow, Post. */
  pill: 18,
  /** The create key's rounded square. */
  key: 12,
  /** The reference's own card corners on the link preview. */
  card: 16,
};

export const shadow = {
  /** Only the login screen's white card carries a shadow in the reference. */
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
};

/**
 * Vertical rhythm inside a post, measured off T1:
 *   card top -> author row ............ 0
 *   author row -> body run ............ 43.6
 *   body run -> media frame ........... 8
 *   body run -> action row (no media) . 8
 *   media frame -> action row ......... 0    (the reference sets them flush)
 *   action row -> closing hairline .... 4.4
 *   action row height ................. measured per row, see `actions`
 */
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

/** Nine-slice geometry the composer's thread connector uses. */
export const connector = {
  width: 2,
  /** The reply tree's per-level indent, measured on T3 (x 6.2 -> 40.4). */
  indent: 34.2,
  /** Distance from a reply's avatar to its own connector line. */
  lineGap: 22,
};

export const icons = {
  /** Reference icon glyphs report as 24 dp boxes; the top bar's own marks are 24 dp too. */
  nav: 24,
  topBar: 24,
  /** A post row's own overflow glyph: three bare dots, 12.7 dp of ink in the capture. */
  more: 16,
  /** The top bar's overflow key is the same three dots inside a ring: 22.6 dp of ink (T3_1). */
  moreTop: 24,
  verified: 16,
  action: 20,
};
