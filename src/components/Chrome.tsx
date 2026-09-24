import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIcon, BackIcon, BellIcon, ChevronDownIcon, ChevronRightIcon, CloseIcon, FiltersIcon, GlobeIcon, HeartIcon, HomeIcon, ImageIcon, InstagramMark, MenuIcon, MessagesIcon, MoreIcon, PlusIcon, ProfileIcon, ReplyIcon, RepostIcon, SettingsIcon, InsightsIcon, WordmarkLockup, SearchIcon, ShareIcon, VerifiedIcon, } from './Icons';
import { actions, colors, frame, icons as iconSize, radius, rhythm, space, tracking, type, weight, type Weight } from '../tokens';
const SEP = '\ufffd';
export const StatusSpacer: React.FC<{
    height?: number;
}> = ({ height = 0 }) => (<View style={{ height, width: frame.width }}/>);
export type TopRightKey = 'search' | 'bell' | 'more' | 'instagram' | 'drafts' | 'settings' | 'insights' | 'filters';
export type TopRight = TopRightKey | {
    key: TopRightKey;
    label?: string;
    left: number;
    width?: number;
    top?: number;
};
type TopBarProps = {
    left?: 'menu' | 'back' | 'cancel' | 'none';
    onLeft?: () => void;
    wordmark?: boolean;
    title?: string;
    subtitle?: string;
    subtitleTail?: string;
    titleGeo?: {
        left?: number;
        top: number;
        width?: number;
        height?: number;
        fontSize: number;
        lineHeight: number;
        letterSpacing?: number;
        fontWeight?: Weight;
    };
    leftGeo?: {
        left?: number;
        top?: number;
        width?: number;
    };
    subtitleGeo?: {
        left?: number;
        top: number;
        line: number;
        numSize: number;
        tailSize: number;
        tailLeft?: number;
    };
    cancelWidth?: number;
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
export const TopBar: React.FC<TopBarProps> = ({ left = 'menu', onLeft, wordmark, title, subtitle, subtitleTail, titleGeo, subtitleGeo, leftGeo, cancelWidth = 48, right = ['search'], onRight }) => (<View style={styles.topBar}>
    {left === 'menu' ? (<Pressable accessibilityRole="button" accessibilityLabel="Menu" onPress={onLeft} style={[styles.topKey, { left: 4 }]}>
        <MenuIcon size={iconSize.topBar} color={colors.menuInk}/>
      </Pressable>) : null}
    {left === 'back' ? (<Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={onLeft} style={[styles.topKey, leftGeo ? { left: leftGeo.left ?? 0, top: leftGeo.top ?? 4, width: leftGeo.width ?? 60 } : { left: 0, top: 8.3 }]}>
        <BackIcon size={iconSize.topBar}/>
      </Pressable>) : null}
    {left === 'cancel' ? (<Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={onLeft} style={[styles.topKey, { left: 0, width: cancelWidth }]}>
        <CloseIcon size={22}/>
      </Pressable>) : null}

    {wordmark ? <WordmarkRow /> : null}
    {title ? (<View style={[
            styles.titleBox,
            titleGeo
                ? { left: titleGeo.left ?? 60, top: titleGeo.top, width: titleGeo.width ?? 200, ...(titleGeo.height ? { height: titleGeo.height } : null) }
                : null,
        ]}>
        <Text style={[
            styles.titleRun,
            titleGeo ? { fontSize: titleGeo.fontSize, lineHeight: titleGeo.lineHeight } : null,
            titleGeo?.letterSpacing === undefined ? null : { letterSpacing: titleGeo.letterSpacing },
            titleGeo?.fontWeight === undefined ? null : { fontWeight: titleGeo.fontWeight },
        ]}>
          {title}
        </Text>
      </View>) : null}

    {subtitle ? (<View style={[styles.subtitleBox, subtitleGeo ? { left: subtitleGeo.left ?? 60, top: subtitleGeo.top } : null]}>
        <Text style={[styles.subtitleRun, subtitleGeo ? { fontSize: subtitleGeo.numSize, lineHeight: subtitleGeo.line } : null]}>{subtitle}</Text>
        {subtitleTail ? (<Text style={[
                styles.subtitleTailRun,
                subtitleGeo ? { fontSize: subtitleGeo.tailSize, lineHeight: subtitleGeo.line } : null,
                subtitleGeo?.tailLeft === undefined ? null : { position: 'absolute', left: subtitleGeo.tailLeft },
            ]}>
            {subtitleTail}
          </Text>) : null}
      </View>) : null}

    {right.map((entry, i) => {
        const spec = typeof entry === 'string' ? { key: entry, left: 341 - (right.length - 1 - i) * 48, width: 48, top: 4 } : { top: 4, ...entry };
        const label = (spec as {
            label?: string;
        }).label ?? RIGHT_LABEL[spec.key];
        return (<Pressable key={`${spec.key}-${i}`} accessibilityRole="button" accessibilityLabel={label} onPress={() => onRight?.(spec.key)} style={[styles.topKey, { left: spec.left, width: spec.width ?? 48, top: spec.top ?? 4 }]}>
          {spec.key === 'search' ? <SearchIcon size={iconSize.topBar} color={colors.searchInk}/> : null}
          {spec.key === 'bell' ? <BellIcon size={iconSize.topBar}/> : null}
          {spec.key === 'more' ? <MoreIcon size={iconSize.more}/> : null}
          {spec.key === 'instagram' ? <InstagramMark size={iconSize.topBar} color={colors.ink}/> : null}
          {spec.key === 'drafts' ? <ImageIcon size={22}/> : null}
          {spec.key === 'settings' ? <SettingsIcon size={iconSize.topBar}/> : null}
          {spec.key === 'insights' ? <InsightsIcon size={iconSize.topBar}/> : null}
          {spec.key === 'filters' ? <FiltersIcon size={iconSize.topBar} color={colors.menuInk}/> : null}
        </Pressable>);
    })}
  </View>);
export const WordmarkRow: React.FC = () => (<Pressable accessibilityRole="button" accessibilityLabel="" style={styles.wordmarkRow}>
    <WordmarkLockup width={119} height={22.9}/>
  </Pressable>);
export const Avatar: React.FC<{
    source: unknown;
    size?: number;
    label?: string;
}> = ({ source, size = space.avatar, label }) => (<Pressable accessibilityRole="button" accessibilityLabel={label} style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: colors.surfaceAlt }}>
    <Image source={source as never} style={{ width: size, height: size, borderRadius: size / 2 }}/>
  </Pressable>);
