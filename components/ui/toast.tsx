import { Ionicons } from "@expo/vector-icons";
import React, { createContext, useCallback, useContext, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type ToastVariant = "default" | "destructive";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextProps {
  showToast: (toast: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString();
      setToasts((prev) => [...prev, { ...toast, id }]);

      // auto remove after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    [setToasts]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<ToastMessage> = ({
  title,
  description,
  variant = "default",
}) => {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const bgColor = variant === "destructive" ? "#FEE2E2" : "#D1FAE5";
  const textColor = variant === "destructive" ? "#B91C1C" : "#065F46";
  const IconName = variant === "destructive" ? "alert-circle" : "checkmark-circle";

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: bgColor, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Ionicons name={IconName} size={24} color={textColor} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        {description && <Text style={[styles.description, { color: textColor }]}>{description}</Text>}
      </View>
      <TouchableOpacity onPress={() => { /* remove toast manually */ }}>
        <Ionicons name="close" size={20} color={textColor} />
      </TouchableOpacity>
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
