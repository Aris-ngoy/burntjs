import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo,
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

// Provider
const IranoProvider: FC<IranoProviderProps> = ({
  children,
  doneProps,
  loadingProps,
  errorProps,
  toastErrorProps,
  toastSuccessProps,
}) => {
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [isToastVisible, setToastVisible] = useState(false);

  const alertParams = useRef<IranoAlertType | null>(null);
  const toastParams = useRef<IranoToastType | null>(null);

  // Handlers
  const showAlert = useCallback((param: IranoAlertType) => {
    alertParams.current = param;
    setAlertVisible(true);
  }, []);

  const onToast = useCallback((param: IranoToastType) => {
    toastParams.current = param;
    setToastVisible(true);
  }, []);

  // Derived props
  const alertProps = useMemo(() => {
    if (!alertParams.current) return {};
    switch (alertParams.current.preset) {
      case 'done':
        return doneProps;
      case 'loading':
        return loadingProps;
      case 'error':
        return errorProps;
      default:
        return {};
    }
  }, [doneProps, loadingProps, errorProps]);

  const toastProps = useMemo(() => {
    if (!toastParams.current) return {};
    return toastParams.current.preset === 'success'
      ? toastSuccessProps
      : toastErrorProps;
  }, [toastErrorProps, toastSuccessProps]);

  // Extracted fields for Alert and Toast
  const {
    title = '',
    subtitle = '',
    preset: alertPreset,
  } = alertParams.current || {};
  const {
    title: toastTitle = '',
    subtitle: toastSubtitle = '',
    preset: toastPreset,
  } = toastParams.current || {};

  return (
    <IranoContext.Provider value={{ showAlert, onToast }}>
      {children}
      <Alert
        title={title}
        subtitle={subtitle}
        preset={alertPreset}
        visible={isAlertVisible}
        onClose={() => setAlertVisible(false)}
        {...alertProps}
      />
      {isToastVisible && (
        <Toast
          position="top"
          title={toastTitle}
          subtitle={toastSubtitle}
          onHide={() => setToastVisible(false)}
          preset={toastPreset}
          {...toastProps}
        />
      )}
    </IranoContext.Provider>
  );
};

export default IranoProvider;

// Types
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
