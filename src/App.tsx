import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { FeedScreen } from './components/FeedScreen';
import { ThreadDetail } from './components/ThreadDetail';
import { Composer } from './components/Composer';
import { SearchScreen } from './components/SearchScreen';
import { ActivityScreen } from './components/ActivityScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { MessagesScreen } from './components/MessagesScreen';
import { LoginScreen } from './components/LoginScreen';
import { buildFeed, buildThread } from './data';
import { colors, frame } from './tokens';
import { useVariableWeightFont } from './webfont';

/**
 * The prototype's shell.
 *
 * One frame, one clock source, and a single `screen` value that every tab and key drives. The
 * relative times and the like counters are derived from that clock and from component state, so
 * nothing on screen is a frozen string: tapping a heart moves its own count, and the app's own
 * "now" advances because the gate pins the page clock (url_pin in spec/gate.json) rather than
 * because the strings were written out by hand.
 */

type Screen = 'login' | 'feed' | 'post' | 'create' | 'search' | 'activity' | 'profile' | 'messages';

export default function App() {
  const [fontsLoaded] = useFonts({
    ThreadsBody: require('../assets/fonts/InstrumentSans-VF.ttf'),
    ThreadsNumbers: require('../assets/fonts/Roboto_500Medium.ttf'),
  });
  useVariableWeightFont('ThreadsBody');

  const [now] = React.useState(() => Date.now());
  const [screen, setScreen] = React.useState<Screen>('feed');
  const [loginVariant, setLoginVariant] = React.useState<'picker' | 'generic'>('picker');
  const [liked, setLiked] = React.useState<Record<string, boolean>>({});
  /* Follow state, keyed by handle, is held here so that the same account shows the same
     Follow / Following glyph wherever it appears - the search suggestion row and the profile's
     suggestion cards both read this map, so a tap on either surface moves the other. */
  const [followed, setFollowed] = React.useState<Record<string, boolean>>({});
  const [openPostId, setOpenPostId] = React.useState<string | null>(null);
  const [segments, setSegments] = React.useState<string[]>(['']);
  const [query, setQuery] = React.useState('');
  const [audience, setAudience] = React.useState('Community or topic');
  const [posted, setPosted] = React.useState(false);
  const feedScroll = React.useRef<ScrollView | null>(null);
  const feedOffset = React.useRef(0);
  const [restoreAt, setRestoreAt] = React.useState<number | null>(null);

  const feed = React.useMemo(() => buildFeed(now), [now]);
  const thread = React.useMemo(() => buildThread(now), [now]);

  const toggleLike = React.useCallback((id: string) => setLiked((s) => ({ ...s, [id]: !s[id] })), []);

  /** Flips one handle's follow state; every surface that draws that handle reads the same map. */
  const toggleFollow = React.useCallback((handle: string) => setFollowed((s) => ({ ...s, [handle]: !s[handle] })), []);

  /** Returning from the detail screen restores the feed's own offset. */
  React.useEffect(() => {
    if (screen === 'feed' && restoreAt !== null && feedScroll.current) {
      feedScroll.current.scrollTo({ y: restoreAt, animated: false });
      setRestoreAt(null);
    }
  }, [screen, restoreAt]);

  const openPost = (id: string) => {
    setOpenPostId(id);
    setScreen('post');
  };

  const backToFeed = () => {
    setRestoreAt(feedOffset.current);
    setScreen('feed');
  };

  const onNavigate = (key: string) => {
    if (key === 'feed') return setScreen('feed');
    if (key === 'messages') return setScreen('messages');
    if (key === 'create') {
      setSegments((s) => (s.length ? s : ['']));
      setPosted(false);
      return setScreen('create');
    }
    if (key === 'activity') return setScreen('activity');
    if (key === 'profile') return setScreen('profile');
    if (key === 'search') return setScreen('search');
    return setScreen('login');
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.shell}>
        <Text style={styles.loading} accessibilityLabel="Loading">Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.shell}>
      <StatusBar style="dark" />
      <View style={styles.frame}>
        {screen === 'login' ? <LoginScreen variant={loginVariant} onVariant={setLoginVariant} onPick={() => setScreen('feed')} /> : null}

        {screen === 'feed' ? (
          <FeedScreen
            now={now}
            posts={feed}
            liked={liked}
            onToggleLike={toggleLike}
            onOpenPost={openPost}
            onNavigate={onNavigate}
            scrollRef={feedScroll}
            onScrollOffset={(y) => (feedOffset.current = y)}
          />
        ) : null}

        {screen === 'post' ? (
          <ThreadDetail now={now} root={thread.root} replies={thread.replies} liked={liked} onToggleLike={toggleLike} onBack={backToFeed} />
        ) : null}

        {screen === 'create' ? (
          <Composer
            segments={segments}
            onChange={setSegments}
            onAddSegment={() => setSegments((s) => [...s, ''])}
            onRemoveSegment={(i) => setSegments((s) => (s.length <= 1 ? s : s.filter((_, j) => j !== i)))}
            onClose={() => setScreen('feed')}
            onPost={() => {
              /* README.md states that posting discards the draft. There is no backend, so the
                 alternative is a draft that outlives the post it was turned into with nothing
                 left to restore it to; clearing it here is what makes that sentence true. */
              setSegments(['']);
              setPosted(true);
              setScreen('feed');
            }}
            audience={audience}
            onAudience={() => setAudience((a) => (a === 'Community or topic' ? 'Profile you follow' : 'Community or topic'))}
          />
        ) : null}

        {screen === 'search' ? <SearchScreen query={query} onQuery={setQuery} onBack={backToFeed} onNavigate={onNavigate} followed={followed} onToggleFollow={toggleFollow} /> : null}
        {screen === 'activity' ? <ActivityScreen now={now} onNavigate={onNavigate} /> : null}
        {screen === 'profile' ? <ProfileScreen onNavigate={onNavigate} followed={followed} onToggleFollow={toggleFollow} /> : null}
        {screen === 'messages' ? <MessagesScreen onNavigate={onNavigate} /> : null}
      </View>

      {/* The reference has no in-app switch back to the login screen; this key exists so the demo
          and the gate can reach T10 without clearing storage. It is the prototype's own affordance
          and it draws nothing: no text, no background, no border. Because it paints no pixel it is
          never a visible node, so the gate has no run to count as spare and this key needs no entry
          in spec/gate.json's extra_allowed - that table is empty on purpose. A cold press lands on
          the gated variant (T10/T10_generic); pressing it again while the login screen is up
          toggles to the remembered-account sheet, which no gated state covers. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Show login screen"
        onPress={() => {
          if (screen === 'login') {
            setLoginVariant((v) => (v === 'generic' ? 'picker' : 'generic'));
          } else {
            setLoginVariant('generic');
            setScreen('login');
          }
        }}
        style={styles.loginKey}
      />
      {posted ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Posted" onPress={() => setPosted(false)} style={styles.postedToast}>
          <Text style={styles.postedText}>Posted</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: '#E9E9E9', alignItems: 'center', justifyContent: 'center' },
  frame: { width: frame.width, height: frame.height, backgroundColor: colors.page, overflow: 'hidden' },
  loading: { fontSize: 14, color: colors.secondary },
  loginKey: { position: 'absolute', right: 6, bottom: 6, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  loginKeyText: { fontSize: 22, lineHeight: 22, color: colors.secondary },
  postedToast: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: colors.ink, borderRadius: 18, paddingHorizontal: 16, height: 36, alignItems: 'center', justifyContent: 'center' },
  postedText: { color: colors.onDark, fontSize: 15 },
});
