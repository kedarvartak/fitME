import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions 
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  const quotes = [
    {
      text: "The only person you are destined to become is the person you decide to be.",
      author: "Ralph Waldo Emerson"
    },
    {
      text: "The difference between try and triumph is just a little umph!",
      author: "Marvin Phillips"
    },
    {
      text: "Success is not final, failure is not fatal: it's the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The hard days are what make you stronger.",
      author: "Aly Raisman"
    }
  ];

  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

 //same animation logic as in App.js, i took this from one of my react projects
  const bgCircle1 = useSharedValue({ x: 0, y: 0 });
  const bgCircle2 = useSharedValue({ x: width, y: height });

 
  const loginScale = useSharedValue(1);

  
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

  
  const loginAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(loginScale.value) }],
  }));

  const onPressIn = () => {
    loginScale.value = 0.95;
  };

  const onPressOut = () => {
    loginScale.value = 1;
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

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
      >
        <View style={tw`flex-1 px-6 pt-24`}>
         
          <Animated.View 
            entering={FadeInDown.duration(1000).springify()}
            style={tw`mb-8`}
          >
            <Text style={[tw`text-4xl text-blue-800 mb-2`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Welcome Back
            </Text>
            <Text style={[tw`text-lg text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
              Login to continue your fitness journey
            </Text>
          </Animated.View>

          
          <Animated.View 
            entering={FadeInUp.duration(1000).delay(200)}
            style={tw`bg-white/80 p-6 rounded-3xl shadow-lg border border-sky-100 backdrop-blur-sm`}
          >
            
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

            
            <View style={tw`mb-6`}>
              <Text style={[tw`text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
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
                loginAnimatedStyle
              ]}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => navigation.replace('Dashboard')}
            >
              <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-Bold' }]}>
                Login
              </Text>
            </AnimatedTouchable>

            
            <TouchableOpacity 
              style={tw`mb-2`}
              activeOpacity={0.7}
            >
              <Text style={[tw`text-blue-800 text-center`, { fontFamily: 'Montserrat-Medium' }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Animated.View>

         
          <Animated.View 
            entering={FadeInUp.duration(1000).delay(400)}
            style={tw`mt-6 flex-row justify-center items-center`}
          >
            <Text style={[tw`text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Animated.View>

          
          <Animated.View 
            entering={FadeInUp.duration(1000).delay(600)}
            style={tw`absolute bottom-12 left-6 right-6`}
          >
            <Text style={[
              tw`text-blue-800/70 text-center text-lg leading-6 mb-2`, 
              { fontFamily: 'Montserrat-Medium' }
            ]}>
              "{randomQuote.text}"
            </Text>
            <Text style={[
              tw`text-sky-500 text-center`, 
              { fontFamily: 'Montserrat-SemiBold' }
            ]}>
              {randomQuote.author}
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 