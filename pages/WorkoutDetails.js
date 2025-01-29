import { 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import Animated, { FadeInDown } from 'react-native-reanimated';


export default function WorkoutDetailsScreen({ route, navigation }) {
  const { workout } = route.params;

  const calculateExerciseStats = (exercise) => {
    const sets = exercise.sets || [];
    if (sets.length === 0) {
      return {
        totalVolume: 0,
        maxWeight: 0,
        maxReps: 0,
        totalSets: 0
      };
    }
    
    return {
      totalVolume: sets.reduce((acc, set) => acc + (Number(set.weight) * Number(set.reps)), 0),
      maxWeight: Math.max(...sets.map(set => Number(set.weight) || 0)),
      maxReps: Math.max(...sets.map(set => Number(set.reps) || 0)),
      totalSets: sets.length
    };
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-slate-50`}>
      <Animated.View style={[tw`absolute w-80 h-80 rounded-full bg-sky-100/30 -top-40 -right-40`]} />
      <Animated.View style={[tw`absolute w-96 h-96 rounded-full bg-blue-100/30 -bottom-40 -left-40`]} />

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

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`flex-1 px-4`}>
          
          <Animated.View 
            entering={FadeInDown.duration(1000)}
            style={tw`pt-16 pb-4`}
          >
            <Text style={[tw`text-4xl text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Workout Details
            </Text>
            <View style={tw`flex-row items-center mt-3`}>
              <Ionicons name="calendar-outline" size={24} color="#1e40af" />
              <Text style={[tw`text-lg text-blue-800/60 ml-2`, { fontFamily: 'Montserrat-Regular' }]}>
                {new Date(workout.startTime).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <View style={tw`flex-row items-center mt-2`}>
              <Ionicons name="time-outline" size={24} color="#0ea5e9" />
              <Text style={[tw`text-lg text-sky-500 ml-2`, { fontFamily: 'Montserrat-Medium' }]}>
                {new Date(workout.startTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </Animated.View>

          
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(200)}
            style={tw`bg-blue-800 p-6 rounded-3xl mb-6 shadow-lg`}
          >
            <Text style={[tw`text-white/80 text-lg mb-4`, { fontFamily: 'Montserrat-SemiBold' }]}>
              Workout Summary
            </Text>
            <View style={tw`flex-row flex-wrap justify-between`}>
              {[
                {
                  label: 'Duration',
                  value: `${Math.round((new Date(workout.endTime) - new Date(workout.startTime)) / (1000 * 60))} min`,
                  icon: 'time-outline'
                },
                {
                  label: 'Total Volume',
                  value: `${workout.exercises.reduce((acc, ex) => 
                    acc + ex.sets.reduce((setAcc, set) => setAcc + (set.weight * set.reps), 0), 0)}kg`,
                  icon: 'stats-chart-outline'
                },
                {
                  label: 'Exercises',
                  value: workout.exercises.length,
                  icon: 'barbell-outline'
                },
                {
                  label: 'Total Sets',
                  value: workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0),
                  icon: 'layers-outline'
                }
              ].map((stat, index) => (
                <View key={`stat-${index}`} style={tw`w-1/2 mb-4`}>
                  <View style={tw`flex-row items-center mb-1`}>
                    <Ionicons name={stat.icon} size={24} color="rgba(255,255,255,0.6)" />
                    <Text style={[tw`text-white/60 ml-2 text-base`, { fontFamily: 'Montserrat-Medium' }]}>
                      {stat.label}
                    </Text>
                  </View>
                  <Text style={[tw`text-white text-xl`, { fontFamily: 'Montserrat-Bold' }]}>
                    {stat.value}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          
          <Text style={[tw`text-blue-800 text-xl mb-4`, { fontFamily: 'Montserrat-Bold' }]}>
            Exercise Details
          </Text>
          
          {workout.exercises.map((exercise, exerciseIndex) => {
            const stats = calculateExerciseStats(exercise);
            
            return (
              <Animated.View
                key={`exercise-${exerciseIndex}`}
                entering={FadeInDown.duration(1000).delay(300 + exerciseIndex * 100)}
                style={tw`bg-white p-6 rounded-2xl mb-4 border border-sky-100 shadow-sm`}
              >
                <View style={tw`flex-row justify-between items-center mb-4`}>
                  <View style={tw`flex-1`}>
                    <Text style={[tw`text-lg text-blue-800`, { fontFamily: 'Montserrat-SemiBold' }]}>
                      {exercise.name}
                    </Text>
                    <Text style={[tw`text-base text-sky-500`, { fontFamily: 'Montserrat-Medium' }]}>
                      {stats.totalSets} sets • {stats.totalVolume}kg total
                    </Text>
                  </View>
                  <View style={tw`bg-sky-50 p-3 rounded-xl`}>
                    <Ionicons name="barbell-outline" size={24} color="#0ea5e9" />
                  </View>
                </View>

                {/* Set Details */}
                <View style={tw`bg-slate-50 rounded-xl p-4`}>
                  <View style={tw`flex-row justify-between mb-2`}>
                    <Text style={[tw`text-blue-800/60 text-base`, { fontFamily: 'Montserrat-Medium' }]}>SET</Text>
                    <Text style={[tw`text-blue-800/60 text-base`, { fontFamily: 'Montserrat-Medium' }]}>WEIGHT × REPS</Text>
                  </View>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <View 
                      key={`set-${setIndex}`}
                      style={tw`flex-row justify-between items-center py-3 border-t border-sky-100`}
                    >
                      <View style={tw`flex-row items-center`}>
                        <View style={tw`w-8 h-8 bg-sky-100 rounded-full items-center justify-center mr-2`}>
                          <Text style={[tw`text-sky-500 text-base`, { fontFamily: 'Montserrat-Bold' }]}>
                            {setIndex + 1}
                          </Text>
                        </View>
                      </View>
                      <Text style={[tw`text-blue-800 text-base`, { fontFamily: 'Montserrat-SemiBold' }]}>
                        {set.weight}kg × {set.reps}
                      </Text>
                    </View>
                  ))}

                  <View style={tw`mt-4 pt-4 border-t border-sky-100`}>
                    <View style={tw`flex-row justify-between`}>
                      <Text style={[tw`text-blue-800/60 text-base`, { fontFamily: 'Montserrat-Medium' }]}>
                        Max Weight:
                      </Text>
                      <Text style={[tw`text-blue-800 text-base`, { fontFamily: 'Montserrat-Bold' }]}>
                        {stats.maxWeight}kg
                      </Text>
                    </View>
                    <View style={tw`flex-row justify-between mt-2`}>
                      <Text style={[tw`text-blue-800/60 text-base`, { fontFamily: 'Montserrat-Medium' }]}>
                        Max Reps:
                      </Text>
                      <Text style={[tw`text-blue-800 text-base`, { fontFamily: 'Montserrat-Bold' }]}>
                        {stats.maxReps}
                      </Text>
                    </View>
                    <View style={tw`flex-row justify-between mt-2`}>
                      <Text style={[tw`text-blue-800/60 text-base`, { fontFamily: 'Montserrat-Medium' }]}>
                        Total Volume:
                      </Text>
                      <Text style={[tw`text-blue-800 text-base`, { fontFamily: 'Montserrat-Bold' }]}>
                        {stats.totalVolume}kg
                      </Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 