import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { View, type ViewProps } from 'react-native';

interface AlertDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface AlertDialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface AlertDialogContentProps extends ViewProps {
  children: React.ReactNode;
}

interface AlertDialogHeaderProps extends ViewProps {
  children: React.ReactNode;
}

interface AlertDialogTitleProps extends ViewProps {
  children: React.ReactNode;
}

interface AlertDialogDescriptionProps extends ViewProps {
  children: React.ReactNode;
}

interface AlertDialogFooterProps extends ViewProps {
  children: React.ReactNode;
}

interface AlertDialogActionProps extends ViewProps {
  children: React.ReactNode;
}

interface AlertDialogCancelProps extends ViewProps {
  children: React.ReactNode;
}

const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

function AlertDialog({ children, open: controlledOpen, onOpenChange }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({ asChild, children }: AlertDialogTriggerProps) {
  const { setOpen } = React.useContext(AlertDialogContext);

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

function AlertDialogContent({ className, children, ...props }: AlertDialogContentProps) {
  const { open, setOpen } = React.useContext(AlertDialogContext);

  if (!open) return null;

  return (
    <View
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

function AlertDialogHeader({ className, children, ...props }: AlertDialogHeaderProps) {
  return (
    <View
      className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function AlertDialogTitle({ className, children, ...props }: AlertDialogTitleProps) {
  return (
    <View
      className={cn('text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function AlertDialogDescription({ className, children, ...props }: AlertDialogDescriptionProps) {
  return (
    <View
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function AlertDialogFooter({ className, children, ...props }: AlertDialogFooterProps) {
  return (
    <View
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function AlertDialogAction({ className, children, ...props }: AlertDialogActionProps) {
  return (
    <View
      className={cn('', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function AlertDialogCancel({ className, children, ...props }: AlertDialogCancelProps) {
  return (
    <View
      className={cn('', className)}
      {...props}
    >
      {children}
    </View>
  );
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
};

