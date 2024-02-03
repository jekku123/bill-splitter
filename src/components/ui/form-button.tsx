'use client';

import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from './button';

export default function FormButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} {...props}>
      {children}
    </Button>
  );
}
