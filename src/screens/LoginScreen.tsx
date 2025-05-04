import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailScale = useRef(new Animated.Value(1)).current;
  const senhaScale = useRef(new Animated.Value(1)).current;

  const animateScale = (scale: Animated.Value | Animated.ValueXY, toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const navigation = useNavigation();

  const handleLogin = () => {
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }
    setError('');
    console.log('Login attempted with:', { email, senha });
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <Text style={styles.title}>Bem-vindo!</Text>
          <Animated.View style={[styles.inputContainer, { transform: [{ scale: emailScale }] }]}>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              left={<TextInput.Icon icon={() => <Icon name="email" size={24} color="#6200ee" />} />}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => animateScale(emailScale, 1.05)}
              onBlur={() => animateScale(emailScale, 1)}
            />
          </Animated.View>
          <Animated.View style={[styles.inputContainer, { transform: [{ scale: senhaScale }] }]}>
            <TextInput
              mode="outlined"
              label="Senha"
              value={senha}
              onChangeText={(text) => setSenha(text)}
              style={styles.input}
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon={() => <Icon name="lock" size={24} color="#6200ee" />} />}
              right={
                <TextInput.Icon
                  icon={() => (
                    <Icon
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      size={24}
                      color="#6200ee"
                    />
                  )}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              onFocus={() => animateScale(senhaScale, 1.05)}
              onBlur={() => animateScale(senhaScale, 1)}
            />
          </Animated.View>
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Entrar
          </Button>
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
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    width: '100%',
    paddingVertical: 5,
    backgroundColor: '#6200ee',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
  },
});

export default LoginScreen;