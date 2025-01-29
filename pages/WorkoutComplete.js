import { 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function WorkoutComplete({ route, navigation }) {
  const { workoutData } = route.params;
  
  
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

  
  const totalSets = workoutData.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
  const totalVolume = workoutData.exercises.reduce((acc, exercise) => {
    return acc + exercise.sets.reduce((setAcc, set) => {
      return setAcc + (Number(set.weight) * Number(set.reps) || 0);
    }, 0);
  }, 0);
  
  const workoutDuration = Math.floor(
    (new Date(workoutData.endTime) - new Date(workoutData.startTime)) / (1000 * 60)
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      
      <Animated.View style={[tw`absolute -left-40 -top-40 w-80 h-80 rounded-full bg-sky-100 opacity-50`, circle1Style]} />
      <Animated.View style={[tw`absolute -right-40 -bottom-40 w-80 h-80 rounded-full bg-blue-100 opacity-50`, circle2Style]} />

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-4 pt-16`}>
         
          <Animated.View 
            entering={FadeInDown.duration(1000)}
            style={tw`mb-8 items-center`}
          >
            <View style={tw`bg-blue-500 p-6 rounded-full mb-4`}>
              <Ionicons name="trophy" size={48} color="#fff" />
            </View>
            <Text style={[tw`text-3xl text-blue-800 text-center`, { fontFamily: 'Montserrat-Bold' }]}>
              Workout Complete! 🎉
            </Text>
            <Text style={[tw`text-lg text-blue-800/60 text-center mt-2`, { fontFamily: 'Montserrat-Medium' }]}>
              Great job crushing your {workoutData.splitDay} workout!
            </Text>
          </Animated.View>

          
          <View style={tw`flex-row flex-wrap justify-between mb-6`}>
            {[
              { label: 'Duration', value: `${workoutDuration} min`, icon: 'time-outline' },
              { label: 'Exercises', value: workoutData.exercises.length, icon: 'barbell-outline' },
              { label: 'Total Sets', value: totalSets, icon: 'layers-outline' },
              { label: 'Volume', value: `${totalVolume}kg`, icon: 'stats-chart-outline' },
            ].map((stat, index) => (
              <Animated.View
                key={stat.label}
                entering={FadeInDown.duration(1000).delay(index * 100)}
                style={tw`w-[48%] bg-white p-4 rounded-2xl mb-4 border border-sky-100`}
              >
                <View style={tw`flex-row items-center mb-2`}>
                  <View style={tw`bg-sky-100 p-2 rounded-xl mr-2`}>
                    <Ionicons name={stat.icon} size={24} color="#0ea5e9" />
                  </View>
                  <Text style={[tw`text-blue-800/60`, { fontFamily: 'Montserrat-Medium' }]}>
                    {stat.label}
                  </Text>
                </View>
                <Text style={[tw`text-2xl text-blue-800`, { fontFamily: 'Montserrat-Bold' }]}>
                  {stat.value}
                </Text>
              </Animated.View>
            ))}
          </View>

          
          <Animated.View
            entering={FadeInDown.duration(1000).delay(400)}
            style={tw`mb-6`}
          >
            <Text style={[tw`text-lg text-blue-800 mb-4`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Exercise Summary
            </Text>
            {workoutData.exercises.map((exercise, index) => (
              exercise.sets.length > 0 && (
                <Animated.View 
                  key={index}
                  entering={FadeInDown.duration(800).delay(index * 100)}
                  style={tw`bg-white p-6 rounded-2xl mb-4 border border-slate-200`}
                >
                  <View style={tw`flex-row items-center justify-between mb-4`}>
                    <View style={tw`flex-row items-center flex-1`}>
                      <View style={tw`bg-slate-100 p-3 rounded-xl mr-3`}>
                        <Ionicons name="barbell-outline" size={20} color="#0ea5e9" />
                      </View>
                      <Text style={[tw`text-blue-800 flex-1`, { fontFamily: 'Montserrat-Medium' }]}>
                        {exercise.name}
                      </Text>
                    </View>
                    <View style={tw`bg-sky-50 px-3 py-1 rounded-xl`}>
                      <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                        {exercise.sets.length} sets
                      </Text>
                    </View>
                  </View>

                  <View style={tw`flex-row flex-wrap`}>
                    {exercise.sets.map((set, setIndex) => (
                      <View 
                        key={setIndex} 
                        style={tw`bg-slate-50 px-4 py-2 rounded-xl mr-2 mb-2 flex-row items-center`}
                      >
                        <Text style={[tw`text-blue-800/60 mr-2`, { fontFamily: 'Montserrat-Medium' }]}>
                          Set {setIndex + 1}
                        </Text>
                        <View style={tw`h-4 w-[1px] bg-slate-300 mr-2`} />
                        <Text style={[tw`text-blue-800`, { fontFamily: 'Montserrat-Medium' }]}>
                          {set.weight}kg × {set.reps}
                        </Text>
                      </View>
                    ))}
                  </View>

                  
                  <View style={tw`mt-4 pt-4 border-t border-slate-100`}>
                    <View style={tw`flex-row justify-between items-center`}>
                      <Text style={[tw`text-blue-800/60`, { fontFamily: 'Montserrat-Medium' }]}>
                        Total Volume
                      </Text>
                      <Text style={[tw`text-blue-800`, { fontFamily: 'Montserrat-Medium' }]}>
                        {exercise.sets.reduce((acc, set) => acc + (Number(set.weight) * Number(set.reps)), 0)}kg
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )
            ))}
          </Animated.View>

         
          <View style={tw`flex-row mb-8`}>
            <AnimatedTouchable
              entering={FadeInDown.duration(1000).delay(500)}
              style={tw`flex-1 bg-blue-800 p-5 rounded-2xl`}
              onPress={() => navigation.navigate('MainApp')}
            >
              <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-Medium' }]}>
                Back to Home
              </Text>
            </AnimatedTouchable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 