import { IranoProvider } from 'react-native-irano';
import Home from './Home';
const App = () => {
  return (
    <IranoProvider
      errorProps={{
        pathAnimatedProps: {
          stroke: 'lightgray',
          strokeWidth: 1.4,
        },
        cardStyle: {
          backgroundColor: '#000',
        },
        subtitleStyle: {
          color: '#fff',
          fontFamily: 'sans-serif',
        },
        titleStyle: {
          color: `#fff`,
        },
      }}
      toastSuccessProps={{
        pathProps: {
          stroke: 'white',
        },
        iconContainerStyle: {
          backgroundColor: 'green',
        },
      }}
      toastErrorProps={{
        pathProps: {
          stroke: 'red',
        },
        iconContainerStyle: {
          backgroundColor: 'white',
        },
        toastMainContainerStyle: {
          backgroundColor: 'red',
        },
        titleStyle: {
          color: 'white',
        },
        subtitleStyle: {
          color: 'white',
        },
      }}
    >
      <Home />
    </IranoProvider>
  );
};

export default App;
