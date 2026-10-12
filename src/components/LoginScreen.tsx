import * as React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { InstagramMark, MetaLogo, WordmarkGlyph, WordmarkPlate } from './Icons';
import { account } from '../data';
import { colors, frame, radius, shadow, type, weight } from '../tokens';

/**
 * T10 — the login screen. Two variants exist and the prototype draws both:
 *
 *   generic — the one the gate captures (T10/T10_generic). White ground; the language key's own
 *             108.1 x 21.8 button at (142.6, 8) holding a 76.1 dp run; the Threads mark on its
 *             361 x 60 plate at (16, 125.2); two 292.9 dp fields at y 328.6 and 401.0, each with its
 *             hint run set 7.3 dp above the input's own box because the reference reports the hint
 *             TextView and the EditText as two nodes; the 361 x 44 log-in pill at (16, 445.4); the
 *             "Forgot password?" button at (118.6, 501.4); and the Meta mark at (166.7, 748.2).
 *   picker  — the remembered-account sheet: mark block at (64.4, 209.8) 264 x 80, white card
 *             (24, 366.1) 344.7 x 92, and the account-switch row at (24, 722.5).
 *
 * Every box above is the reference's own, so the two variants differ in content but share a ground.
 * The picker's bottom row is the one label on this screen whose wording is the prototype's own: the
 * capture's phrase is Meta's own accounts-centre copy, and the picker variant is not a gated state,
 * so nothing else depends on it.
 */

type Props = {
  variant: 'picker' | 'generic';
  onVariant: (v: 'picker' | 'generic') => void;
  onPick: () => void;
};

