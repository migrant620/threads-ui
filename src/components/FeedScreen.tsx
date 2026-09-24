import * as React from 'react';
import { Image, PanResponder, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, ActionRow, BottomNav, Hairline, PostHeader, TopBar } from './Chrome';
import { formatCount, type Post } from '../data';
import { colors, feedRows, frame, radius, rhythm, space, tracking, type, weight } from '../tokens';
type Props = {
    now: number;
    posts: Post[];
    liked: Record<string, boolean>;
    onToggleLike: (id: string) => void;
    onOpenPost: (id: string) => void;
    onNavigate: (key: string) => void;
    scrollRef?: React.RefObject<ScrollView | null>;
    onScrollOffset?: (y: number) => void;
};
const FEED_TOP = 115.6;
const FEED_HEIGHT = 728 - FEED_TOP;
const TRIGGER = 30;
const MAX_PULL = 70;
const REFRESH_MS = 900;
export const FeedScreen: React.FC<Props> = ({ now, posts, liked, onToggleLike, onOpenPost, onNavigate, scrollRef, onScrollOffset }) => {
    const [pull, setPull] = React.useState(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const offset = React.useRef(0);
    const pulled = React.useRef(0);
    const busy = React.useRef(false);
    const begin = React.useCallback(() => {
        busy.current = true;
        pulled.current = 44;
        setPull(44);
        setRefreshing(true);
        setTimeout(() => {
            busy.current = false;
            pulled.current = 0;
            setPull(0);
            setRefreshing(false);
        }, REFRESH_MS);
    }, []);
    const responder = React.useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_e, g) => !busy.current && offset.current <= 0 && g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderMove: (_e, g) => {
            const d = Math.max(0, Math.min(MAX_PULL, g.dy * 0.5));
            pulled.current = d;
            setPull(d);
        },
        onPanResponderRelease: () => {
            if (pulled.current >= TRIGGER)
                begin();
            else {
                pulled.current = 0;
                setPull(0);
            }
        },
        onPanResponderTerminate: () => {
            pulled.current = 0;
            setPull(0);
        },
    }), [begin]);
    return (<View style={styles.screen}>
      <TopBar left="menu" wordmark right={['search']} onRight={(k) => (k === 'search' ? onNavigate('search') : undefined)}/>
      <ComposerEntry onPress={() => onNavigate('create')}/>
      <Hairline top={FEED_TOP}/>
      {refreshing || pull > 0 ? (<View accessibilityRole="progressbar" accessibilityLabel={refreshing ? 'Refreshing' : 'Pull to refresh feed'} style={[styles.pullRow, { top: FEED_TOP + Math.max(0, pull) / 2 - 12 }]}>
          <View style={styles.spinner}/>
        </View>) : null}
      <View style={styles.feedArea} {...responder.panHandlers}>
        <ScrollView ref={scrollRef} style={styles.scroller} contentContainerStyle={{ paddingTop: pull, paddingBottom: 8 }} onScroll={(e) => {
            const y = e.nativeEvent.contentOffset.y;
            offset.current = y;
            onScrollOffset?.(y);
        }} scrollEventThrottle={16}>
          {posts.map((p, i) => (<PostCard key={p.id} post={p} index={i} now={now} liked={!!liked[p.id]} onToggleLike={() => onToggleLike(p.id)} onOpen={() => onOpenPost(p.id)}/>))}
        </ScrollView>
      </View>
      <BottomNav current="feed" onSelect={onNavigate}/>
    </View>);
};
const ComposerEntry: React.FC<{
    onPress: () => void;
}> = ({ onPress }) => (<Pressable accessibilityRole="button" accessibilityLabel="Create a new thread" onPress={onPress} style={styles.composerEntry}>
    <View style={{ position: 'absolute', left: space.avatarLeft, top: 54.1 }}>
      <Avatar source={require('../../assets/images/a01.webp')} label="m620ui profile photo"/>
    </View>
    
    <Text accessibilityLabel="m620ui" style={[styles.composerHandle, { top: 58.5 }]}>m620ui</Text>
    <Text style={[styles.composerPrompt, { top: 80 }]}>What&apos;s new?</Text>
  </Pressable>);
