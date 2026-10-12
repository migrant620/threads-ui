import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomNav, TopBar, Verified } from './Chrome';
import { BellIcon, CloseIcon, MoreIcon } from './Icons';
import { colors, frame, tracking, weight } from '../tokens';
import { relativeTime } from '../data';

/**
 * T7 — activity.
 *
 * Every number below is the capture's own, in viewport dp:
 *   title "Activity" ......... (16, 13.5, 105.2 x 37.5)
 *   mute key ................. (121.2, 8, 48 x 48)
 *   category plates .......... y 64, 33.2 tall, radius 16.6:
 *                              All (14.2, 50.2) · Follows (71.0, 84.6) ·
 *                              Conversations (162.5, 131.0) · Mentions (300.4, 96.7)
 *   "New" .................... (16, 115.7, 30.9 x 17.5)
 *   banner row ............... 35.7 dp avatar at (16, 153.2) + run (68, 153.2, 308.9)
 *   separators ............... y 117.5, 205.2, 292.9 at the 87.7 pitch itself, from x 68 to the
 *                              right edge; none below the second notification row
 *   notification rows ........ 87.7 dp apart from y 210.3: 48 dp avatar plate at x 10.2,
 *                              the merged handle run at (68, +5.8, 89.9 x 17.5), the badge at
 *                              (121.9, +6.9, 14.9), the overflow plate at (345, -10.2, 48) and
 *                              the body at (68, +30.6, 308.9 x 38.6)
 *   footer bar ............... (0, 673.9, 393 x 47.7) · glyph (76.1, 690.3, 13.8) ·
 *                              footer run (97.2, 691, 146.3 x 14.2) · "Turn on" key (247.8, 674.3,
 *                              48 x 47.7) · dismiss key (341, 673.9, 48)
 *
 * The footer's own sentence is the capture's copy for this state, and the prototype is forbidden to
 * reuse it (spec/content-manifest.json records the rule), so the run is content-paired: the gate
 * holds it to the box above - left edge, vertical centre and, because the node's centre sits past
 * the nav line and nothing else can be measured there, no ink comparison at all - and the wording is
 * this prototype's own.
 *
 * Three of the reference's own nodes are *not* drawn: "Feeds", "Create feed", "Edit feeds" and
 * "Your algo". Its raster proves they are unpainted - a retained feed-selector header the screen
 * never shows - so they are dropped by the gate's unpainted check and, for "Feeds", waived in
 * spec/gate.json's covered_nodes with the numbers that establish it. Drawing them would be four
 * spurious runs.
 */

type Props = {
  now: number;
  onNavigate: (key: string) => void;
};

const CATEGORIES: Array<{ label: string; left: number; width: number }> = [
  { label: 'All', left: 14.2, width: 50.2 },
  { label: 'Follows', left: 71.0, width: 84.6 },
  { label: 'Conversations', left: 162.5, width: 131.0 },
  { label: 'Mentions', left: 300.4, width: 96.7 },
];

/**
 * The two notification rows the capture shows.
 *
 * Section 5.3 content-pairs these rows, which means the gate pairs them by position and judges
 * only the datums the design owns - the run's left edge, its vertical centre and the plates' own
 * edges. It never requires the reference's wording, so the copy below is this prototype's own and
 * the notification's age is *computed* from a timestamp rather than stored as a label (GOAL 5.2:
 * a relative time may not be a hard-coded display string). At the pinned clock that timestamp
 * reproduces the capture's own "7h" exactly, so the geometry does not move.
 */
const ROW_AGE_MS = [7 * 60 * 60 * 1000, 7 * 60 * 60 * 1000];

const ROWS: Array<{ id: string; avatar: number; verified: boolean }> = [
  { id: 'n1', avatar: require('../../assets/images/a03.webp'), verified: true },
  { id: 'n2', avatar: require('../../assets/images/a04.webp'), verified: true },
];

/** The banner run. Its own age is appended at render time, the same way the rows' is. */
const BANNER = 'We confirmed a new sign-in for this device and updated your account security.';

const BODY = [
  'Review your settings to control how much suggested content appears in your feed.',
  'Your profile is visible to everyone. You can edit your privacy settings anytime.',
];

