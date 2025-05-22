import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Car, Eye, EyeOff, User, Lock, Mail, ArrowRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const API_URL = "http://10.0.2.2:8000";

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const logoScale = useSharedValue(0.8);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const buttonScale = useSharedValue(1);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  useEffect(() => {
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 300 })
    );
    formOpacity.value = withDelay(400, withTiming(1, { duration: 700 }));
    formTranslateY.value = withDelay(400, withTiming(0, { duration: 700 }));
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !senha) {
      setError('Preencha todos os campos.');
      buttonScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: senha }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || 'Erro no cadastro');

      navigation.navigate('Login');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#1a2a6c', '#2a4085', '#324f9c']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Car size={48} color="#ffffff" />
            <Text style={styles.logoText}>ParkingSpot</Text>
          </Animated.View>

          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <Text style={styles.welcomeText}>Criar conta</Text>
            <Text style={styles.subtitleText}>Preencha os dados para se cadastrar</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#324f9c" style={styles.inputIcon} />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Digite seu username"
                  style={styles.input}
                  autoCapitalize="none"
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ colors: { primary: 'transparent' } }}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#324f9c" style={styles.inputIcon} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ colors: { primary: 'transparent' } }}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#324f9c" style={styles.inputIcon} />
                <TextInput
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Digite sua senha"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  mode="flat"
                  underlineColor="transparent"
                  theme={{ colors: { primary: 'transparent' } }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <EyeOff size={20} color="#324f9c" /> : <Eye size={20} color="#324f9c" />}
                </TouchableOpacity>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Animated.View style={[styles.buttonOuterContainer, buttonAnimatedStyle]}>
              <Pressable
                style={({ pressed }) => [styles.buttonContainer, pressed && styles.buttonPressed]}
                onPress={handleRegister}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#5e35b1', '#7b1fa2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrar'}</Text>
                  {!loading && <ArrowRight color="white" size={20} />}
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.registerLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logoText: { fontSize: 32, fontWeight: 'bold', color: 'white', marginTop: 8 },
  formContainer: { backgroundColor: 'white', borderRadius: 16, padding: 20, elevation: 5 },
  welcomeText: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitleText: { fontSize: 14, color: '#666', marginBottom: 16 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputIcon: { marginRight: 8 },
  eyeIcon: { marginLeft: 'auto' },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 40,
    padding: 0,
    fontSize: 14,
  },
  buttonOuterContainer: { marginTop: 20 },
  buttonContainer: { borderRadius: 8, overflow: 'hidden' },
  buttonPressed: { opacity: 0.8 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  errorText: { color: 'red', marginTop: 8, fontSize: 14 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  registerText: { color: '#666' },
  registerLink: { color: '#324f9c', fontWeight: 'bold' },
});

export default RegisterScreen;