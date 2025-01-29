import { 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Animated, { FadeInDown} from 'react-native-reanimated';


const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);


const defaultExercises = {
  "Push": [
    { name: "Bench Press", icon: "barbell-outline", category: "Compound" },
    { name: "Overhead Press", icon: "barbell-outline", category: "Compound" },
    { name: "Incline Bench Press", icon: "barbell-outline", category: "Compound" },
    { name: "Dips", icon: "body-outline", category: "Compound" },
    { name: "Lateral Raises", icon: "fitness-outline", category: "Isolation" },
    { name: "Tricep Pushdowns", icon: "git-network-outline", category: "Isolation" },
    { name: "Front Raises", icon: "fitness-outline", category: "Isolation" },
    { name: "Close Grip Bench", icon: "barbell-outline", category: "Compound" },
    { name: "Machine Chest Press", icon: "fitness-outline", category: "Compound" },
    { name: "Tricep Extensions", icon: "fitness-outline", category: "Isolation" },
    { name: "Push-Ups", icon: "body-outline", category: "Bodyweight" },
    { name: "Cable Flyes", icon: "git-network-outline", category: "Isolation" }
  ],
  "Pull": [
    { name: "Pull-ups", icon: "body-outline", category: "Compound" },
    { name: "Barbell Rows", icon: "barbell-outline", category: "Compound" },
    { name: "Deadlifts", icon: "barbell-outline", category: "Compound" },
    { name: "Lat Pulldowns", icon: "git-network-outline", category: "Compound" },
    { name: "Face Pulls", icon: "git-network-outline", category: "Isolation" },
    { name: "Bicep Curls", icon: "barbell-outline", category: "Isolation" },
    { name: "Cable Rows", icon: "git-network-outline", category: "Compound" },
    { name: "Hammer Curls", icon: "fitness-outline", category: "Isolation" },
    { name: "Preacher Curls", icon: "fitness-outline", category: "Isolation" },
    { name: "Reverse Flyes", icon: "fitness-outline", category: "Isolation" },
    { name: "Chin-ups", icon: "body-outline", category: "Compound" },
    { name: "Shrugs", icon: "barbell-outline", category: "Isolation" }
  ],
  "Chest": [
    { name: "Bench Press", icon: "barbell-outline", category: "Compound" },
    { name: "Incline Press", icon: "trending-up", category: "Compound" },
    { name: "Chest Flyes", icon: "fitness-outline", category: "Isolation" },
    { name: "Dips", icon: "body-outline", category: "Compound" },
    { name: "Push-Ups", icon: "arrow-down", category: "Bodyweight" },
    { name: "Cable Crossover", icon: "git-network-outline", category: "Isolation" }
  ],
  "Back": [
    { name: "Pull-ups", icon: "arrow-up", category: "Compound" },
    { name: "Barbell Rows", icon: "barbell-outline", category: "Compound" },
    { name: "Lat Pulldowns", icon: "trending-down", category: "Isolation" },
    { name: "Deadlifts", icon: "barbell-outline", category: "Compound" },
    { name: "Face Pulls", icon: "git-network-outline", category: "Isolation" },
    { name: "Cable Rows", icon: "git-network-outline", category: "Isolation" }
  ],
  "Shoulders": [
    { name: "Overhead Press", icon: "barbell-outline", category: "Compound" },
    { name: "Lateral Raises", icon: "fitness-outline", category: "Isolation" },
    { name: "Front Raises", icon: "fitness-outline", category: "Isolation" },
    { name: "Arnold Press", icon: "barbell-outline", category: "Compound" },
    { name: "Face Pulls", icon: "git-network-outline", category: "Isolation" },
    { name: "Reverse Flyes", icon: "fitness-outline", category: "Isolation" }
  ],
 
};

