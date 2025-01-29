import { 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const getMotivationalQuote = () => {
  const quotes = [
    "Push your limits! 💪",
    "Beast mode: ON 🔥",
    "Make it count! ⚡️",
    "Stronger every day 🏋️‍♂️",
    "No excuses! 💯",
    "Let's crush it! 🚀",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export default function ActiveWorkout({ route, navigation }) {
  const { splitDay = '', selectedExercises = [] } = route.params || {};
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sets, setSets] = useState([]);
  const [workoutStartTime, setWorkoutStartTime] = useState(new Date());
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);
  const [quote, setQuote] = useState(getMotivationalQuote());
  const [allExerciseSets, setAllExerciseSets] = useState({});
  const [previousData, setPreviousData] = useState(null);
  const [weightUnit, setWeightUnit] = useState('kg'); 

  
  const bgCircle1 = useSharedValue({ x: 0, y: 0 });
  const bgCircle2 = useSharedValue({ x: width, y: height });
  const pulseValue = useSharedValue(1);
  const timerScale = useSharedValue(1);

 
  const circle1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: bgCircle1.value.x },
      { translateY: bgCircle1.value.y },
      { scale: pulseValue.value }
    ],
  }));

  const circle2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: bgCircle2.value.x },
      { translateY: bgCircle2.value.y },
      { scale: pulseValue.value }
    ],
  }));

  const timerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: timerScale.value }],
  }));

  
  const kgToLb = (kg) => (kg * 2.20462).toFixed(1);
  const lbToKg = (lb) => (lb / 2.20462).toFixed(1);

 
  const convertWeight = (weight, from, to) => {
    if (!weight) return '';
    const numWeight = parseFloat(weight);
    if (from === to) return weight;
    return from === 'kg' ? kgToLb(numWeight) : lbToKg(numWeight);
  };

  useEffect(() => {
    if (!selectedExercises || selectedExercises.length === 0) {
      Alert.alert(
        'No Exercises',
        'Please select exercises before starting workout',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
      return;
    }
    
    setWorkoutStartTime(new Date());
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    
    const quoteInterval = setInterval(() => {
      setQuote(getMotivationalQuote());
    }, 30000);

    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    
    bgCircle1.value = withRepeat(
      withSequence(
        withTiming({ x: width * 0.5, y: height * 0.3 }, { duration: 12000 }),
        withTiming({ x: 0, y: 0 }, { duration: 12000 })
      ),
      -1,
      true
    );

    bgCircle2.value = withRepeat(
      withSequence(
        withTiming({ x: width * 0.3, y: height * 0.5 }, { duration: 10000 }),
        withTiming({ x: width, y: height }, { duration: 10000 })
      ),
      -1,
      true
    );

    
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    loadPreviousData();
  }, [currentExerciseIndex]);

  const loadPreviousData = async () => {
    try {
      const workouts = await AsyncStorage.getItem('workouts');
      if (workouts) {
        const parsedWorkouts = JSON.parse(workouts);
        const lastWorkout = parsedWorkouts
          .filter(w => w.exercises.some(e => e.name === currentExercise.name))
          .pop();
        
        if (lastWorkout) {
          const exerciseData = lastWorkout.exercises.find(e => e.name === currentExercise.name);
          setPreviousData(exerciseData.sets);
        } else {
          setPreviousData(null);
        }
      }
    } catch (error) {
      console.error('Error loading previous data:', error);
    }
  };

  const currentExercise = selectedExercises[currentExerciseIndex] || {
    name: 'Exercise',
    icon: 'barbell-outline'
  };

  const toggleTimer = () => {
    if (isTimerRunning) {
      clearInterval(timerRef.current);
    } else {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const addSet = () => {
    setSets([...sets, { weight: '', reps: '', restTime: timer }]);
    resetTimer();
  };


  const updateSet = (index, field, value) => {
    const newSets = [...sets];
    if (field === 'weight') {
      
      newSets[index] = { 
        ...newSets[index], 
        [field]: weightUnit === 'kg' ? value : lbToKg(value)
      };
    } else {
      newSets[index] = { ...newSets[index], [field]: value };
    }
    setSets(newSets);
  };

  // Toggle weight unit
  const toggleWeightUnit = () => {
    setWeightUnit(prev => prev === 'kg' ? 'lb' : 'kg');
  };

  const nextExercise = async () => {
    if (currentExerciseIndex < selectedExercises.length - 1) {
      
      setAllExerciseSets(prev => ({
        ...prev,
        [currentExercise.name]: sets
      }));
      
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setSets([]);
      resetTimer();
    } else {
      await finishWorkout();
    }
  };

  const finishWorkout = async () => {
    try {
      
      const finalExerciseSets = {
        ...allExerciseSets,
        [currentExercise.name]: sets
      };

      const workoutData = {
        splitDay,
        startTime: workoutStartTime,
        endTime: new Date(),
        exercises: selectedExercises.map(exercise => ({
          name: exercise.name,
          sets: finalExerciseSets[exercise.name] || []
        }))
      };

      const existingWorkouts = await AsyncStorage.getItem('workouts');
      const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];
      workouts.push(workoutData);
      await AsyncStorage.setItem('workouts', JSON.stringify(workouts));

      navigation.navigate('WorkoutComplete', { workoutData });
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Could not save workout data');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
     
      <Animated.View style={[tw`absolute -left-40 -top-40 w-80 h-80 rounded-full bg-sky-100 opacity-50`, circle1Style]} />
      <Animated.View style={[tw`absolute -right-40 -bottom-40 w-80 h-80 rounded-full bg-blue-100 opacity-50`, circle2Style]} />

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-4 pt-8`}>
         
          <Animated.View 
            entering={SlideInRight.duration(1000)}
            style={tw`mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200`}
          >
            <View style={tw`flex-row items-center justify-between mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={[tw`text-sky-500 text-base`, { fontFamily: 'Montserrat-Medium' }]}>
                  Current Exercise
                </Text>
                <Text style={[tw`text-2xl text-blue-800 mt-1`, { fontFamily: 'Montserrat-Medium' }]}>
                  {currentExercise.name}
                </Text>
              </View>
              <View style={tw`bg-slate-100 px-3 py-1 rounded-xl`}>
                <Text style={[tw`text-blue-800`, { fontFamily: 'Montserrat-Medium' }]}>
                  {currentExerciseIndex + 1} / {selectedExercises.length}
                </Text>
              </View>
            </View>
            
            <View style={tw`bg-slate-100 h-2 rounded-full overflow-hidden`}>
              <Animated.View 
                entering={FadeInRight.duration(1000)}
                style={[
                  tw`bg-sky-500 h-full rounded-full`,
                  { width: `${((currentExerciseIndex + 1) / selectedExercises.length) * 100}%` }
                ]} 
              />
            </View>
          </Animated.View>

         
          {currentExerciseIndex < selectedExercises.length - 1 && (
            <Animated.View
              entering={FadeInDown.duration(1000)}
              style={tw`mb-6 bg-white/90 p-4 rounded-2xl border border-slate-200`}
            >
              <Text style={[tw`text-sky-500 text-sm`, { fontFamily: 'Montserrat-Medium' }]}>
                Up Next
              </Text>
              <View style={tw`flex-row items-center mt-2`}>
                <View style={tw`bg-slate-100 p-2 rounded-xl mr-3`}>
                  <Ionicons name={selectedExercises[currentExerciseIndex + 1].icon} size={20} color="#0ea5e9" />
                </View>
                <Text style={[tw`text-blue-800`, { fontFamily: 'Montserrat-Medium' }]}>
                  {selectedExercises[currentExerciseIndex + 1].name}
                </Text>
              </View>
            </Animated.View>
          )}

         
          <Animated.View
            entering={FadeInDown.duration(1000)}
            style={[tw`mb-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200`, timerStyle]}
          >
            <Text style={[tw`text-6xl text-blue-800 text-center`, { fontFamily: 'Montserrat-Medium' }]}>
              {formatTime(timer)}
            </Text>
            <View style={tw`flex-row justify-center mt-6`}>
              <TouchableOpacity
                onPress={toggleTimer}
                style={tw`bg-sky-500 px-6 py-3 rounded-xl mr-3 flex-row items-center`}
              >
                <Ionicons 
                  name={isTimerRunning ? "pause" : "play"} 
                  size={20} 
                  color="#fff" 
                  style={tw`mr-2`}
                />
                <Text style={[tw`text-white`, { fontFamily: 'Montserrat-Medium' }]}>
                  {isTimerRunning ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetTimer}
                style={tw`bg-slate-100 px-6 py-3 rounded-xl flex-row items-center`}
              >
                <Ionicons name="refresh" size={20} color="#0ea5e9" style={tw`mr-2`} />
                <Text style={[tw`text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          
          <Animated.View 
            entering={FadeInDown.duration(1000)}
            style={tw`mb-6 flex-row justify-end`}
          >
            <View style={tw`flex-row bg-white rounded-xl overflow-hidden border border-slate-200`}>
              {['kg', 'lb'].map((unit) => (
                <TouchableOpacity
                  key={unit}
                  onPress={() => setWeightUnit(unit)}
                  style={[
                    tw`px-4 py-2`,
                    weightUnit === unit && tw`bg-sky-500`
                  ]}
                >
                  <Text style={[
                    tw`text-sm`,
                    { fontFamily: 'Montserrat-Medium' },
                    weightUnit === unit ? tw`text-white` : tw`text-blue-800`
                  ]}>
                    {unit.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          
          {previousData && previousData.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(1000)}
              style={tw`mb-6 bg-white/90 p-4 rounded-2xl border border-slate-200`}
            >
              <Text style={[tw`text-sky-500 text-sm mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
                Last Performance
              </Text>
              <View style={tw`flex-row flex-wrap`}>
                {previousData.map((set, idx) => (
                  <View key={idx} style={tw`bg-slate-50 px-3 py-1 rounded-lg mr-2 mb-2`}>
                    <Text style={[tw`text-blue-800`, { fontFamily: 'Montserrat-Medium' }]}>
                      {weightUnit === 'kg' ? 
                        set.weight : 
                        kgToLb(set.weight)
                      }{weightUnit} × {set.reps}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          
          {sets.map((set, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.duration(1000).delay(100 * index)}
              style={tw`mb-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200`}
            >
              <View style={tw`flex-row items-center mb-4`}>
                <Text style={[tw`text-blue-800 mr-2`, { fontFamily: 'Montserrat-Medium' }]}>
                  Set {index + 1}
                </Text>
                {set.restTime > 0 && (
                  <View style={tw`bg-slate-100 px-2 py-1 rounded-lg`}>
                    <Text style={[tw`text-sky-500 text-sm`, { fontFamily: 'Montserrat-Medium' }]}>
                      Rest: {formatTime(set.restTime)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={tw`flex-row`}>
                <View style={tw`flex-1 mr-2`}>
                  <Text style={[tw`text-sky-500 text-sm mb-1`, { fontFamily: 'Montserrat-Medium' }]}>
                    Weight ({weightUnit})
                  </Text>
                  <TextInput
                    value={weightUnit === 'kg' ? 
                      set.weight : 
                      convertWeight(set.weight, 'kg', 'lb')
                    }
                    onChangeText={(value) => updateSet(index, 'weight', value)}
                    keyboardType="decimal-pad"
                    style={tw`bg-slate-50 px-4 py-3 rounded-xl border border-slate-200`}
                    placeholder="0"
                  />
                </View>

                <View style={tw`flex-1 ml-2`}>
                  <Text style={[tw`text-sky-500 text-sm mb-1`, { fontFamily: 'Montserrat-Medium' }]}>
                    Reps
                  </Text>
                  <TextInput
                    value={set.reps}
                    onChangeText={(value) => updateSet(index, 'reps', value)}
                    keyboardType="number-pad"
                    style={tw`bg-slate-50 px-4 py-3 rounded-xl border border-slate-200`}
                    placeholder="0"
                  />
                </View>
              </View>
            </Animated.View>
          ))}

         
          <View style={tw`flex-row mb-8`}>
            <TouchableOpacity
              style={tw`flex-1 mr-2 bg-sky-500 p-4 rounded-xl flex-row items-center justify-center`}
              onPress={addSet}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={tw`mr-2`} />
              <Text style={[tw`text-white`, { fontFamily: 'Montserrat-Medium' }]}>
                Add Set
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-1 ml-2 bg-blue-800 p-4 rounded-xl`}
              onPress={nextExercise}
            >
              <Text style={[tw`text-white text-center`, { fontFamily: 'Montserrat-Medium' }]}>
                {currentExerciseIndex < selectedExercises.length - 1 ? 'Next Exercise' : 'Complete Workout'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 