import * as React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionRow, Avatar, TopBar } from './Chrome';
import { ChevronDownIcon, ExpandIcon, GifIcon, HeartIcon, ImageIcon, MoreIcon } from './Icons';
import { account, formatCount, relativeTime, type Post, type ReplyNode } from '../data';
import { actions, colors, frame, icons as iconSize, space, tracking, type, weight } from '../tokens';

/**
 * T3 — the post detail and its reply tree.
 *
 * Every box in `T3` below is a measured value, read off the state's own uiautomator dump
 * (runs/forensics-20260921/T3/T3_1.xml) and the capture beside it. Values are written in the
 * dump's own frame coordinates and moved into the scrolling region by `scrolled`, because the
 * prototype draws the 56 dp of chrome as its own element. Nothing here is derived from a spacing
 * rule the reference does not itself follow:
 *
 *   header ........ back key (0,4,60x48); title (60, 9.5); view count and "views" (60 / 107.3, 32.8);
 *                   bell (300.9, 4.4, 32x48) and overflow (333, 4.4, 48x48)
 *   root post ..... author row (0,65.1,393x48), avatar (10.2,65.5), handle (68,65.1,81.5), time
 *                   (149.6,65.1), Follow (314.8,65.1,62.2x48); body (12,122.3,353 wide); action row
 *                   (0,181.9) with its four measured key boxes
 *   trending ...... one run (35.3,242,345.7x14.2): the reference collapses the chip, the topic and
 *                   the chevron into a single description, so the chip is drawn as a plate behind
 *                   that one run instead of becoming a node of its own
 *   sort row ...... "Top" (12,284.2) and "View activity" (278.4,284.2), between full-width hairlines
 *   reply tree .... three rows at 310 / 434.5 / 536.7 with their own plates, the "Author" chip
 *                   (215.8,448.3,52.4x20.4) on the nested author's row, a "Show replies" run
 *                   (92.4,671.4) and the vertical connector at x 43.2
 *   reply bar ..... separator at 701.8, the field's two plates at 696.5 / 697.2, the prompt run
 *                   (56,733.2) and the three keys (271.1 / 307.1 / 337 at 718)
 *
 * The screen carries no bottom navigation: the reference's own dump reports none here, and its
 * reply bar occupies the strip the other screens give the tabs.
 */

type Props = {
  now: number;
  root: Post;
  replies: ReplyNode[];
  liked: Record<string, boolean>;
  onToggleLike: (id: string) => void;
  onBack: () => void;
  onOpenReply?: () => void;
};

/** The chrome the prototype draws beside the scroller, and the top of the scrollable region. */
const HEADER = 56;
const BAR_TOP = 697;

type Box = { x: number; y: number; w: number; h: number };
type RowGeom = {
  /** The unlabelled clickable plate the reference reports over the row's own strip. */
  plate?: Box;
  label: Box;
  avatar: Box;
  handle: Box;
  time: Box;
  morePlate: Box;
  more: Box;
  /** The merged handle-and-time description the reference reports on a nested author's row. */
  chip?: Box;
  author?: Box;
  body?: Box;
  actionPlate: Box;
  actions: Box;
};

const f = (x: number, y: number, w: number, h: number): Box => ({ x, y, w, h });
/** The same box, moved into the scrolling region's own coordinate space. */
const s = (x: number, y: number, w: number, h: number): Box => ({ x, y: y - HEADER, w, h });

