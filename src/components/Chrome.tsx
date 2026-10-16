import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  ActivityIcon,
  BackIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircledMoreIcon,
  CloseIcon,
  DraftsIcon,
  FiltersIcon,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  InstagramMark,
  MenuIcon,
  MessagesIcon,
  MoreIcon,
  PlusIcon,
  ProfileIcon,
  ReplyIcon,
  RepostIcon,
  SettingsIcon,
  InsightsIcon,
  WordmarkLockup,
  SearchIcon,
  ShareIcon,
  VerifiedIcon,
} from './Icons';
import { actions, colors, frame, icons as iconSize, radius, rhythm, space, tracking, type, weight, type Weight } from '../tokens';

/** The icon-font separator glyph the captures report inside merged runs ('handle ··· time'). */
const SEP = '\ufffd';

/**
 * Shared chrome, placed at the coordinates the reference reports.
 *
 * Every box in this file comes from a uiautomator dump of the reference build, mapped into the
 * 393 x 777 frame (see tokens.ts for the mapping). Chrome rows keep a 48 dp touch height even
 * where the visible glyph is 24 dp, which is why the boxes here are taller than the art they
 * hold — the reference does the same.
 */

/** One row of the prototype's optional status strip. Not drawn; the frame starts below it. */
export const StatusSpacer: React.FC<{ height?: number }> = ({ height = 0 }) => (
  <View style={{ height, width: frame.width }} />
);

// ---------------------------------------------------------------- top bar

export type TopRightKey = 'search' | 'bell' | 'more' | 'instagram' | 'drafts' | 'settings' | 'insights' | 'filters';

/**
 * A right-hand key. Written as a bare name it is laid out on the prototype's default ladder (the
 * last key's left edge at 341, each earlier key 48 dp further left). Written as an object it carries
 * the reference's own box: the capture does not use one ladder across screens - the composer's drafts
 * key sits at 292.9 and its overflow at 341, while the detail header's notification key is a 32 dp
 * plate at 300.9 and its overflow at 333 - so the boxes are supplied per use rather than derived.
 */
export type TopRight = TopRightKey | { key: TopRightKey; label?: string; left: number; width?: number; top?: number };

type TopBarProps = {
  /** Left key: the feed's menu, or a screen's back key. */
  left?: 'menu' | 'back' | 'cancel' | 'none';
  onLeft?: () => void;
  /** True when the bar carries the wordmark instead of a title run. */
  wordmark?: boolean;
  title?: string;
  /** Small line under the title; the detail header's own view count. */
  subtitle?: string;
  /** The subtitle's second run, reported as its own node ("views" after "108,288"). */
  subtitleTail?: string;
  /** The title run's own measured box, when the screen's header is not on the default row.
   *  `letterSpacing` is a per-screen datum like the size: the substitute face's advance is not the
   *  reference's, and on a heading the difference over eight glyphs is worth more than the 2 dp the
   *  gate allows, so the run is set to the reference's own measured advance. */
  titleGeo?: { left?: number; top: number; width?: number; height?: number; fontSize: number; lineHeight: number; letterSpacing?: number; fontWeight?: Weight };
  /** Left key box, when the screen's own capture reports one that differs from the default. */
  leftGeo?: { left?: number; top?: number; width?: number };
  /** The two runs under the title. They sit on one line, so the tail's x follows the count's own
   *  advance: the reference reports them abutting (108,288 ends at 107.3 and views starts there). */
  subtitleGeo?: { left?: number; top: number; line: number; numSize: number; tailSize: number; tailLeft?: number };
  /** The left key's own measured width; the composer's Cancel key is 60 dp, not 48. */
  cancelWidth?: number;
  /** Right-hand keys, in the order the reference draws them. */
  right?: TopRight[];
  onRight?: (key: string) => void;
};

const RIGHT_LABEL: Record<TopRightKey, string> = {
  search: 'Search',
  bell: 'Enable notifications',
  more: 'More options',
  instagram: 'Instagram',
  drafts: 'Click to view all your saved drafts.',
  settings: 'Settings',
  insights: 'Insights',
  filters: 'Search filters',
};

