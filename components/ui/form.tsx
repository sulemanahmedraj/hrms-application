import { cn } from '@/lib/utils';
import React, { createContext } from 'react';
import { View, type ViewProps } from 'react-native';

interface FormProps {
  children: React.ReactNode;
}

interface FormFieldProps {
  control?: any;
  name: string;
  render: (props: { field: any }) => React.ReactNode;
}

interface FormItemProps extends ViewProps {
  children: React.ReactNode;
}

interface FormLabelProps extends ViewProps {
  children: React.ReactNode;
}

interface FormControlProps extends ViewProps {
  children: React.ReactNode;
}

interface FormMessageProps extends ViewProps {
  children?: React.ReactNode;
}

const FormContext = createContext<any>({});

function Form({ children }: FormProps) {
  return (
    <FormContext.Provider value={{}}>
      <View>{children}</View>
    </FormContext.Provider>
  );
}

function FormField({ control, name, render }: FormFieldProps) {
  const field = {
    name,
    value: '',
    onChange: () => {},
    onBlur: () => {},
  };

  return <>{render({ field })}</>;
}

function FormItem({ className, children, ...props }: FormItemProps) {
  return (
    <View
      className={cn('space-y-2', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function FormLabel({ className, children, ...props }: FormLabelProps) {
  return (
    <View
      className={cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function FormControl({ className, children, ...props }: FormControlProps) {
  return (
    <View
      className={cn('', className)}
      {...props}
    >
      {children}
    </View>
  );
}

function FormMessage({ className, children, ...props }: FormMessageProps) {
  return (
    <View
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {children}
    </View>
  );
}

export {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
};

