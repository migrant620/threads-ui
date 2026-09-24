import * as React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionRow, Avatar, TopBar } from './Chrome';
import { ChevronDownIcon, ExpandIcon, GifIcon, HeartIcon, ImageIcon, MoreIcon } from './Icons';
import { formatCount, relativeTime, type Post, type ReplyNode } from '../data';
import { actions, colors, frame, icons as iconSize, tracking, type, weight } from '../tokens';
type Props = {
    now: number;
    root: Post;
    replies: ReplyNode[];
    liked: Record<string, boolean>;
    onToggleLike: (id: string) => void;
    onBack: () => void;
    onOpenReply?: () => void;
};
const HEADER = 56;
const BAR_TOP = 697;
type Box = {
    x: number;
    y: number;
    w: number;
    h: number;
};
type RowGeom = {
    plate?: Box;
    label: Box;
    avatar: Box;
    handle: Box;
    time: Box;
    morePlate: Box;
    more: Box;
    chip?: Box;
    author?: Box;
    body?: Box;
    actionPlate: Box;
    actions: Box;
};
const f = (x: number, y: number, w: number, h: number): Box => ({ x, y, w, h });
const s = (x: number, y: number, w: number, h: number): Box => ({ x, y: y - HEADER, w, h });
const T3 = {
    root: {
        plate: s(0, 65.1, 393, 48),
        avatar: s(10.2, 65.5, 48, 48),
        handle: s(68, 65.1, 81.5, 48),
        time: s(149.6, 65.1, 48, 48),
        follow: s(314.8, 65.1, 62.2, 48),
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
const BODY_SIZE = 16.3;
const BODY_LINE = 21.1;
const abs = (b: Box) => ({ position: 'absolute' as const, left: b.x, top: b.y, width: b.w, height: b.h });
const inPlate = (plate: Box, b: Box): Box => ({ x: b.x - plate.x, y: b.y - plate.y, w: b.w, h: b.h });
const RowPlate: React.FC<{
    box: Box;
    label: string;
    children?: React.ReactNode;
}> = ({ box, label, children }) => (<Pressable accessibilityRole="button" accessibilityLabel={label} style={abs(box)}>
    {children}
  </Pressable>);
export const ThreadDetail: React.FC<Props> = ({ now, root, replies, liked, onToggleLike, onBack, onOpenReply }) => (<View style={styles.screen}>
    <TopBar left="back" onLeft={onBack} leftGeo={{ left: 0, top: 4, width: 60 }} title="Thread" titleGeo={{ top: 10.5, height: 23.3, fontSize: 19.3, lineHeight: 23.3, fontWeight: weight.semibold }} subtitle={formatCount(root.likes)} subtitleTail="views" subtitleGeo={{ top: 32.8, line: 14.2, numSize: 14.5, tailSize: 14.5, tailLeft: 47.3 }} right={[
        { key: 'bell', label: 'Turn on notifications to thread for 24 hours', left: 300.9, width: 32 },
        { key: 'more', left: 333, width: 48 },
    ]}/>

    <ScrollView style={styles.scroll} contentContainerStyle={{ height: BAR_TOP - HEADER, width: frame.width }}>
      
      <RowPlate box={T3.root.plate} label={`${root.handle} posted`}>
        <View style={abs(inPlate(T3.root.plate, T3.root.avatar))}>
          <Avatar source={root.avatar} label={`${root.handle} profile photo`}/>
        </View>
        <HandleKey box={inPlate(T3.root.plate, T3.root.handle)} handle={root.handle}/>
        <TimeKey box={inPlate(T3.root.plate, T3.root.time)} time={relativeTime(root.postedAt, now)}/>
        <Pressable accessibilityRole="button" accessibilityLabel="Follow" style={[abs(inPlate(T3.root.plate, T3.root.follow)), styles.followPlate]}>
          <Text style={styles.followRun}>Follow</Text>
        </Pressable>
      </RowPlate>
      <Text style={[styles.body, { left: T3.root.body.x, top: T3.root.body.y, width: T3.root.body.w }]}>{root.body}</Text>
      <ActionRow likes={root.likes + (liked[root.id] ? 1 : 0)} replies={root.replies} reposts={root.reposts} top={T3.root.actions.y} liked={!!liked[root.id]} onLike={() => onToggleLike(root.id)} likeLabel={formatCount(root.likes + (liked[root.id] ? 1 : 0))} box={actions.detailRoot}/>

      <Hairline y={T3.hairline[0]}/>
      
      <View style={[abs(T3.trendChip), styles.trendChip]}/>
      <Text numberOfLines={1} style={[styles.trendingRun, { left: T3.trending.x, top: T3.trending.y, width: T3.trending.w }]}>
        Trending · Trail survey results · 6K posts
      </Text>
      <Hairline y={T3.hairline[1]}/>

      <Pressable accessibilityRole="button" accessibilityLabel="Top" style={{ position: 'absolute', left: T3.top.x, top: T3.top.y, height: T3.top.h, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.sortRun}>Top</Text>
        <View style={{ marginLeft: 3.4 }}>
          <ChevronDownIcon size={14}/>
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="View activity" style={{ position: 'absolute', left: T3.viewActivity.x, top: T3.viewActivity.y }}>
        <Text style={styles.viewActivityRun}>View activity</Text>
      </Pressable>
      <Hairline y={T3.hairline[2]}/>

      <View style={[styles.connector, { left: T3.connector.x, top: T3.connector.from, height: T3.connector.to - T3.connector.from }]}/>

      
      {replies.map((r, i) => {
        const g = ROWS[i] ?? ROWS[0];
        const time = relativeTime(r.postedAt, now);
        const header = (<>
            <View style={abs(inPlate(g.label, g.avatar))}>
              <Avatar source={r.avatar} label={`${r.handle} profile photo`}/>
            </View>
            <HandleKey box={inPlate(g.label, g.handle)} handle={r.handle}/>
            <TimeKey box={inPlate(g.label, g.time)} time={time}/>
            
            {g.chip && g.author && r.author ? (<Pressable accessibilityRole="button" accessibilityLabel={`${r.handle} ${time}`} style={[abs(inPlate(g.label, g.chip)), styles.authorChip]}>
                <Text style={[styles.authorRun, abs(inPlate(g.chip, g.author))]}>Author</Text>
              </Pressable>) : null}
          </>);
        const labelled = (<Pressable accessibilityRole="button" accessibilityLabel={`${r.handle} posted`} style={abs(g.plate ? inPlate(g.plate, g.label) : g.label)}>
            {header}
          </Pressable>);
        return (<React.Fragment key={r.id}>
            {g.plate ? (<Pressable accessibilityRole="button" accessibilityLabel="" style={abs(g.plate)}>
                {labelled}
              </Pressable>) : (labelled)}
            
            <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(g.morePlate)}>
              <Pressable accessibilityRole="button" accessibilityLabel="More options" style={abs(inPlate(g.morePlate, g.more))}>
                <MoreIcon size={iconSize.more} color={colors.overflowInk} dotRadius={i === 0 ? 2.05 : undefined}/>
              </Pressable>
            </Pressable>
            
            {i === 0 ? (<React.Fragment>
                <View pointerEvents="none" style={[styles.likedRing, { left: 332, top: 329.8 - HEADER }]}>
                  <Image source={root.avatar} style={styles.likedFace}/>
                </View>
                <View pointerEvents="none" style={[styles.likedHeartRing, { left: 324.55, top: 337.1 - HEADER }]}>
                  <HeartIcon size={9.6} color="#FF3040" filled/>
                </View>
              </React.Fragment>) : null}
            {g.body ? <Text style={[styles.body, { left: g.body.x, top: g.body.y, width: g.body.w }]}>{r.body}</Text> : null}
            <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(g.actionPlate)}>
              <ActionRow likes={r.likes + (liked[r.id] ? 1 : 0)} replies={r.replies} reposts={r.reposts} top={inPlate(g.actionPlate, g.actions).y} liked={!!liked[r.id]} onLike={() => onToggleLike(r.id)} box={{
                ...(ROW_BOXES[i] ?? actions.detailReply1),
                left: (ROW_BOXES[i] ?? actions.detailReply1).left - g.actionPlate.x,
            }}/>
            </Pressable>
          </React.Fragment>);
    })}

      <Pressable accessibilityRole="button" accessibilityLabel="Show replies" style={{ position: 'absolute', left: T3.showReplies.x, top: T3.showReplies.y, width: T3.showReplies.w, height: T3.showReplies.h }}>
        <Text style={[styles.showRepliesRun, { width: T3.showReplies.w, height: T3.showReplies.h }]}>Show replies</Text>
      </Pressable>
    </ScrollView>

    
    <Hairline y={T3.bar.separator}/>
    <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(T3.bar.plateLeft)}/>
    <Pressable accessibilityRole="button" accessibilityLabel="" style={abs(T3.bar.plateRight)}/>
    <Pressable accessibilityRole="button" accessibilityLabel={`Reply to ${root.handle}`} onPress={onOpenReply} style={[abs(T3.bar.prompt), styles.barPrompt]}>
      <Text numberOfLines={1} style={styles.promptRun}>
        Reply to {root.handle}
      </Text>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Gallery" style={[abs(T3.bar.gallery), styles.barKey]}>
      <ImageIcon size={22}/>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="GIF" style={[abs(T3.bar.gif), styles.barKey]}>
      <GifIcon size={22}/>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Add attachment" style={[abs(T3.bar.attach), styles.barKey]}>
      <ExpandIcon size={22}/>
    </Pressable>
  </View>);
