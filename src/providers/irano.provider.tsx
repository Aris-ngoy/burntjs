import {
  createContext,
  useContext,
  useRef,
  useCallback,
  useMemo,
  memo,
  useReducer,
  type FC,
  type ReactNode,
} from 'react';
import { Alert, type AlertStyleProps } from '../components/alert';
import Toast, { type ToastStyleProps } from '../components/toast';

// Context types
type ContextProps = {
  showAlert: (param: IranoAlertType) => void;
  onToast: (param: IranoToastType) => void;
};

const IranoContext = createContext<ContextProps | undefined>(undefined);

export const useIrano = (): ContextProps => {
  const context = useContext(IranoContext);
  if (!context) {
    throw new Error('useIrano must be used within an IranoProvider');
  }
  return context;
};

// Separate components for Alert and Toast to prevent unnecessary rerenders
const AlertComponent: FC<{
  isVisible: boolean;
  params: IranoAlertType | null;
  styleProps: AlertStyleProps;
  onClose: () => void;
}> = memo(({ isVisible, params, styleProps, onClose }) => {
  if (!isVisible || !params) return null;

  return (
    <Alert
      title={params.title}
      subtitle={params.subtitle}
      visible={isVisible}
      onClose={onClose}
      preset={params.preset}
      {...styleProps}
    />
  );
});

const ToastComponent: FC<{
  isVisible: boolean;
  params: IranoToastType | null;
  styleProps: ToastStyleProps;
  onHide: () => void;
}> = memo(({ isVisible, params, styleProps, onHide }) => {
  if (!isVisible || !params) return null;

  return (
    <Toast
      position="top"
      title={params.title}
      subtitle={params.subtitle}
      onHide={onHide}
      preset={params.preset}
      {...styleProps}
    />
  );
});

// Provider
const IranoProvider: FC<IranoProviderProps> = ({
  children,
  doneProps,
  loadingProps,
  errorProps,
  toastErrorProps,
  toastSuccessProps,
}) => {
  // State management using reducer for better organization
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isAlertVisible, isToastVisible, alertPreset, toastPreset } = state;

  // Use refs for params to avoid unnecessary rerenders
  const alertParams = useRef<IranoAlertType | null>(null);
  const toastParams = useRef<IranoToastType | null>(null);

  // Memoized style props
  const alertStyleProps = useMemo(() => {
    switch (alertPreset) {
      case 'done':
        return doneProps;
      case 'loading':
        return loadingProps;
      case 'error':
        return errorProps;
      default:
        return {};
    }
  }, [doneProps, loadingProps, errorProps, alertPreset]);

  const toastStyleProps = useMemo(() => {
    return toastPreset === 'success' ? toastSuccessProps : toastErrorProps;
  }, [toastErrorProps, toastSuccessProps, toastPreset]);

  // Memoized handlers
  const showAlert = useCallback((param: IranoAlertType) => {
    alertParams.current = param;
    dispatch({ type: 'SHOW_ALERT', preset: param.preset });
  }, []);

  const onToast = useCallback((param: IranoToastType) => {
    toastParams.current = param;
    dispatch({ type: 'SHOW_TOAST', preset: param.preset });
  }, []);

  const handleAlertClose = useCallback(() => {
    dispatch({ type: 'HIDE_ALERT' });
  }, []);

  const handleToastHide = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, []);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      showAlert,
      onToast,
    }),
    [showAlert, onToast]
  );

  return (
    <IranoContext.Provider value={contextValue}>
      {children}
      <AlertComponent
        isVisible={isAlertVisible}
        params={alertParams.current || null}
        styleProps={alertStyleProps as AlertStyleProps}
        onClose={handleAlertClose}
      />
      <ToastComponent
        isVisible={isToastVisible}
        params={toastParams.current}
        styleProps={toastStyleProps || {}} // Provide a default empty object to avoid undefined
        onHide={handleToastHide}
      />
    </IranoContext.Provider>
  );
};

// Reducer types and implementation
type State = {
  isAlertVisible: boolean;
  isToastVisible: boolean;
  alertPreset?: string;
  toastPreset?: 'success' | 'error';
};

type Action =
  | { type: 'SHOW_ALERT'; preset: string }
  | { type: 'HIDE_ALERT' }
  | { type: 'SHOW_TOAST'; preset: 'success' | 'error' }
  | { type: 'HIDE_TOAST' };

const initialState: State = {
  isAlertVisible: false,
  isToastVisible: false,
  alertPreset: undefined,
  toastPreset: undefined,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SHOW_ALERT':
      return {
        ...state,
        isAlertVisible: true,
        alertPreset: action.preset,
      };
    case 'HIDE_ALERT':
      return {
        ...state,
        isAlertVisible: false,
        alertPreset: undefined,
      };
    case 'SHOW_TOAST':
      return {
        ...state,
        isToastVisible: true,
        toastPreset: action.preset,
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        isToastVisible: false,
        toastPreset: undefined,
      };
    default:
      return state;
  }
};

export default IranoProvider;

// Types remain the same
type IranoProviderProps = {
  children: ReactNode;
  doneProps?: AlertStyleProps;
  loadingProps?: AlertStyleProps;
  errorProps?: AlertStyleProps;
  toastErrorProps?: ToastStyleProps;
  toastSuccessProps?: ToastStyleProps;
};

interface IranoType {
  title: string;
  subtitle: string;
}

interface IranoToastType extends IranoType {
  preset: 'success' | 'error';
}

interface IranoAlertType extends IranoType {
  preset: 'done' | 'loading' | 'error';
}
