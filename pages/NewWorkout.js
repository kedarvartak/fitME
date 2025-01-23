import { 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Dimensions 
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';

//get devices width height
const { width, height } = Dimensions.get('window');

// for our workout timer
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function NewWorkoutScreen({ navigation }) {
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState('');
  const [timers, setTimers] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTimer) {
        setTimers(prev => ({
          ...prev,
          [activeTimer]: (prev[activeTimer] || 0) + 1
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const toggleTimer = useCallback((exerciseId) => {
    setActiveTimer(activeTimer === exerciseId ? null : exerciseId);
  }, [activeTimer]);

  // was using timestamp but it was causing issues with the timer so i switched to uuid. timestamp could lead to possible collisions down to milliseconds
  // uuid is a better solution for this. guaranteed unique id for each exercise, uuids are 128-bit values, which means they have a very low probability of collision, globally unique, suitable for database ids
  const addExercise = () => {
    if (newExercise.trim()) {
      const newId = uuidv4();
      setExercises([...exercises, {
        id: newId,
        name: newExercise.trim(),
        sets: [],
        currentReps: 0,
        weight: ''
      }]);
      setTimers(prev => ({ ...prev, [newId]: 0 }));
      setNewExercise('');
    }
  };

  const updateReps = (exerciseId, increment) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          currentReps: Math.max(0, ex.currentReps + increment)
        };
      }
      return ex;
    }));
  };

  const updateWeight = (exerciseId, weight) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          weight
        };
      }
      return ex;
    }));
  };

  const addSet = (exerciseId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: [...ex.sets, { reps: ex.currentReps, weight: ex.weight }],
          currentReps: 0,
          weight: ''
        };
      }
      return ex;
    }));
  };

  const ExerciseCard = ({ exercise }) => (
    <View style={tw`mb-4 bg-white/90 p-6 rounded-3xl shadow-lg border border-sky-100`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={[tw`text-xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
          {exercise.name}
        </Text>
        <View
          style={[
            tw`px-4 py-2 rounded-xl flex-row items-center`,
            activeTimer === exercise.id ? tw`bg-sky-500` : tw`bg-sky-50`
          ]}
        >
          <TouchableOpacity onPress={() => toggleTimer(exercise.id)}>
            <Ionicons 
              name={activeTimer === exercise.id ? "pause" : "play"} 
              size={20} 
              color={activeTimer === exercise.id ? "white" : "#0ea5e9"} 
            />
          </TouchableOpacity>
          <Text 
            style={[
              tw`ml-2`,
              activeTimer === exercise.id ? tw`text-white` : tw`text-sky-500`,
              { fontFamily: 'Montserrat-Medium' }
            ]}
          >
            {formatTime(timers[exercise.id] || 0)}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-1 mr-4`}>
          <Text style={[tw`text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
            Weight (kg)
          </Text>
          <TextInput
            value={exercise.weight}
            onChangeText={(text) => updateWeight(exercise.id, text)}
            placeholder="Enter weight"
            keyboardType="numeric"
            style={[
              tw`bg-white border border-sky-100 rounded-xl p-4 text-blue-800`,
              { fontFamily: 'Montserrat-Regular' }
            ]}
          />
        </View>
        <View style={tw`flex-1`}>
          <Text style={[tw`text-blue-800 mb-2`, { fontFamily: 'Montserrat-Medium' }]}>
            Reps
          </Text>
          <View style={tw`flex-row items-center justify-between bg-white border border-sky-100 rounded-xl p-4`}>
            <TouchableOpacity 
              onPress={() => updateReps(exercise.id, -1)}
              style={tw`bg-sky-50 w-10 h-10 rounded-full items-center justify-center`}
            >
              <Ionicons name="remove" size={24} color="#0ea5e9" />
            </TouchableOpacity>
            <Text style={[tw`text-2xl text-blue-800`, { fontFamily: 'Montserrat-Bold' }]}>
              {exercise.currentReps}
            </Text>
            <TouchableOpacity 
              onPress={() => updateReps(exercise.id, 1)}
              style={tw`bg-sky-50 w-10 h-10 rounded-full items-center justify-center`}
            >
              <Ionicons name="add" size={24} color="#0ea5e9" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => addSet(exercise.id)}
        style={tw`bg-sky-500 p-4 rounded-xl mb-4`}
      >
        <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-Bold' }]}>
          Add Set
        </Text>
      </TouchableOpacity>

      {exercise.sets.length > 0 && (
        <View style={tw`flex-row flex-wrap`}>
          {exercise.sets.map((set, setIndex) => (
            <View 
              key={`${exercise.id}-${setIndex}`}
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
      )}
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
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
          <View style={tw`pt-16 pb-8`}>
            <Text style={[tw`text-4xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
              New Workout
            </Text>
            <Text style={[tw`text-lg text-blue-800/60`, { fontFamily: 'Montserrat-Regular' }]}>
              Track your exercises
            </Text>
          </View>

          <View style={tw`mb-6 bg-white/90 p-6 rounded-3xl shadow-lg border border-sky-100`}>
            <View style={tw`flex-row items-center`}>
              <TextInput
                value={newExercise}
                onChangeText={setNewExercise}
                placeholder="Enter exercise name"
                style={[
                  tw`flex-1 bg-white border border-sky-100 rounded-xl p-4 mr-2 text-blue-800`,
                  { fontFamily: 'Montserrat-Regular' }
                ]}
              />
              <TouchableOpacity
                onPress={addExercise}
                style={tw`bg-sky-500 p-4 rounded-xl`}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {exercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 