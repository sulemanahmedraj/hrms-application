import React from "react";
import { Platform, View } from "react-native";
import Animated, { AnimatedProps } from "react-native-reanimated";

type NativeOnlyAnimatedViewProps = AnimatedProps<any> & {
  children?: React.ReactNode;
};

/**
 * Renders an Animated.View only on native platforms.
 * On web, it falls back to a normal View.
 */
export const NativeOnlyAnimatedView = ({ children, ...props }: NativeOnlyAnimatedViewProps) => {
  if (Platform.OS === "web") {
    return <View {...props}>{children}</View>;
  }

  return <Animated.View {...props}>{children}</Animated.View>;
};