export const PostCard: React.FC<{
    post: Post;
    now: number;
    liked: boolean;
    onToggleLike: () => void;
    onOpen: () => void;
    index?: number;
}> = ({ post, now, liked, onToggleLike, onOpen, index = 0, }) => (<View style={{ width: frame.width }}>
    <PostHeader avatar={post.avatar} handle={post.handle} verified={post.verified} time={relTime(post.postedAt, now)} row={feedRows[index] ?? feedRows[0]} onOpen={onOpen} openLabel={index === 0 ? 'Open post' : `Open post by ${post.handle}`}/>
    
    
    <View style={[styles.bodyBox, index === 1 ? styles.bodyLift : null]}>
      <Text style={styles.body}>
        {post.body}
        {post.link ? (<>
            {' '}
            <Text style={styles.link}>{flushLink(post.link)}</Text>
          </>) : null}
      </Text>
    </View>
    {post.photo ? (<View style={styles.mediaBlock}>
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.mediaPlate}>
          <Pressable accessibilityRole="button" accessibilityLabel="Photo preview" style={styles.media}>
            <Image source={post.photo} style={styles.mediaImage} resizeMode="cover"/>
          </Pressable>
        </Pressable>
      </View>) : (<View style={{ height: rhythm.post.bodyToActions }}/>)}
    <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.actionPlate}>
      <View style={styles.actionInset}>
        <ActionRow likes={post.likes + (liked ? 1 : 0)} replies={post.replies} reposts={post.reposts} liked={liked} onLike={onToggleLike} likeLabel={formatCount(post.likes + (liked ? 1 : 0))}/>
      </View>
    </Pressable>
    <View style={{ height: rhythm.post.actionsToHairline }}/>
    <View style={styles.separator}/>
  </View>);
const flushLink = (link: string) => (link.length > 18 ? `${link.slice(0, 17)}…` : link);
const relTime = (postedAt: number, now: number) => {
    const s = Math.max(1, Math.floor((now - postedAt) / 1000));
    if (s < 60)
        return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60)
        return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24)
        return `${h}h`;
    return `${Math.floor(h / 24)}d`;
};
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
    composerEntry: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 115.6 },
    feedArea: { position: 'absolute', left: 0, top: FEED_TOP, width: frame.width, height: FEED_HEIGHT },
    scroller: { flex: 1 },
    pullRow: { position: 'absolute', left: 0, width: frame.width, height: 24, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
    spinner: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.disabled, borderTopColor: colors.secondary },
    composerHandle: { position: 'absolute', left: space.gutter, fontSize: type.body, fontWeight: weight.medium, color: colors.ink, letterSpacing: -0.35, fontFamily: 'ThreadsBody' },
    composerPrompt: { position: 'absolute', left: space.gutter, width: 332.7, fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    bodyBox: { marginLeft: space.gutter, width: 320.7 },
    bodyLift: { marginTop: -4.5 },
    body: { fontSize: type.body, lineHeight: type.bodyLine, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },
    link: { color: colors.verified },
    mediaBlock: { position: 'relative', width: frame.width, height: 396, marginTop: rhythm.post.bodyToMedia },
    mediaPlate: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 396 },
    media: { position: 'absolute', left: space.gutter, top: 0, width: 316.7, height: 396, borderRadius: radius.media, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
    mediaImage: { width: '100%', height: '100%' },
    actionPlate: { position: 'relative', width: frame.width, height: 43.3 },
    actionInset: { position: 'relative', left: 0, top: 0, width: frame.width, height: 43.3 },
    separator: { height: 1, backgroundColor: colors.hairline },
});
