import { useCallback, useEffect, type FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  type TextStyle,
  type ViewStyle,
  type ViewProps,
  ActivityIndicator,
} from 'react-native';
import { Svg, Path, type PathProps } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  ZoomIn,
  ZoomOut,
  type AnimatedProps,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export interface AlertProps extends AlertStyleProps {
  title: string;
  subtitle: string;
  onClose: () => void; // Callback function for closing the dialog
  visible: boolean; // New prop to control visibility from parent
  preset?: 'done' | 'loading' | 'error';
}

export interface AlertStyleProps {
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  delay?: number;
  duration?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  cardStyle?: ViewStyle;
  animatedViewProps?: AnimatedProps<ViewProps>;
  pathAnimatedProps?: PathProps;
  overlayStyle?: ViewStyle;
  loadingIndicatorStyle?: ViewStyle;
}

export const Alert: FC<AlertProps> = ({
  title,
  subtitle,
  onClose,
  visible,
  preset,
  animatedViewProps,
  pathAnimatedProps,
  titleStyle,
  subtitleStyle,
  cardStyle,
  overlayStyle,
  loadingIndicatorStyle,
  autoHide = true,
  autoHideDelay = 5000,
  delay = 400,
  duration = 400,
}) => {
  const strokeDashoffset = useSharedValue(22);

  const handleDialogClose = useCallback(() => {
    strokeDashoffset.value = 22;
    onClose();
  }, [onClose, strokeDashoffset]);

  useEffect(() => {
    if (visible) {
      // Start checkmark animation after a delay
      setTimeout(() => {
        strokeDashoffset.value = withTiming(0, {
          duration: duration,
          easing: Easing.out(Easing.ease),
        });
      }, delay); // Delay after fade-in animation

      let autoCloseTimeout: string | number | NodeJS.Timeout | undefined;
      if (autoHide) {
        autoCloseTimeout = setTimeout(() => {
          handleDialogClose();
        }, autoHideDelay);
      }

      return () => clearTimeout(autoCloseTimeout);
    }
    return; // Ensure all code paths return a value
  }, [
    autoHide,
    autoHideDelay,
    delay,
    duration,
    handleDialogClose,
    strokeDashoffset,
    visible,
  ]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDashoffset.value,
  }));

  const renderContent = () => {
    if (preset === 'loading') {
      return (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          {...loadingIndicatorStyle}
        />
      );
    } else if (preset === 'error') {
      return (
        <Svg
          style={styles.svgStyle}
          width="120"
          height="120"
          viewBox="0 0 24 24"
        >
          <AnimatedPath
            d="M6 18L18 6M6 6l12 12" // X Path for error
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="22"
            fill="none"
            {...pathAnimatedProps}
            animatedProps={animatedProps}
          />
        </Svg>
      );
    } else {
      return (
        <Svg
          style={styles.svgStyle}
          width="120"
          height="120"
          viewBox="0 0 24 24"
        >
          <AnimatedPath
            d="M5 12.5l5 5 10-10" // Checkmark Path
            stroke="gray"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="22"
            fill="none"
            {...pathAnimatedProps}
            animatedProps={animatedProps}
          />
        </Svg>
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType={!visible ? 'fade' : 'none'}
      onRequestClose={handleDialogClose}
    >
      <View
        style={[styles.modalOverlay, overlayStyle]}
        onTouchEnd={handleDialogClose}
      >
        {visible && (
          <Animated.View
            entering={ZoomIn.springify()}
            exiting={ZoomOut.springify()}
            style={[styles.card, cardStyle]}
            onTouchEnd={handleDialogClose}
            {...animatedViewProps}
          >
            {renderContent()}
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  svgStyle: {
    padding: 20,
  },
  loadingIndicator: {
    margin: 20,
  },
});
