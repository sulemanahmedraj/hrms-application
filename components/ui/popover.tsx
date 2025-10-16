import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { View, type ViewProps } from 'react-native';

interface PopoverProps {
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface PopoverContentProps extends ViewProps {
  children: React.ReactNode;
}

const PopoverContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

function Popover({ children }: PopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      {children}
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ asChild, children }: PopoverTriggerProps) {
  const { setOpen } = React.useContext(PopoverContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => setOpen(true),
    } as any);
  }

  return (
    <View onTouchEnd={() => setOpen(true)}>
      {children}
    </View>
  );
}

function PopoverContent({ className, children, ...props }: PopoverContentProps) {
  const { open, setOpen } = React.useContext(PopoverContext);

  if (!open) return null;

  return (
    <View
      className={cn(
        'absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export { Popover, PopoverContent, PopoverTrigger };

