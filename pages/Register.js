import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions,
  ScrollView
} from 'react-native';
import { useState, useCallback } from 'react';
import tw from 'twrnc';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  const bgCircle1 = useSharedValue({ x: 0, y: 0 });
  const bgCircle2 = useSharedValue({ x: width, y: height });
  const registerScale = useSharedValue(1);

  const circle1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: bgCircle1.value.x },
      { translateY: bgCircle1.value.y }
    ],
  }));

  const circle2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: bgCircle2.value.x },
      { translateY: bgCircle2.value.y }
    ],
  }));

  const registerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(registerScale.value) }],
  }));

  const onPressIn = () => {
    registerScale.value = 0.95;
  };

  const onPressOut = () => {
    registerScale.value = 1;
  };

  useCallback(() => {
    bgCircle1.value = withRepeat(
      withTiming(
        { x: width * 0.5, y: height * 0.3 },
        { duration: 8000, easing: Easing.inOut(Easing.ease) }
      ),
      -1,
      true
    );
    bgCircle2.value = withRepeat(
      withTiming(
        { x: width * 0.2, y: height * 0.7 },
        { duration: 10000, easing: Easing.inOut(Easing.ease) }
      ),
      -1,
      true
    );
  }, [])();

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      <Animated.View style={[tw`absolute w-80 h-80 rounded-full bg-sky-100/30`, circle1Style]} />
      <Animated.View style={[tw`absolute w-96 h-96 rounded-full bg-blue-100/30`, circle2Style]} />

      <View style={tw`absolute top-12 left-6 z-10`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`flex-row items-center`}
        >
          <Text style={tw`text-blue-800 text-2xl`}>←</Text>
          <Text style={[tw`text-blue-800 ml-2 text-base`, { fontFamily: 'Montserrat-Medium' }]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-1`}>
        <ScrollView 
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`px-6 pt-24 pb-8`}
        >
          <Animated.View 
            entering={FadeInDown.duration(1000).springify()}
            style={tw`mb-8`}
          >
            <Text style={[tw`text-4xl text-blue-800 mb-2`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Create Account
            </Text>
            <Text style={[tw`text-lg text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
              Start your fitness journey today
            </Text>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.duration(1000).delay(200)}
            style={tw`bg-white/80 p-6 rounded-3xl shadow-lg border border-sky-100 backdrop-blur-sm mb-6`}
          >
            <View style={tw`mb-4`}>
              <Text style={[tw`text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                style={[
                  tw`bg-white border border-sky-100 rounded-xl p-4 text-blue-800`,
                  { fontFamily: 'Montserrat-Regular' }
                ]}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={[tw`text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[
                  tw`bg-white border border-sky-100 rounded-xl p-4 text-blue-800`,
                  { fontFamily: 'Montserrat-Regular' }
                ]}
              />
            </View>

            <View style={tw`mb-4`}>
              <Text style={[tw`text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                style={[
                  tw`bg-white border border-sky-100 rounded-xl p-4 text-blue-800`,
                  { fontFamily: 'Montserrat-Regular' }
                ]}
              />
            </View>

            <View style={tw`mb-6`}>
              <Text style={[tw`text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
                Confirm Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                style={[
                  tw`bg-white border border-sky-100 rounded-xl p-4 text-blue-800`,
                  { fontFamily: 'Montserrat-Regular' }
                ]}
              />
            </View>

            <AnimatedTouchable
              style={[
                tw`bg-sky-500 p-4 rounded-xl mb-4 shadow-md`,
                registerAnimatedStyle
              ]}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => navigation.replace('MainApp')}
            >
              <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-Bold' }]}>
                Sign Up
              </Text>
            </AnimatedTouchable>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.duration(1000).delay(400)}
            style={tw`flex-row justify-center items-center mb-6`}
          >
            <Text style={[tw`text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Login
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
} 