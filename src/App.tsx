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
        if (key === 'feed')
            return setScreen('feed');
        if (key === 'messages')
            return setScreen('messages');
        if (key === 'create') {
            setSegments((s) => (s.length ? s : ['']));
            setPosted(false);
            return setScreen('create');
        }
        if (key === 'activity')
            return setScreen('activity');
        if (key === 'profile')
            return setScreen('profile');
        if (key === 'search')
            return setScreen('search');
        return setScreen('login');
    };
    if (!fontsLoaded) {
        return (<View style={styles.shell}>
        <Text style={styles.loading} accessibilityLabel="Loading">Loading</Text>
      </View>);
    }
    return (<View style={styles.shell}>
      <StatusBar style="dark"/>
      <View style={styles.frame}>
        {screen === 'login' ? <LoginScreen variant={loginVariant} onVariant={setLoginVariant} onPick={() => setScreen('feed')}/> : null}

        {screen === 'feed' ? (<FeedScreen now={now} posts={feed} liked={liked} onToggleLike={toggleLike} onOpenPost={openPost} onNavigate={onNavigate} scrollRef={feedScroll} onScrollOffset={(y) => (feedOffset.current = y)}/>) : null}

        {screen === 'post' ? (<ThreadDetail now={now} root={thread.root} replies={thread.replies} liked={liked} onToggleLike={toggleLike} onBack={backToFeed}/>) : null}

        {screen === 'create' ? (<Composer segments={segments} onChange={setSegments} onAddSegment={() => setSegments((s) => [...s, ''])} onRemoveSegment={(i) => setSegments((s) => (s.length <= 1 ? s : s.filter((_, j) => j !== i)))} onClose={() => setScreen('feed')} onPost={() => {
                setSegments(['']);
                setPosted(true);
                setScreen('feed');
            }} audience={audience} onAudience={() => setAudience((a) => (a === 'Community or topic' ? 'Profile you follow' : 'Community or topic'))}/>) : null}

        {screen === 'search' ? <SearchScreen query={query} onQuery={setQuery} onBack={backToFeed} onNavigate={onNavigate}/> : null}
        {screen === 'activity' ? <ActivityScreen now={now} onNavigate={onNavigate}/> : null}
        {screen === 'profile' ? <ProfileScreen onNavigate={onNavigate}/> : null}
        {screen === 'messages' ? <MessagesScreen onNavigate={onNavigate}/> : null}
      </View>

      
      <Pressable accessibilityRole="button" accessibilityLabel="Show login screen" onPress={() => {
            if (screen === 'login') {
                setLoginVariant((v) => (v === 'generic' ? 'picker' : 'generic'));
            }
            else {
                setLoginVariant('generic');
                setScreen('login');
            }
        }} style={styles.loginKey}/>
      {posted ? (<Pressable accessibilityRole="button" accessibilityLabel="Posted" onPress={() => setPosted(false)} style={styles.postedToast}>
          <Text style={styles.postedText}>Posted</Text>
        </Pressable>) : null}
    </View>);
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
