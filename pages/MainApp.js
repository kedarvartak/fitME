import { Text, View, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);


const calculateWeeklyStats = (workouts) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  
  const weeklyWorkouts = workouts.filter(workout => 
    new Date(workout.startTime) > oneWeekAgo
  );

  return {
    totalCalories: weeklyWorkouts.reduce((acc, workout) => {
      
      const duration = (new Date(workout.endTime) - new Date(workout.startTime)) / (1000 * 60);
      return acc + (duration * 7);
    }, 0),
    totalMinutes: weeklyWorkouts.reduce((acc, workout) => {
      const duration = (new Date(workout.endTime) - new Date(workout.startTime)) / (1000 * 60);
      return acc + duration;
    }, 0),
    totalExercises: weeklyWorkouts.reduce((acc, workout) => acc + workout.totalExercises, 0),
    workoutGoalProgress: (weeklyWorkouts.length / 5) * 100  // 5 workouts per week is 100% goal
  };
};

const getWorkoutDurationsByDay = (workouts) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  
  const durations = Array(7).fill(0);
  
  workouts.forEach(workout => {
    const workoutDate = new Date(workout.startTime);
    if (workoutDate > oneWeekAgo) {
      const duration = (new Date(workout.endTime) - new Date(workout.startTime)) / (1000 * 60);
      const dayIndex = workoutDate.getDay();
      durations[dayIndex] = duration;
    }
  });
  
  
  const today = now.getDay();
  const rotatedDurations = [...durations.slice(today + 1), ...durations.slice(0, today + 1)];
  const rotatedDays = [...days.slice(today + 1), ...days.slice(0, today + 1)];
  
  return {
    labels: rotatedDays,
    datasets: [{
      data: rotatedDurations
    }]
  };
};