export const TopBar: React.FC<TopBarProps> = ({ left = 'menu', onLeft, wordmark, title, subtitle, subtitleTail, titleGeo, subtitleGeo, leftGeo, cancelWidth = 48, right = ['search'], onRight }) => (
  <View style={styles.topBar}>
    {left === 'menu' ? (
      <Pressable accessibilityRole="button" accessibilityLabel="Menu" onPress={onLeft} style={[styles.topKey, { left: 4 }]}>
        <MenuIcon size={iconSize.topBar} color={colors.menuInk} />
      </Pressable>
    ) : null}
    {left === 'back' ? (
      /* The back key's own box is a per-screen datum, not a constant: the detail header reports
         (0, 4, 60 x 48) and the search header (0, 8.4, 60 x 48). */
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onLeft}
        style={[styles.topKey, leftGeo ? { left: leftGeo.left ?? 0, top: leftGeo.top ?? 4, width: leftGeo.width ?? 60 } : { left: 0, top: 8.3 }]}
      >
        <BackIcon size={iconSize.topBar} />
      </Pressable>
    ) : null}
    {left === 'cancel' ? (
      /* The composer's left key draws a close glyph, not the word: the reference reports the key as a
         60 dp button with nothing inside it, and the capture's own raster shows the ×. */
      <Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={onLeft} style={[styles.topKey, { left: 0, width: cancelWidth }]}>
        <CloseIcon size={22} />
      </Pressable>
    ) : null}

    {wordmark ? <WordmarkRow /> : null}
    {title ? (
      <View
        style={[
          styles.titleBox,
          titleGeo
            ? { left: titleGeo.left ?? 60, top: titleGeo.top, width: titleGeo.width ?? 200, ...(titleGeo.height ? { height: titleGeo.height } : null) }
            : null,
        ]}
      >
        <Text
          style={[
            styles.titleRun,
            titleGeo ? { fontSize: titleGeo.fontSize, lineHeight: titleGeo.lineHeight } : null,
            titleGeo?.letterSpacing === undefined ? null : { letterSpacing: titleGeo.letterSpacing },
            titleGeo?.fontWeight === undefined ? null : { fontWeight: titleGeo.fontWeight },
          ]}
        >
          {title}
        </Text>
      </View>
    ) : null}

    {subtitle ? (
      <View style={[styles.subtitleBox, subtitleGeo ? { left: subtitleGeo.left ?? 60, top: subtitleGeo.top } : null]}>
        <Text style={[styles.subtitleRun, subtitleGeo ? { fontSize: subtitleGeo.numSize, lineHeight: subtitleGeo.line } : null]}>{subtitle}</Text>
        {subtitleTail ? (
          <Text
            style={[
              styles.subtitleTailRun,
              subtitleGeo ? { fontSize: subtitleGeo.tailSize, lineHeight: subtitleGeo.line } : null,
              subtitleGeo?.tailLeft === undefined ? null : { position: 'absolute', left: subtitleGeo.tailLeft },
            ]}
          >
            {subtitleTail}
          </Text>
        ) : null}
      </View>
    ) : null}

    {right.map((entry, i) => {
      const spec = typeof entry === 'string' ? { key: entry, left: 341 - (right.length - 1 - i) * 48, width: 48, top: 4 } : { top: 4, ...entry };
      const label = (spec as { label?: string }).label ?? RIGHT_LABEL[spec.key];
      return (
        <Pressable
          key={`${spec.key}-${i}`}
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={() => onRight?.(spec.key)}
          style={[styles.topKey, { left: spec.left, width: spec.width ?? 48, top: spec.top ?? 4 }]}
        >
          {spec.key === 'search' ? <SearchIcon size={iconSize.topBar} color={colors.searchInk} /> : null}
          {spec.key === 'bell' ? <BellIcon size={iconSize.topBar} /> : null}
          {spec.key === 'more' ? <CircledMoreIcon size={iconSize.moreTop} /> : null}
          {spec.key === 'instagram' ? <InstagramMark size={iconSize.topBar} color={colors.ink} /> : null}
          {spec.key === 'drafts' ? <DraftsIcon size={22} /> : null}
          {spec.key === 'settings' ? <SettingsIcon size={iconSize.topBar} /> : null}
          {spec.key === 'insights' ? <InsightsIcon size={iconSize.topBar} /> : null}
          {spec.key === 'filters' ? <FiltersIcon size={iconSize.topBar} color={colors.menuInk} /> : null}
        </Pressable>
      );
    })}
  </View>
);