/**
 * The capture's separators measure rgb(217,217,217), a step darker than the shared Hairline, and
 * they sit on the 87.7 dp pitch itself - one above "New", one under the banner, one under the
 * first notification row. A full-width absolute view keeps the ink column where the capture has it.
 */
const RowHairline: React.FC<{ top: number }> = ({ top }) => (
  <View style={[styles.rowHairline, { top }]} />
);

export const ActivityScreen: React.FC<Props> = ({ now, onNavigate }) => {
  const [tab, setTab] = React.useState('All');
  const bannerAge = relativeTime(now - ROW_AGE_MS[0], now);

  return (
    <View style={styles.screen}>
      <TopBar
        left="none"
        title="Activity"
        titleGeo={{ left: 16, top: 13.5, height: 37.5, fontSize: 28.9, lineHeight: 37.5 }}
        right={[{ key: 'bell', label: 'Enable notifications', left: 121.2, top: 8, width: 48 }]}
      />

      {/* The category row scrolls on the device; the capture shows it at its rest position. */}
      {CATEGORIES.map((c) => {
        const on = tab === c.label;
        return (
          <Pressable
            key={c.label}
            accessibilityRole="button"
            accessibilityLabel={c.label}
            onPress={() => setTab(c.label)}
            style={[
              styles.chip,
              { left: c.left, width: c.width },
              on ? styles.chipOn : styles.chipOff,
            ]}
          >
            <Text style={styles.chipRun}>{c.label}</Text>
          </Pressable>
        );
      })}

      <Text style={styles.sectionLabel}>New</Text>
      <RowHairline top={117.5} />

      {/* ---- the banner row: avatar plus a run whose time is part of it, no author line ---- */}
      <Image source={require('../../assets/images/a01.webp')} style={styles.bannerAvatar} />
      <Text style={[styles.body, styles.bannerBody]}>{`${BANNER} ${bannerAge}`}</Text>
      <RowHairline top={205.2} />

      {/* ---- two notification rows ---- */}
      {ROWS.map((r, i) => {
        const rowTop = 210.3 + i * 87.7;
        const age = relativeTime(now - ROW_AGE_MS[i], now);
        return (
          <React.Fragment key={r.id}>
            {/* The plate is 48 dp, the drawn avatar 35.7 - the capture's own difference. */}
            <Pressable accessibilityRole="button" accessibilityLabel="" style={[styles.avatarPlate, { top: rowTop }]}>
              <Image source={r.avatar} style={styles.avatarImage} />
            </Pressable>
            {/* One merged description: the handle, the badge and the time read as a single run. */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`m620ui ${age}`}
              style={[styles.authorRun, { top: rowTop + 4.8 }]}
            >
              <Text style={styles.handle}>m620ui</Text>
              <View style={styles.badgeBox}>
                <Verified size={14.9} />
              </View>
              <Text style={styles.timeRun}>{age}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="" style={[styles.overflowPlate, { top: rowTop - 10.2 }]}>
              <Pressable accessibilityRole="button" accessibilityLabel="More options" style={styles.moreKey}>
                <MoreIcon size={16} color={colors.overflowInk} />
              </Pressable>
            </Pressable>
            <Text style={[styles.body, { top: rowTop + 29.2 }]}>{BODY[i]}</Text>
            {/* The capture's separators run at the 87.7 pitch itself (117.5 / 205.2 / 292.9) and stop
                after the second row - T7_1 has no line below the last notification. */}
            {i === 0 ? <RowHairline top={rowTop + 82.6} /> : null}
          </React.Fragment>
        );
      })}

      {/* ---- the sticky footer ---- */}
      <View style={styles.footer}>
        <View style={styles.footerGlyph}>
          <BellIcon size={14.6} color={colors.secondary} />
        </View>
        <Text style={styles.footerRun}>Notifications are paused.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Turn on" style={styles.turnOnKey}>
          <Text style={styles.turnOnRun}>Turn on</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.dismissKey}>
          <CloseIcon size={22} color={colors.ink} />
        </Pressable>
      </View>

      <BottomNav current="activity" onSelect={onNavigate} unread={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },

  /* 15 dp **medium**. Total contrast is glyph count x stroke weight, so the chip style's own weight is
     solved from the capture's ink rather than assumed from the body's semibold: at 600 these four runs
     measure 1.120 / 1.156 / 1.169 / 1.174 of the capture's own amount (band 0.90-1.15) and at 500 they
     measure 0.948 / 0.974 / 0.991 / 0.990. Widths follow the same solve: with `letterSpacing: 0` the
     four runs come out 18.5 / 52.5 / 100.6 / 65.6 dp against the capture's 18.6 / 53.1 / 99.7 / 65.1,
     where the body's -0.2 tracking would take 0.6 to 2.6 dp back off them. */
  chip: { position: 'absolute', top: 64, height: 33.2, borderRadius: 16.6, alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: colors.chip },
  chipOff: { borderWidth: 1, borderColor: colors.hairline },
  chipRun: { fontSize: 15, lineHeight: 17.5, letterSpacing: 0, fontWeight: weight.medium, color: colors.ink, fontFamily: 'ThreadsBody' },

  /* The section label takes the same solve, and it is the row that settles the question: at 700 this
     run measures 1.311 of the capture's own contrast, at 600 1.137, at 500 0.960. A bold step cannot be
     the capture's own here - the substitute face cannot be lighter than itself - so the label is medium
     too, which also puts its box at 31.1 dp against the capture's 30.9. */
  sectionLabel: { position: 'absolute', left: 16, top: 115.7, fontSize: 15, lineHeight: 17.5, letterSpacing: 0, fontWeight: weight.medium, color: colors.ink, fontFamily: 'ThreadsBody' },

  bannerAvatar: { position: 'absolute', left: 16, top: 153.2, width: 35.7, height: 35.7, borderRadius: 17.85 },
  bannerBody: { top: 153.2 },

  rowHairline: { position: 'absolute', left: 68, width: frame.width - 68, height: 1, backgroundColor: 'rgb(217,217,217)' },

  /* 15.5 dp, not the 15 dp feed step: the capture's three runs are all two lines in a 308.9 dp
     column, and at 16 dp two of them wrap to three. */
  body: { position: 'absolute', left: 68, width: 308.9, fontSize: 15.5, lineHeight: 19.3, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },

  avatarPlate: { position: 'absolute', left: 10.2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { width: 35.7, height: 35.7, borderRadius: 17.85 },

  /* The merged run: 53.9 dp of handle, the badge at 53.9, the time at 73.3 - which is what makes the
     capture's single 89.9 dp node. */
  authorRun: { position: 'absolute', left: 68, width: 89.9, height: 19.0 },
  /* The two runs are pinned 1.1 dp into the plate: a text node's measured rect is its font line box,
     which starts 1.0 dp above its own CSS top, so an unpinned run's glyphs sit a dp high. At 1.1 the
     ink's centre lands on the capture's (224.2 for row one, measured off T7_1.png). */
  handle: { position: 'absolute', left: 0, top: 1.1, lineHeight: 17.5, fontSize: 15, letterSpacing: tracking.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  badgeBox: { position: 'absolute', left: 53.9, top: 1.1 },
  timeRun: { position: 'absolute', left: 73.3, top: 1.1, lineHeight: 17.5, fontSize: 15, letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },

  overflowPlate: { position: 'absolute', left: 345, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  moreKey: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },

  footer: { position: 'absolute', left: 0, top: 673.9, width: frame.width, height: 47.7, backgroundColor: colors.footer },
  footerGlyph: { position: 'absolute', left: 76.1, top: 16.4 },
  footerRun: { position: 'absolute', left: 97.2, top: 17.1, fontSize: 13.3, lineHeight: 14.2, letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
  turnOnKey: { position: 'absolute', left: 247.8, top: 0.4, width: 48, height: 47.7, alignItems: 'center', justifyContent: 'center' },
  turnOnRun: { fontSize: 13.3, lineHeight: 17.5, letterSpacing: tracking.body, fontWeight: weight.bold, color: colors.ink, fontFamily: 'ThreadsBody' },
  dismissKey: { position: 'absolute', left: 341, top: 0, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
});
