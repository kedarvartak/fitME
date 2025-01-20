import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import tw from 'twrnc';


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`} onLayout={onLayoutRootView}>
      <ScrollView style={tw`flex-1`}>
        <View style={tw`flex-1 px-4`}>
          
          <View style={tw`py-8`}>
            <Text style={[tw`text-5xl text-blue-800`, { fontFamily: 'Montserrat-Black' }]}>
              fit<Text style={tw`text-sky-500`}>ME</Text>
            </Text>
            <Text style={[tw`text-blue-800 text-lg mt-2`, { fontFamily: 'Montserrat-Regular' }]}>
              Your Personal Fitness Journey
            </Text>
          </View>

          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-4 px-4 py-4`}>
            
            <View style={tw`mr-4 bg-white p-4 rounded-2xl w-40 border border-sky-100 shadow-sm`}>
              <Text style={[tw`text-sky-500 text-4xl`, { fontFamily: 'Montserrat-Bold' }]}>7</Text>
              <Text style={[tw`text-blue-800 mt-2`, { fontFamily: 'Montserrat-Medium' }]}>Day Streak</Text>
            </View>
            
            <View style={tw`mr-4 bg-white p-4 rounded-2xl w-40 border border-sky-100 shadow-sm`}>
              <Text style={[tw`text-sky-500 text-4xl`, { fontFamily: 'Montserrat-Bold' }]}>24</Text>
              <Text style={[tw`text-blue-800 mt-2`, { fontFamily: 'Montserrat-Medium' }]}>Workouts</Text>
            </View>
            
            <View style={tw`mr-4 bg-white p-4 rounded-2xl w-40 border border-sky-100 shadow-sm`}>
              <Text style={[tw`text-sky-500 text-4xl`, { fontFamily: 'Montserrat-Bold' }]}>860</Text>
              <Text style={[tw`text-blue-800 mt-2`, { fontFamily: 'Montserrat-Medium' }]}>Active Minutes</Text>
            </View>
          </ScrollView>

          
          <View style={tw`mt-6 bg-white p-6 rounded-3xl shadow-lg border border-sky-100`}>
            <View style={tw`bg-white rounded-2xl p-4 mb-6 border border-sky-100`}>
              <Text style={[tw`text-blue-800 text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>Ready to crush it? </Text>
              <Text style={[tw`text-blue-800/70 mt-2`, { fontFamily: 'Montserrat-Regular' }]}>
                Your next workout awaits. Let's make it count!
              </Text>
            </View>

           
            <TouchableOpacity style={tw`bg-sky-500 p-4 rounded-xl mb-4 shadow-md`}>
              <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-Bold' }]}>
                Start New Workout
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={tw`bg-blue-800 p-4 rounded-xl`}>
              <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>
                View Workout History
              </Text>
            </TouchableOpacity>
          </View>

          
          <View style={tw`mt-6 flex-row justify-between`}>
            <View style={tw`bg-white p-4 rounded-2xl flex-1 mr-4 border border-sky-100 shadow-sm`}>
              <Text style={[tw`text-blue-800/70`, { fontFamily: 'Montserrat-Medium' }]}>Last Workout</Text>
              <Text style={[tw`text-blue-800 mt-1`, { fontFamily: 'Montserrat-SemiBold' }]}>Chest Day</Text>
              <Text style={[tw`text-sky-500 text-sm`, { fontFamily: 'Montserrat-Regular' }]}>2 days ago</Text>
            </View>
            <View style={tw`bg-white p-4 rounded-2xl flex-1 border border-sky-100 shadow-sm`}>
              <Text style={[tw`text-blue-800/70`, { fontFamily: 'Montserrat-Medium' }]}>Next Goal</Text>
              <Text style={[tw`text-blue-800 mt-1`, { fontFamily: 'Montserrat-SemiBold' }]}>Bench Press</Text>
              <Text style={[tw`text-sky-500 text-sm`, { fontFamily: 'Montserrat-Regular' }]}>100 kg</Text>
            </View>
          </View>

          
          <View style={tw`mt-6 mb-8 bg-white p-6 rounded-2xl border border-sky-100`}>
            <Text style={[tw`text-blue-800/70 italic`, { fontFamily: 'Montserrat-Regular' }]}>
              "The only bad workout is the one that didn't happen."
            </Text>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
