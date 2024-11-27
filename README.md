# React Native Irano

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
- [Usage Example](#usage-example)
  - [Step 1: Wrap Your Application with `IranoProvider`](#step-1-wrap-your-application-with-irano-provider)
  - [Step 2: Use the `useIrano` Hook in Your Component](#step-2-use-the-useirano-hook-in-your-component)
- [Components](#components)
  - [Alert Component](#alert-component)
  - [Toast Component](#toast-component)
- [Features](#features)
- [Props](#props)
- [Styles](#styles)
- [Animations](#animations)
- [Example Presets](#example-presets)
- [Contributing](#contributing)
- [License](#license)
- [Getting Help](#getting-help)

## Overview

React Native Irano is a library that provides customizable alert and toast components for React Native applications. It allows developers to easily display notifications and alerts with smooth animations and various presets.

## Installation

To use the React Native Irano components, ensure you have the following dependencies installed in your React Native project. You can use one of the following commands based on your package manager:

```sh
npm install react-native-irano
# or
yarn add react-native-irano
```

## Usage Example

To use the `IranoProvider`, `Alert`, and `Toast` components in your application, follow the example below:

### Step 1: Wrap Your Application with `IranoProvider`

First, ensure that your application is wrapped with the `IranoProvider` to provide context for the alert and toast functionalities.

```tsx
import React from 'react';
import { IranoProvider } from 'react-native-irano';
import Home from './Home';

const App = () => {
    return (
        <IranoProvider
            doneProps={{
                titleStyle: { color: 'green' },
                subtitleStyle: { color: 'lightgray' },
            }}
            loadingProps={{
                titleStyle: { color: 'blue' },
                subtitleStyle: { color: 'lightgray' },
            }}
            errorProps={{
                titleStyle: { color: 'red' },
                subtitleStyle: { color: 'lightgray' },
            }}
        >
            <Home />
        </IranoProvider>
    );
};

export default App;
```

### Step 2: Use the `useIrano` Hook in Your Component

In your component (e.g., `Home`), you can use the `useIrano` hook to access the `showAlert` and `onToast` functions.

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { useIrano } from 'react-native-irano';

const Home = () => {
    const { showAlert, onToast } = useIrano();

    const handleShowAlert = () => {
        showAlert({
            title: 'Success!',
            subtitle: 'Your operation was successful.',
            preset: 'done',
        });
    };

    const handleShowToast = () => {
        onToast({
            title: 'Toast Notification',
            subtitle: 'This is a toast message.',
            preset: 'success',
        });
    };

    return (
        <View>
            <Button title="Show Alert" onPress={handleShowAlert} />
            <Button title="Show Toast" onPress={handleShowToast} />
        </View>
    );
};

export default Home;
```

## Components

### Alert Component

The `Alert` component is a customizable modal alert dialog for React Native applications. It provides visual feedback to users through various presets such as "done", "loading", and "error".

#### Props

| Prop                    | Type                       | Description                                                          |
| ----------------------- | -------------------------- | -------------------------------------------------------------------- |
| `title`                 | `string`                   | The title of the alert dialog.                                       |
| `subtitle`              | `string`                   | The subtitle of the alert dialog.                                    |
| `onClose`               | `() => void`               | Callback function to be called when the alert is closed.             |
| `visible`               | `boolean`                  | Controls the visibility of the alert dialog.                         |
| `preset`                | `'done' | 'loading' | 'error'` | Determines the type of alert to display.                             |
| `titleStyle`            | `TextStyle`                | Custom styles for the title text.                                    |
| `subtitleStyle`         | `TextStyle`                | Custom styles for the subtitle text.                                 |
| `animatedViewProps`     | `AnimatedProps<ViewProps>` | Additional props for the animated view.                              |
| `overlayStyle`          | `ViewStyle`                | Custom styles for the modal overlay.                                 |
| `autoHide`              | `boolean`                  | If true, the alert will automatically close after a specified delay. |
| `autoHideDelay`         | `number`                   | The delay in milliseconds before the alert automatically closes.     |
| `delay`                 | `number`                   | The delay in milliseconds before the animation starts.               |
| `duration`              | `number`                   | The duration of the animation in milliseconds.                       |

### Toast Component

The `Toast` component is a lightweight notification that appears temporarily at the top or bottom of the screen. It provides feedback to users about an operation.

#### Props

| Prop                    | Type                       | Description                                                          |
| ----------------------- | -------------------------- | -------------------------------------------------------------------- |
| `title`                 | `string`                   | The title of the toast notification.                                 |
| `subtitle`              | `string`                   | The subtitle of the toast notification.                              |
| `onHide`                | `() => void`               | Callback function to be called when the toast is hidden.            |
| `preset`                | `'success' | 'error'`      | Determines the type of toast to display.                             |
| `position`              | `'top' | 'bottom'`         | Position of the toast on the screen.                                 |
| `MAX_WIDTH`             | `number`                   | Maximum width of the toast.                                          |
| `autoHideDuration`      | `number`                   | Duration in milliseconds before the toast automatically hides.       |
| `iconContainerStyle`    | `ViewStyle`                | Custom styles for the icon container.                                |
| `toastMainContainerStyle`| `ViewStyle`               | Custom styles for the main toast container.                          |
| `textContainerStyle`     | `ViewStyle`               | Custom styles for the text container.                                |
| `titleStyle`            | `TextStyle`                | Custom styles for the title text.                                    |
| `subtitleStyle`         | `TextStyle`                | Custom styles for the subtitle text.                                 |
| `pathProps`            | `PathProps`                | Additional props for the animated SVG path.                          |

## Features

- Customizable alert and toast presets (done, loading, error).
- Smooth animations using `react-native-reanimated`.
- Easy integration with React Native applications.

## Styles

The components use default styles defined in their respective style objects. You can customize the appearance by passing your own styles through the relevant style props.

## Animations

The `Alert` and `Toast` components utilize the `react-native-reanimated` library for smooth animations. The alert can animate in and out using various effects.

## Example Presets

- **Done**: Displays a checkmark to indicate success.
- **Loading**: Shows a loading spinner.
- **Error**: Displays an "X" icon to indicate an error.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

This component is open-source and available under the MIT License. Feel free to use and modify it in your projects.

## Getting Help

If you encounter any issues or have questions, please open an issue in the repository or contact the maintainers for support.

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