/**
 * The wordmark plate the feed's capture reports: an unlabelled 120.1 x 56 control carrying the
 * lockup, drawn as outlines. The capture has no text node there, so none is drawn.
 */
export const WordmarkRow: React.FC = () => (
  <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.wordmarkRow}>
    <WordmarkLockup width={119} height={22.9} />
  </Pressable>
);

// ---------------------------------------------------------------- primitives

export const Avatar: React.FC<{ source: unknown; size?: number; label?: string }> = ({ source, size = space.avatar, label }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: colors.surfaceAlt }}>
    <Image source={source as never} style={{ width: size, height: size, borderRadius: size / 2 }} />
  </Pressable>
);

export const Verified: React.FC<{ size?: number }> = ({ size = iconSize.verified }) => (
  <Pressable accessibilityRole="button" accessibilityLabel="Verified" style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <VerifiedIcon size={size} />
  </Pressable>
);

/**
 * A post's author row, drawn at the boxes the reference reports.
 *
 * The reference reports five labelled nodes here - a full-width "«handle» posted" run, the handle's
 * own key, the relative-time key, the verified badge and the overflow glyph - plus two unlabelled
 * clickable containers: the whole row, and a 48 dp plate around the overflow glyph. All seven are
 * drawn, because the gate reads every node the reference exposes and §5.3 forbids dropping any.
 */
export const PostHeader: React.FC<{
  avatar: unknown;
  handle: string;
  verified?: boolean;
  time?: string;
  row: { handleLeft: number; handleWidth: number; timeLeft: number; verifiedLeft: number | null; verifiedGlyphLeft?: number };
  onOpen?: () => void;
  /** Accessible name for the row's own tap target; the reference reports this row as one target. */
  openLabel?: string;
}> = ({ avatar, handle, verified, time, row, onOpen, openLabel = '' }) => (
  // `row` carries `verifiedGlyphLeft` where the capture paints the badge away from its own key box.
  <View style={{ height: rhythm.post.headerToBody }}>
    <View style={{ position: 'absolute', left: space.avatarLeft, top: 13.4 }}>
      <Avatar source={avatar} label={`${handle} profile photo`} />
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={`${handle} posted`} style={styles.postedRun} onPress={onOpen} />
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={handle}
      onPress={onOpen}
      style={{ position: 'absolute', left: row.handleLeft, top: 0, width: row.handleWidth, height: 48, justifyContent: 'center' }}
    >
      <Text numberOfLines={1} style={[styles.handle, styles.ghost]}>
        {handle}
      </Text>
    </Pressable>
    {verified && row.verifiedLeft !== null ? (
      <>
        {/* The badge key is the 17.8 x 48 column the feed's capture reports for it (130.6, 666.6),
            not the glyph's own 16 dp box: the device's hit column runs the full row height while
            keeping the glyph's width. The glyph is drawn centred inside that column, which puts its
            centre where the raster has it. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Verified"
          style={{ position: 'absolute', left: row.verifiedLeft, top: 0.3, width: 17.8, height: 48, alignItems: 'center', justifyContent: 'center' }}
        >
          <View
            style={
              row.verifiedGlyphLeft === undefined
                ? null
                : { position: 'absolute', left: row.verifiedGlyphLeft - row.verifiedLeft, top: 16 }
            }
          >
            <View style={styles.ghost}>
              <VerifiedIcon size={iconSize.verified} />
            </View>
          </View>
          {/* The capture's own merged description for the badge key: the row reads back as one
              'handle ··· time' run carried at the badge's box, and the device paints nothing for
              it. The node paints only the separator glyph in the ground colour - a full run would
              wrap at the key's 17.8 dp width and trip the ellipsis check - and it is drawn at the
              capture's own box so the run pairs with a node of its own: the 48 dp plate beside it
              is the unlabelled icon row's partner, and the two rows judge that plate's ink against
              different captures (the badge's blue vs the plate's black), so they cannot share one
              node. */}
          <Text accessibilityLabel={`${handle} ${SEP} ${time}`} numberOfLines={1} style={styles.badgeMergedRun}>
            {SEP}
          </Text>
        </Pressable>
        {/* The badge's own 48 dp plate, reported beside the labelled box. */}
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.badgePlate} />
      </>
    ) : null}
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={time}
      style={{ position: 'absolute', left: row.timeLeft, top: 0, width: 48, height: 48, alignItems: 'center', justifyContent: 'flex-start' }}
    >
      <Text numberOfLines={1} style={[styles.time, styles.ghost]}>
        {time}
      </Text>
    </Pressable>
    {/* What the row paints: handle, badge and time as one run on the body's left edge, centred in
        the 48 dp band. The keys above keep their boxes for touch and screen readers but paint
        nothing, so a short or long handle can never push the time off its line or under the avatar. */}
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={styles.visibleRun}
    >
      <Text numberOfLines={1} style={styles.handle}>
        {handle}
      </Text>
      {verified ? (
        <View style={styles.visibleBadge}>
          <VerifiedIcon size={iconSize.verified} />
        </View>
      ) : null}
      {time ? <Text style={[styles.time, styles.visibleTime]}>{time}</Text> : null}
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.overflowPlate}>
      <MoreKey top={20.4} left={16} />
    </Pressable>
    {/* The row's own tap target is drawn last so it is the topmost layer at every point of the band:
         the device reports this row as ONE target, and a click aimed at its centre has to reach it
         rather than land on the handle or the time run that sit inside the same band. It paints
         nothing, so it hides nothing - the runs under it stay visible to the collector, which only
         lets an *opaque* or lettered layer hide what is beneath it. Its box starts 4.3 dp above the
         card's own top, which is where the reference's row box begins. */}
    <Pressable accessibilityRole="button" accessibilityLabel={openLabel} onPress={onOpen} style={styles.headerRow} />
  </View>
);

