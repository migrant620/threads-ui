import * as React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, BottomNav, TopBar, Verified } from './Chrome';
import { ChevronDownIcon, ChevronRightIcon, SearchIcon, VerifiedIcon } from './Icons';
import { searchAccounts, suggestions, trending } from '../data';
import { colors, frame, type, weight } from '../tokens';
const SEP = '\ufffd';
type Props = {
    query: string;
    onQuery: (v: string) => void;
    onBack: () => void;
    onNavigate: (key: string) => void;
};
const TREND_TOP = 178.7;
const TREND_PITCH = 86.4;
const RESULT_ROWS: Array<{
    handle: number;
    avatar: number;
    name: number | null;
    badge?: number;
    nameDy?: number;
    handleInk?: string;
    nameInk?: string;
}> = [
    { handle: 76.4, avatar: 77.1, name: 96.1, badge: 105.5 },
    { handle: 136.5, avatar: 137.2, name: null },
    { handle: 186.7, avatar: 187.4, name: null },
    { handle: 227.1, avatar: 227.8, name: 246.7, badge: 119.4 },
    { handle: 277.3, avatar: 278.0, name: 296.9, badge: 164.5 },
    { handle: 327.5, avatar: 328.2, name: 347.1 },
    { handle: 377.7, avatar: 378.4, name: 397.4 },
    { handle: 424.7, avatar: 428.7, name: 444.3, nameDy: 3.7 },
    { handle: 478.1, avatar: 478.9, name: 497.8, nameInk: '#F8F8F8' },
    { handle: 528.4, avatar: 529.1, name: 548.0, handleInk: '#EFEFEF', nameInk: '#44474F' },
    { handle: 578.6, avatar: 579.3, name: 598.2, handleInk: '#EFEFEF', nameInk: '#1B1B1F' },
    { handle: 628.8, avatar: 629.5, name: 648.4, handleInk: '#EFEFEF', nameInk: '#EFEFEF' },
    { handle: 677.6, avatar: 679.7, name: 697.2, badge: 163.4, handleInk: '#1B1B1F' },
];
export const SearchScreen: React.FC<Props> = ({ query, onQuery, onBack, onNavigate }) => {
    const typed = query.trim();
    return typed.length > 0 ? (<Results query={query} onQuery={onQuery} onBack={onBack} onNavigate={onNavigate}/>) : (<Landing query={query} onQuery={onQuery} onBack={onBack} onNavigate={onNavigate}/>);
};
const Landing: React.FC<Props> = ({ query, onQuery, onBack, onNavigate }) => (<View style={styles.screen}>
    <TopBar left="back" onLeft={onBack} leftGeo={{ left: 0, top: 8.4, width: 60 }} title="Search" titleGeo={{ left: 60, top: 13.5, height: 37.5, fontSize: 30.9, lineHeight: 37.5 }} right={[]}/>

    
    <View style={styles.fieldPill}/>
    <View style={styles.fieldGlyph} pointerEvents="none">
      <SearchIcon size={14.2} color={colors.secondary}/>
    </View>

    <ScrollView style={styles.body} contentContainerStyle={{ height: 700 }} scrollEnabled={false}>
      
      <View style={styles.sectionMarker}/>
      <Text style={styles.sectionTitle}>Trending now</Text>

      <Text style={styles.subtitle}>
        {'What the community is talking about now '}
        {SEP}
      </Text>
      
      <View style={styles.subtitleMask}/>
      <View style={styles.subtitleChevron} pointerEvents="none">
        <ChevronRightIcon size={11} color={colors.secondary}/>
      </View>

      {trending.map((t, i) => {
        const top = TREND_TOP + i * TREND_PITCH;
        return (<View key={t.id} style={{ position: 'absolute', left: 0, top, width: frame.width, height: TREND_PITCH }}>
            <Text style={[styles.trendTitle, { top: 0 }]} numberOfLines={1}>
              {t.topic}
            </Text>
            <Text style={[styles.trendSummary, { top: 21.4, width: t.thumb ? 294.8 : 361 }]} numberOfLines={2}>
              {t.summary}
            </Text>
            
            {t.thumb || i === 0 ? (<Pressable accessibilityRole="button" style={[styles.thumb, { top: -2.2, backgroundColor: t.thumb ? colors.surfaceAlt : '#FFFFFF' }]}>
                {t.thumb ? <Image source={t.thumb} style={styles.thumbImage} resizeMode="cover"/> : null}
              </Pressable>) : null}
          </View>);
    })}

      <Pressable accessibilityRole="button" accessibilityLabel="Show more" style={styles.showMoreKey}>
        <Text style={styles.showMoreRun}>Show more</Text>
      </Pressable>
      <View style={styles.showMoreChevron} pointerEvents="none">
        <ChevronDownIcon size={11} color={colors.ink}/>
      </View>

      <Text style={styles.suggestionCaption}>Suggested accounts</Text>
      <SuggestionRow s={suggestions[0]}/>
    </ScrollView>

    
    <TextInput accessibilityLabel="Search field" value={query} onChangeText={onQuery} placeholder="Search" placeholderTextColor={colors.secondary} style={styles.fieldInput}/>

    <BottomNav current="feed" onSelect={onNavigate}/>
  </View>);