// same bg anim weve used in every screen
export default function MainAppScreen() {
  const navigation = useNavigation();
  
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

 

  const [recentWorkouts, setRecentWorkouts] = useState([]);
  
  
  const [dashboardStats, setDashboardStats] = useState({
    totalCalories: 0,
    totalMinutes: 0,
    totalExercises: 0,
    workoutGoalProgress: 0
  });
  
  
  const [workoutChartData, setWorkoutChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
  });

  const [workoutSplit, setWorkoutSplit] = useState(null);

  useEffect(() => {
    checkWorkoutSplit();
    loadWorkouts();
  }, []);

  const checkWorkoutSplit = async () => {
    try {
      const splitData = await AsyncStorage.getItem('workoutSplit');
      if (!splitData) {
        navigation.replace('SplitSetup');
      } else {
        setWorkoutSplit(JSON.parse(splitData));
      }
    } catch (error) {
      console.error('Error checking split:', error);
    }
  };

  
  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [])
  );

  
  const loadWorkouts = async () => {
    try {
      const workoutsData = await AsyncStorage.getItem('workouts');
      console.log('Raw workouts data:', workoutsData);
      
      if (workoutsData) {
        const workouts = JSON.parse(workoutsData);
        console.log('Parsed workouts:', workouts); 
        
       
        workouts.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        setRecentWorkouts(workouts);
        console.log('Sorted and set workouts:', workouts); 
        
       
        const stats = calculateWeeklyStats(workouts);
        setDashboardStats(stats);
        
       
        const chartData = getWorkoutDurationsByDay(workouts);
        setWorkoutChartData(chartData);
      } else {
        console.log('No workouts found in storage'); 
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  
  const getWorkoutDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMinutes = Math.floor((end - start) / (1000 * 60));
    return `${diffInMinutes} min`;
  };

  
  const renderRecentActivity = () => (
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
      {recentWorkouts.length === 0 ? (
        <Text style={[tw`text-blue-800/60 text-center py-4`, { fontFamily: 'Montserrat-Regular' }]}>
          No workouts recorded yet
        </Text>
      ) : (
        recentWorkouts.slice(0, 3).map((workout, index) => (
          <AnimatedTouchable 
            key={`recent-workout-${workout.id}-${index}`}
            entering={FadeInRight.duration(1000).delay(index * 100)}
            style={tw`bg-white/90 p-4 rounded-2xl mb-3 border border-sky-100`}
            onPress={() => navigation.navigate('WorkoutDetails', { workout })}
          >
            <View style={tw`flex-row items-center justify-between mb-2`}>
              <View style={tw`flex-row items-center`}>
                <View style={tw`bg-sky-50 p-2 rounded-xl mr-3`}>
                  <Ionicons name="barbell-outline" size={24} color="#0ea5e9" />
                </View>
                <View>
                  <Text style={[tw`text-blue-800 text-base`, { fontFamily: 'Montserrat-SemiBold' }]}>
                    Workout {index + 1}
                  </Text>
                  <Text style={[tw`text-blue-800/60 text-sm`, { fontFamily: 'Montserrat-Regular' }]}>
                    {getTimeAgo(workout.startTime)}
                  </Text>
                </View>
              </View>
              <View style={tw`bg-sky-50 px-3 py-1 rounded-full`}>
                <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                  {getWorkoutDuration(workout.startTime, workout.endTime)}
                </Text>
              </View>
            </View>
            
            <View style={tw`flex-row justify-between mt-2`}>
              <Text style={[tw`text-blue-800/70`, { fontFamily: 'Montserrat-Medium' }]}>
                {workout.totalExercises} exercises • {workout.totalSets} sets
              </Text>
              <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                {workout.totalVolume}kg total
              </Text>
            </View>
          </AnimatedTouchable>
        ))
      )}
    </Animated.View>
  );

  
  const renderQuickActions = () => (
    <Animated.View 
      entering={FadeInDown.duration(1000).delay(600)}
      style={tw`mb-8`}
    >
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View>
          <Text style={[tw`text-blue-800 text-xl`, { fontFamily: 'Montserrat-Bold' }]}>
            Start Workout
          </Text>
          <Text style={[tw`text-blue-800/60 mt-1`, { fontFamily: 'Montserrat-Regular' }]}>
            Choose your workout split for today
          </Text>
        </View>
        <View style={tw`bg-sky-50 px-3 py-1 rounded-full border border-sky-100`}>
          <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short' })}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row flex-wrap justify-between`}>
        {workoutSplit?.days.map((day, index) => {
          const isToday = index === new Date().getDay();
          const getWorkoutIcon = (day) => {
            if (day.toLowerCase().includes('push')) return ['dumbell', '💪'];
            if (day.toLowerCase().includes('pull')) return ['fitness', '🏋️‍♂️'];
            if (day.toLowerCase().includes('leg')) return ['walk', '🦵'];
            return ['body', '🏃‍♂️'];
          };
          const [icon, emoji] = getWorkoutIcon(day);

          return (
            <AnimatedTouchable 
              key={`workout-day-${index}-${day}`}
              entering={FadeInRight.duration(1000).delay(index * 100)}
              style={[
                tw`bg-white p-5 rounded-3xl w-[48%] mb-4 border ${isToday ? 'border-sky-500' : 'border-sky-100'} shadow-sm`,
                isToday && tw`bg-sky-50/50`
              ]}
              onPress={() => navigation.navigate('StartWorkout', { splitDay: day })}
            >
              <View style={tw`flex-row justify-between items-start mb-3`}>
                <View style={[
                  tw`rounded-2xl w-12 h-12 items-center justify-center`,
                  { backgroundColor: isToday ? 'rgb(14 165 233 / 0.2)' : 'rgb(14 165 233 / 0.1)' }
                ]}>
                  <Ionicons 
                    name={`${icon}-outline`}
                    size={24} 
                    color={isToday ? '#0284c7' : '#0ea5e9'} 
                  />
                </View>
                <Text style={tw`text-2xl`}>{emoji}</Text>
              </View>

              <View>
                <Text style={[
                  tw`text-lg ${isToday ? 'text-blue-800' : 'text-blue-800/80'}`, 
                  { fontFamily: isToday ? 'Montserrat-Bold' : 'Montserrat-SemiBold' }
                ]}>
                  {day}
                </Text>
                {isToday && (
                  <Text style={[tw`text-sky-500 mt-1`, { fontFamily: 'Montserrat-Medium' }]}>
                    Today's Focus
                  </Text>
                )}
              </View>
            </AnimatedTouchable>
          );
        })}
      </View>
    </Animated.View>
  );

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all workout data? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('workouts');
              await AsyncStorage.removeItem('workoutSplit');
              navigation.replace('SplitSetup');
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      <View style={tw`absolute top-12 left-6 z-10`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={tw`flex-row items-center`}
        >
          <Ionicons name="arrow-back" size={28} color="#1e40af" />
          <Text style={[tw`text-blue-800 ml-2 text-base`, { fontFamily: 'Montserrat-Medium' }]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={tw`absolute top-12 right-6 z-10`}
        onPress={clearAllData}
      >
        <Ionicons name="trash-outline" size={24} color="#ef4444" />
      </TouchableOpacity>

      <Animated.View style={[tw`absolute w-80 h-80 rounded-full bg-sky-100/30`, circle1Style]} />
      <Animated.View style={[tw`absolute w-96 h-96 rounded-full bg-blue-100/30`, circle2Style]} />

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-4`}>
          <Animated.View 
            entering={FadeInDown.duration(1000).springify()} 
            style={tw`pt-16 pb-8`}
          >
            <Text style={[tw`text-4xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Dashboard
            </Text>
            <Text style={[tw`text-lg text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
              Welcome back, <Text style={tw`text-sky-500`}>Kedar</Text>
            </Text>
          </Animated.View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={tw`-mx-4 px-4`}
          >
            {[
              { 
                id: 'calories', 
                icon: 'flame-outline', 
                value: `${Math.round(dashboardStats.totalCalories)}`, 
                label: 'Calories', 
                color: 'rgb(239 68 68)' 
              },
              { 
                id: 'minutes', 
                icon: 'time-outline', 
                value: `${Math.round(dashboardStats.totalMinutes)}`, 
                label: 'Minutes', 
                color: 'rgb(14 165 233)' 
              },
              { 
                id: 'goal', 
                icon: 'trophy-outline', 
                value: `${Math.round(dashboardStats.workoutGoalProgress)}%`, 
                label: 'Goal', 
                color: 'rgb(168 85 247)' 
              },
            ].map((stat) => (
              <Animated.View 
                key={stat.id}
                entering={SlideInRight.duration(1000).delay(stat.id === 'calories' ? 0 : 100)}
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
              data={workoutChartData}
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

          {renderQuickActions()}

          {renderRecentActivity()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 