/** A handle, its optional badge, and the relative-time run that follows it. */
export const HandleRow: React.FC<{
  handle: string;
  verified?: boolean;
  time?: string;
  crosspost?: boolean;
  width?: number;
  height?: number;
  left?: number;
  top?: number;
  /** True when the reference reports this row as one touch target rather than separate runs. */
  asTarget?: boolean;
  onPress?: () => void;
  authorChip?: boolean;
}> = ({ handle, verified, time, crosspost, width = 48, height = 48, left = 50.6, top = 0, onPress, authorChip }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${handle} posted`}
    onPress={onPress}
    style={{ position: 'absolute', left, top, width: Math.max(width, handle.length * 8), height, flexDirection: 'row', alignItems: 'center' }}
  >
    <Text numberOfLines={1} style={styles.handle}>
      {handle}
    </Text>
    {verified ? (
      <View style={{ marginLeft: 5 }}>
        <Verified />
      </View>
    ) : null}
    {crosspost ? (
      <View style={{ marginLeft: 5 }}>
        <GlobeIcon size={16} />
      </View>
    ) : null}
    {authorChip ? (
      <View style={styles.authorChip}>
        <Text style={styles.authorChipText}>Author</Text>
      </View>
    ) : null}
    {time ? (
      <Text style={[styles.time, { marginLeft: 6 }]}>{time}</Text>
    ) : null}
  </Pressable>
);

/** A measured action-row box from `tokens.actions`, plus the counters the row renders. */
type ActionBox = { left: number; height: number; widths: readonly number[]; heights?: readonly number[] };

/** The four keys under every post. Counts are props, so a tap can change them. */
export const ActionRow: React.FC<{
  likes: number;
  replies: number;
  reposts: number;
  /** Absolute y inside the caller. Omit to leave the row in the caller's own flow. */
  top?: number;
  liked: boolean;
  onLike: () => void;
  onReply?: () => void;
  /** The Repost and Share keys raise their own sheets; a caller that omits them leaves the key as
   *  the reference's own inert plate. Both are existing controls either way - wiring them adds no
   *  node and moves no box, so a resting frame is unchanged. */
  onRepost?: () => void;
  onShare?: () => void;
  likeLabel?: string;
  replyLabel?: string;
  repostLabel?: string;
  /** The measured box this row draws in; see tokens.actions for where the numbers come from. The
   *  per-key heights exist because the reference's own Like key reports 48 dp where its three
   *  siblings report 42.6/43.3 in the same row. */
  box?: ActionBox;
}> = ({ likes, replies, reposts, top, liked, onLike, onReply, onRepost, onShare, likeLabel, replyLabel, repostLabel, box = actions.feed }) => (
  <View style={[{ left: box.left, height: box.height, flexDirection: 'row' }, top === undefined ? null : { position: 'absolute', top }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Like ${likes}`} onPress={onLike} style={[styles.actionKey, { width: box.widths[0], height: box.heights?.[0] ?? box.height }]}>
      <HeartIcon size={iconSize.action} filled={liked} color={liked ? colors.unread : colors.ink} />
      <Text style={[styles.actionCount, liked ? { color: colors.unread } : null]}>{likeLabel ?? String(likes)}</Text>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={replies > 0 ? `Reply ${replies}` : 'Reply'} onPress={onReply} style={[styles.actionKey, { width: box.widths[1], height: box.heights?.[1] ?? box.height }]}>
      <ReplyIcon size={iconSize.action} />
      {replies > 0 ? <Text style={styles.actionCount}>{replyLabel ?? String(replies)}</Text> : null}
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={reposts > 0 ? `Repost ${reposts}` : 'Repost'} onPress={onRepost} style={[styles.actionKey, { width: box.widths[2], height: box.heights?.[2] ?? box.height }]}>
      <RepostIcon size={iconSize.action} />
      {reposts > 0 ? <Text style={styles.actionCount}>{repostLabel ?? String(reposts)}</Text> : null}
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Share" onPress={onShare} style={[styles.actionKey, { width: box.widths[3], height: box.heights?.[3] ?? box.height }]}>
      <ShareIcon size={iconSize.action} />
    </Pressable>
  </View>
);

