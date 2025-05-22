import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  Pressable
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Car, Eye, EyeOff, User, Lock, ArrowRight, CircleHelp as HelpCircle } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

const API_URL = "http://10.0.2.2:8000";

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigation = useNavigation();

  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);
  const logoScale = useSharedValue(0.8);
  const usernameScale = useSharedValue(1);
  const passwordScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }]
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }]
  }));

  const handleLogin = async () => {
    if (!username || !senha) {
      setError('Por favor, preencha todos os campos.');
      buttonScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      return;
    }
    
    setError('');
    setLoading(true);
    buttonScale.value = withTiming(0.95, { duration: 100 });
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', senha);
      
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Falha na autenticação');
      }

      await AsyncStorage.setItem('access_token', data.access_token);
      await AsyncStorage.setItem('token_type', data.token_type);
      
      navigation.navigate('Home');
    } catch (err: any) {
      console.error('Erro de login:', err);
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
      buttonScale.value = withTiming(1, { duration: 200 });
    }
  };

  React.useEffect(() => {
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 300 })
    );
    
    formOpacity.value = withDelay(400, withTiming(1, { duration: 700 }));
    formTranslateY.value = withDelay(400, withTiming(0, { duration: 700 }));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1a2a6c', '#2a4085', '#324f9c']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <Car size={48} color="#ffffff" strokeWidth={1.5} />
            <Text style={styles.logoText}>ParkingSpot</Text>
          </Animated.View>

          <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
            <Text style={styles.welcomeText}>Bem-vindo!</Text>
            <Text style={styles.subtitleText}>Acesse sua conta para continuar</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#324f9c" style={styles.inputIcon} />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  placeholder="Digite seu username"
                  autoCapitalize="none"
                  mode="flat"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
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
                  style={styles.input}
                  placeholder="Digite sua senha"
                  secureTextEntry={!showPassword}
                  mode="flat"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  theme={{ colors: { primary: 'transparent' } }}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#324f9c" />
                  ) : (
                    <Eye size={20} color="#324f9c" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[
                  styles.checkbox,
                  rememberMe && styles.checkboxChecked
                ]}>
                  {rememberMe && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.rememberText}>Lembrar-me</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Animated.View style={[styles.buttonOuterContainer, useAnimatedStyle(() => ({
              transform: [{ scale: buttonScale.value }]
            }))]}>
              <Pressable 
                style={({ pressed }) => [
                  styles.buttonContainer,
                  pressed && styles.buttonPressed
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#5e35b1', '#7b1fa2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Text>
                  {!loading && <ArrowRight color="white" size={20} />}
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.helpContainer}>
              <HelpCircle size={16} color="#324f9c" />
              <Text style={styles.helpText}>Precisa de ajuda?</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
  },
  formContainer: {
    width: '88%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#324f9c',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    height: 54,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 54,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#324f9c',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#324f9c',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  rememberText: {
    fontSize: 14,
    color: '#475569',
  },
  forgotText: {
    fontSize: 14,
    color: '#324f9c',
    fontWeight: '500',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonOuterContainer: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  button: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  registerText: {
    fontSize: 14,
    color: '#475569',
  },
  registerLink: {
    fontSize: 14,
    color: '#324f9c',
    fontWeight: '500',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#324f9c',
    marginLeft: 4,
  },
});

export default LoginScreen;