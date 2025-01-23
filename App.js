import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import tw from 'twrnc';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/Login';
import DashboardScreen from './pages/MainApp';
import RegisterScreen from './pages/Register';
import NewWorkoutScreen from './pages/NewWorkout';
import WorkoutHistoryScreen from './pages/WorkoutHistory';
import { Ionicons } from '@expo/vector-icons';
// status bar displays mobile time, batter etc
// text is like p tag from html
// view is like div from html
// safe area view ensures content is visible
// touchale opacity is like faded button
//scroll view makes content scrollable used in our app for the card thing
// useFonts is used to load fonts

// this shows loading screen while fonts load, really unnecessary because fonts load quickly but i encountered delayed loading for the first time so juts a safety measure
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('./assets/fonts/Quicksand-Bold.ttf'),
    'Montserrat-SemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Quicksand-Medium.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
  });

  const bgCircle1 = useSharedValue({ x: 0, y: 0 });
  const bgCircle2 = useSharedValue({ x: width, y: height });

  
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

  
  const loginScale = useSharedValue(1);
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

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  // were using twnrc which is tailwindcss, we need to write tw `` and the style classes in backticks, not that there are some changes in tailwind for web and twrnc so check the docs
  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`} onLayout={onLayoutRootView}>
      
      <Animated.View style={[tw`absolute w-80 h-80 rounded-full bg-sky-100/30`, circle1Style]} />
      <Animated.View style={[tw`absolute w-96 h-96 rounded-full bg-blue-100/30`, circle2Style]} />

      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-1 px-4`}>
          
          <Animated.View 
            entering={FadeInDown.duration(1000).springify()} 
            style={tw`py-8 flex-row justify-between items-center`}
          >
            <View style={tw`flex-row items-center`}>
              <View style={tw`bg-white/80 p-3 rounded-2xl border-2 border-blue-800 shadow-sm`}>
                <Ionicons 
                  name="fitness-outline" 
                  size={40} 
                  color="#1e40af"
                />
              </View>
              <View style={tw`ml-3`}>
                <Text style={[tw`text-2xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
                  fit<Text style={tw`text-sky-500`}>ME</Text>
                </Text>
                <Text style={[tw`text-sm text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
                  Your Fitness Partner
                </Text>
              </View>
            </View>

            <AnimatedTouchable 
              style={[
                tw`px-6 py-4 border-2 border-sky-500 rounded-full bg-white/80`,
                loginAnimatedStyle
              ]}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Login
              </Text>
            </AnimatedTouchable>
          </Animated.View>

          
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(200)} 
            style={tw`mb-8 flex-row justify-between items-center`}
          >
            <Text style={[tw`text-blue-800 text-lg`, { fontFamily: 'Montserrat-Regular' }]}>
              Your Personal Fitness Journey
            </Text>
            <TouchableOpacity 
              style={tw`flex-row items-center`}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[tw`text-blue-800 text-base underline mr-1`, { fontFamily: 'Montserrat-Medium' }]}>
                Sign Up
              </Text>
              <Animated.Text 
                entering={FadeIn.duration(1000).delay(500)} 
                style={tw`text-blue-800`}
              >
                →
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>

          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4 py-4`}>
            {[
              { value: '7', label: 'Day Streak' },
              { value: '24', label: 'Workouts' },
              { value: '860', label: 'Active Minutes' }
            ].map((stat, index) => (
              <Animated.View 
                key={stat.label}
                entering={SlideInRight.duration(1000).delay(index * 200)}
                style={tw`mr-4 bg-white/80 p-4 rounded-2xl w-40 border border-sky-100 shadow-sm backdrop-blur-sm`}
              >
                <Text style={[tw`text-sky-500 text-4xl`, { fontFamily: 'Montserrat-Bold' }]}>
                  {stat.value}
                </Text>
                <Text style={[tw`text-blue-800 mt-2`, { fontFamily: 'Montserrat-Medium' }]}>
                  {stat.label}
                </Text>
              </Animated.View>
            ))}
          </ScrollView>

          
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(800)}
            style={tw`mt-6 bg-white/80 p-6 rounded-3xl shadow-lg border border-sky-100 backdrop-blur-sm`}
          >
            <View style={tw`bg-sky-50/80 rounded-2xl p-4 mb-6 border border-sky-100`}>
              <Text style={[tw`text-blue-800 text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Ready to crush it? 
              </Text>
              <Text style={[tw`text-blue-800/70 mt-2`, { fontFamily: 'Montserrat-Regular' }]}>
                Your next workout awaits. Let's make it count!
              </Text>
            </View>

            <AnimatedTouchable 
              entering={FadeInRight.duration(1000).delay(1000)}
              style={tw`bg-sky-500 border-2 border-sky-500 p-4 rounded-xl mb-4 shadow-md`}
              onPress={() => navigation.navigate('Dashboard')}
            >
              <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Start New Workout
              </Text>
            </AnimatedTouchable>

            <AnimatedTouchable 
              entering={FadeInRight.duration(1000).delay(1200)}
              style={tw`bg-blue-800 border-2 border-blue-800 p-4 rounded-xl`}
              onPress={() => navigation.navigate('WorkoutHistory')}
            >
              <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>
                View Workout History
              </Text>
            </AnimatedTouchable>
          </Animated.View>

          
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(1400)}
            style={tw`mt-6 flex-row justify-between`}
          >
            <View style={tw`bg-white/80 p-4 rounded-2xl flex-1 mr-4 border border-sky-100 shadow-sm backdrop-blur-sm`}>
              <Text style={[tw`text-blue-800/70`, { fontFamily: 'Montserrat-Medium' }]}>Last Workout</Text>
              <Text style={[tw`text-blue-800 mt-1`, { fontFamily: 'Montserrat-SemiBold' }]}>Chest Day</Text>
              <Text style={[tw`text-sky-500 text-sm`, { fontFamily: 'Montserrat-Regular' }]}>2 days ago</Text>
            </View>
            <View style={tw`bg-white/80 p-4 rounded-2xl flex-1 border border-sky-100 shadow-sm backdrop-blur-sm`}>
              <Text style={[tw`text-blue-800/70`, { fontFamily: 'Montserrat-Medium' }]}>Next Goal</Text>
              <Text style={[tw`text-blue-800 mt-1`, { fontFamily: 'Montserrat-SemiBold' }]}>Bench Press</Text>
              <Text style={[tw`text-sky-500 text-sm`, { fontFamily: 'Montserrat-Regular' }]}>100 kg</Text>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
//Navigation
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="NewWorkout" component={NewWorkoutScreen} />
        <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
