import { View, Text, StyleSheet, Button } from 'react-native';
import { useIrano } from 'react-native-irano';

const Home = () => {
  const { showAlert, onToast } = useIrano();

  const onPress = () => {
    showAlert({
      title: 'Download completed.',
      subtitle: 'Your file has been downloaded successfully.',
      preset: 'done',
    });
  };

  const onErrorPress = () => {
    showAlert({
      title: 'Download failed.',
      subtitle: 'Your file has not been downloaded.',
      preset: 'error',
    });
  };

  const onShowToast = () => {
    onToast({
      title: 'Download completed.',
      subtitle: 'Your file has been downloaded successfully.',
      preset: 'success',
    });
  };

  const onShowToastError = () => {
    onToast({
      title: 'Download completed.',
      subtitle: 'Your file has been downloaded successfully.',
      preset: 'error',
    });
  };

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button title="Show Alert" onPress={onPress} />
      <Button title="Show Error" onPress={onErrorPress} />
      <Button title="Show Toast" onPress={onShowToast} />
      <Button title="Show Toast Error" onPress={onShowToastError} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
