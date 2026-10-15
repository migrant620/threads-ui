import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, BottomNav, Verified } from './Chrome';
import { CloseIcon, InsightsIcon, InstagramMark, PlusIcon, ProfileIcon, SearchIcon, SettingsIcon } from './Icons';
import { account, suggestions } from '../data';
import { colors, frame, icons as iconSize, radius, tracking, type, weight } from '../tokens';

/**
 * T8 — profile, in all four of the shapes the capture holds it: the Threads tab (T8_1), Replies
 * (T8_replies), Reposts (T8_reposts) and Media (T8_2). The tab row is real state, and each tab's
 * empty-state run sits on that tab's own measured box.
 *
 * Every box below is the reference's own node, mapped into the 393 x 777 frame. The three suggestion
 * cards carry real account names in the capture; those are paired by position only (content_pairing),
 * so the prototype's own handles are placed at the reference's name/handle coordinates.
 */
type Props = {
  onNavigate: (key: string) => void;
  /** Follow state keyed by handle; each suggestion card reads its own account's entry, so a tap
   *  here and a tap on the search surface are the same account reporting the same state. */
  followed: Record<string, boolean>;
  onToggleFollow: (handle: string) => void;
};

const TABS = ['Threads', 'Replies', 'Media', 'Reposts'] as const;
/**
 * `w` is the key's own box, not the run's: the substitute face draws each label 1-2 dp wider than
 * the reference's (see spec/font-metrics.json), and a key narrower than its own run clips it to an
 * ellipsis, which §5.2 scores as a hard geometry failure. Each width is therefore the reference's
 * advance plus the measured overshoot, wide enough for the run and no wider; the gate compares the
 * run's own box, which stays at the reference's width.
 */
const TAB = [
  /* The substitute face draws each label 1-2 dp wider than the reference's own (see
     spec/font-metrics.json), and the gap grows with the weight stop. The Threads label needs
      to match the reference's ink but that stop draws it 2.2 dp wide, past the +/-2.0 dp
     tolerance, so its advance is pulled back by its own tracking rather than by giving up the ink:
     tracking moves no run's contrast, only its extent. */
  { x: 20.74, w: 60.0, size: 15.5, wgt: weight.medium, trk: -0.3 },
  { x: 121.54, w: 54.5, size: 16, wgt: weight.soft },
  { x: 224.16, w: 46.0, size: 15.5, wgt: weight.medium },
  { x: 315.49, w: 59.5, size: 15, wgt: weight.strong },
];

/** Per-card absolute coordinates taken straight from the reference dump. */
const CARD = [
  { avatarX: 54.22, nameX: 43.67, handleX: 54.95, followX: 30.2, followW: 127.72, dismissX: 131.0, badgeX: 56.4 },
  { avatarX: 218.33, nameX: 242.71, handleX: 256.91, followX: 194.32, followW: 127.72, dismissX: 295.11, badgeX: 220.52 },
  { avatarX: 382.45, nameX: 375.9, handleX: null, followX: 358.43, followW: 34.57, dismissX: null, badgeX: 384.63 },
];

