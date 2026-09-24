import * as React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomNav, TopBar, Verified } from './Chrome';
import { BellIcon, CloseIcon, MoreIcon } from './Icons';
import { colors, frame, tracking, weight } from '../tokens';
import { relativeTime } from '../data';
type Props = {
    now: number;
    onNavigate: (key: string) => void;
};
const CATEGORIES: Array<{
    label: string;
    left: number;
    width: number;
}> = [
    { label: 'All', left: 14.2, width: 50.2 },
    { label: 'Follows', left: 71.0, width: 84.6 },
    { label: 'Conversations', left: 162.5, width: 131.0 },
    { label: 'Mentions', left: 300.4, width: 96.7 },
];
const ROW_AGE_MS = [7 * 60 * 60 * 1000, 7 * 60 * 60 * 1000];
const ROWS: Array<{
    id: string;
    avatar: number;
    verified: boolean;
}> = [
    { id: 'n1', avatar: require('../../assets/images/a03.webp'), verified: true },
    { id: 'n2', avatar: require('../../assets/images/a04.webp'), verified: true },
];
const BANNER = 'We confirmed a new sign-in for this device and updated your account security.';
const BODY = [
    'Review your settings to control how much suggested content appears in your feed.',
    'Your profile is visible to everyone. You can edit your privacy settings anytime.',
];
const RowHairline: React.FC<{
    top: number;
}> = ({ top }) => (<View style={[styles.rowHairline, { top }]}/>);
export const ActivityScreen: React.FC<Props> = ({ now, onNavigate }) => {
    const [tab, setTab] = React.useState('All');
    const bannerAge = relativeTime(now - ROW_AGE_MS[0], now);
    return (<View style={styles.screen}>
      <TopBar left="none" title="Activity" titleGeo={{ left: 16, top: 13.5, height: 37.5, fontSize: 28.9, lineHeight: 37.5 }} right={[{ key: 'bell', label: 'Enable notifications', left: 121.2, top: 8, width: 48 }]}/>

      
      {CATEGORIES.map((c) => {
            const on = tab === c.label;
            return (<Pressable key={c.label} accessibilityRole="button" accessibilityLabel={c.label} onPress={() => setTab(c.label)} style={[
                    styles.chip,
                    { left: c.left, width: c.width },
                    on ? styles.chipOn : styles.chipOff,
                ]}>
            <Text style={styles.chipRun}>{c.label}</Text>
          </Pressable>);
        })}

      <Text style={styles.sectionLabel}>New</Text>
      <RowHairline top={117.5}/>

      
      <Image source={require('../../assets/images/a01.webp')} style={styles.bannerAvatar}/>
      <Text style={[styles.body, styles.bannerBody]}>{`${BANNER} ${bannerAge}`}</Text>
      <RowHairline top={205.2}/>

      
      {ROWS.map((r, i) => {
            const rowTop = 210.3 + i * 87.7;
            const age = relativeTime(now - ROW_AGE_MS[i], now);
            return (<React.Fragment key={r.id}>
            
            <Pressable accessibilityRole="button" accessibilityLabel="" style={[styles.avatarPlate, { top: rowTop }]}>
              <Image source={r.avatar} style={styles.avatarImage}/>
            </Pressable>
            
            <Pressable accessibilityRole="button" accessibilityLabel={`m620ui ${age}`} style={[styles.authorRun, { top: rowTop + 4.8 }]}>
              <Text style={styles.handle}>m620ui</Text>
              <View style={styles.badgeBox}>
                <Verified size={14.9}/>
              </View>
              <Text style={styles.timeRun}>{age}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="" style={[styles.overflowPlate, { top: rowTop - 10.2 }]}>
              <Pressable accessibilityRole="button" accessibilityLabel="More options" style={styles.moreKey}>
                <MoreIcon size={16} color={colors.overflowInk}/>
              </Pressable>
            </Pressable>
            <Text style={[styles.body, { top: rowTop + 29.2 }]}>{BODY[i]}</Text>
            
            {i === 0 ? <RowHairline top={rowTop + 82.6}/> : null}
          </React.Fragment>);
        })}

      
      <View style={styles.footer}>
        <View style={styles.footerGlyph}>
          <BellIcon size={14.6} color={colors.secondary}/>
        </View>
        <Text style={styles.footerRun}>Notifications are paused.</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Turn on" style={styles.turnOnKey}>
          <Text style={styles.turnOnRun}>Turn on</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.dismissKey}>
          <CloseIcon size={22} color={colors.ink}/>
        </Pressable>
      </View>

      <BottomNav current="activity" onSelect={onNavigate} unread={false}/>
    </View>);
};
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
    chip: { position: 'absolute', top: 64, height: 33.2, borderRadius: 16.6, alignItems: 'center', justifyContent: 'center' },
    chipOn: { backgroundColor: colors.chip },
    chipOff: { borderWidth: 1, borderColor: colors.hairline },
    chipRun: { fontSize: 15, lineHeight: 17.5, letterSpacing: 0, fontWeight: weight.medium, color: colors.ink, fontFamily: 'ThreadsBody' },
    sectionLabel: { position: 'absolute', left: 16, top: 115.7, fontSize: 15, lineHeight: 17.5, letterSpacing: 0, fontWeight: weight.medium, color: colors.ink, fontFamily: 'ThreadsBody' },
    bannerAvatar: { position: 'absolute', left: 16, top: 153.2, width: 35.7, height: 35.7, borderRadius: 17.85 },
    bannerBody: { top: 153.2 },
    rowHairline: { position: 'absolute', left: 68, width: frame.width - 68, height: 1, backgroundColor: 'rgb(217,217,217)' },
    body: { position: 'absolute', left: 68, width: 308.9, fontSize: 15.5, lineHeight: 19.3, letterSpacing: tracking.body, color: colors.ink, fontFamily: 'ThreadsBody' },
    avatarPlate: { position: 'absolute', left: 10.2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    avatarImage: { width: 35.7, height: 35.7, borderRadius: 17.85 },
    authorRun: { position: 'absolute', left: 68, width: 89.9, height: 19.0 },
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