const SuggestionRow: React.FC<{
    s: (typeof suggestions)[number];
}> = ({ s }) => (<View style={styles.suggestionRow}>
    <View style={styles.suggestionAvatar}>
      <Avatar source={s.avatar} label={`${s.handle} profile photo`}/>
    </View>
    <Text style={[styles.suggestionHandle, { left: 68, top: 689.6 }]} numberOfLines={1}>
      {s.handle}
    </Text>
    {s.verified ? (<View style={styles.suggestionBadge}>
        <Verified size={14.2}/>
      </View>) : null}
    <Text style={[styles.suggestionName, { left: 68, top: 707.3 }]} numberOfLines={1}>
      {s.bio}
    </Text>
    <Pressable accessibilityRole="button" accessibilityLabel="Follow" style={styles.followPlate}>
      <Text style={styles.followRun}>Follow</Text>
    </Pressable>
  </View>);
const Results: React.FC<Props> = ({ query, onQuery, onBack, onNavigate }) => (<View style={styles.screen}>
    <View style={styles.resultsPill}/>
    <View style={styles.resultsGlyph} pointerEvents="none">
      <SearchIcon size={14.2} color={colors.secondary}/>
    </View>
    <TopBar left="back" onLeft={onBack} leftGeo={{ left: 0, top: 8.4, width: 46.9 }} right={[{ key: 'filters', left: 333, width: 48, top: 8.4 }]} onRight={() => undefined}/>
    <TextInput accessibilityLabel="Search field" value={query} onChangeText={onQuery} style={styles.resultsInput} autoCapitalize="none"/>

    <ScrollView style={styles.body} contentContainerStyle={{ height: 720 }} scrollEnabled={false}>
      {searchAccounts.map((acct, i) => {
        const row = RESULT_ROWS[i] ?? RESULT_ROWS[RESULT_ROWS.length - 1];
        const handle = acct.echo ? query : acct.handle;
        if (!handle)
            return null;
        return (<View key={acct.id} style={styles.resultRow}>
            <View style={[styles.resultAvatar, { top: row.avatar }]}>
              {acct.magnifier ? (<View style={[styles.magnifierDisc, { width: 36, height: 36, borderRadius: 18 }]}>
                  <SearchIcon size={15} color={colors.secondary}/>
                </View>) : (<Avatar source={acct.avatar} size={36} label={`${acct.handle} profile photo`}/>)}
            </View>
            <Text style={[styles.resultHandle, { top: row.handle }, row.handleInk ? { color: row.handleInk } : null]} numberOfLines={1}>
              {handle}
            </Text>
            {acct.verified && row.badge !== undefined ? (<View style={[styles.resultBadge, { left: row.badge, top: row.handle + 1.8 }]}>
                <Verified size={14.2}/>
              </View>) : null}
            {row.name !== null && acct.name ? (<Text style={[styles.resultName, { top: row.name + (row.nameDy ?? 0) }, row.nameInk ? { color: row.nameInk } : null]} numberOfLines={1}>
                {acct.name}
              </Text>) : null}
          </View>);
    })}
    </ScrollView>

    <BottomNav current="feed" onSelect={onNavigate}/>
  </View>);
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
    body: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 726 },
    fieldPill: { position: 'absolute', left: 18.6, top: 58.4, width: 358.4, height: 43.8, borderRadius: 21.9, backgroundColor: colors.field },
    fieldGlyph: { position: 'absolute', left: 29.5, top: 73.1, width: 14.2, height: 14.2, alignItems: 'center', justifyContent: 'center' },
    fieldInput: {
        position: 'absolute',
        left: 50.9,
        top: 70.6,
        width: 52.8,
        height: 19.6,
        padding: 0,
        borderWidth: 0,
        fontSize: 16,
        fontWeight: weight.medium,
        color: colors.ink,
        fontFamily: 'ThreadsBody',
        backgroundColor: 'transparent',
        outlineStyle: 'none',
    } as never,
    sectionTitle: { position: 'absolute', left: 16, top: 120.1, lineHeight: 21, fontSize: 18.9, fontWeight: weight.bold, color: colors.markerInk, fontFamily: 'ThreadsBody' },
    sectionMarker: { position: 'absolute', left: 12.5, top: 120.6, width: 130, height: 19, backgroundColor: colors.marker },
    subtitle: { position: 'absolute', left: 16, top: 145.1, lineHeight: 17, fontSize: 13.5, color: colors.markerInk, fontFamily: 'ThreadsBody' },
    subtitleMask: { position: 'absolute', left: 269.5, top: 145.1, width: 22, height: 17, backgroundColor: colors.page },
    subtitleChevron: { position: 'absolute', left: 277.9, top: 147, width: 11, height: 11, alignItems: 'center', justifyContent: 'center' },
    trendTitle: { position: 'absolute', left: 16, lineHeight: 18.3, fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    trendSummary: { position: 'absolute', left: 16, lineHeight: 18.3, fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    thumb: { position: 'absolute', left: 322.8, width: 54.2, height: 64, borderRadius: 8, overflow: 'hidden', backgroundColor: colors.surfaceAlt },
    thumbImage: { width: '100%', height: '100%' },
    showMoreKey: { position: 'absolute', left: 16, top: 602.2, height: 17.5, justifyContent: 'center' },
    showMoreRun: { lineHeight: 17.5, fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    showMoreChevron: { position: 'absolute', left: 93.9, top: 605.4, width: 11, height: 11, alignItems: 'center', justifyContent: 'center' },
    suggestionCaption: { position: 'absolute', left: 16, top: 656.1, lineHeight: 17.5, fontSize: type.body, fontWeight: weight.strong, color: colors.secondary, fontFamily: 'ThreadsBody' },
    suggestionRow: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 0 },
    suggestionAvatar: { position: 'absolute', left: 16, top: 691 },
    suggestionHandle: { position: 'absolute', lineHeight: 17.5, fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    suggestionBadge: { position: 'absolute', left: 168.8, top: 691.4, width: 14.2, height: 14.2 },
    suggestionName: { position: 'absolute', lineHeight: 18.3, fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    followPlate: { position: 'absolute', left: 280.9, top: 685.2, width: 96.1, height: 36.8, borderRadius: 18.4, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
    followRun: { fontSize: type.body, fontWeight: weight.semibold, color: colors.onDark, fontFamily: 'ThreadsBody' },
    resultsPill: { position: 'absolute', left: 48, top: 10.2, width: 328.6, height: 43.6, borderRadius: 21.8, backgroundColor: colors.field },
    resultsGlyph: { position: 'absolute', left: 59, top: 25.1, width: 14.1, height: 14.2, alignItems: 'center', justifyContent: 'center' },
    resultsInput: {
        position: 'absolute',
        left: 48,
        top: 8.4,
        width: 329,
        height: 48,
        padding: 0,
        paddingLeft: 33.5,
        borderWidth: 0,
        fontSize: type.body,
        color: colors.menuInk,
        fontFamily: 'ThreadsBody',
        backgroundColor: 'transparent',
        outlineStyle: 'none',
    } as never,
    resultRow: { position: 'absolute', left: 0, top: 0, width: frame.width, height: 0 },
    resultAvatar: { position: 'absolute', left: 16 },
    magnifierDisc: { backgroundColor: colors.field, alignItems: 'center', justifyContent: 'center' },
    resultHandle: { position: 'absolute', left: 68, lineHeight: 17.5, fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    resultName: { position: 'absolute', left: 68, lineHeight: 17.5, fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
    resultBadge: { position: 'absolute', width: 14.2, height: 14.2 },
});
export { VerifiedIcon };
