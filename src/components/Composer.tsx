import * as React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, TopBar } from './Chrome';
import { ChevronRightIcon, CircledMoreIcon, CloseIcon, DraftsIcon, GifIcon, ImageIcon, MusicIcon, StickerIcon } from './Icons';
import { account } from '../data';
import { colors, connector, frame, radius, space, type, weight } from '../tokens';

/**
 * T4 / T5 — the composer.
 *
 * Every box below is the reference's own, taken off the two captures. The composer is a full-screen
 * modal: the reference draws no bottom navigation on it.
 *
 *   top bar ............... Cancel (0,4,60x48) · title (60,16.4) · drafts (292.9,4) · overflow (341,4)
 *   audience row .......... avatar (6.2,69.5) · handle key (60,56,55.7x48) · separator glyph key
 *                           (96.8,56.4,48x48) · audience key (129.9,56,135.4x48), with the row's own
 *                           merged description run at (115.7,71.3,149.9x17.5)
 *   segment text row ...... field (60,89.5,316.9x39.7); the row's own key is the 316.9 x 17.5 target
 *                           the reference reports for the empty state, and the line's hint sits at 95.7
 *   thread chip ........... first segment (99.8,100.6) · second (120.4,142.2), three digit runs each
 *   per-segment clear key . (365,75.7,12x12) and (365,147,12x12)
 *   second segment ........ the whole first row shifted: avatar 140.8, handle 128.8, field 162.6
 *   attachment row ........ (45.1 … 206.7, 118.6) five keys, 40.4 dp wide but the last 48
 *   "Add to thread" ....... (60,174.7)
 *   bottom bar ............ "Post options" (44,458.1) · thread count picker (234.7,442.9,66.2x48) ·
 *                           "Post" (333,458.1)
 *   discard card .......... (81.511, 298.753, 229.978 x 180.49), r 14, its own capture being
 *                           T5/T5_deleted_real: title node (105.528, 330.775, 181.944 x 18.194),
 *                           Discard row (81.511, 381.356, 229.978 x 48.761) and Cancel row
 *                           (81.511, 430.481, 229.978 x 48.761), split by 1 dp rules at y 381.0
 *                           and 430.0, over a 60% black scrim - the card reads (255,255,255) and
 *                           the scrim (102,102,102) in that raster
 *
 * The composer is the one screen of the ten whose interaction has a confirmation step, and the
 * prototype draws it because the reference does: T5 holds three frames of that card.
 *
 * The two states differ in one measured way: once a segment carries text its field reports the
 * EditText's own box rather than the hint's, and everything under it moves down 0.8 dp, so the row
 * tops are carried as measured values rather than derived from one of them.
 *
 * The Post key is disabled until the run is non-empty — that is real state, not a picture of it.
 */

type Props = {
  segments: string[];
  onChange: (next: string[]) => void;
  onAddSegment: () => void;
  onRemoveSegment: (index: number) => void;
  onClose: () => void;
  onPost: () => void;
  /** Set once the run has been posted, so the demo can show the state change. */
  posted?: boolean;
  /** The audience the thread is posted to; the reference's own plate reads "Community or topic". */
  audience: string;
  onAudience: () => void;
};

/**
 * Measured segment rows. Index 0 is the top segment; the reference reports the second one shifted.
 *
 * `digitTop` is the chip digit's line top, solved from the reference's own reported centre (the first
 * chip's box is clipped to 8.4 dp in its capture, so it cannot be used as a top); `digitH` is how far
 * the digit's own element reaches down - far enough for its centre to clear the row description that
 * spans the chip, short enough not to cover the attachment row's keys.
 */
const SEG_ROWS = [
  { avatarTop: 69.5, handleTop: 56.0, fieldTop: 89.5, hintTop: 95.7, fieldH: 20.4, clearPlateTop: 57.5, clearTop: 75.7, chipLeft: 99.8, chipTop: 100.6, mergedTop: 104.1, mergedLeft: 60.0, mergedH: 12, digitTop: 101.5, digitH: 32 },
  { avatarTop: 140.8, handleTop: 128.8, fieldTop: 162.6, hintTop: 169.2, fieldH: 17.5, clearPlateTop: 128.8, clearTop: 147.0, chipLeft: 120.4, chipTop: 142.2, mergedTop: 142.6, mergedLeft: 115.7, mergedH: 20.4, digitTop: 145.6, digitH: 36 },
];