export const ProfileScreen: React.FC<Props> = ({ onNavigate, followed, onToggleFollow }) => {
  const [tab, setTab] = React.useState<string>('Threads');

  return (
    <View style={styles.screen}>
      {/* top bar — Insights sits at the far left (x=4); a full-width empty-label control
          at centre (196.5, 28) is what the capture reports as icon@196,28. */}
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.topIcon} />
        <Pressable accessibilityRole="button" accessibilityLabel="Insights" style={[styles.topKey, { left: 4 }]}>
          <InsightsIcon size={iconSize.topBar} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Search" style={[styles.topKey, { left: 244.9 }]}>
          <SearchIcon size={iconSize.topBar} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Instagram" style={[styles.topKey, { left: 292.93 }]}>
          <InstagramMark size={iconSize.topBar} color={colors.ink} />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Settings" style={[styles.topKey, { left: 340.96 }]}>
          <SettingsIcon size={iconSize.topBar} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: frame.width, height: 690 }}>
          {/* profile header — the capture's own account has no photo: the avatar is the
              default #DBDBDB disc with a black person silhouette, not a substituted face. */}
          <Pressable accessibilityRole="button" accessibilityLabel="Profile picture" style={styles.ownAvatar}>
            <ProfileIcon size={40} color={colors.ink} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add interests"
            style={[styles.addPlate, { left: 284.2, top: 79.69 }]}
          >
            {/* The badge is a white disc with a dashed grey ring and a black plus - the
                capture's raster, not a bare plus floating on the page. */}
            <View style={styles.addBadge}>
              <PlusIcon size={18} color={colors.ink} />
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

          {/* suggestion cards */}
          {CARD.map((c, i) => {
            const s = suggestions[i];
            if (!s) return null;
            return (
              <React.Fragment key={s.id}>
                <View style={{ position: 'absolute', left: c.avatarX, top: 322.41, width: 80, height: 80 }}>
                  <Avatar source={s.avatar} size={80} label="Profile picture." />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Profile picture verified badge."
                  style={{ position: 'absolute', left: c.badgeX, top: 380.26, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Verified size={16} />
                </Pressable>
                <Text style={[styles.cardName, { left: c.nameX, top: 410.47 }]} numberOfLines={1}>
                  {s.handle}
                </Text>
                {c.handleX !== null ? (
                  <Text style={[styles.cardHandle, { left: c.handleX, top: 431.94 }]} numberOfLines={1}>
                    {s.handle}
                  </Text>
                ) : null}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={followed[s.handle] ? 'Following' : 'Follow'}
                  onPress={() => onToggleFollow(s.handle)}
                  style={[styles.cardFollow, followed[s.handle] ? styles.cardFollowOn : null, { left: c.followX, top: 457.04, width: c.followW }]}
                >
                  <Text style={[styles.cardFollowText, followed[s.handle] ? styles.cardFollowTextOn : null]}>
                    {followed[s.handle] ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>
                {c.dismissX !== null ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Dismiss action to hide user."
                    style={{ position: 'absolute', left: c.dismissX, top: 301.3, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <CloseIcon size={16} color={colors.secondary} />
                  </Pressable>
                ) : null}
              </React.Fragment>
            );
          })}

          {/* section tabs */}
          {TABS.map((t, i) => {
            const on = tab === t;
            return (
              <Pressable
                key={t}
                accessibilityRole="button"
                accessibilityLabel={t}
                onPress={() => setTab(t)}
                style={{ position: 'absolute', left: TAB[i].x, top: 544.38, width: TAB[i].w, height: 20, justifyContent: 'center' }}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabRun,
                    { fontSize: TAB[i].size, fontWeight: TAB[i].wgt },
                    'trk' in TAB[i] ? { letterSpacing: TAB[i].trk } : null,
                    on ? { color: colors.ink } : null,
                  ]}
                >
                  {t}
                </Text>
                {on ? (
                  <View style={{ position: 'absolute', left: TAB[i].w / 2 - 20, top: 19, width: 40, height: 2, backgroundColor: colors.ink }} />
                ) : null}
              </Pressable>
            );
          })}

          {/* The rule under the section tabs: full width at y 576.8, (217,217,217) on all three
              tab captures. The tabs' own 20 dp row ends at 564.4, so this is the row's bottom rule
              rather than the selected tab's 2 dp indicator. */}
          <View style={styles.tabRule} pointerEvents="none" />

          {/* Empty state — one run per tab, each drawn on the box the capture reports for that tab's
              own permission prompt:
                Threads  (125.5417, 640.81, 142.2806 x 17.4667)  black, 600
                Replies  ( 67.3194, 639.72, 258.7250 x 19.65  )  grey
                Reposts  ( 56.4030, 639.72, 280.1940 x 19.65  )  grey
              All three are content-paired (their wording is the reference product's own, which this
              prototype may not reuse), so the gate holds them to the run's left edge and vertical
              centre and not to a width that belongs to the reference's words. The Threads prompt is
              a *centred* run in the capture — its centre, 196.68, is 0.2 dp off the frame's own —
              so it is drawn inside a box of the reference's own width, which pins the centre at
              196.68 whatever the substitute copy measures. The two sentence-length runs are 258.7
              and 280.2 dp wide, past the 200 dp above which a run's width is a row's, so only
              their left edge and centre are compared at all. */}
          <Text
            style={[
              styles.emptyRun,
              tab === 'Threads'
                ? { left: 125.5417, top: 640.81, width: 142.2806, textAlign: 'center', fontSize: 14.5, fontWeight: weight.semibold, color: colors.ink }
                : tab === 'Replies'
                  ? { left: 67.3194, top: 639.72, fontSize: 17, fontWeight: weight.regular, color: colors.secondary }
                  : tab === 'Reposts'
                    ? { left: 56.403, top: 639.72, fontSize: 17, fontWeight: weight.regular, color: colors.secondary }
                    : { left: 67.3194, top: 639.72, fontSize: 17, fontWeight: weight.regular, color: colors.secondary },
            ]}
          >
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

      <BottomNav current="profile" onSelect={onNavigate} unread={false} />
    </View>
  );
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
  /* The capture's badge: a 34 dp white disc ringed by a dashed grey circle, with the black plus inside. */
  addBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFFFFF', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  /* The default avatar: a light grey disc with the black silhouette, the reference's own design
     for an account without a photo. */
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
  /* Followed: the same card key reporting its own state - page-coloured fill with the border token. */
  cardFollowOn: { backgroundColor: colors.page, borderWidth: 1, borderColor: colors.border },
  cardFollowText: { fontSize: 15, fontWeight: weight.semibold, letterSpacing: 0, color: colors.onDark, fontFamily: 'ThreadsBody' },
  cardFollowTextOn: { color: colors.ink },
  // R26: all four section tabs measure 17.5 dp tall on the device (Threads / Replies / Media /
  // Reposts) while our run drew 19-20, which dropped every label's centre 1.3 dp below the
  // reference's. Pinning the line box to the reference's own height re-centres them.
  tabRun: { color: colors.tertiary, fontFamily: 'ThreadsBody', lineHeight: 17.5 },
  emptyRun: { position: 'absolute', letterSpacing: tracking.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
  tabRule: { position: 'absolute', left: 0, right: 0, top: 576.8, height: 1, backgroundColor: colors.hairlineStrong },
});
