'use client';

import { useFormStatus } from 'react-dom';
import { Icons } from '../icons';
import { Button, ButtonProps } from './button';

export default function FormButton({ children, ...props }: ButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} {...props}>
      {children}
      {pending && <Icons.spinner className="animate-spin ml-2" />}
    </Button>
  );
}
