import { 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring 
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const commonSplits = [
  {
    name: "Push/Pull/Legs",
    description: "3-6 days per week",
    days: ["Push", "Pull", "Legs"],
    icon: "barbell-outline",
    recommended: true
  },
  {
    name: "Upper/Lower",
    description: "4 days per week",
    days: ["Upper", "Lower"],
    icon: "body-outline"
  },
  {
    name: "Bro Split",
    description: "5 days per week",
    days: ["Chest", "Back", "Legs", "Shoulders", "Arms"],
    icon: "fitness-outline"
  },
  {
    name: "Full Body",
    description: "3 days per week",
    days: ["Full Body A", "Full Body B", "Full Body C"],
    icon: "flash-outline"
  }
];


export default function SplitSetup({ navigation }) {
  const [selectedSplit, setSelectedSplit] = useState(null);
  const [customSplit, setCustomSplit] = useState([]);
  const [currentDay, setCurrentDay] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const buttonScale = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(buttonScale.value) }],
  }));

  const saveSplitAndExercises = async () => {
    try {
      const splitData = {
        type: selectedSplit ? selectedSplit.name : 'Custom',
        days: selectedSplit ? selectedSplit.days : customSplit
      };
      await AsyncStorage.setItem('workoutSplit', JSON.stringify(splitData));
      navigation.replace('MainApp');
    } catch (error) {
      console.error('Error saving split:', error);
    }
  };

  const addCustomDay = () => {
    if (currentDay && !customSplit.includes(currentDay)) {
      setCustomSplit([...customSplit, currentDay]);
      setCurrentDay('');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={tw`flex-1`} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={tw`px-4 pb-4`}>
              
              <Animated.View 
                entering={FadeInDown.duration(1000)}
                style={tw`pt-16 pb-8`}
              >
                <Text style={[tw`text-3xl text-blue-800`, { fontFamily: 'Montserrat-Bold' }]}>
                  Training Split
                </Text>
                <Text style={[tw`text-base text-blue-800/60 mt-2`, { fontFamily: 'Montserrat-Regular' }]}>
                  Choose your workout structure
                </Text>
              </Animated.View>

             
              {commonSplits.map((split, index) => (
                <AnimatedTouchable
                  key={split.name}
                  entering={SlideInRight.duration(1000).delay(index * 100)}
                  onPress={() => setSelectedSplit(split)}
                  style={[
                    tw`mb-4 rounded-2xl border shadow-sm`,
                    selectedSplit?.name === split.name
                      ? tw`border-2 border-blue-800`
                      : tw`border-slate-200`
                  ]}
                >
                  <View style={[
                    tw`p-5`,
                    selectedSplit?.name === split.name
                      ? tw`bg-blue-800`
                      : tw`bg-white`
                  ]}>
                    
                    <View style={tw`flex-row items-center justify-between mb-3`}>
                      <View style={tw`flex-row items-center flex-1`}>
                        <View style={[
                          tw`rounded-xl p-2 mr-3`,
                          selectedSplit?.name === split.name
                            ? tw`bg-white/20`
                            : tw`bg-slate-100`
                        ]}>
                          <Ionicons 
                            name={split.icon} 
                            size={22} 
                            color={selectedSplit?.name === split.name ? '#fff' : '#1e40af'} 
                          />
                        </View>
                        <View style={tw`flex-1`}>
                          <Text style={[
                            tw`text-lg mb-0.5`,
                            { fontFamily: 'Montserrat-Bold' },
                            selectedSplit?.name === split.name ? tw`text-white` : tw`text-blue-800`
                          ]}>
                            {split.name}
                          </Text>
                          <Text style={[
                            tw`text-sm`,
                            { fontFamily: 'Montserrat-Medium' },
                            selectedSplit?.name === split.name ? tw`text-white/80` : tw`text-blue-800/60`
                          ]}>
                            {split.description}
                          </Text>
                        </View>
                      </View>
                      {split.recommended && (
                        <View style={tw`bg-sky-100 px-2.5 py-1 rounded-full ml-2`}>
                          <Text style={[tw`text-sky-500 text-xs`, { fontFamily: 'Montserrat-Medium' }]}>
                            Popular
                          </Text>
                        </View>
                      )}
                    </View>

                    
                    <View style={tw`flex-row flex-wrap mt-2`}>
                      {split.days.map((day, dayIndex) => (
                        <View
                          key={day}
                          style={[
                            tw`px-3 py-1.5 rounded-lg mr-2 mb-2`,
                            selectedSplit?.name === split.name
                              ? tw`bg-white/20`
                              : tw`bg-slate-100`
                          ]}
                        >
                          <Text style={[
                            tw`text-sm`,
                            { fontFamily: 'Montserrat-Medium' },
                            selectedSplit?.name === split.name
                              ? tw`text-white`
                              : tw`text-blue-800`
                          ]}>
                            {day}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </AnimatedTouchable>
              ))}

              {/* Custom Split Section */}
              <Animated.View
                entering={FadeInDown.duration(1000).delay(400)}
                style={tw`mt-2 mb-8`}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowCustom(!showCustom);
                    if (!showCustom) {
                      setTimeout(() => {
                        Keyboard.dismiss();
                      }, 100);
                    }
                  }}
                  style={tw`flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm`}
                >
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-slate-100 p-2 rounded-lg mr-3`}>
                      <Ionicons name="create-outline" size={22} color="#1e40af" />
                    </View>
                    <Text style={[tw`text-base text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
                      Create Custom Split
                    </Text>
                  </View>
                  <Ionicons 
                    name={showCustom ? "chevron-up" : "chevron-down"} 
                    size={22} 
                    color="#1e40af" 
                  />
                </TouchableOpacity>

                {showCustom && (
                  <Animated.View 
                    entering={FadeInDown.duration(500)}
                    style={tw`mt-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm`}
                  >
                    <View style={tw`flex-row mb-3`}>
                      <TextInput
                        value={currentDay}
                        onChangeText={setCurrentDay}
                        placeholder="Enter training day name"
                        placeholderTextColor="#94A3B8"
                        style={[
                          tw`flex-1 bg-slate-100 px-4 py-3 rounded-l-lg border border-slate-200`,
                          { fontFamily: 'Montserrat-Regular' }
                        ]}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          addCustomDay();
                          Keyboard.dismiss();
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          addCustomDay();
                          Keyboard.dismiss();
                        }}
                        style={tw`bg-blue-800 px-4 rounded-r-lg justify-center`}
                      >
                        <Ionicons name="add" size={22} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    {customSplit.map((day, index) => (
                      <Animated.View
                        key={day}
                        entering={FadeInRight.duration(500).delay(index * 100)}
                        style={tw`bg-slate-100 px-4 py-3 rounded-lg mb-2 flex-row justify-between items-center`}
                      >
                        <Text style={[tw`text-blue-800`, { fontFamily: 'Montserrat-Medium' }]}>
                          {day}
                        </Text>
                        <TouchableOpacity
                          onPress={() => setCustomSplit(customSplit.filter(d => d !== day))}
                          style={tw`bg-red-50 p-1.5 rounded-lg`}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </Animated.View>
                    ))}
                  </Animated.View>
                )}
              </Animated.View>

             
              {(selectedSplit || customSplit.length > 0) && (
                <TouchableOpacity
                  style={tw`bg-blue-800 p-4 rounded-xl mb-8 shadow-sm`}
                  onPress={saveSplitAndExercises}
                >
                  <Text style={[tw`text-white text-center text-base`, { fontFamily: 'Montserrat-Bold' }]}>
                    Continue to Workout
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
} 