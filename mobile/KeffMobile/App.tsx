import React from 'react';
import {SafeAreaView, Text, StyleSheet} from 'react-native';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Keff Mobile App</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default App;