export const Verified: React.FC<{
    size?: number;
}> = ({ size = iconSize.verified }) => (<Pressable accessibilityRole="button" accessibilityLabel="Verified" style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <VerifiedIcon size={size}/>
  </Pressable>);
export const PostHeader: React.FC<{
    avatar: unknown;
    handle: string;
    verified?: boolean;
    time?: string;
    row: {
        handleLeft: number;
        handleWidth: number;
        timeLeft: number;
        verifiedLeft: number | null;
        verifiedGlyphLeft?: number;
    };
    onOpen?: () => void;
    openLabel?: string;
}> = ({ avatar, handle, verified, time, row, onOpen, openLabel = '' }) => (<View style={{ height: rhythm.post.headerToBody }}>
    <View style={{ position: 'absolute', left: space.avatarLeft, top: 13.4 }}>
      <Avatar source={avatar} label={`${handle} profile photo`}/>
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={`${handle} posted`} style={styles.postedRun} onPress={onOpen}/>
    <Pressable accessibilityRole="button" accessibilityLabel={handle} onPress={onOpen} style={{ position: 'absolute', left: row.handleLeft, top: 0, width: row.handleWidth, height: 48, justifyContent: 'center' }}>
      <Text numberOfLines={1} style={styles.handle}>
        {handle}
      </Text>
    </Pressable>
    {verified && row.verifiedLeft !== null ? (<>
        
        <Pressable accessibilityRole="button" accessibilityLabel="Verified" style={{ position: 'absolute', left: row.verifiedLeft, top: 0.3, width: 17.8, height: 48, alignItems: 'center', justifyContent: 'center' }}>
          <View style={row.verifiedGlyphLeft === undefined
            ? null
            : { position: 'absolute', left: row.verifiedGlyphLeft - row.verifiedLeft, top: 16 }}>
            <VerifiedIcon size={iconSize.verified}/>
          </View>
          
          <Text accessibilityLabel={`${handle} ${SEP} ${time}`} numberOfLines={1} style={styles.badgeMergedRun}>
            {SEP}
          </Text>
        </Pressable>
        
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.badgePlate}/>
      </>) : null}
    <Pressable accessibilityRole="button" accessibilityLabel={time} style={{ position: 'absolute', left: row.timeLeft, top: 0, width: 48, height: 48, alignItems: 'center', justifyContent: 'flex-start' }}>
      <Text numberOfLines={1} style={styles.time}>
        {time}
      </Text>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.overflowPlate}>
      <MoreKey top={20.4} left={16}/>
    </Pressable>
    
    <Pressable accessibilityRole="button" accessibilityLabel={openLabel} onPress={onOpen} style={styles.headerRow}/>
  </View>);
