import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomNav, TopBar } from './Chrome';
import { BellIcon, FiltersIcon, ImageIcon, InstagramMark, SearchIcon } from './Icons';
import { colors, frame, tracking, weight } from '../tokens';
type Props = {
    onNavigate: (key: string) => void;
};
const CHIP_TOP = 110.3;
const CHIP_H = 33.5;
const CHIP_RADIUS = 16.75;
const CHIP_INK = 'rgb(217,217,217)';
export const MessagesScreen: React.FC<Props> = ({ onNavigate }) => (<View style={styles.screen}>
    <TopBar left="none" title="Messages" titleGeo={{ left: 16, top: 9.5, height: 37.5, fontSize: 32, lineHeight: 37.5, letterSpacing: -1.05 }} right={[]}/>

    
    <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.muteKey}>
      <View style={styles.muteGlyph}>
        <BellIcon size={22.6} color={colors.ink}/>
        <View style={styles.muteSlash}/>
      </View>
    </Pressable>

    
    <Pressable accessibilityRole="button" accessibilityLabel="New message" style={styles.composeKey}>
      <ImageIcon size={22.6}/>
    </Pressable>

    
    <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.searchRow}>
      <View style={styles.searchPlate} aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.searchGlyph}>
          <SearchIcon size={19} color={colors.searchInk}/>
        </View>
        <Text style={styles.searchHint}>Search</Text>
      </View>
    </Pressable>

    
    
    <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.filterColumn}>
      <View accessibilityRole="button" accessibilityLabel="Inbox filters" pointerEvents="none" style={styles.filterKey}>
        <FiltersIcon size={15} color={colors.ink}/>
      </View>
    </Pressable>

    <View style={[styles.chipPlate, styles.chipOn, { left: 70.2, width: 70.6 }]}/>
    <Text style={[styles.chipRun, { left: 86.2 }]}>Inbox</Text>

    <View style={[styles.chipPlate, styles.chipOff, { left: 148.8, width: 97.1 }]}/>
    <Text style={[styles.chipRun, { left: 164.8 }]}>Requests</Text>

    
    <View style={styles.emptyPlate}>
      <View style={styles.emptyMark}>
        <InstagramMark size={22} color={colors.onDark}/>
      </View>
      <View style={styles.emptyRuleBox}>
        <View style={[styles.emptyRule, { top: 0, width: 42 }]}/>
        <View style={[styles.emptyRule, { top: 11, width: 30 }]}/>
      </View>
      <View style={styles.emptyBadge}>
        <View style={styles.emptyEnvelope}/>
      </View>
    </View>

    <Text style={styles.emptyTitle}>Everything lands here</Text>
    <Text style={styles.emptyBody}>Turn on alerts so your replies land here.</Text>

    
    
    <Pressable accessibilityRole="button" accessibilityLabel="Enable notifications" style={styles.cta}>
      <Text style={styles.ctaRun}>Enable notifications</Text>
    </Pressable>

    <BottomNav current="messages" onSelect={onNavigate} unread={false}/>
  </View>);
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
    muteKey: { position: 'absolute', left: 159.4, top: 4.4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
    muteGlyph: { width: 22.6, height: 22.6, alignItems: 'center', justifyContent: 'center' },
    muteSlash: { position: 'absolute', width: 1.4, height: 27, backgroundColor: colors.ink, transform: [{ rotate: '45deg' }] },
    composeKey: { position: 'absolute', left: 341, top: 4.4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', zIndex: 30 },
    searchRow: { position: 'absolute', left: 0, top: 54.2, width: frame.width, height: 48 },
    searchPlate: { position: 'absolute', left: 16, top: 1.8, width: 361, height: 44.1, borderRadius: 16, backgroundColor: colors.navPlate },
    searchGlyph: { position: 'absolute', left: 11.6, top: 10.6 },
    searchHint: { position: 'absolute', left: 36, top: 12.4, fontSize: 15.4, lineHeight: 17.5, letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    filterColumn: { position: 'absolute', left: 14.2, top: 103, width: 48, height: 48 },
    filterKey: { position: 'absolute', left: 0, top: 7.3, width: 48, height: CHIP_H, borderRadius: CHIP_RADIUS, borderWidth: 1, borderColor: CHIP_INK, alignItems: 'center', justifyContent: 'center' },
    chipPlate: { position: 'absolute', top: CHIP_TOP, height: CHIP_H, borderRadius: CHIP_RADIUS },
    chipOn: { backgroundColor: colors.chip },
    chipOff: { borderWidth: 1, borderColor: CHIP_INK },
    chipRun: { position: 'absolute', top: 118.3, fontSize: 15, lineHeight: 17.5, letterSpacing: 0, fontWeight: weight.medium, color: colors.ink, fontFamily: 'ThreadsBody' },
    emptyPlate: { position: 'absolute', left: 84.1, top: 329.0, width: 224.8, height: 60, borderRadius: 12, backgroundColor: colors.navPlate },
    emptyMark: { position: 'absolute', left: 16.4, top: 13.2, width: 33.6, height: 33.6, borderRadius: 9, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
    emptyRuleBox: { position: 'absolute', left: 62, top: 20 },
    emptyRule: { position: 'absolute', left: 0, height: 5, borderRadius: 2.5, backgroundColor: '#E5E5E5' },
    emptyBadge: { position: 'absolute', left: 172, top: 13.2, width: 33.6, height: 33.6, borderRadius: 16.8, backgroundColor: '#E0E0E0', alignItems: 'center', justifyContent: 'center' },
    emptyEnvelope: { width: 15, height: 11, borderRadius: 1.6, backgroundColor: colors.onDark },
    emptyTitle: { position: 'absolute', left: 74.597, top: 413.014, fontSize: 24, lineHeight: 28.019, letterSpacing: tracking.name, fontWeight: weight.bold, color: colors.ink, fontFamily: 'ThreadsBody' },
    emptyBody: { position: 'absolute', left: 61.861, top: 449.039, fontSize: 15.4, lineHeight: 17.467, letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    cta: { position: 'absolute', left: 109.2, top: 512.5, width: 175, height: 32.5, borderRadius: 16.25, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
    ctaRun: { fontSize: 15, lineHeight: 17.5, letterSpacing: 0, fontWeight: weight.medium, color: colors.onDark, fontFamily: 'ThreadsBody' },
});
