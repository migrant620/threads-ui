import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, BottomNav, Verified } from './Chrome';
import { CloseIcon, InsightsIcon, InstagramMark, PlusIcon, ProfileIcon, SearchIcon, SettingsIcon } from './Icons';
import { account, suggestions } from '../data';
import { colors, frame, icons as iconSize, radius, tracking, type, weight } from '../tokens';
type Props = {
    onNavigate: (key: string) => void;
};
const TABS = ['Threads', 'Replies', 'Media', 'Reposts'] as const;
const TAB = [
    { x: 20.74, w: 60.0, size: 15.5, wgt: weight.medium, trk: -0.3 },
    { x: 121.54, w: 54.5, size: 16, wgt: weight.soft },
    { x: 224.16, w: 46.0, size: 15.5, wgt: weight.medium },
    { x: 315.49, w: 59.5, size: 15, wgt: weight.strong },
];
const CARD = [
    { avatarX: 54.22, nameX: 43.67, handleX: 54.95, followX: 30.2, followW: 127.72, dismissX: 131.0, badgeX: 56.4 },
    { avatarX: 218.33, nameX: 242.71, handleX: 256.91, followX: 194.32, followW: 127.72, dismissX: 295.11, badgeX: 220.52 },
    { avatarX: 382.45, nameX: 375.9, handleX: null, followX: 358.43, followW: 34.57, dismissX: null, badgeX: 384.63 },
];
export const ProfileScreen: React.FC<Props> = ({ onNavigate }) => {
    const [tab, setTab] = React.useState<string>('Threads');
    return (<View style={styles.screen}>
      
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.topIcon}/>
        <Pressable accessibilityRole="button" accessibilityLabel="Insights" style={[styles.topKey, { left: 4 }]}>
          <InsightsIcon size={iconSize.topBar}/>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Search" style={[styles.topKey, { left: 244.9 }]}>
          <SearchIcon size={iconSize.topBar}/>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Instagram" style={[styles.topKey, { left: 292.93 }]}>
          <InstagramMark size={iconSize.topBar} color={colors.ink}/>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" style={[styles.topKey, { left: 340.96 }]}>
          <SettingsIcon size={iconSize.topBar}/>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: frame.width, height: 690 }}>
          
          <Pressable accessibilityRole="button" accessibilityLabel="Profile picture" style={styles.ownAvatar}>
            <ProfileIcon size={40} color={colors.ink}/>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Add interests" style={[styles.addPlate, { left: 284.2, top: 79.69 }]}>
            
            <View style={styles.addBadge}>
              <PlusIcon size={18} color={colors.ink}/>
            </View>
          </Pressable>

          <Text style={[styles.displayName, { top: 70.59 }]}>{account.display}</Text>
          <Text style={[styles.handle, { top: 102.62 }]}>{account.handle}</Text>

          <Pressable accessibilityRole="button" accessibilityLabel="Add interests" style={[styles.interestsPill, { top: 129.4 }]}>
            <Text style={styles.interestsRun}>+ Add interests</Text>
          </Pressable>

          <Text style={[styles.followers, { top: 176.12 }]}>{account.followers} followers</Text>

          <Pressable accessibilityRole="button" accessibilityLabel="Edit profile" style={[styles.plate, { left: 16, top: 214.71 }]}>
            <Text style={styles.plateRunEdit}>Edit profile</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Share profile" style={[styles.plate, { left: 201.5, top: 214.71 }]}>
            <Text style={styles.plateRunShare}>Share profile</Text>
          </Pressable>

          <Text style={[styles.sectionRun, { left: 16, top: 274.74 }]}>People you may know</Text>

          
          {CARD.map((c, i) => {
            const s = suggestions[i];
            if (!s)
                return null;
            return (<React.Fragment key={s.id}>
                <View style={{ position: 'absolute', left: c.avatarX, top: 322.41, width: 80, height: 80 }}>
                  <Avatar source={s.avatar} size={80} label="Profile picture."/>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Profile picture verified badge." style={{ position: 'absolute', left: c.badgeX, top: 380.26, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <Verified size={16}/>
                </Pressable>
                <Text style={[styles.cardName, { left: c.nameX, top: 410.47 }]} numberOfLines={1}>
                  {s.handle}
                </Text>
                {c.handleX !== null ? (<Text style={[styles.cardHandle, { left: c.handleX, top: 431.94 }]} numberOfLines={1}>
                    {s.handle}
                  </Text>) : null}
                <Pressable accessibilityRole="button" accessibilityLabel="Follow" style={[styles.cardFollow, { left: c.followX, top: 457.04, width: c.followW }]}>
                  <Text style={styles.cardFollowText}>Follow</Text>
                </Pressable>
                {c.dismissX !== null ? (<Pressable accessibilityRole="button" accessibilityLabel="Dismiss action to hide user." style={{ position: 'absolute', left: c.dismissX, top: 301.3, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
                    <CloseIcon size={16} color={colors.secondary}/>
                  </Pressable>) : null}
              </React.Fragment>);
        })}

          
          {TABS.map((t, i) => {
            const on = tab === t;
            return (<Pressable key={t} accessibilityRole="button" accessibilityLabel={t} onPress={() => setTab(t)} style={{ position: 'absolute', left: TAB[i].x, top: 544.38, width: TAB[i].w, height: 20, justifyContent: 'center' }}>
                <Text numberOfLines={1} style={[
                    styles.tabRun,
                    { fontSize: TAB[i].size, fontWeight: TAB[i].wgt },
                    'trk' in TAB[i] ? { letterSpacing: TAB[i].trk } : null,
                    on ? { color: colors.ink } : null,
                ]}>
                  {t}
                </Text>
                {on ? (<View style={{ position: 'absolute', left: TAB[i].w / 2 - 20, top: 19, width: 40, height: 2, backgroundColor: colors.ink }}/>) : null}
              </Pressable>);
        })}

          
          <Text style={[
            styles.emptyRun,
            tab === 'Threads'
                ? { left: 125.5417, top: 640.81, width: 142.2806, textAlign: 'center', fontSize: 14.5, fontWeight: weight.semibold, color: colors.ink }
                : tab === 'Replies'
                    ? { left: 67.3194, top: 639.72, fontSize: 17, fontWeight: weight.regular, color: colors.secondary }
                    : tab === 'Reposts'
                        ? { left: 56.403, top: 639.72, fontSize: 17, fontWeight: weight.regular, color: colors.secondary }
                        : { left: 67.3194, top: 639.72, fontSize: 17, fontWeight: weight.regular, color: colors.secondary },
        ]}>
            {tab === 'Threads'
            ? 'Post your first thread'
            : tab === 'Replies'
                ? "Nothing you've replied to yet."
                : tab === 'Reposts'
                    ? "Nothing you've reposted yet."
                    : `No ${tab.toLowerCase()} yet`}
          </Text>
        </View>
      </ScrollView>

      <BottomNav current="profile" onSelect={onNavigate} unread={false}/>
    </View>);
};
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
    topBar: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 56, zIndex: 20 },
    topIcon: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 56 },
    topKey: { position: 'absolute', top: 4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    scroll: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.navTop },
    displayName: { position: 'absolute', left: 16, fontSize: 23, fontWeight: weight.semibold, lineHeight: 28, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },
    handle: { position: 'absolute', left: 16, fontSize: 15, lineHeight: 18.3, fontWeight: weight.medium, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },
    addPlate: { position: 'absolute', width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    addBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
    ownAvatar: { position: 'absolute', left: 312.94, top: 56.04, width: 64.04, height: 64.04, borderRadius: 32.02, backgroundColor: '#DBDBDB', alignItems: 'center', justifyContent: 'center' },
    interestsPill: { position: 'absolute', left: 16, width: 113, height: 32, borderRadius: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    interestsRun: { fontSize: 13, fontWeight: weight.soft, letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    followers: { position: 'absolute', left: 16, fontSize: 15, fontWeight: weight.soft, letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    plate: { position: 'absolute', height: 32, width: 175.3, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    plateRunEdit: { fontSize: 15.5, fontWeight: weight.medium, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },
    plateRunShare: { fontSize: 15, fontWeight: weight.strong, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },
    sectionRun: { position: 'absolute', fontSize: 15, fontWeight: weight.semibold, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },
    cardName: { position: 'absolute', fontSize: 15, fontWeight: weight.semibold, lineHeight: 18, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody', width: 160 },
    cardHandle: { position: 'absolute', fontSize: 14, lineHeight: 16, letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody', width: 160 },
    cardFollow: { position: 'absolute', height: 48, borderRadius: radius.pill, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
    cardFollowText: { fontSize: 15, fontWeight: weight.semibold, letterSpacing: tracking.body, color: colors.onDark, fontFamily: 'ThreadsBody' },
    tabRun: { color: colors.tertiary, fontFamily: 'ThreadsBody' },
    emptyRun: { position: 'absolute', letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
});