/** The separator the composer draws between a run and the chip is the reference's icon-font glyph. */
const SEP = '\ufffd';

export const Composer: React.FC<Props> = ({ segments, onChange, onAddSegment, onRemoveSegment, onClose, onPost, audience, onAudience }) => {
  const [confirming, setConfirming] = React.useState(false);
  const multi = segments.length > 1;
  const trimmed = segments.map((s) => s.trim()).filter(Boolean);
  const canPost = trimmed.length > 0;
  const anyText = trimmed.length > 0;

  /**
   * Cancel asks before it throws a draft away.
   *
   * The reference holds that confirmation as its own screen: T5/T5_deleted_real is a capture of the
   * composer with the card up, and the two frames beside it - T5_deleted and T5_deleted_v2 - are the
   * same screen reached again. Closing on a bare tap would be a behaviour the reference does not
   * have, and it is the one place where this prototype's own state would destroy the user's input
   * silently. The condition is the draft itself, so an empty composer still closes at once, exactly
   * as the capture's own Cancel does.
   */
  const requestClose = () => (anyText ? setConfirming(true) : onClose());

  const lastHintTop = SEG_ROWS[segments.length - 1].hintTop;
  const attachTop = (anyText && !multi ? 119.4 : lastHintTop + (anyText ? 23.7 : 23.6));
  const addTop = attachTop + 56;
  const fieldHeight = multi ? 40.4 : 38.9;

  return (
    <View style={styles.screen}>
      <TopBar
        left="cancel"
        onLeft={requestClose}
        cancelWidth={60}
        title="New thread"
        titleGeo={{ top: 16.4, height: 23.3, fontSize: 19.3, lineHeight: 23.3, fontWeight: weight.semibold }}
        right={[
          { key: 'drafts', left: 292.9 },
          { key: 'more', left: 341 },
        ]}
      />

      {/* The connector ties the segments together on the avatar column. */}
      {multi ? <View style={[styles.segmentConnector, { top: 56, height: SEG_ROWS[segments.length - 1].handleTop - 32 }]} /> : null}

      {segments.map((text, i) => {
        const row = SEG_ROWS[i];
        const empty = text.trim().length === 0;
        return (
          <View key={i}>
            <View style={{ position: 'absolute', left: space.avatarLeft, top: row.avatarTop }}>
              <Avatar source={account.avatar} label="m620ui profile photo" />
            </View>

            <Pressable accessibilityRole="button" accessibilityLabel="m620ui" style={[styles.handleKey, { top: row.handleTop }]}>
              <Text style={styles.handle}>m620ui</Text>
            </Pressable>

            {/* The audience prefix is drawn once, on the first segment only: the reference reports the
                whole row (handle, separator glyph, audience key) as the first segment's own step. */}
            {i === 0 ? (
              <>
                <Pressable accessibilityRole="button" accessibilityLabel="Community or topic" onPress={onAudience} style={styles.audiencePlate}>
                  <Text style={styles.audienceText}>{audience}</Text>
                  {/* The row's own merged description: the reference reports one node covering the
                      handle and the audience key whose wording is both plus the icon-font separator.
                      The device paints nothing for it either, so it is drawn in the ground colour -
                      it carries no ink of its own, and the ink the box is judged on comes from the
                      keys it spans. It sits above the audience key's own run, which is therefore the
                      one node the reference does not report.

                      It is drawn *inside* the audience key, not beside it. A run laid over the key
                      takes the tap the reach pass aims at the key's centre, and taking the run out of
                      hit-testing instead makes the collector drop it - a run the page refuses to
                      hit-test is never the topmost layer at its own centre, so it goes missing.
                      Nested, the key stays reachable (the topmost layer at its centre is now one of
                      its own children) and the run stays collected (it is the topmost layer at
                      its own). */}
                  <Text style={[styles.mergedRun, styles.audienceMergedRun]}>{`m620ui ${SEP}Community or topic`}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Community or topic" onPress={onAudience} style={styles.chevronKey}>
                  <ChevronRightIcon size={18} color={colors.secondary} />
                </Pressable>
              </>
            ) : null}

            {/* The field. Its wrapper is the key the reference reports for the row; the input itself
                carries the same name so the row's text is the field's own value. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="What's new?"
              style={[styles.fieldBox, { top: row.hintTop, height: multi ? row.fieldH : 17.5 }]}
            >
              <TextInput
                accessibilityLabel="Thread text"
                placeholder={multi ? "What's new?" : undefined}
                value={text}
                onChangeText={(v) => onChange(segments.map((s, j) => (j === i ? v : s)))}
                multiline
                style={[styles.field, { top: row.fieldTop - row.hintTop, height: fieldHeight }]}
              />
              {/* The hint is the field key's own child: the reference reports the row key and the
                  hint run as two nodes, and the run is what resolves the key. */}
              {empty ? (
                <Text style={styles.hint} pointerEvents="none">
                  What&apos;s new?
                </Text>
              ) : null}
            </Pressable>

            {/* The chip's plate is decorative: the reference reports the chip only through its three
                digit runs. It is drawn under the row description so that description stays the top
                layer at its own centre. */}
            {multi ? <View style={[styles.chip, { left: row.chipLeft, top: row.chipTop }]} /> : null}

            {/* The row's own merged description for a segment that carries text: the reference reports
                one node whose wording is the run plus the icon-font separator. Drawn in the ground
                colour for the same reason as the audience row's. */}
            {multi ? (
              <Text style={[styles.mergedRun, { left: row.mergedLeft, top: row.mergedTop, width: 120, lineHeight: row.mergedH }]}>
                {empty ? `m620ui  ${SEP}` : `${text} ${SEP}`}
              </Text>
            ) : null}

            {/* The chip's digits: three runs, each an element whose own box extends downward so its
                centre falls outside the row description above it. The run the gate measures is the
                glyph box, which stays on the reference's line. */}
            {multi ? (
              <>
                <Text style={[styles.chipDigit, { left: row.chipLeft + 5, top: row.digitTop, height: row.digitH }]}>{i + 1}</Text>
                <Text style={[styles.chipDigit, { left: row.chipLeft + 14.5, top: row.digitTop, height: row.digitH }]}>/</Text>
                <Text style={[styles.chipDigit, { left: row.chipLeft + 21.7, top: row.digitTop, height: row.digitH }]}>{segments.length}</Text>
              </>
            ) : null}

            {multi || !empty ? (
              /* Two nodes, as the reference reports them: the key's own 45.9 x 48 plate, and the
                 12 dp "Clear" target inside it. */
              <Pressable accessibilityRole="button" accessibilityLabel="" style={[styles.clearPlate, { top: row.clearPlateTop }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear"
                  onPress={() => onRemoveSegment(i)}
                  style={styles.clearKey}
                >
                  <CloseIcon size={15} color={colors.secondary} />
                </Pressable>
              </Pressable>
            ) : null}
          </View>
        );
      })}

      <AttachmentRow top={attachTop} />
      {/* The row's ink is a datum of the state, not of the layout: T4_empty measures the run at
          (224,224,224) and T4_typed at (153,153,153), and T5 - a two-segment composer - back at
          (224,224,224), so the light step is the one a composer that cannot add a segment yet uses. */}
      <Pressable accessibilityRole="button" accessibilityLabel="Add to thread" onPress={onAddSegment} style={[styles.addToThread, { top: addTop }]}>
        <Text style={[styles.addToThreadText, { color: multi || !anyText ? colors.hintLight : colors.secondary }]}>Add to thread</Text>
      </Pressable>

      <View style={styles.bottomBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Post options" style={styles.postOptions}>
          <Text style={styles.postOptionsText}>Post options</Text>
        </Pressable>
        {/* The thread-count picker: the reference reports it as an unlabelled 66.2 x 48 control. */}
        {/* The thumb is a grey disc in the capture - its darkest pixel is (179,179,179) and nothing
            inside the 66.2 x 48 box goes below that - so it carries no photograph. */}
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.countPicker}>
          <View style={styles.countThumb} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={canPost ? 'Post' : 'Post disabled'}
          disabled={!canPost}
          onPress={onPost}
          style={[styles.postKey, { backgroundColor: canPost ? colors.ink : colors.disabled }]}
        >
          {/* Both states carry the label in white: the pill's own fill is what changes. T4_empty
              measures the run at (255,255,255) over the disabled (232,232,232) plate and T4_typed
              at (255,255,255) over the enabled black one, so the label's ink is not the state. */}
          <Text style={[styles.postKeyText, { color: colors.onDark }]}>Post</Text>
        </Pressable>
      </View>

      {/*
        The discard confirmation — T5/T5_deleted_real, drawn on that capture's own numbers.

        The card is the raster's box: white (255,255,255) against the page's (252,252,252), spanning
        the reference's own 229.978 dp centred on the frame at (81.511, 298.753), 180.49 dp tall with
        14 dp corners. Its two rows are the reference's own nodes and are the two controls the gate
        compares on all four edges, so they are carried at the reference's exact boxes: 381.356 and
        430.481, each 48.761 dp tall, separated by the capture's own 1 dp (219,219,219) rules at 381.0
        and 430.0. The title is the capture's sentence, which this prototype may not reuse — it is
        content-paired, so the gate holds it to the run's centre (196.5, the card's own axis) and its
        vertical centre, and the copy above is the prototype's own.

        The two rules are one *device* pixel tall, not one dp. The reference draws them as Android's
        1-px divider: a single physical pixel in a 1080-wide capture, i.e. 0.364 dp. An app-side 1 dp
        rule rasterises to 2.75 px at the density the gate renders the page at, roughly three times the
        reference's weight, and - because each rule lands on the shared edge of a Button node whose box
        the gate measures ink over - that thickness is read as ink the row does not have. Measured on
        T5-discard: 1 dp rules put the two rows at 1.420 and 1.438 of the reference's own ink amount
        (band 0.90-1.15); one device pixel puts them inside it. `1 / PixelRatio.get()` is the same
        idiom the platform uses, so the rule is a device pixel on any screen rather than a number
        tuned to one capture.

        The two row labels are *not* rewritten: `Discard` and `Cancel` are control labels, the same
        class as `Post`, `Follow` and the composer's own `Cancel` key, and they are listed as the
        reference's structural vocabulary in spec/content-manifest.json. They are the reference's own
        red (224,1,13) and black respectively.

        The scrim is a translucent full-frame layer, not an opaque one — the capture's own value is
        60% black, which over the page's white reads (102,102,102), and that is what the raster shows
        everywhere the card does not cover. Translucency is also what keeps the screen behind it
        *there*: app_gate reads an opaque cover as hiding what is under it, while a scrim dims.
      */}
      {confirming ? (
        <View style={styles.scrim}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Throw this draft away?</Text>
            <View style={[styles.dialogRule, { top: 82.25 }]} />
            <Pressable accessibilityRole="button" accessibilityLabel="Discard" onPress={onClose} style={styles.dialogRow}>
              <Text style={styles.dialogDiscard}>Discard</Text>
            </Pressable>
            <View style={[styles.dialogRule, { top: 131.364 }]} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              onPress={() => setConfirming(false)}
              style={[styles.dialogRow, { top: 131.728 }]}
            >
              <Text style={styles.dialogCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
};

/**
 * The attachment row's own glyphs, at the capture's extents.
 *
 * T5_2 measures the row's ink at 21.8 dp for the camera-roll, GIF, sticker and overflow keys and
 * 19.3 x 21.5 dp for the music key, all in the secondary grey (ref ink 153 = colors.overflowInk),
 * not black. The two shared glyphs (ImageIcon, GifIcon) draw 19.1 of their 24-box units, so they
 * are rendered at size 27.5 to land on the same 21.9 dp extent; the four composer-only glyphs are
 * drawn to that extent directly.
 */
const AttachmentRow: React.FC<{ top: number }> = ({ top }) => (
  <View style={{ position: 'absolute', left: 0, top, width: frame.width, height: 48 }}>
    {[
      { left: 45.1, w: 40.4, h: 40.8, label: 'Add photos and videos from your camera roll', node: <ImageIcon size={27.5} color={colors.overflowInk} /> },
      { left: 85.5, w: 40.4, h: 40.8, label: 'Add a GIF', node: <GifIcon size={27.5} color={colors.overflowInk} /> },
      { left: 125.9, w: 40.4, h: 48.0, label: 'Add a sticker', node: <StickerIcon size={30} color={colors.overflowInk} /> },
      { left: 166.3, w: 40.4, h: 48.0, label: 'Add music to your posts', node: <MusicIcon size={26} color={colors.overflowInk} /> },
      { left: 206.7, w: 48.0, h: 48.0, label: 'See more options', node: <CircledMoreIcon size={24} color={colors.overflowInk} /> },
    ].map((k) => (
      <Pressable
        key={k.label}
        accessibilityRole="button"
        accessibilityLabel={k.label}
        style={[styles.attachKey, { left: k.left, width: k.w, height: k.h }]}
      >
        {k.node}
      </Pressable>
    ))}
  </View>
);

/**
 * The discard card's divider thickness: one *device* pixel, expressed in dp at the density the
 * reference capture was taken at (1080 px across a 393 dp frame, so 1 px = 393/1080 = 0.364 dp).
 *
 * Not a dp and not a number picked to land on a statistic: the reference draws these as Android's
 * 1-px divider, a single physical pixel, and this is that pixel in dp. Each divider sits on the
 * shared edge of a `Button` node whose box the gate measures ink over, so at an app-side 1 dp the
 * divider rasterises to 2.75 px at capture density and is read as ink the label does not have.
 */
const DEVICE_PX = 0.36;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
  segmentConnector: { position: 'absolute', left: space.avatarLeft + 23, width: connector.width, backgroundColor: colors.border, borderRadius: 1 },

  handleKey: { position: 'absolute', left: 60, width: 55.7, height: 48, justifyContent: 'center' },
  handle: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  chevronKey: { position: 'absolute', left: 96.8, top: 56.4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  audiencePlate: { position: 'absolute', left: 129.9, top: 56, width: 135.4, height: 48, justifyContent: 'center' },
  /* The run overflows its own key plate on purpose: the capture paints 'Community or topic' as ONE
     line starting at the plate's left edge (ink band 74.7-85.3), while the key box is only 135.4 dp
     wide - a flow child would wrap at the plate's width and drop its second line into the typed
     run's colour box below. Absolutely positioned and wider than the run, it stays one line. */
  audienceText: { position: 'absolute', left: 0, top: 15.3, width: 220, fontSize: type.body, lineHeight: 17.5, color: colors.secondary, fontFamily: 'ThreadsBody' },

  fieldBox: { position: 'absolute', left: 60, width: 316.9 },
  field: {
    position: 'absolute',
    left: 0,
    width: 316.9,
    padding: 0,
    paddingTop: 5.8,
    borderWidth: 0,
    fontSize: type.body,
    lineHeight: 18.3,
    color: colors.ink,
    fontFamily: 'ThreadsBody',
    backgroundColor: 'transparent',
    /* The browser paints its own focus ring around the focused field, and a ring is ink the
       reference's EditText never drew: it adds a dark rectangle to every box that touches the
       field, which the ink-amount band then reads as a heavier run. */
    outlineStyle: 'none',
  } as never,
  hint: { position: 'absolute', left: 0, top: 0, width: 83.7, height: 17.5, lineHeight: 17.5, fontSize: 14.3, color: colors.secondary, fontFamily: 'ThreadsBody' },

  chip: { position: 'absolute', width: 31, height: 18, borderRadius: 9, backgroundColor: colors.chip },
  /* Each digit's element reaches 40 dp down while its line stays on the reference's line: the gate
     reads the glyph box, the hit test reads the element box, and only the latter needs to clear the
     row description that spans the chip. */
  chipDigit: { position: 'absolute', height: 40, fontSize: 11.5, lineHeight: 14.2, color: colors.secondary, fontFamily: 'ThreadsNumbers' },

  mergedRun: { position: 'absolute', fontSize: 15, color: colors.page, fontFamily: 'ThreadsBody' },
  /* Width is the element's, not the run's: it is set wide enough that the description stays on one
     line, so the run the gate measures keeps the reference's own centre (see spec/gate.json's
     ref_box_anomalies entry for its width). */
  /* Offsets are the key's own: the run is nested in the audience key, whose box is (129.9, 56), so
     115.7 - 129.9 and 71.3 - 56 put it back on the reference's box. */
  audienceMergedRun: { left: -14.2, top: 15.3, width: 260, lineHeight: 17.5 },

  clearPlate: { position: 'absolute', left: 347.1, width: 45.9, height: 48, alignItems: 'center', justifyContent: 'center' },
  clearKey: { position: 'absolute', left: 17.9, top: 18.2, width: 12, height: 12, alignItems: 'center', justifyContent: 'center' },

  attachKey: { position: 'absolute', top: 0, alignItems: 'center', justifyContent: 'center', borderRadius: radius.media },
  addToThread: { position: 'absolute', left: 60, height: 17.5, justifyContent: 'center' },
  addToThreadText: { fontSize: 14.4, fontWeight: weight.soft, color: colors.secondary, fontFamily: 'ThreadsBody' },

  bottomBar: { position: 'absolute', left: 0, top: 442.9, width: frame.width, height: 56 },
  postOptions: { position: 'absolute', left: 44, top: 15.2, height: 17.5, justifyContent: 'center' },
  postOptionsText: { fontSize: type.body, fontWeight: weight.medium, color: colors.secondary, fontFamily: 'ThreadsBody' },
  countPicker: { position: 'absolute', left: 234.7, top: 0, width: 66.2, height: 48, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 },
  countThumb: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pickerGrey },
  postKey: { position: 'absolute', left: 316.7, top: 4, width: 64, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  postKeyText: { fontSize: type.body, fontWeight: weight.medium, fontFamily: 'ThreadsBody' },

  /* ---- the discard confirmation (T5/T5_deleted_real) ---- */
  scrim: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100 },
  dialogCard: { position: 'absolute', left: 81.511, top: 298.753, width: 229.978, height: 180.51, borderRadius: 14, backgroundColor: colors.dialog },
  /* The capture's node is 181.944 x 18.194 at (105.528, 330.775) - a box wider than the run it
     describes - so the run is drawn in a box of the card's own width and centred, which puts its
     centre on the card's axis (196.5) whatever the substituting copy measures, and its line top is
     carried as the offset the node's own centre implies. */
  dialogTitle: { position: 'absolute', left: 0, top: 32.022, width: 229.978, textAlign: 'center', fontSize: 15, lineHeight: 18.194, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  dialogRule: { position: 'absolute', left: 0, width: 229.978, height: DEVICE_PX, backgroundColor: 'rgb(219,219,219)' },
  dialogRow: { position: 'absolute', left: 0, top: 82.603, width: 229.978, height: 48.761, alignItems: 'center', justifyContent: 'center' },
  // The reference's red "Discard" carries no more ink than its own regular: the substitute face's
  // semibold sits ~50% over the reference's ink-amount band (see gate.json ink_amount_deviations),
  // but at regular (400) the red run lands at 1.08x - inside 0.90-1.15 - while the colour still
  // matches the reference's [224,1,13] to dist 0.0. Red alone carries the destructive-action emphasis,
  // so the heavier semibold is dropped rather than registered as a deviation (the band closes at 400).
  dialogDiscard: { fontSize: 15, fontWeight: weight.regular, color: colors.danger, fontFamily: 'ThreadsBody' },
  dialogCancel: { fontSize: 15, fontWeight: weight.regular, color: colors.ink, fontFamily: 'ThreadsBody' },
});