export const HandleRow: React.FC<{
    handle: string;
    verified?: boolean;
    time?: string;
    crosspost?: boolean;
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    asTarget?: boolean;
    onPress?: () => void;
    authorChip?: boolean;
}> = ({ handle, verified, time, crosspost, width = 48, height = 48, left = 50.6, top = 0, onPress, authorChip }) => (<Pressable accessibilityRole="button" accessibilityLabel={`${handle} posted`} onPress={onPress} style={{ position: 'absolute', left, top, width: Math.max(width, handle.length * 8), height, flexDirection: 'row', alignItems: 'center' }}>
    <Text numberOfLines={1} style={styles.handle}>
      {handle}
    </Text>
    {verified ? (<View style={{ marginLeft: 5 }}>
        <Verified />
      </View>) : null}
    {crosspost ? (<View style={{ marginLeft: 5 }}>
        <GlobeIcon size={16}/>
      </View>) : null}
    {authorChip ? (<View style={styles.authorChip}>
        <Text style={styles.authorChipText}>Author</Text>
      </View>) : null}
    {time ? (<Text style={[styles.time, { marginLeft: 6 }]}>{time}</Text>) : null}
  </Pressable>);
type ActionBox = {
    left: number;
    height: number;
    widths: readonly number[];
    heights?: readonly number[];
};
export const ActionRow: React.FC<{
    likes: number;
    replies: number;
    reposts: number;
    top?: number;
    liked: boolean;
    onLike: () => void;
    onReply?: () => void;
    likeLabel?: string;
    replyLabel?: string;
    repostLabel?: string;
    box?: ActionBox;
}> = ({ likes, replies, reposts, top, liked, onLike, onReply, likeLabel, replyLabel, repostLabel, box = actions.feed }) => (<View style={[{ left: box.left, height: box.height, flexDirection: 'row' }, top === undefined ? null : { position: 'absolute', top }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Like ${likes}`} onPress={onLike} style={[styles.actionKey, { width: box.widths[0], height: box.heights?.[0] ?? box.height }]}>
      <HeartIcon size={iconSize.action} filled={liked} color={liked ? colors.unread : colors.ink}/>
      <Text style={[styles.actionCount, liked ? { color: colors.unread } : null]}>{likeLabel ?? String(likes)}</Text>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={replies > 0 ? `Reply ${replies}` : 'Reply'} onPress={onReply} style={[styles.actionKey, { width: box.widths[1], height: box.heights?.[1] ?? box.height }]}>
      <ReplyIcon size={iconSize.action}/>
      {replies > 0 ? <Text style={styles.actionCount}>{replyLabel ?? String(replies)}</Text> : null}
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel={reposts > 0 ? `Repost ${reposts}` : 'Repost'} style={[styles.actionKey, { width: box.widths[2], height: box.heights?.[2] ?? box.height }]}>
      <RepostIcon size={iconSize.action}/>
      {reposts > 0 ? <Text style={styles.actionCount}>{repostLabel ?? String(reposts)}</Text> : null}
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Share" style={[styles.actionKey, { width: box.widths[3], height: box.heights?.[3] ?? box.height }]}>
      <ShareIcon size={iconSize.action}/>
    </Pressable>
  </View>);
export const BottomNav: React.FC<{
    current: string;
    onSelect: (key: string) => void;
    unread?: boolean;
}> = ({ current, onSelect, unread = true }) => {
    const tabs: Array<{
        key: string;
        label: string;
        x: number;
    }> = [
        { key: 'feed', label: 'Feed', x: 40.4 },
        { key: 'messages', label: 'Messages', x: 112.8 },
        { key: 'create', label: 'Create', x: 184.9 },
        { key: 'activity', label: 'Activity', x: 256.9 },
        { key: 'profile', label: 'Profile', x: 329.0 },
    ];
    const y = 10;
    return (<View style={styles.nav}>
      {tabs.map((t) => {
            const on = current === t.key;
            return (<Pressable key={t.key} accessibilityRole="button" accessibilityLabel={t.label} onPress={() => onSelect(t.key)} style={{ position: 'absolute', left: t.x, top: y, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
            {t.key === 'feed' ? <HomeIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle}/> : null}
            {t.key === 'messages' ? <MessagesIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle}/> : null}
            {t.key === 'create' ? <CreateKey on={on}/> : null}
            {t.key === 'activity' ? (<View>
                <ActivityIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle}/>
                {unread ? <View style={[styles.unreadDot, { right: -1, top: -1 }]}/> : null}
              </View>) : null}
            {t.key === 'profile' ? <ProfileIcon size={iconSize.nav} filled={on} color={on ? colors.ink : colors.navIdle}/> : null}
          </Pressable>);
        })}
    </View>);
};
const CreateKey: React.FC<{
    on?: boolean;
}> = ({ on }) => (<View style={[styles.createKey, on ? { borderColor: colors.ink, backgroundColor: colors.ink } : null]}>
    <PlusIcon size={20} color={on ? colors.page : colors.navIdle}/>
  </View>);
export const SortRow: React.FC<{
    label: string;
    top: number;
    label2: string;
    label2Top: number;
    onSort?: () => void;
}> = ({ label, top, label2, label2Top, onSort }) => (<>
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onSort} style={{ position: 'absolute', left: 16, top, height: 20, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.sortRun}>{label}</Text>
      <View style={{ marginLeft: 4 }}>
        <ChevronDownIcon size={15}/>
      </View>
    </Pressable>
    <View style={{ position: 'absolute', left: 283.4, top: label2Top, height: 20, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.sortRun}>{label2}</Text>
      <View style={{ marginLeft: 4 }}>
        <ChevronRightIcon size={15} color={colors.secondary}/>
      </View>
    </View>
  </>);
export const SectionCaption: React.FC<{
    text: string;
    left?: number;
    top: number;
    size?: number;
}> = ({ text, left = 16, top, size = type.body }) => (<Text style={[styles.sectionCaption, { left, top, fontSize: size }]}>{text}</Text>);
export const Hairline: React.FC<{
    top: number;
    left?: number;
    right?: number;
}> = ({ top, left = 0, right = 0 }) => (<View style={{ position: 'absolute', left, right, top, height: 1, backgroundColor: colors.hairline }}/>);
export const CloseKey: React.FC<{
    onPress?: () => void;
    top?: number;
    left?: number;
    label?: string;
}> = ({ onPress, top = 0, left = 0, label = 'Clear' }) => (<Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={{ position: 'absolute', left, top, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
    <CloseIcon size={17} color={colors.secondary}/>
  </Pressable>);
export const MoreKey: React.FC<{
    onPress?: () => void;
    top?: number;
    left?: number;
}> = ({ onPress, top = 13.4, left = 361 }) => (<Pressable accessibilityRole="button" accessibilityLabel="More options" onPress={onPress} style={{ position: 'absolute', left, top, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
    <MoreIcon size={iconSize.more} color={colors.overflowInk}/>
  </Pressable>);
const styles = StyleSheet.create({
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
    headerRow: { position: 'absolute', left: 0, top: -4.3, width: frame.width, height: 48, backgroundColor: 'transparent' },
    postedRun: { position: 'absolute', left: 0, top: 15.4, width: frame.width, height: 17.5, backgroundColor: 'transparent' },
    badgePlate: { position: 'absolute', left: 148.5, top: 0.3, width: 48, height: 48, backgroundColor: 'transparent' },
    badgeMergedRun: { position: 'absolute', left: 16.8, top: 15, width: 24.4, height: 17.5, lineHeight: 17.5, fontSize: 15, color: colors.page },
    overflowPlate: { position: 'absolute', left: 345, top: -5, width: 48, height: 48, backgroundColor: 'transparent' },
    time: { fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    authorChip: { marginLeft: 6, borderRadius: 9, backgroundColor: colors.chip, paddingHorizontal: 7, height: 18, justifyContent: 'center' },
    authorChipText: { fontSize: 11, color: colors.chipInk, fontFamily: 'ThreadsBody' },
    actionKey: { flexDirection: 'row', alignItems: 'center' },
    actionCount: { fontSize: type.body, color: colors.ink, marginLeft: 6, fontFamily: 'ThreadsBody' },
    nav: { position: 'absolute', left: 0, top: 728, width: frame.width, height: 44, backgroundColor: colors.navPlate },
    createKey: { width: 24, height: 24, borderRadius: radius.key, borderWidth: 1.4, borderColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
    unreadDot: { position: 'absolute', right: 1, top: 0, width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.unread },
    homeIndicator: { position: 'absolute', left: 133, top: 76, width: 127, height: 5, borderRadius: 3, backgroundColor: '#1C1C1E' },
    sortRun: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    sectionCaption: { position: 'absolute', fontWeight: weight.bold, color: colors.ink, fontFamily: 'ThreadsBody' },
});
