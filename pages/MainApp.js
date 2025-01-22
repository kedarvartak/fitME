import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import tw from 'twrnc';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring, 
} from 'react-native-reanimated';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons'; 

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// same bg anim weve used in every screen
export default function MainAppScreen({ navigation }) {
  
  const bgCircle1 = useSharedValue({ x: 0, y: 0 });
  const bgCircle2 = useSharedValue({ x: width, y: height });

  
  const buttonScale = useSharedValue(1);

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

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(buttonScale.value) }],
  }));

  // this is the mock data
  const workoutData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [45, 60, 30, 75, 50, 65, 40],
    }]
  };

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

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-4`}>
         
          <Animated.View 
            entering={FadeInDown.duration(1000).springify()} 
            style={tw`pt-16 pb-8 flex-row justify-between items-center`}
          >
            <View>
              <Text style={[tw`text-4xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Dashboard
              </Text>
              <Text style={[tw`text-lg text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
                Welcome back, <Text style={tw`text-sky-500`}>Kedar</Text>
              </Text>
            </View>
            <AnimatedTouchable 
              style={[
                tw`bg-white/90 p-3 rounded-2xl shadow-sm border border-sky-100`,
                buttonAnimatedStyle
              ]}
            >
              <Ionicons name="person-circle-outline" size={32} color="#1e40af" />
            </AnimatedTouchable>
          </Animated.View>

          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={tw`-mx-4 px-4`}
          >
            {[
              { icon: 'flame-outline', value: '2,450', label: 'Calories', color: 'rgb(239 68 68)' },
              { icon: 'time-outline', value: '45', label: 'Minutes', color: 'rgb(14 165 233)' },
              { icon: 'barbell-outline', value: '6', label: 'Exercises', color: 'rgb(34 197 94)' },
              { icon: 'trophy-outline', value: '85%', label: 'Goal', color: 'rgb(168 85 247)' },
            ].map((stat, index) => (
              <Animated.View 
                key={stat.label}
                entering={SlideInRight.duration(1000).delay(index * 100)}
                style={tw`mr-4 bg-white/80 p-4 rounded-2xl w-32 border border-sky-100 shadow-sm backdrop-blur-sm`}
              >
                <Ionicons name={stat.icon} size={24} color={stat.color} />
                <Text style={[tw`text-2xl mt-2`, { fontFamily: 'Montserrat-Bold', color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text style={[tw`text-blue-800/70 text-sm`, { fontFamily: 'Montserrat-Medium' }]}>
                  {stat.label}
                </Text>
              </Animated.View>
            ))}
          </ScrollView>

         
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(400)}
            style={tw`mt-6 mb-6 bg-white/90 p-6 rounded-3xl shadow-lg border border-sky-100 backdrop-blur-sm`}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={[tw`text-blue-800 text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Workout Duration
              </Text>
              <View style={tw`bg-sky-50 px-3 py-1 rounded-full border border-sky-100`}>
                <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>This Week</Text>
              </View>
            </View>
            <LineChart
              data={workoutData}
              width={width - 64}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(14, 165, 233, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(30, 64, 175, ${opacity})`,
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#fff"
                },
                propsForLabels: {
                  fontFamily: 'Montserrat-Medium',
                }
              }}
              bezier
              style={tw`rounded-2xl`}
            />
          </Animated.View>

          
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(600)}
            style={tw`mb-6`}
          >
            <Text style={[tw`text-blue-800 text-lg mb-4`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Quick Actions
            </Text>
            <View style={tw`flex-row flex-wrap justify-between`}>
              {[
                { icon: 'add-circle-outline', label: 'New Workout', color: 'rgb(14 165 233)' },
                { icon: 'calendar-outline', label: 'Schedule', color: 'rgb(34 197 94)' },
                { icon: 'stats-chart', label: 'Progress', color: 'rgb(168 85 247)' },
                { icon: 'settings-outline', label: 'Settings', color: 'rgb(239 68 68)' }
              ].map((action, index) => (
                <AnimatedTouchable 
                  key={action.label}
                  entering={FadeInRight.duration(1000).delay(index * 100)}
                  style={tw`bg-white/90 p-4 rounded-2xl w-[48%] mb-4 border border-sky-100 shadow-sm`}
                >
                  <View style={[tw`rounded-full w-12 h-12 items-center justify-center mb-2`, { backgroundColor: `${action.color}10` }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={[tw`text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
                    {action.label}
                  </Text>
                </AnimatedTouchable>
              ))}
            </View>
          </Animated.View>

         
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(800)}
            style={tw`mb-6`}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={[tw`text-blue-800 text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>
                Recent Activity
              </Text>
              <TouchableOpacity>
                <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>See All</Text>
              </TouchableOpacity>
            </View>
            {[
              { type: 'Chest & Triceps', time: '2 hours ago', duration: '45 min', icon: 'barbell-outline' },
              { type: 'Back & Biceps', time: 'Yesterday', duration: '50 min', icon: 'fitness-outline' },
              { type: 'Leg Day', time: '2 days ago', duration: '60 min', icon: 'body-outline' }
            ].map((activity, index) => (
              <AnimatedTouchable 
                key={index}
                entering={FadeInRight.duration(1000).delay(index * 100)}
                style={tw`bg-white/90 p-4 rounded-2xl mb-3 border border-sky-100 flex-row items-center`}
              >
                <View style={tw`bg-sky-50 p-2 rounded-xl mr-3`}>
                  <Ionicons name={activity.icon} size={24} color="#0ea5e9" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-blue-800 text-base`, { fontFamily: 'Montserrat-SemiBold' }]}>
                    {activity.type}
                  </Text>
                  <Text style={[tw`text-blue-800/60 text-sm`, { fontFamily: 'Montserrat-Regular' }]}>
                    {activity.time}
                  </Text>
                </View>
                <View style={tw`bg-sky-50 px-3 py-1 rounded-full`}>
                  <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                    {activity.duration}
                  </Text>
                </View>
              </AnimatedTouchable>
            ))}
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 