import { ToasterToast, useToast } from "@/hooks/use-toast";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {toasts.map(({ id, title, description, variant }: ToasterToast) => (
        <ToastItem
          key={id}
          id={id}
          title={title}
          description={description}
          variant={variant}
          onClose={() => dismiss(id)}
        />
      ))}
    </View>
  );
};

interface ToastItemProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ title, description, variant = "default", onClose }) => {
  const bgColor = variant === "destructive" ? "#FEE2E2" : "#D1FAE5";
  const textColor = variant === "destructive" ? "#B91C1C" : "#065F46";
  const icon = variant === "destructive" ? "alert-circle" : "checkmark-circle";

  return (
    <View style={[styles.toast, { backgroundColor: bgColor }]}>
      <Ionicons name={icon as any} size={24} color={textColor} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
        {description && <Text style={[styles.description, { color: textColor }]}>{description}</Text>}
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={16} color={textColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: "100%",
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
  closeButton: { marginLeft: 12, padding: 4 },
});
