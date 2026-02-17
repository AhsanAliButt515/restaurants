import { useLoginMutation, useSignupMutation } from '@/api/auth';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { saveAccess, saveToken, saveUser } from '@/storage/auth';
import { BlueLogo } from '@/utils/svgs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { useAuthContext } from '../../navigation/RootNavigator';


type AuthMode = 'login' | 'register-info' | 'register-password';
export default function LoginScreen() {
    const navigation = useNavigation();
    const authContext = useAuthContext();
    const { checkAuth } = authContext;
    const insets = useSafeAreaInsets();
    console.log('[LoginScreen] AuthContext available:', !!authContext);
    console.log('[LoginScreen] checkAuth available:', !!checkAuth);

    // ===== STATES =====

    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const validEmail = useMemo(() => /.+@.+\..+/, []);
    // ===== Animations =====
    const slideAnim = useRef(new Animated.Value(120)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const logoFade = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(logoFade, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();



        Animated.parallel([

            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),

        ]).start();

    }, []);

    // ===== HANDLERS =====
    const loginMutation = useLoginMutation();
    const signupMutation = useSignupMutation();
    const handleLogin = async () => {
        try {
            setError('');
            if (!validEmail.test(email)) {
                setError('Introduce un email válido.');
                return;
            }
            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            const response = await loginMutation.mutateAsync({ email, password });
            console.log('Login Response:', response);
            if (response && response.user) {
                // Store authentication data
                await saveAccess("1")
                await saveUser(response.user)
                if (response.token) {
                    await saveToken(response.token);
                }

                // Trigger RootNavigator to re-check auth state
                await checkAuth();
            } else {
                throw new Error(response.token || 'Auto-login failed');
            }
        } catch (e: any) {
            setError(e.response?.data?.message || e.message || 'No se pudo iniciar sesión.');
        }
    };

    const handleRegisterInfo = () => {
        setError('');
        if (!validEmail.test(email)) {
            setError('Introduce un email válido.');
            return;
        }
        if (!username.trim()) {
            setError('Introduce un nombre de usuario.');
            return;
        }
        setMode('register-password');
    };

    const handleSignup = async () => {
        try {
            setError('');
            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
            const response = await signupMutation.mutateAsync({
                email,
                password,
                name: username
            });
            console.log('Signup Response:', response);
            Alert.alert(JSON.stringify(response));
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' as never }],
            });




            // if (response && response.user) {

            //     // Store authentication data

            //     await AsyncStorage.setItem(ACCESS_FLAG, "1");
            //     await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.user));
            //     if (response.token) {
            //         await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
            //     }
            //     // Force navigation to the authenticated stack/screen
            //     navigation.reset({
            //         index: 0,
            //         routes: [{ name: 'splash' as never }],
            //     });
            // }
        } catch (e: any) {
            setError(e.response?.data?.message || e.message || 'No se pudo crear la cuenta.');
        }
    };

    const handleBack = () => {
        setError('');

        if (mode === 'register-password') {

            setMode('register-info');
        } else if (mode === 'register-info') {
            setError('');
            setEmail('');
            setUsername('');
            setPassword('');
            setMode('login');
        }
    };



    return (
        <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    {/* ===== LOGO ===== */}
                    <Animated.View style={[styles.logoWrapper, { opacity: logoFade }]}>
                        <BlueLogo />
                    </Animated.View>
                    {/* ===== FORM ===== */}
                    <Animated.View
                        style={[
                            styles.bottomContainer,
                            mode !== 'login' && { paddingTop: 20 },
                            {
                                transform: [{ translateY: slideAnim }],
                                opacity: fadeAnim,
                            },
                        ]}
                    >

                        {/* BACK BUTTON */}

                        {mode !== 'login' && (
                            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                                <Text style={{ color: '#fff', fontSize: 28 }}>←</Text>
                            </TouchableOpacity>
                        )}

                        <View style={styles.form}>

                            {/* ================= LOGIN ================= */}

                            {mode === 'login' && (

                                <>
                                    <ThemedText type="subtitle" style={styles.label}>Email</ThemedText>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Escribe tu email"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                    <Text style={styles.label}>Contraseña</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Esccribe tu nombre"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    {error ? <Text style={styles.error}>{error}</Text> : null}
                                    <Button
                                        title={loginMutation.isPending ? 'Entrando...' : 'Entrar'}
                                        variant="secondary"
                                        textStyle={{
                                            color: '#000'
                                        }}
                                        style={styles.authButton}
                                        onPress={handleLogin}
                                        loading={loginMutation.isPending}
                                    />

                                    <TouchableOpacity onPress={() => {
                                        setMode('register-info');
                                        setError('');
                                        setEmail('');
                                        setUsername('');
                                        setPassword('');
                                    }}>
                                        <Text style={styles.linkText}>
                                            ¿No tienes cuenta?{' '}
                                            <Text style={styles.linkHighlight}>Regístrate</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}

                            {/* =================  REGISTER STEP 1 ================= */}

                            {mode === 'register-info' && (
                                <>
                                    <Text style={styles.label}>Email</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Añade tu email"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                    />
                                    <Text style={styles.label}>Nombre de usuario</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Añade tu nombre"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        value={username}
                                        onChangeText={setUsername}
                                    />
                                    {error ? <Text style={styles.error}>{error}</Text> : null}

                                    <Button
                                        title="Continuar"
                                        variant="secondary"
                                        textStyle={{
                                            color: '#000'
                                        }}
                                        style={styles.authButton}
                                        onPress={handleRegisterInfo}
                                    />
                                </>
                            )}

                            {/* ================= REGISTER STEP 2 ================= */}

                            {mode === 'register-password' && (
                                <>
                                    <Text style={styles.label}>Crea una nueva contraseña</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nueva contraseña"
                                        placeholderTextColor="rgba(255,255,255,0.6)"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                    {error ? <Text style={styles.error}>{error}</Text> : null}
                                    <Button
                                        title={signupMutation.isPending ? 'Creando...' : 'Crear cuenta'}
                                        disabled={signupMutation.isPending}
                                        variant="secondary"
                                        textStyle={{
                                            color: '#000'
                                        }}
                                        style={styles.authButton}
                                        onPress={handleSignup}
                                        loading={signupMutation.isPending}
                                    />
                                </>
                            )}
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        minHeight: 400,
        backgroundColor: '#FFFFFF',
    },
    logoWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 240,
        height: 120,
        resizeMode: 'contain',
    },
    backButton: {
        padding: 2,
        paddingHorizontal: 24,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    bottomContainer: {
        backgroundColor: '#264BEB',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 30,
        paddingTop: 40,
        paddingBottom: Platform.OS === 'ios' ? 40 : 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
    },

    form: {

        gap: 15,

    },

    input: {
        backgroundColor: 'rgba(0,0,0,0)',
        height: 44,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: Colors.light.inputBorder,
        borderRadius: 25,
        fontSize: 16,
        color: '#ffffff',
    },
    label: {
        color: "#fff",
        fontSize: 24,
        marginBottom: -5,
        fontWeight: '600',
    },

    error: {
        color: "#ff6b6b",
        marginTop: 6,
        textAlign: 'center',

    },

    authButton: {

        backgroundColor: '#FFFFFF',
        fontSize: 16,
        borderRadius: 16,
        fontWeight: '600',
        paddingVertical: 12,

        paddingHorizontal: 12,

        alignItems: 'center',

        justifyContent: 'center',

        height: 44,

    },

    linkText: {
        color: '#fff',
        fontSize: 16,
        marginTop: 10,

    },

    linkHighlight: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
