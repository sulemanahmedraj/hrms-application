import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { View, type ViewProps } from 'react-native';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface DialogContentProps extends ViewProps {
  children: React.ReactNode;
}

interface DialogHeaderProps extends ViewProps {
  children: React.ReactNode;
}

interface DialogTitleProps extends ViewProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps extends ViewProps {
  children: React.ReactNode;
}

interface DialogFooterProps extends ViewProps {
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

function Dialog({ children, open: controlledOpen, onOpenChange }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ asChild, children }: DialogTriggerProps) {
  const { setOpen } = React.useContext(DialogContext);

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

function DialogContent({ className, children, ...props }: DialogContentProps) {
  const { open, setOpen } = React.useContext(DialogContext);

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

function DialogHeader({ className, children, ...props }: DialogHeaderProps) {
  return (
    <View
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <View
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function DialogDescription({ className, children, ...props }: DialogDescriptionProps) {
  return (
    <View
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function DialogFooter({ className, children, ...props }: DialogFooterProps) {
  return (
    <View
      className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
      {...props}
    >
      {children}
    </View>
  );
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
};