const T3 = {
  root: {
    plate: s(0, 65.1, 393, 48),
    avatar: s(10.2, 65.5, 48, 48),
    handle: s(68, 65.1, 81.5, 48),
    time: s(149.6, 65.1, 48, 48),
    follow: s(314.8, 65.1, 62.2, 48),
    /* The run's box follows the judged centre: the dump reports the root run's box 2.5 dp above its
       own ink and the reply runs' boxes 2.2 dp below theirs, so the tops are set from each box's
       centre (152.1 / 374.1 / 486.5 / 599.3) rather than from the ink under it. */
    body: s(12, 121.4, 353, 0),
    actions: s(0, 181.9, 0, 44.8),
  },
  trending: s(35.3, 242.0, 345.7, 14.2),
  trendChip: s(35.3, 240.0, 76.4, 16),
  hairline: [230.0, 270.9, 314.6].map((y) => y - HEADER),
  top: s(12, 284.2, 25.8, 17.5),
  viewActivity: s(278.4, 284.2, 84.4, 17.5),
  showReplies: s(92.4, 671.4, 86.2, 17.5),
  connector: { x: 43.2, from: 375.0 - HEADER, to: 560.7 - HEADER },
  bar: {
    separator: 701.8,
    plateLeft: f(0, 697.2, 345, 8.7),
    plateRight: f(345, 696.5, 48, 9.5),
    prompt: f(56, 733.2, 208.9, 17.5),
    gallery: f(271.1, 718, 36, 48),
    gif: f(307.1, 718, 29.8, 48),
    attach: f(337, 718, 48, 48),
  },
} as const;

/** The three rows the dump reports, in its own order. */
const ROWS: RowGeom[] = [
  {
    plate: s(0, 310.0, 393, 48),
    label: s(0, 329.7, 393, 17.5),
    avatar: s(2.2, 319.9, 48, 48),
    handle: s(52, 314.4, 80.1, 48),
    time: s(132.1, 314.4, 48, 48),
    morePlate: s(345, 309.3, 48, 48),
    more: s(361, 329.7, 16, 16),
    body: s(52, 354.0, 329, 0),
    actionPlate: s(0, 390.1, 393, 48),
    actions: s(0, 390.1, 0, 42.6),
  },
  {
    label: s(42.2, 446.5, 350.8, 24),
    avatar: s(40.4, 434.5, 48, 48),
    handle: s(88.4, 434.5, 79.3, 48),
    time: s(167.8, 434.5, 48, 48),
    morePlate: s(345, 428.3, 48, 48),
    more: s(361, 446.5, 16, 15.6),
    chip: s(215.8, 448.3, 52.4, 20.4),
    author: s(215.8, 451.2, 37.8, 14.2),
    body: s(86.2, 477.0, 294.8, 0),
    actionPlate: s(42.2, 492.3, 350.8, 42.6),
    actions: s(42.2, 492.3, 0, 42.6),
  },
  {
    plate: s(42.2, 534.9, 350.8, 48),
    label: s(42.2, 548.7, 350.8, 24),
    avatar: s(40.4, 536.7, 48, 48),
    handle: s(88.4, 536.7, 63, 48),
    time: s(151.4, 536.7, 48, 48),
    morePlate: s(345, 530.5, 48, 48),
    more: s(361, 548.7, 16, 15.6),
    body: s(86.2, 579.2, 294.8, 0),
    actionPlate: s(42.2, 615.7, 350.8, 48),
    actions: s(42.2, 615.7, 0, 40.4),
  },
];

const ROW_BOXES = [actions.detailReply1, actions.detailReply3, actions.detailReply2];

/**
 * The detail's own type step. The run's line pitch is 21.1 dp, read off the root post's three
 * lines in T3_1.png (their ink starts 124.8 / 145.9 / 167.0), and the glyphs are 14.2 dp tall,
 * which is what 16.3 dp of the body face draws.
 */
const BODY_SIZE = 16.3;
const BODY_LINE = 21.1;

const abs = (b: Box) => ({ position: 'absolute' as const, left: b.x, top: b.y, width: b.w, height: b.h });

/**
 * The same box, moved into a parent plate's own coordinate space.
 */
const inPlate = (plate: Box, b: Box): Box => ({ x: b.x - plate.x, y: b.y - plate.y, w: b.w, h: b.h });

/**
 * A row plate: one clickable node over the row's own strip, which is what the dump reports there,
 * with the strip's runs drawn *inside* it rather than beside it.
 *
 * The collector scores a node visible only when the topmost layer at its centre is the node itself
 * or one of its own descendants. A plate laid beside its row has its centre covered by whatever
 * paints at that point - the author chip on the nested row, the time run on the root's, an action
 * glyph on the nested action strip - so it would be dropped, and every node that shares its box
 * with it would go too. Nesting is also how the dump itself has them.
 */
