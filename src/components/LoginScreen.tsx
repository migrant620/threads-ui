import * as React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { InstagramMark, MetaLogo, WordmarkGlyph, WordmarkPlate } from './Icons';
import { account } from '../data';
import { colors, frame, radius, shadow, type, weight } from '../tokens';
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
        return (<View style={styles.screen}>
        <View style={styles.wordmarkBlock}>
          <WordmarkPlate width={264} height={80}/>
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel={`${account.handle} account`} onPress={onPick} style={styles.card}>
          <View style={styles.cardMark}>
            <InstagramMark size={48}/>
          </View>
          <Text style={styles.cardRun}>{account.handle}</Text>
          <View style={styles.cardChevron}>
            <InstagramMark size={22}/>
          </View>
        </Pressable>

        <Pressable accessibilityRole="button" accessibilityLabel="Switch account" onPress={() => onVariant('generic')} style={styles.pickerBottomRun}>
          <Text style={styles.pickerBottomRunText}>Switch account</Text>
        </Pressable>
      </View>);
    }
    return (<View style={styles.screen}>
      
      <Pressable accessibilityRole="button" accessibilityLabel="English (US)" style={styles.langKey}>
        <Text style={styles.langRun}>English (US)</Text>
      </Pressable>

      
      <Pressable accessibilityRole="button" accessibilityLabel="Threads from Meta" onPress={() => onVariant('picker')} style={styles.markPlate}>
        <WordmarkGlyph size={54} color={colors.ink}/>
      </Pressable>

      
      <View style={styles.fieldPlate}/>
      <View style={styles.userBox}>
        <TextInput accessibilityLabel="Username, email or mobile number" placeholder="Username, email or mobile number" placeholderTextColor={colors.fieldInk} value={user} onChangeText={setUser} autoCapitalize="none" style={styles.userInput}/>
      </View>

      <View style={styles.fieldPlate2}/>
      <View style={styles.passBox}>
        <TextInput accessibilityLabel="Password" placeholder="Password" placeholderTextColor={colors.fieldInk} value={pass} onChangeText={setPass} secureTextEntry style={styles.passInput}/>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Log in" style={styles.loginKey}>
        <Text style={styles.loginRun}>Log in</Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Forgot password?" style={styles.forgotKey}>
        <Text style={styles.forgotRun}>Forgot password?</Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Meta logo" style={styles.metaKey}>
        <MetaLogo width={60} height={12}/>
      </Pressable>
    </View>);
};
const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface, width: frame.width, height: frame.height },
    langKey: { position: 'absolute', left: 142.6, top: 8, width: 108.1, height: 21.8, alignItems: 'center', justifyContent: 'center' },
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