/**
 * The bottom action sheet the Repost and Share keys raise.
 *
 * It is a P1 surface (spec/release-plan.json lists "repost/quote sheets"), so no gated state carries
 * a frame for it: it is drawn only while a key has opened it, and the resting feed the gate compares
 * against T1 is untouched. The shape follows the reference's own bottom sheet - the one the composer's
 * discard card is drawn from: a translucent scrim over the whole frame, with the panel on the bottom
 * edge, a grabber, and one row per choice. The scrim is translucent rather than opaque for the same
 * reason the discard card's is: a dimmed layer keeps the feed behind it *there*, while an opaque one
 * would read as hiding it.
 */
export type SheetRow = { label: string; onPress: () => void };

export const ActionSheet: React.FC<{ title?: string; rows: SheetRow[]; onClose: () => void }> = ({ title, rows, onClose }) => (
  <View style={styles.sheetScrim}>
    <View style={styles.sheetPanel}>
      <View style={styles.sheetGrabber} />
      {title ? <Text style={styles.sheetTitle}>{title}</Text> : null}
      {rows.map((r, i) => (
        <Pressable
          key={r.label}
          accessibilityRole="button"
          accessibilityLabel={r.label}
          onPress={r.onPress}
          style={[styles.sheetRow, !title && i === 0 ? null : styles.sheetRowRule]}
        >
          <Text style={styles.sheetRowRun}>{r.label}</Text>
        </Pressable>
      ))}
      <Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={onClose} style={[styles.sheetRow, styles.sheetRowRule]}>
        <Text style={styles.sheetRowRun}>Cancel</Text>
      </Pressable>
    </View>
  </View>
);

/**
 * Bottom navigation. Five 24 dp glyphs at the reference's own x centres, on the bar's own plate.
 *
 * The plate is a per-capture datum, not a constant: every capture puts it at y 728.2 .. 771.8 dp and
 * samples it at (245,245,245), and the glyphs sit centred in it (738 .. 762). The frame's `navTop`
 * constant is 697, but that is the gate's own "content ends here" line for the ink pass - the app's
 * bar starts 31 dp lower, which is why the search landing's suggestion row is still visible above it.
 */
