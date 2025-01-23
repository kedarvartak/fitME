import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useState } from 'react';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

// Mock data - Replace with real data from your backend/storage
const mockWorkoutHistory = [
  {
    id: '1',
    date: '2024-03-15',
    duration: '45:30',
    exercises: [
      { name: 'Bench Press', sets: [{ reps: 12, weight: '60' }, { reps: 10, weight: '65' }] },
      { name: 'Shoulder Press', sets: [{ reps: 12, weight: '40' }, { reps: 10, weight: '45' }] }
    ]
  },
  {
    id: '2',
    date: '2024-03-14',
    duration: '55:20',
    exercises: [
      { name: 'Squats', sets: [{ reps: 15, weight: '80' }, { reps: 12, weight: '85' }] },
      { name: 'Deadlifts', sets: [{ reps: 10, weight: '100' }, { reps: 8, weight: '110' }] }
    ]
  }
];

export default function WorkoutHistoryScreen({ navigation }) {
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  
  // Background animation
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

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const WorkoutCard = ({ workout }) => {
    const isExpanded = expandedWorkout === workout.id;
    
    return (
      <Animated.View
        entering={FadeInDown.duration(1000).springify()}
        style={tw`mb-4 bg-white/90 rounded-3xl shadow-lg border border-sky-100 overflow-hidden`}
      >
        <TouchableOpacity
          onPress={() => setExpandedWorkout(isExpanded ? null : workout.id)}
          style={tw`p-6`}
        >
          <View style={tw`flex-row justify-between items-center mb-2`}>
            <Text style={[tw`text-xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
              {formatDate(workout.date)}
            </Text>
            <View style={tw`bg-sky-50 px-4 py-2 rounded-xl`}>
              <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                {workout.duration}
              </Text>
            </View>
          </View>
          
          {isExpanded && (
            <View style={tw`mt-4`}>
              {workout.exercises.map((exercise, index) => (
                <View key={index} style={tw`mb-4 last:mb-0`}>
                  <Text style={[tw`text-lg text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
                    {exercise.name}
                  </Text>
                  <View style={tw`flex-row flex-wrap`}>
                    {exercise.sets.map((set, setIndex) => (
                      <View 
                        key={setIndex}
                        style={tw`bg-sky-50 px-4 py-2 rounded-xl mr-2 mb-2`}
                      >
                        <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                          Set {setIndex + 1}
                        </Text>
                        <Text style={[tw`text-blue-800 text-center mt-1`, { fontFamily: 'Montserrat-Bold' }]}>
                          {set.reps} × {set.weight}kg
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
          
          <View style={tw`flex-row justify-center mt-2`}>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#1e40af"
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
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

      <ScrollView 
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`px-6`}
      >
        <View style={tw`pt-24 pb-8`}>
          <Text style={[tw`text-4xl text-blue-800 mb-2`, { fontFamily: 'Montserrat-SemiBold' }]}>
            Workout History
          </Text>
          <Text style={[tw`text-lg text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
            Track your progress
          </Text>
        </View>

        {mockWorkoutHistory.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
} 