const HandleKey: React.FC<{
    box: Box;
    handle: string;
}> = ({ box, handle }) => (<Pressable accessibilityRole="button" accessibilityLabel={handle} style={[abs(box), styles.centred]}>
    <Text style={styles.handle}>{handle}</Text>
  </Pressable>);
const TimeKey: React.FC<{
    box: Box;
    time: string;
}> = ({ box, time }) => (<Pressable accessibilityRole="button" accessibilityLabel={time} style={[abs(box), styles.centred]}>
    <Text numberOfLines={1} style={styles.time}>
      {time}
    </Text>
  </Pressable>);
const Hairline: React.FC<{
    y: number;
}> = ({ y }) => <View style={[styles.hairline, { top: y }]}/>;
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
    trendChip: { backgroundColor: colors.marker, borderRadius: 4 },
    trendingRun: { position: 'absolute', fontSize: 13.5, lineHeight: 14.2, color: colors.markerInk, fontFamily: 'ThreadsBody' },
    sortRun: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    viewActivityRun: { fontSize: 14.5, fontWeight: weight.soft, color: colors.secondary, fontFamily: 'ThreadsBody' },
    connector: { position: 'absolute', width: 2, backgroundColor: colors.border },
    authorChip: { borderRadius: 10, backgroundColor: colors.chip, justifyContent: 'center' },
    authorRun: { fontSize: 13, lineHeight: 14.2, color: colors.verified, fontFamily: 'ThreadsBody' },
    likedRing: { position: 'absolute', width: 17, height: 17, borderRadius: 8.5, backgroundColor: colors.page, alignItems: 'center', justifyContent: 'center' },
    likedFace: { width: 14, height: 14, borderRadius: 7, opacity: 0.4 },
    likedHeartRing: { position: 'absolute', width: 12.4, height: 12.4, borderRadius: 6.2, backgroundColor: colors.page, alignItems: 'center', justifyContent: 'center' },
    showRepliesRun: { fontSize: 15.5, lineHeight: 17.5, fontWeight: weight.semibold, color: colors.secondary, fontFamily: 'ThreadsBody' },
    barPrompt: { justifyContent: 'center' },
    promptRun: { fontSize: 16.5, lineHeight: 17.5, color: colors.secondary, fontFamily: 'ThreadsBody' },
    barKey: { alignItems: 'center', justifyContent: 'center' },
});