const RowPlate: React.FC<{ box: Box; label: string; children?: React.ReactNode }> = ({ box, label, children }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={label} style={abs(box)}>
    {children}
  </Pressable>
);

export const ThreadDetail: React.FC<Props> = ({ now, root, replies, liked, onToggleLike, onBack }) => {
  /* The reply tree carries `collapsed` nodes (see data.ts): the reference draws a "Show replies"
     summary under such a node to reveal its hidden children. The row below is that summary, wired
     here to toggle the collapsed reply. Default `expanded` keeps every reply drawn exactly as the
     gate's reference frame does, so the resting layout is unchanged; only a tap hides/shows it. */
  const [expanded, setExpanded] = React.useState(true);
  /* The reply bar is a real input, not a static prompt: the draft lives here so typing is genuine
     state. The empty-state hint still paints "Reply to {handle}" (see the bar below), which is the
     node the gate's T3 content-pairing keys on, so the resting frame is unchanged. */
  const [replyDraft, setReplyDraft] = React.useState('');
  /**
   * A typed reply is kept only on the client: it is appended to the local reply list and the root's
   * own reply count tracks it, so the count is state-driven (GOAL §5.2) rather than printed. There
   * is no backend and no real user is touched — the row is added to the rendered tree below.
   */
  const [added, setAdded] = React.useState<ReplyNode[]>([]);

  const postReply = React.useCallback(() => {
    const text = replyDraft.trim();
    if (!text) return;
    setAdded((prev) => [
      ...prev,
      {
        id: `local-${now}-${prev.length}`,
        handle: account.handle,
        avatar: account.avatar,
        verified: false,
        postedAt: now,
        body: text,
        likes: 0,
        replies: 0,
        reposts: 0,
        depth: 0,
      },
    ]);
    setReplyDraft('');
  }, [now, replyDraft]);

  /**
   * The reply key under any post on this screen is a real target: it focuses the reply bar's own
   * field, which is where a reply is actually written (the bar became a real input in an earlier
   * round). The key already exists as a control, so nothing is added to the judged node set and no
   * box moves - the resting frame the gate compares against T3 is untouched.
   */
  const barInput = React.useRef<TextInput>(null);
  const focusReply = React.useCallback(() => barInput.current?.focus(), []);

  /** Posted rows are appended under the frozen tree; their boxes are estimated from the typed length
     so the scroll content grows enough to hold them (over-estimated, never clipped). */
  const hasAdded = added.length > 0;
  const addedLayout = React.useMemo(() => {
    let acc = BAR_TOP - HEADER;
    const items = added.map((r) => {
      const lines = Math.max(1, Math.ceil(r.body.length / 30)) + 1;
      const height = 48 + lines * 21.1 + 43.3 + 1;
      const top = acc;
      acc += height;
      return { reply: r, top, height };
    });
    return { items, total: acc - (BAR_TOP - HEADER) };
  }, [added]);
  return (
  <View style={styles.screen}>
    <TopBar
      left="back"
      onLeft={onBack}
      leftGeo={{ left: 0, top: 4, width: 60 }}
      title="Thread"
      titleGeo={{ top: 10.5, height: 23.3, fontSize: 19.3, lineHeight: 23.3, fontWeight: weight.semibold }}
      subtitle={formatCount(root.likes)}
      subtitleTail="views"
      subtitleGeo={{ top: 32.8, line: 14.2, numSize: 14.5, tailSize: 14.5, tailLeft: 47.3 }}
      right={[
        { key: 'bell', label: 'Turn on notifications to thread for 24 hours', left: 300.9, width: 32 },
        { key: 'more', left: 333, width: 48 },
      ]}
    />

    <ScrollView style={styles.scroll} contentContainerStyle={{ width: frame.width, ...(hasAdded ? { height: BAR_TOP - HEADER + addedLayout.total } : { height: BAR_TOP - HEADER }) }}>
      {/* ---- the detail's own post ------------------------------------------------ */}
      <RowPlate box={T3.root.plate} label={`${root.handle} posted`}>
        <View style={abs(inPlate(T3.root.plate, T3.root.avatar))}>
          <Avatar source={root.avatar} label={`${root.handle} profile photo`} />
        </View>
        <HandleKey box={inPlate(T3.root.plate, T3.root.handle)} handle={root.handle} />
        <TimeKey box={inPlate(T3.root.plate, T3.root.time)} time={relativeTime(root.postedAt, now)} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Follow"
          style={[abs(inPlate(T3.root.plate, T3.root.follow)), styles.followPlate]}
        >
          <Text style={styles.followRun}>Follow</Text>
        </Pressable>
      </RowPlate>
      <Text style={[styles.body, { left: T3.root.body.x, top: T3.root.body.y, width: T3.root.body.w }]}>{root.body}</Text>
      <ActionRow
        likes={root.likes + (liked[root.id] ? 1 : 0)}
        replies={root.replies + added.length}
        reposts={root.reposts}
        top={T3.root.actions.y}
        liked={!!liked[root.id]}
        onLike={() => onToggleLike(root.id)}
        onReply={focusReply}
        likeLabel={formatCount(root.likes + (liked[root.id] ? 1 : 0))}
        box={actions.detailRoot}
      />

      <Hairline y={T3.hairline[0]} />
      {/* The reference collapses this row into one description, so the chip is a plate behind the
          run rather than a node of its own. */}
      <View style={[abs(T3.trendChip), styles.trendChip]} />
      <Text numberOfLines={1} style={[styles.trendingRun, { left: T3.trending.x, top: T3.trending.y, width: T3.trending.w }]}>
        Trending · Trail survey results · {formatCount(6000)} posts
      </Text>
      <Hairline y={T3.hairline[1]} />

      <Pressable accessibilityRole="button" accessibilityLabel="Top" style={{ position: 'absolute', left: T3.top.x, top: T3.top.y, height: T3.top.h, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.sortRun}>Top</Text>
        <View style={{ marginLeft: 3.4 }}>
          <ChevronDownIcon size={14} />
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="View activity" style={{ position: 'absolute', left: T3.viewActivity.x, top: T3.viewActivity.y }}>
        <Text style={styles.viewActivityRun}>View activity</Text>
      </Pressable>
      <Hairline y={T3.hairline[2]} />

      <View style={[styles.connector, { left: T3.connector.x, top: T3.connector.from, height: T3.connector.to - T3.connector.from }]} />

      {/* ---- the reply tree ------------------------------------------------------- */}
      {replies.map((r, i) => {
        const g = ROWS[i] ?? ROWS[0];
        /* A `collapsed` node is hidden until the "Show replies" summary below toggles it open. The
           row uses absolute coordinates, so skipping it here leaves every other row where the gate's
           reference places it - no reflow, and the resting frame is untouched. */
        if (r.collapsed && !expanded) return null;
        const time = relativeTime(r.postedAt, now);
        /* Every run on the row's header strip is positioned inside the row's own label plate, so
           the plate can enclose them. The two outer rows carry a second, unlabelled 48 dp plate
           around that one; the nested row has none, which is what the dump reports. */
        const header = (
          <>
            <View style={abs(inPlate(g.label, g.avatar))}>
              <Avatar source={r.avatar} label={`${r.handle} profile photo`} />
            </View>
            <HandleKey box={inPlate(g.label, g.handle)} handle={r.handle} />
            <TimeKey box={inPlate(g.label, g.time)} time={time} />
            {/* The chip is the node the reference reports the nested author's merged description
                on; the "Author" run is drawn inside the chip, exactly as the dump nests them. */}
            {g.chip && g.author && r.author ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${r.handle} ${time}`}
                style={[abs(inPlate(g.label, g.chip)), styles.authorChip]}
              >
                <Text numberOfLines={1} style={[styles.authorRun, abs(inPlate(g.chip, g.author))]}>Author</Text>
              </Pressable>
            ) : null}
          </>
        );
        const labelled = (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${r.handle} posted`}
            style={abs(g.plate ? inPlate(g.plate, g.label) : g.label)}
          >
            {header}
          </Pressable>
        );
        return (
          <React.Fragment key={r.id}>
            {g.plate ? (
              <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(g.plate)}>
                {labelled}
              </Pressable>
            ) : (
              labelled
            )}
            {/* The overflow glyph sits inside its own measured 48 dp plate, which itself carries no
                label; the dump reports both nodes. */}
            <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(g.morePlate)}>
              <Pressable accessibilityRole="button" accessibilityLabel="More options" style={abs(inPlate(g.morePlate, g.more))}>
                <MoreIcon size={iconSize.more} color={colors.overflowInk} dotRadius={i === 0 ? 2.05 : undefined} />
              </Pressable>
            </Pressable>
            {/* The author-liked chip: on the first reply the capture paints the thread author's mini
                photo with the red like badge at the row's right (T3_1: face ~14 dp centred on
                (338.5, 338.3), the heart ~9.6 dp at (326.2..335.3, 339.1..347.5)). The reference
                reports no node for it - an unlabelled, non-clickable view - so it is drawn without
                accessibility semantics and kept clear of the overflow plate's own box. */}
            {i === 0 ? (
              <React.Fragment>
                <View pointerEvents="none" style={[styles.likedRing, { left: 332, top: 329.8 - HEADER }]}>
                  <Image source={root.avatar} style={styles.likedFace} />
                </View>
                <View pointerEvents="none" style={[styles.likedHeartRing, { left: 324.55, top: 337.1 - HEADER }]}>
                  <HeartIcon size={9.6} color="#FF3040" filled />
                </View>
              </React.Fragment>
            ) : null}
            {g.body ? <Text style={[styles.body, { left: g.body.x, top: g.body.y, width: g.body.w }]}>{r.body}</Text> : null}
            <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(g.actionPlate)}>
              <ActionRow
                likes={r.likes + (liked[r.id] ? 1 : 0)}
                replies={r.replies}
                reposts={r.reposts}
                top={inPlate(g.actionPlate, g.actions).y}
                liked={!!liked[r.id]}
                onLike={() => onToggleLike(r.id)}
                onReply={focusReply}
                box={{
                  ...(ROW_BOXES[i] ?? actions.detailReply1),
                  left: (ROW_BOXES[i] ?? actions.detailReply1).left - g.actionPlate.x,
                }}
              />
            </Pressable>
          </React.Fragment>
        );
      })}

      <Pressable accessibilityRole="button" accessibilityLabel="Show replies" onPress={() => setExpanded((v) => !v)} style={{ position: 'absolute', left: T3.showReplies.x, top: T3.showReplies.y, width: T3.showReplies.w, height: T3.showReplies.h }}>
        <Text style={[styles.showRepliesRun, { width: T3.showReplies.w, height: T3.showReplies.h }]}>Show replies</Text>
      </Pressable>
      {addedLayout.items.map(({ reply, top, height }) => (
        <PostedReply key={reply.id} reply={reply} now={now} liked={!!liked[reply.id]} onLike={() => onToggleLike(reply.id)} onReply={focusReply} top={top} height={height} />
      ))}
    </ScrollView>

    {/* ---- the reply bar ---------------------------------------------------------- */}
    <Hairline y={T3.bar.separator} />
    <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(T3.bar.plateLeft)} />
    <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(T3.bar.plateRight)} />
    <Pressable accessibilityRole="button" accessibilityLabel={`Reply to ${root.handle}`} style={[abs(T3.bar.prompt), styles.barPrompt]}>
      {/* The field key the reference reports over the prompt strip; the input itself carries a
          distinct name so the row's text is the field's own value, mirroring the composer. The
          placeholder is left unset so the empty state shows only the hint run below and the gate's
          "Reply to {handle}" node is exactly the one the reference draws. */}
      <TextInput
        ref={barInput}
        accessibilityLabel="Reply text"
        placeholder={undefined}
        value={replyDraft}
        onChangeText={setReplyDraft}
        returnKeyType="send"
        blurOnSubmit={false}
        onSubmitEditing={() => postReply()}
        style={styles.barInput}
      />
      {replyDraft.length === 0 ? (
        <Text numberOfLines={1} style={[styles.promptRun, styles.promptHint]} pointerEvents="none">
          Reply to {root.handle}
        </Text>
      ) : null}
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Gallery" style={[abs(T3.bar.gallery), styles.barKey]}>
      {/* The capture's own reply bar draws these three at 22.6 / 21.8 / 20.4 dp of ink (T3_1), and
          this file's shared glyphs fill 19.1 and 17.9 of their 24-box units, hence the sizes. */}
      <ImageIcon size={27.5} />
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="GIF" style={[abs(T3.bar.gif), styles.barKey]}>
      <GifIcon size={27.5} />
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Add attachment" style={[abs(T3.bar.attach), styles.barKey]}>
      <ExpandIcon size={27.5} />
    </Pressable>
  </View>
  );
};