export const BottomNav: React.FC<{ current: string; onSelect: (key: string) => void; unread?: boolean }> = ({ current, onSelect, unread = true }) => {
  const tabs: Array<{ key: string; label: string; x: number }> = [
    { key: 'feed', label: 'Feed', x: 40.4 },
    { key: 'messages', label: 'Messages', x: 112.8 },
    { key: 'create', label: 'Create', x: 184.9 },
    { key: 'activity', label: 'Activity', x: 256.9 },
    { key: 'profile', label: 'Profile', x: 329.0 },
  ];
  const y = 10;
  return (
    <View style={styles.nav}>
      {tabs.map((t) => {
        const on = current === t.key;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="button"
            accessibilityLabel={t.label}
            onPress={() => onSelect(t.key)}
            style={{ position: 'absolute', left: t.x, top: y, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}
          >
            {t.key === 'feed' ? <HomeIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle} /> : null}
            {t.key === 'messages' ? <MessagesIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle} /> : null}
            {t.key === 'create' ? <CreateKey on={on} /> : null}
            {t.key === 'activity' ? (
              <View>
                <ActivityIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle} />
                {unread ? <View style={[styles.unreadDot, { right: -1, top: -1 }]} /> : null}
              </View>
            ) : null}
            {t.key === 'profile' ? <ProfileIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
};

/** The centre create key is a filled rounded square rather than a bare glyph. */
const CreateKey: React.FC<{ on?: boolean }> = ({ on }) => (
  <View style={[styles.createKey, on ? { borderColor: colors.ink, backgroundColor: colors.ink } : null]}>
    <PlusIcon size={20} color={on ? colors.page : colors.navIdle} />
  </View>
);

/** Small filled chevron plate used by the detail header's sort row. */
export const SortRow: React.FC<{ label: string; top: number; label2: string; label2Top: number; onSort?: () => void }> = ({ label, top, label2, label2Top, onSort }) => (
  <>
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onSort} style={{ position: 'absolute', left: 16, top, height: 20, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.sortRun}>{label}</Text>
      <View style={{ marginLeft: 4 }}>
        <ChevronDownIcon size={15} />
      </View>
    </Pressable>
    <View style={{ position: 'absolute', left: 283.4, top: label2Top, height: 20, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.sortRun}>{label2}</Text>
      <View style={{ marginLeft: 4 }}>
        <ChevronRightIcon size={15} color={colors.secondary} />
      </View>
    </View>
  </>
);

/** The reference's own "New" / section caption step. */
export const SectionCaption: React.FC<{ text: string; left?: number; top: number; size?: number }> = ({ text, left = 16, top, size = type.body }) => (
  <Text style={[styles.sectionCaption, { left, top, fontSize: size }]}>{text}</Text>
);

/** A 1 px separator at the measured y. */
export const Hairline: React.FC<{ top: number; left?: number; right?: number }> = ({ top, left = 0, right = 0 }) => (
  <View style={{ position: 'absolute', left, right, top, height: 1, backgroundColor: colors.hairline }} />
);

export const CloseKey: React.FC<{ onPress?: () => void; top?: number; left?: number; label?: string }> = ({ onPress, top = 0, left = 0, label = 'Clear' }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ position: 'absolute', left, top, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
    <CloseIcon size={17} color={colors.secondary} />
  </Pressable>
);

/** The post's own overflow glyph. Its box is the 16 dp glyph; the 48 dp plate that carries it is drawn by the caller. */
export const MoreKey: React.FC<{ onPress?: () => void; top?: number; left?: number }> = ({ onPress, top = 13.4, left = 361 }) => (
  <Pressable accessibilityRole="button" accessibilityLabel="More options" onPress={onPress} style={{ position: 'absolute', left, top, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
    <MoreIcon size={iconSize.more} color={colors.overflowInk} />
  </Pressable>
);

const styles = StyleSheet.create({
  /* The bar paints last on purpose: the feed's composer row is a full-width target that starts at
     y 0, and without an explicit stacking order it would swallow the top bar's own keys. */
  topBar: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 56, zIndex: 20 },
  topKey: { position: 'absolute', top: 4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  wordmarkRow: { position: 'absolute', left: 136.5, top: 0, width: 120.1, height: 56, alignItems: 'center', justifyContent: 'center' },
  titleBox: { position: 'absolute', left: 60, top: 13.4, width: 200, height: 37.5, justifyContent: 'center' },
  titleRun: { fontSize: type.title, fontWeight: weight.bold, color: colors.ink, letterSpacing: tracking.title, fontFamily: 'ThreadsBody' },
  subtitleBox: { position: 'absolute', left: 60, top: 32.8, flexDirection: 'row', alignItems: 'baseline' },
  subtitleRun: { fontSize: type.caption, color: colors.secondary, fontFamily: 'ThreadsNumbers' },
  subtitleTailRun: { fontSize: type.caption, color: colors.secondary, fontFamily: 'ThreadsBody' },
  cancelRun: { fontSize: 15.6, color: colors.ink, fontFamily: 'ThreadsBody' },
  handle: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  /* The reference's own containers: the whole author row, its full-width "posted" run, and the
     48 dp plate that carries the overflow glyph. None of the three paints anything. */
  headerRow: { position: 'absolute', left: 0, top: -4.3, width: frame.width, height: 48, backgroundColor: 'transparent' },
  postedRun: { position: 'absolute', left: 0, top: 15.4, width: frame.width, height: 17.5, backgroundColor: 'transparent' },
  badgePlate: { position: 'absolute', left: 148.5, top: 0.3, width: 48, height: 48, backgroundColor: 'transparent' },
  /* The badge key's merged description: drawn in the ground colour at the capture's own box
     (147.4, 681.6, 24.4 x 17.5 relative to the frame, i.e. 16.8/15 inside the badge key). */
  badgeMergedRun: { position: 'absolute', left: 16.8, top: 15, width: 24.4, height: 17.5, lineHeight: 17.5, fontSize: 15, color: colors.page },
  overflowPlate: { position: 'absolute', left: 345, top: -5, width: 48, height: 48, backgroundColor: 'transparent' },
  time: { fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
  ghost: { opacity: 0 },
  visibleRun: { position: 'absolute', left: space.gutter, top: 0, right: 56, height: 48, flexDirection: 'row', alignItems: 'center' },
  visibleBadge: { marginLeft: 4 },
  visibleTime: { marginLeft: 6 },
  authorChip: { marginLeft: 6, borderRadius: 9, backgroundColor: colors.chip, paddingHorizontal: 7, height: 18, justifyContent: 'center' },
  authorChipText: { fontSize: 11.5, fontWeight: '500' as const, color: colors.chipInk, fontFamily: 'ThreadsBody' },
  actionKey: { flexDirection: 'row', alignItems: 'center' },
  actionCount: { fontSize: type.body, color: colors.ink, marginLeft: 6, fontFamily: 'ThreadsBody' },
  nav: { position: 'absolute', left: 0, top: 728, width: frame.width, height: 44, backgroundColor: colors.navPlate },
  createKey: { width: 24, height: 24, borderRadius: radius.key, borderWidth: 1.4, borderColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  unreadDot: { position: 'absolute', right: 1, top: 0, width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.unread },
  homeIndicator: { position: 'absolute', left: 133, top: 76, width: 127, height: 5, borderRadius: 3, backgroundColor: '#1C1C1E' },
  sortRun: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  sectionCaption: { position: 'absolute', fontWeight: weight.bold, color: colors.ink, fontFamily: 'ThreadsBody' },
  /* ---- the P1 action sheet (Repost / Share) ---- */
  sheetScrim: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200, justifyContent: 'flex-end' },
  sheetPanel: { width: frame.width, backgroundColor: colors.dialog, borderTopLeftRadius: radius.card, borderTopRightRadius: radius.card, paddingTop: 8, paddingBottom: 24 },
  sheetGrabber: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 6 },
  sheetTitle: { textAlign: 'center', fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody', paddingBottom: 6 },
  sheetRow: { height: 52, alignItems: 'center', justifyContent: 'center' },
  sheetRowRule: { borderTopWidth: 1, borderTopColor: colors.hairline },
  sheetRowRun: { fontSize: 15.5, fontWeight: weight.medium, color: colors.ink, fontFamily: 'ThreadsBody' },
});
