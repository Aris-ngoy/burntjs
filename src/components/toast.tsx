import {
  View,
  StyleSheet,
  Text,
  type TextProps,
  type ViewProps,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useEffect, memo } from 'react';
import Animated, {
  Easing,
  FadeIn,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
  useSharedValue,
  withTiming,
  useAnimatedProps,
  useAnimatedStyle,
  type AnimatedProps,
} from 'react-native-reanimated';
import Svg, { Path, type PathProps } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Icon = ({
  preset,
  animatedProps,
  pathAnimatedProps,
}: {
  preset: 'success' | 'error';
  animatedProps: AnimatedProps<any>;
  pathAnimatedProps?: PathProps;
}) => (
  <Svg style={styles.icon} width="30" height="30" viewBox="0 0 24 24">
    <AnimatedPath
      d={preset === 'error' ? 'M6 18L18 6M6 6l12 12' : 'M5 12.5l5 5 10-10'}
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

const Toast = memo(
  ({
    title,
    subtitle,
    preset = 'success',
    pathProps,
    textContainerProps,
    textContainerStyle,
    toastContainerProps,
    toastContainerStyle,
    titleProps,
    titleStyle,
    subtitleProps,
    subtitleStyle,
    iconContainerStyle,
    toastMainContainerStyle,
    MAX_WIDTH = 340,
    autoHideDuration = 5000,
    position = 'top',
    onHide,
  }: ToastProps) => {
    const strokeDashoffset = useSharedValue(22);
    const widthValue = useSharedValue(55);

    useEffect(() => {
      const animationTimeouts = [
        setTimeout(() => {
          strokeDashoffset.value = withTiming(0, {
            duration: 300,
            easing: Easing.out(Easing.ease),
          });
        }, 400),
        setTimeout(() => {
          widthValue.value = withTiming(MAX_WIDTH, {
            duration: 300,
            easing: Easing.out(Easing.elastic(0.7)),
          });
        }, 600),
        setTimeout(() => {
          onHide();
        }, autoHideDuration),
      ];

      return () => animationTimeouts.forEach(clearTimeout);
    }, [MAX_WIDTH, strokeDashoffset, widthValue, onHide, autoHideDuration]);

    const animatedProps = useAnimatedProps(() => ({
      strokeDashoffset: strokeDashoffset.value,
    }));

    const animatedStyle = useAnimatedStyle(() => ({
      width: widthValue.value,
    }));

    return (
      <Animated.View
        style={[
          styles.toastContainer,
          position === 'bottom'
            ? styles.toastContainerBottom
            : styles.toastContainerTop,
          toastContainerStyle,
        ]}
        entering={(position === 'top' ? SlideInUp : SlideInDown)
          .springify()
          .damping(10)
          .mass(0.5)}
        exiting={position === 'top' ? SlideOutUp : SlideOutDown}
        {...toastContainerProps}
      >
        <Animated.View
          style={[animatedStyle, styles.toastContent, toastMainContainerStyle]}
        >
          <View
            onTouchEnd={onHide}
            style={[styles.iconContainer, iconContainerStyle]}
          >
            <Icon
              preset={preset}
              animatedProps={animatedProps}
              pathAnimatedProps={pathProps}
            />
          </View>
          <Animated.View
            style={[
              styles.textContainer,
              { width: MAX_WIDTH * 0.75 },
              textContainerStyle,
            ]}
            entering={FadeIn.delay(900)}
            {...textContainerProps}
          >
            <Text
              allowFontScaling
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.text, titleStyle]}
              {...titleProps}
            >
              {title}
            </Text>
            <Text
              allowFontScaling
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.subtitleStyle, subtitleStyle]}
              {...subtitleProps}
            >
              {subtitle}
            </Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }
);

export interface ToastProps extends ToastStyleProps {
  title: string;
  subtitle: string;
  preset?: 'success' | 'error';
  onHide: () => void;
}

export interface ToastStyleProps {
  titleProps?: TextProps;
  titleStyle?: TextStyle;
  subtitleProps?: TextProps;
  subtitleStyle?: TextStyle;
  textContainerProps?: ViewProps;
  textContainerStyle?: ViewStyle;
  toastContainerProps?: ViewProps;
  toastContainerStyle?: ViewStyle;
  pathProps?: PathProps;
  toastMainContainerStyle?: ViewStyle;
  iconContainerStyle?: ViewStyle;
  MAX_WIDTH?: number;
  autoHideDuration?: number;
  position?: 'top' | 'bottom';
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  toastContainerBottom: {
    bottom: '10%',
  },
  toastContainerTop: {
    top: '10%',
  },
  toastContent: {
    height: 55,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  icon: {
    margin: 2,
  },
  iconContainer: {
    padding: 4,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  textContainer: {
    width: 230,
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  subtitleStyle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default Toast;