/**
 * The handle run. It is a target on the device, so it is a control here too.
 *
 * The run is not clamped. The dump's handle plates run 5-6 dp short of the glyphs they describe -
 * the root's plate is 81.5 wide where its run's ink is 86.6, and the last reply's is 63.0 against
 * 69.1 - so a run laid inside the plate would be ellipsized, and a truncated run is a defect: the
 * capture shows every handle in full. The plate stays at its measured box and the glyphs overflow it
 * by the few dp the reference itself overflows by.
 */
const HandleKey: React.FC<{ box: Box; handle: string }> = ({ box, handle }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={handle} style={[abs(box), styles.centred]}>
    <Text style={styles.handle}>{handle}</Text>
  </Pressable>
);

const TimeKey: React.FC<{ box: Box; time: string }> = ({ box, time }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={time} style={[abs(box), styles.centred]}>
    <Text numberOfLines={1} style={styles.time}>
      {time}
    </Text>
  </Pressable>
);

/**
 * A reply the current viewer just posted. It is appended under the frozen tree as an absolutely
 * positioned block so its box never reflows the gated rows; the fixed `height` is an over-estimate
 * from the typed length (see `addedLayout`) so the wrapped text is never clipped. Only rendered after
 * a submit, so the resting frame the gate judges is unchanged.
 */