export const LoginScreen: React.FC<Props> = ({ variant, onVariant, onPick }) => {
  const picker = variant === 'picker';
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');

  if (picker) {
    return (
      <View style={styles.screen}>
        <View style={styles.wordmarkBlock}>
          <WordmarkPlate width={264} height={80} />
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel={`${account.handle} account`} onPress={onPick} style={styles.card}>
          <View style={styles.cardMark}>
            <InstagramMark size={48} />
          </View>
          <Text style={styles.cardRun}>{account.handle}</Text>
          <View style={styles.cardChevron}>
            <InstagramMark size={22} />
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Switch account"
          onPress={() => onVariant('generic')}
          style={styles.pickerBottomRun}
        >
          <Text style={styles.pickerBottomRunText}>Switch account</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* The language key: the reference reports its own 108.1 x 21.8 button plus the 76.1 dp run. */}
      <Pressable accessibilityRole="button" accessibilityLabel="English (US)" style={styles.langKey}>
        <Text style={styles.langRun}>English (US)</Text>
      </Pressable>

      {/* The Threads mark on the 361 x 60 plate the reference reports for it. */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Threads from Meta"
        onPress={() => onVariant('picker')}
        style={styles.markPlate}
      >
        <WordmarkGlyph size={54} color={colors.ink} />
      </Pressable>

      {/* The two fields, drawn off the capture's own raster: a 360.6 x 60 rounded plate at (16, 300.6)
          and its twin at (16, 373.0). Inside each, the hint is centred on the plate (the reference's
          hint TextView sits 7.3 dp above its EditText's own box), so the input carries the hint as its
          placeholder and is drawn at the hint's box while its wrapper carries the EditText's box: the
          reference reports those as two nodes and both are judged. */}
      <View style={styles.fieldPlate} />
      <View style={styles.userBox}>
        <TextInput
          accessibilityLabel="Username, email or mobile number"
          placeholder="Username, email or mobile number"
          placeholderTextColor={colors.fieldInk}
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          style={styles.userInput}
        />
      </View>

      <View style={styles.fieldPlate2} />
      <View style={styles.passBox}>
        <TextInput
          accessibilityLabel="Password"
      placeholder="Password"
      placeholderTextColor={colors.fieldInk}
          value={pass}
          onChangeText={setPass}
          secureTextEntry
          style={styles.passInput}
        />
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Log in" style={styles.loginKey}>
        <Text style={styles.loginRun}>Log in</Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Forgot password?" style={styles.forgotKey}>
        <Text style={styles.forgotRun}>Forgot password?</Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Meta logo" style={styles.metaKey}>
        <MetaLogo width={60} height={12} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface, width: frame.width, height: frame.height },

  langKey: { position: 'absolute', left: 142.6, top: 8, width: 108.1, height: 21.8, alignItems: 'center', justifyContent: 'center' },
  /* The run is set at the step that reproduces the reference's own 76.1 dp advance; the reference's
     face is narrower than the substitute at the same nominal size, and section 6 of the goal asks for
     the width to be matched by scaling rather than by accepting the difference. */
  /* (102,106,114), sampled off T10_generic: the language key is not set in the page's own ink. */
  langRun: { fontSize: 13.5, lineHeight: 21.8, color: colors.fieldInk, fontFamily: 'ThreadsBody' },

  markPlate: { position: 'absolute', left: 16, top: 125.2, width: 361, height: 60, alignItems: 'center', justifyContent: 'center' },

  fieldPlate: {
    position: 'absolute',
    left: 16,
    top: 300.6,
    width: 360.6,
    height: 60,
    borderRadius: 10.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  fieldPlate2: {
    position: 'absolute',
    left: 16,
    top: 373.0,
    width: 360.6,
    height: 60,
    borderRadius: 10.5,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  userBox: { position: 'absolute', left: 32, top: 328.6, width: 292.9, height: 19.6 },
  userInput: {
    position: 'absolute',
    left: 0,
    top: -7.3,
    width: 237.3,
    height: 18.9,
    padding: 0,
    borderWidth: 0,
    fontSize: type.body,
    lineHeight: 18.9,
    color: colors.ink,
    fontFamily: 'ThreadsBody',
    backgroundColor: 'transparent',
  },
  passBox: { position: 'absolute', left: 32, top: 401, width: 292.9, height: 19.6 },
  passInput: {
    position: 'absolute',
    left: 0,
    top: -7.3,
    width: 67.3,
    height: 18.9,
    padding: 0,
    borderWidth: 0,
    fontSize: type.body,
    lineHeight: 18.9,
    color: colors.ink,
    fontFamily: 'ThreadsBody',
    backgroundColor: 'transparent',
  },

  loginKey: {
    position: 'absolute',
    left: 16,
    top: 445.4,
    width: 361,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.igBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginRun: { fontSize: type.body, lineHeight: 21.1, fontWeight: weight.soft, color: colors.onDark, fontFamily: 'ThreadsBody' },

  forgotKey: { position: 'absolute', left: 118.6, top: 501.4, width: 155.7, height: 36, alignItems: 'center', justifyContent: 'center' },
  forgotRun: { fontSize: 14.6, lineHeight: 25.1, fontWeight: weight.medium, color: colors.ink, fontFamily: 'ThreadsBody' },

  metaKey: { position: 'absolute', left: 166.7, top: 748.2, width: 60, height: 12, alignItems: 'center', justifyContent: 'center' },

  wordmarkBlock: { position: 'absolute', left: 64.4, top: 209.8, width: 264, height: 80, alignItems: 'center', justifyContent: 'center' },
  card: {
    position: 'absolute',
    left: 24,
    top: 366.1,
    width: 344.7,
    height: 92,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  cardMark: { position: 'absolute', left: 22.2, top: 22.2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  cardRun: { position: 'absolute', left: 78.2, top: 37.5, fontSize: type.body, fontWeight: weight.semibold, color: colors.ink, fontFamily: 'ThreadsBody' },
  cardChevron: { position: 'absolute', left: 292.7, top: 22.2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  pickerBottomRun: { position: 'absolute', left: 24, top: 722.5, width: 345, height: 48, alignItems: 'center', justifyContent: 'center' },
  pickerBottomRunText: { fontSize: type.body, color: colors.secondary, fontFamily: 'ThreadsBody' },
});
