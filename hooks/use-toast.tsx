import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

type ToastVariant = "default" | "destructive";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // in ms
}

interface ToasterToast extends ToastProps {
  id: string;
  open?: boolean;
}

interface State {
  toasts: ToasterToast[];
}

const TOAST_LIMIT = 3;
const DEFAULT_DURATION = 3000;
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const listeners: Array<(state: State) => void> = [];
let memoryState: State = { toasts: [] };

function dispatch(toast: State) {
  memoryState = toast;
  listeners.forEach((listener) => listener(memoryState));
}

function reducer(state: State, action: { type: string; toast?: ToasterToast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast!, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
}

function toast({ title, description, variant = "default", duration = DEFAULT_DURATION }: ToastProps) {
  const id = genId();
  const newToast: ToasterToast = { id, title, description, variant, open: true };

  memoryState = reducer(memoryState, { type: "ADD_TOAST", toast: newToast });
  listeners.forEach((listener) => listener(memoryState));

  const dismiss = () => dispatch({ ...memoryState, toasts: memoryState.toasts.filter((t) => t.id !== id) });
  setTimeout(dismiss, duration);

  return { id, dismiss };
}

function useToast() {
  const [state, setState] = useState<State>(memoryState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (!toastId) return;
      memoryState = reducer(memoryState, { type: "REMOVE_TOAST", toastId });
      listeners.forEach((listener) => listener(memoryState));
    },
  };
}

/** React Native Toast Renderer Component */
export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </View>
  );
};

const ToastItem: React.FC<ToasterToast> = ({ title, description, variant }) => {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const bgColor = variant === "destructive" ? "#FEE2E2" : "#D1FAE5";
  const textColor = variant === "destructive" ? "#B91C1C" : "#065F46";
  const icon = variant === "destructive" ? "alert-circle" : "checkmark-circle";

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bgColor, transform: [{ translateY: slideAnim }] }]}>
      <Ionicons name={icon as any} size={24} color={textColor} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
        {description && <Text style={[styles.description, { color: textColor }]}>{description}</Text>}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: Dimensions.get("window").width,
    alignItems: "center",
    zIndex: 9999,
  },
  toast: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    minWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: { fontWeight: "bold", fontSize: 16 },
  description: { fontSize: 14, opacity: 0.9 },
});

export { toast, useToast };