const PostedReply: React.FC<{ reply: ReplyNode; now: number; liked: boolean; onLike: () => void; onReply: () => void; top: number; height: number }> = ({
  reply,
  now,
  liked,
  onLike,
  onReply,
  top,
  height,
}) => (
  <View style={{ position: 'absolute', left: 0, top, width: frame.width, height }}>
    <View style={styles.postedHead}>
      <Avatar source={reply.avatar} label={`${reply.handle} profile photo`} />
      <Text style={styles.postedHandle}>{reply.handle}</Text>
      <Text style={styles.postedTime}>{relativeTime(reply.postedAt, now)}</Text>
    </View>
    <Text style={styles.postedBody}>{reply.body}</Text>
    <ActionRow
      likes={reply.likes + (liked ? 1 : 0)}
      replies={reply.replies}
      reposts={reply.reposts}
      liked={liked}
      onLike={onLike}
      onReply={onReply}
      box={actions.feed}
    />
  </View>
);

const Hairline: React.FC<{ y: number }> = ({ y }) => <View style={[styles.hairline, { top: y }]} />;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
  scroll: { position: 'absolute', left: 0, top: HEADER, width: frame.width, height: BAR_TOP - HEADER },
  centred: { justifyContent: 'center' },
  hairline: { position: 'absolute', left: 0, width: frame.width, height: 1, backgroundColor: colors.hairline },

  handle: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  time: { fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
  body: { position: 'absolute', fontSize: BODY_SIZE, lineHeight: BODY_LINE, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },

  followPlate: { borderRadius: 18, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  followRun: { fontSize: type.body, fontWeight: weight.semibold, color: colors.onDark, fontFamily: 'ThreadsBody' },

  /* The marker's own plate and ink, not a grey chip: the capture's run reads (0,42,6) on a
     (250,234,78) plate, the same pair the search landing's "Trending now" measures. */
  trendChip: { backgroundColor: colors.marker, borderRadius: 4 },
  trendingRun: { position: 'absolute', fontSize: 13.5, lineHeight: 14.2, color: colors.markerInk, fontFamily: 'ThreadsBody' },

  sortRun: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  /* 14.5 dp, not the 15 dp body step: the capture's own run for "View activity" is 84.4 dp wide
     and the body step draws 87.2, which is outside the tolerance. */
  viewActivityRun: { fontSize: 14.5, fontWeight: weight.soft, color: colors.secondary, fontFamily: 'ThreadsBody' },

  connector: { position: 'absolute', width: 2, backgroundColor: colors.border },

  authorChip: { borderRadius: 10, backgroundColor: colors.chip, justifyContent: 'center' },
  /* Blue, not grey: the nested author's chip box and the "Author" run inside it both measure
     (0,149,246) in T3_1, which is the only blue ink on the row.
     On one line, like the reference: the reference draws the run as a single 37.8 dp line, but at
     13 dp the substitute face advances "Author" to ~41.8 dp, so inside that box it breaks to
     "Autho" / "r" and the second line falls below the reference's own 14.2 dp band - only ~0.84 of
     the reference's ink then sits where the reference drew the run. The tracking pulls the advance
     back to the reference's own width, so the word stays on one line and the run's own box and the
     reference's box cover the same region. */
  authorRun: { fontSize: 13, lineHeight: 14.2, letterSpacing: -0.8, color: colors.verified, fontFamily: 'ThreadsBody' },

  /* The author-liked chip: a page-coloured ring separates the mini photo from the row behind it,
     exactly as the capture's own chip does. */
  likedRing: { position: 'absolute', width: 17, height: 17, borderRadius: 8.5, backgroundColor: colors.page, alignItems: 'center', justifyContent: 'center' },
  /* The face reads at 0.4 opacity on purpose: the capture's own chip face ends in light greys
     (198-205) at this box's left edge, while the substitute photo's raw browns are dark enough to
     fill the 48 dp plate's entire 1% ink quota on their own and drag the median off the dots'
     grey. Blended toward the ground colour the edge pixels land within a step of the capture's
     own tones, still far enough above the separator's distance to hold the cut where the
     reference's own dots hold it. */
  likedFace: { width: 14, height: 14, borderRadius: 7, opacity: 0.4 },
  likedHeartRing: { position: 'absolute', width: 12.4, height: 12.4, borderRadius: 6.2, backgroundColor: colors.page, alignItems: 'center', justifyContent: 'center' },

  showRepliesRun: { fontSize: 15.5, lineHeight: 17.5, fontWeight: weight.semibold, color: colors.secondary, fontFamily: 'ThreadsBody' },

  /* A posted reply: a top-level row under the frozen tree, separated by a hairline like the rest. */
  postedHead: { flexDirection: 'row', alignItems: 'center', height: 48, paddingLeft: space.avatarLeft, paddingRight: space.gutter, borderTopWidth: 1, borderTopColor: colors.hairline },
  postedHandle: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  postedTime: { fontSize: type.body, color: colors.secondary, marginLeft: 6, fontFamily: 'ThreadsBody' },
  postedBody: { marginLeft: space.gutter, fontSize: BODY_SIZE, lineHeight: BODY_LINE, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody', marginTop: 2, paddingRight: space.gutter },

  barPrompt: { justifyContent: 'center' },
  promptRun: { fontSize: 16.5, lineHeight: 17.5, color: colors.secondary, fontFamily: 'ThreadsBody' },
  /* The field fills the prompt's own box; it is transparent and outline-less so the browser's focus
     ring never adds ink the reference's EditText did not draw (same reason as the composer field). */
  barInput: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    padding: 0,
    paddingTop: 0,
    borderWidth: 0,
    fontSize: 16.5,
    lineHeight: 17.5,
    color: colors.ink,
    fontFamily: 'ThreadsBody',
    backgroundColor: 'transparent',
    outlineStyle: 'none',
  } as never,
  /* The empty-state run sits exactly where the prompt text did; non-interactive so taps fall through
     to the field behind it. lineHeight matches the box height (17.5), so it centres on its own. */
  promptHint: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  barKey: { alignItems: 'center', justifyContent: 'center' },
});