export default function StartWorkout({ route, navigation }) {
  const { splitDay } = route.params;
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState(defaultExercises[splitDay] || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customExerciseName, setCustomExerciseName] = useState('');

  const toggleExerciseSelection = (exercise) => {
    setSelectedExercises(prev => {
      const isSelected = prev.some(e => e.name === exercise.name);
      if (isSelected) {
        return prev.filter(e => e.name !== exercise.name);
      } else {
        return [...prev, exercise];
      }
    });
  };

  const startWorkout = () => {
    if (selectedExercises.length === 0) {
      Alert.alert('Select Exercises', 'Please select at least one exercise to start workout');
      return;
    }
    navigation.navigate('ActiveWorkout', {
      splitDay,
      selectedExercises: selectedExercises
    });
  };

  const addCustomExercise = () => {
    if (!customExerciseName.trim()) {
      Alert.alert('Enter Exercise Name', 'Please enter a name for your custom exercise');
      return;
    }

    const newExercise = {
      name: customExerciseName.trim(),
      icon: 'barbell-outline',
      category: 'Custom'
    };

    setExercises(prev => [...prev, newExercise]);
    setSelectedExercises(prev => [...prev, newExercise]);
    setCustomExerciseName('');
    setShowAddModal(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-4 pt-16`}>
          
          <Animated.View 
            entering={FadeInDown.duration(1000)}
            style={tw`mb-8`}
          >
            <Text style={[tw`text-4xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
              {splitDay}
            </Text>
            <Text style={[tw`text-lg text-blue-800/60 mt-2`, { fontFamily: 'Montserrat-Regular' }]}>
              Select exercises for your workout
            </Text>
          </Animated.View>

         
          <View style={tw`mb-6 flex-row flex-wrap justify-between`}>
            {exercises.map((exercise, index) => (
              <AnimatedTouchable
                key={`${exercise.name}-${index}`}
                entering={FadeInDown.duration(1000).delay(index * 100)}
                style={[
                  tw`mb-4 rounded-2xl border shadow-sm w-[48%]`,  
                  selectedExercises.some(e => e.name === exercise.name)
                    ? tw`bg-blue-800 border-blue-800`
                    : tw`bg-white border-sky-100`
                ]}
                onPress={() => toggleExerciseSelection(exercise)}
              >
                <View style={tw`p-4`}>
                  
                  <View style={[
                    tw`rounded-xl mb-3 self-start p-3`,
                    selectedExercises.some(e => e.name === exercise.name)
                      ? tw`bg-blue-700`
                      : tw`bg-sky-100/80`
                  ]}>
                    <Ionicons 
                      name={exercise.icon} 
                      size={24} 
                      color={selectedExercises.some(e => e.name === exercise.name) ? '#fff' : '#0ea5e9'} 
                    />
                  </View>

                 
                  <Text 
                    style={[
                      tw`text-base mb-2`,
                      selectedExercises.some(e => e.name === exercise.name)
                        ? tw`text-white`
                        : tw`text-blue-800`,
                      { fontFamily: 'Montserrat-SemiBold' }
                    ]}
                    numberOfLines={2}
                  >
                    {exercise.name}
                  </Text>

                  
                  <View style={[
                    tw`rounded-full px-3 py-1 self-start`,
                    selectedExercises.some(e => e.name === exercise.name)
                      ? tw`bg-blue-700`
                      : tw`bg-sky-100/80`
                  ]}>
                    <Text style={[
                      tw`text-xs`,
                      selectedExercises.some(e => e.name === exercise.name)
                        ? tw`text-white`
                        : tw`text-sky-500`,
                      { fontFamily: 'Montserrat-Medium' }
                    ]}>
                      {exercise.category}
                    </Text>
                  </View>

                  
                  {selectedExercises.some(e => e.name === exercise.name) && (
                    <View style={tw`absolute top-2 right-2`}>
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    </View>
                  )}
                </View>
              </AnimatedTouchable>
            ))}
          </View>

          
          <AnimatedTouchable
            entering={FadeInDown.duration(1000).delay(exercises.length * 100)}
            style={tw`mb-6 p-4 rounded-xl border border-sky-100 bg-white flex-row items-center justify-center shadow-sm`}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#0ea5e9" />
            <Text style={[tw`text-sky-500 ml-2`, { fontFamily: 'Montserrat-Medium' }]}>
              Add Custom Exercise
            </Text>
          </AnimatedTouchable>

         
          <AnimatedTouchable
            entering={FadeInDown.duration(1000).delay((exercises.length + 1) * 100)}
            style={tw`mb-8 bg-blue-800 p-4 rounded-xl shadow-md`}
            onPress={startWorkout}
          >
            <Text style={[tw`text-white text-center text-lg`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Start Workout ({selectedExercises.length} exercises)
            </Text>
          </AnimatedTouchable>
        </View>
      </ScrollView>

     
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={tw`flex-1 justify-end`}
          >
            <View style={tw`bg-white rounded-t-3xl p-6 shadow-xl`}>
              <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={[tw`text-2xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
                  Add Custom Exercise
                </Text>
                <TouchableOpacity onPress={() => setShowAddModal(false)}>
                  <Ionicons name="close-circle" size={24} color="#1e40af" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                value={customExerciseName}
                onChangeText={setCustomExerciseName}
                placeholder="Exercise name"
                style={tw`bg-slate-50 p-4 rounded-xl mb-4 border border-sky-100`}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={addCustomExercise}
              />
              
              <TouchableOpacity
                style={tw`bg-blue-800 p-4 rounded-xl mb-2`}
                onPress={addCustomExercise}
              >
                <Text style={[tw`text-white text-center`, { fontFamily: 'Montserrat-SemiBold' }]}>
                  Add Exercise
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      
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
    </SafeAreaView>
  );
} 