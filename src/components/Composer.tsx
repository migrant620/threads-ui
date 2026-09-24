import * as React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Avatar, TopBar } from './Chrome';
import { ActivityIcon, ChevronRightIcon, CloseIcon, GifIcon, ImageIcon, MoreIcon, PlusIcon } from './Icons';
import { account } from '../data';
import { colors, connector, frame, radius, space, type, weight } from '../tokens';
type Props = {
    segments: string[];
    onChange: (next: string[]) => void;
    onAddSegment: () => void;
    onRemoveSegment: (index: number) => void;
    onClose: () => void;
    onPost: () => void;
    posted?: boolean;
    audience: string;
    onAudience: () => void;
};
const SEG_ROWS = [
    { avatarTop: 69.5, handleTop: 56.0, fieldTop: 89.5, hintTop: 95.7, fieldH: 20.4, clearPlateTop: 57.5, clearTop: 75.7, chipLeft: 99.8, chipTop: 100.6, mergedTop: 104.1, mergedLeft: 60.0, mergedH: 12, digitTop: 101.5, digitH: 32 },
    { avatarTop: 140.8, handleTop: 128.8, fieldTop: 162.6, hintTop: 169.2, fieldH: 17.5, clearPlateTop: 128.8, clearTop: 147.0, chipLeft: 120.4, chipTop: 142.2, mergedTop: 142.6, mergedLeft: 115.7, mergedH: 20.4, digitTop: 145.6, digitH: 36 },
];
const SEP = '\ufffd';
export const Composer: React.FC<Props> = ({ segments, onChange, onAddSegment, onRemoveSegment, onClose, onPost, audience, onAudience }) => {
    const [confirming, setConfirming] = React.useState(false);
    const multi = segments.length > 1;
    const trimmed = segments.map((s) => s.trim()).filter(Boolean);
    const canPost = trimmed.length > 0;
    const anyText = trimmed.length > 0;
    const requestClose = () => (anyText ? setConfirming(true) : onClose());
    const lastHintTop = SEG_ROWS[segments.length - 1].hintTop;
    const attachTop = (anyText && !multi ? 119.4 : lastHintTop + (anyText ? 23.7 : 23.6));
    const addTop = attachTop + 56;
    const fieldHeight = multi ? 40.4 : 38.9;
    return (<View style={styles.screen}>
      <TopBar left="cancel" onLeft={requestClose} cancelWidth={60} title="New thread" titleGeo={{ top: 16.4, height: 23.3, fontSize: 19.3, lineHeight: 23.3, fontWeight: weight.semibold }} right={[
            { key: 'drafts', left: 292.9 },
            { key: 'more', left: 341 },
        ]}/>

      
      {multi ? <View style={[styles.segmentConnector, { top: 56, height: SEG_ROWS[segments.length - 1].handleTop - 32 }]}/> : null}

      {segments.map((text, i) => {
            const row = SEG_ROWS[i];
            const empty = text.trim().length === 0;
            return (<View key={i}>
            <View style={{ position: 'absolute', left: space.avatarLeft, top: row.avatarTop }}>
              <Avatar source={account.avatar} label="m620ui profile photo"/>
            </View>

            <Pressable accessibilityRole="button" accessibilityLabel="m620ui" style={[styles.handleKey, { top: row.handleTop }]}>
              <Text style={styles.handle}>m620ui</Text>
            </Pressable>

            
            {i === 0 ? (<>
                <Pressable accessibilityRole="button" accessibilityLabel="Community or topic" onPress={onAudience} style={styles.audiencePlate}>
                  <Text style={styles.audienceText}>{audience}</Text>
                  
                  <Text style={[styles.mergedRun, styles.audienceMergedRun]}>{`m620ui ${SEP}Community or topic`}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Community or topic" onPress={onAudience} style={styles.chevronKey}>
                  <ChevronRightIcon size={18} color={colors.secondary}/>
                </Pressable>
              </>) : null}

            
            <Pressable accessibilityRole="button" accessibilityLabel="What's new?" style={[styles.fieldBox, { top: row.hintTop, height: multi ? row.fieldH : 17.5 }]}>
              <TextInput accessibilityLabel="Thread text" placeholder={multi ? "What's new?" : undefined} value={text} onChangeText={(v) => onChange(segments.map((s, j) => (j === i ? v : s)))} multiline style={[styles.field, { top: row.fieldTop - row.hintTop, height: fieldHeight }]}/>
              
              {empty ? (<Text style={styles.hint} pointerEvents="none">
                  What&apos;s new?
                </Text>) : null}
            </Pressable>

            
            {multi ? <View style={[styles.chip, { left: row.chipLeft, top: row.chipTop }]}/> : null}

            
            {multi ? (<Text style={[styles.mergedRun, { left: row.mergedLeft, top: row.mergedTop, width: 120, lineHeight: row.mergedH }]}>
                {empty ? `m620ui  ${SEP}` : `${text} ${SEP}`}
              </Text>) : null}

            
            {multi ? (<>
                <Text style={[styles.chipDigit, { left: row.chipLeft + 5, top: row.digitTop, height: row.digitH }]}>{i + 1}</Text>
                <Text style={[styles.chipDigit, { left: row.chipLeft + 14.5, top: row.digitTop, height: row.digitH }]}>/</Text>
                <Text style={[styles.chipDigit, { left: row.chipLeft + 21.7, top: row.digitTop, height: row.digitH }]}>{segments.length}</Text>
              </>) : null}

            {multi || !empty ? (<Pressable accessibilityRole="button" accessibilityLabel="" style={[styles.clearPlate, { top: row.clearPlateTop }]}>
                <Pressable accessibilityRole="button" accessibilityLabel="Clear" onPress={() => onRemoveSegment(i)} style={styles.clearKey}>
                  <CloseIcon size={15} color={colors.secondary}/>
                </Pressable>
              </Pressable>) : null}
          </View>);
        })}

      <AttachmentRow top={attachTop}/>
      
      <Pressable accessibilityRole="button" accessibilityLabel="Add to thread" onPress={onAddSegment} style={[styles.addToThread, { top: addTop }]}>
        <Text style={[styles.addToThreadText, { color: multi || !anyText ? colors.hintLight : colors.secondary }]}>Add to thread</Text>
      </Pressable>

      <View style={styles.bottomBar}>
        <Pressable accessibilityRole="button" accessibilityLabel="Post options" style={styles.postOptions}>
          <Text style={styles.postOptionsText}>Post options</Text>
        </Pressable>
        
        
        <Pressable accessibilityRole="button" accessibilityLabel="" style={styles.countPicker}>
          <View style={styles.countThumb}/>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={canPost ? 'Post' : 'Post disabled'} disabled={!canPost} onPress={onPost} style={[styles.postKey, { backgroundColor: canPost ? colors.ink : colors.disabled }]}>
          
          <Text style={[styles.postKeyText, { color: colors.onDark }]}>Post</Text>
        </Pressable>
      </View>

      
      {confirming ? (<View style={styles.scrim}>
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>Throw this draft away?</Text>
            <View style={[styles.dialogRule, { top: 82.25 }]}/>
            <Pressable accessibilityRole="button" accessibilityLabel="Discard" onPress={onClose} style={styles.dialogRow}>
              <Text style={styles.dialogDiscard}>Discard</Text>
            </Pressable>
            <View style={[styles.dialogRule, { top: 131.364 }]}/>
            <Pressable accessibilityRole="button" accessibilityLabel="Cancel" onPress={() => setConfirming(false)} style={[styles.dialogRow, { top: 131.728 }]}>
              <Text style={styles.dialogCancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>) : null}
    </View>);
};
const AttachmentRow: React.FC<{
    top: number;
}> = ({ top }) => (<View style={{ position: 'absolute', left: 0, top, width: frame.width, height: 48 }}>
    {[
        { left: 45.1, w: 40.4, h: 40.8, label: 'Add photos and videos from your camera roll', node: <ImageIcon size={22}/> },
        { left: 85.5, w: 40.4, h: 40.8, label: 'Add a GIF', node: <GifIcon size={22}/> },
        { left: 125.9, w: 40.4, h: 48.0, label: 'Add a sticker', node: <PlusIcon size={22}/> },
        { left: 166.3, w: 40.4, h: 48.0, label: 'Add music to your posts', node: <ActivityIcon size={22}/> },
        { left: 206.7, w: 48.0, h: 48.0, label: 'See more options', node: <MoreIcon size={20}/> },
    ].map((k) => (<Pressable key={k.label} accessibilityRole="button" accessibilityLabel={k.label} style={[styles.attachKey, { left: k.left, width: k.w, height: k.h }]}>
        {k.node}
      </Pressable>))}
  </View>);
const DEVICE_PX = 393 / 1080;
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.page, width: frame.width, height: frame.height },
    segmentConnector: { position: 'absolute', left: space.avatarLeft + 23, width: connector.width, backgroundColor: colors.border, borderRadius: 1 },
    handleKey: { position: 'absolute', left: 60, width: 55.7, height: 48, justifyContent: 'center' },
    handle: { fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    chevronKey: { position: 'absolute', left: 96.8, top: 56.4, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    audiencePlate: { position: 'absolute', left: 129.9, top: 56, width: 135.4, height: 48, justifyContent: 'center' },
    audienceText: { position: 'absolute', left: 0, top: 15.3, width: 220, fontSize: type.body, lineHeight: 17.5, color: colors.secondary, fontFamily: 'ThreadsBody' },
    fieldBox: { position: 'absolute', left: 60, width: 316.9 },
    field: {
        position: 'absolute',
        left: 0,
        width: 316.9,
        padding: 0,
        paddingTop: 5.8,
        borderWidth: 0,
        fontSize: type.body,
        lineHeight: 18.3,
        color: colors.ink,
        fontFamily: 'ThreadsBody',
        backgroundColor: 'transparent',
        outlineStyle: 'none',
    } as never,
    hint: { position: 'absolute', left: 0, top: 0, width: 83.7, height: 17.5, lineHeight: 17.5, fontSize: 14.3, color: colors.secondary, fontFamily: 'ThreadsBody' },
    chip: { position: 'absolute', width: 31, height: 18, borderRadius: 9, backgroundColor: colors.chip },
    chipDigit: { position: 'absolute', height: 40, fontSize: 11.5, lineHeight: 14.2, color: colors.secondary, fontFamily: 'ThreadsNumbers' },
    mergedRun: { position: 'absolute', fontSize: 15, color: colors.page, fontFamily: 'ThreadsBody' },
    audienceMergedRun: { left: -14.2, top: 15.3, width: 260, lineHeight: 17.5 },
    clearPlate: { position: 'absolute', left: 347.1, width: 45.9, height: 48, alignItems: 'center', justifyContent: 'center' },
    clearKey: { position: 'absolute', left: 17.9, top: 18.2, width: 12, height: 12, alignItems: 'center', justifyContent: 'center' },
    attachKey: { position: 'absolute', top: 0, alignItems: 'center', justifyContent: 'center', borderRadius: radius.media },
    addToThread: { position: 'absolute', left: 60, height: 17.5, justifyContent: 'center' },
    addToThreadText: { fontSize: 14.4, fontWeight: weight.soft, color: colors.secondary, fontFamily: 'ThreadsBody' },
    bottomBar: { position: 'absolute', left: 0, top: 442.9, width: frame.width, height: 56 },
    postOptions: { position: 'absolute', left: 44, top: 15.2, height: 17.5, justifyContent: 'center' },
    postOptionsText: { fontSize: type.body, fontWeight: weight.medium, color: colors.secondary, fontFamily: 'ThreadsBody' },
    countPicker: { position: 'absolute', left: 234.7, top: 0, width: 66.2, height: 48, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 },
    countThumb: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pickerGrey },
    postKey: { position: 'absolute', left: 316.7, top: 4, width: 64, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
    postKeyText: { fontSize: type.body, fontWeight: weight.medium, fontFamily: 'ThreadsBody' },
    scrim: { position: 'absolute', left: 0, top: 0, width: frame.width, height: frame.height, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100 },
    dialogCard: { position: 'absolute', left: 81.511, top: 298.753, width: 229.978, height: 180.51, borderRadius: 14, backgroundColor: colors.dialog },
    dialogTitle: { position: 'absolute', left: 0, top: 32.022, width: 229.978, textAlign: 'center', fontSize: 15, lineHeight: 18.194, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
    dialogRule: { position: 'absolute', left: 0, width: 229.978, height: DEVICE_PX, backgroundColor: 'rgb(219,219,219)' },
    dialogRow: { position: 'absolute', left: 0, top: 82.603, width: 229.978, height: 48.761, alignItems: 'center', justifyContent: 'center' },
    dialogDiscard: { fontSize: 15, fontWeight: weight.regular, color: colors.danger, fontFamily: 'ThreadsBody' },
    dialogCancel: { fontSize: 15, fontWeight: weight.regular, color: colors.ink, fontFamily: 'ThreadsBody' },
});
