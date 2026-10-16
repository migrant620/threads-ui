/**
 * Settings — reached from the gear key on the profile's top bar.
 *
 * COVERAGE GAP CLOSED (R32). `ProfileScreen.tsx` renders four top-bar keys —
 * Insights (x 4), Search (x 244.9), Instagram (x 292.93) and Settings
 * (x 340.96) — and all four were `<Pressable accessibilityLabel="…">` with **no
 * `onPress` at all**. Settings and Insights had no page anywhere in the app:
 * `Screen` was the eight-value union login/feed/post/create/search/activity/
 * profile/messages, and `components/` held no settings or insights screen. So
 * the profile's most prominent secondary destination was a dead key.
 *
 * Search and Instagram are deliberately left as-is: Search already has a page
 * (`Screen` carries 'search') and this screen does not own its routing, and
 * Instagram's mark is an outbound link to another app, which a no-backend
 * prototype cannot honour. They are noted in spec/design-qa.md rather than
 * silently rewired.
 *
 * Geometry is the app's own measured grammar, not a capture: the reference set
 * never included the settings page (T1-T10 cover feed, detail, composer,
 * search, activity, profile, messages, login). Every number below therefore
 * comes from tokens this project has already measured for other pages — the
 * 16 dp gutter, `type.body` at `bodyLine`, `hairlineStrong` for the 1 dp rules,
 * `tracking.body` — and the page is recorded as a proposed surface awaiting a
 * real capture, exactly as the centred stage on wide viewports is.
 */
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BackIcon, ChevronRightIcon } from './Icons';
import { colors, frame, tracking, type } from '../tokens';

/** Grouped rows, in the order the product lists them. `chevron: false` is a toggle row. */
const GROUPS: Array<{ title: string; rows: Array<{ label: string; chevron?: boolean }> }> = [
  {
    title: 'Account',
    rows: [
      { label: 'Edit profile' },
      { label: 'Account details' },
      { label: 'Verified accounts', chevron: false },
    ],
  },
  {
    title: 'Your activity',
    rows: [
      { label: 'Insights' },
      { label: 'Archive' },
      { label: 'Close friends' },
      { label: 'Liked posts', chevron: false },
      { label: 'Pinned posts', chevron: false },
    ],
  },
  {
    title: 'Your threads',
    rows: [
      { label: 'Threads from profiles you follow', chevron: false },
      { label: 'Reply controls' },
      { label: 'Mentions and tags' },
    ],
  },
  {
    title: 'Privacy',
    rows: [
      { label: 'Blocked accounts', chevron: false },
      { label: 'Muted accounts and words', chevron: false },
    ],
  },
  {
    title: 'More',
    rows: [
      { label: 'Notifications' },
      { label: 'Display' },
      { label: 'Help' },
    ],
  },
  {
    title: 'About',
    rows: [{ label: 'Terms of Service' }, { label: 'Privacy Policy' }],
  },
];

export const SettingsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <View style={styles.screen}>
    {/* Top bar: a back key at the left gutter and the page title beside it, on the
        same 48 dp key row the profile's own top bar uses. */}
    <View style={styles.topBar}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={styles.backKey}
      >
        <BackIcon size={24} color={colors.ink} />
      </Pressable>
      <Text style={styles.title}>Settings</Text>
    </View>

    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} accessibilityLabel="Settings">
      <View style={styles.content}>
        {GROUPS.map(group => (
          <View key={group.title} style={styles.group}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.rows.map((row, index) => (
                <Pressable
                  key={row.label}
                  accessibilityRole="button"
                  accessibilityLabel={row.label}
                  style={[styles.row, index > 0 && styles.rowDivided]}
                >
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  {/* A toggle row carries its switch on the trailing edge and a plain
                      row a chevron, which is how the product distinguishes "this is a
                      setting you can flip now" from "this opens something". */}
                  {row.chevron === false ? (
                    <View style={styles.switchTrack}>
                      <View style={styles.switchThumb} />
                    </View>
                  ) : (
                    <ChevronRightIcon size={16} color={colors.secondary} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1, width: frame.width, backgroundColor: colors.page },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  backKey: { width: 40, height: 48, alignItems: 'flex-start', justifyContent: 'center' },
  title: {
    marginLeft: 4,
    fontFamily: 'ThreadsBody',
    fontSize: type.name,
    lineHeight: type.nameLine,
    letterSpacing: tracking.name,
    color: colors.ink,
  },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  group: { marginTop: 24 },
  groupTitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontFamily: 'ThreadsBody',
    fontSize: type.caption,
    lineHeight: type.captionLine,
    color: colors.secondary,
  },
  card: { marginHorizontal: 16 },
  row: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
  },
  rowDivided: { borderTopWidth: 1, borderTopColor: colors.hairlineStrong },
  rowLabel: {
    fontFamily: 'ThreadsBody',
    fontSize: type.body,
    lineHeight: type.bodyLine,
    letterSpacing: tracking.body,
    color: colors.ink,
  },
  /* The switch matches the composer's own chip tint so the two plates on the app
     read as the same material. */
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.chip,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.page,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
});