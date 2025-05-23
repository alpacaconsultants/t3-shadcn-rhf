/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/aFle2ZVz5Zt
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";

import { type FC, useState } from "react";
import { Button, type ButtonProps } from "~/components/ui/button";

interface ProgressButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick?: () => Promise<void>;
}

export const ProgressButton: FC<ProgressButtonProps> = ({
  children,
  onClick,
  ...rest
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      onClick={
        onClick
          ? async () => {
              setIsSubmitting(true);
              try {
                await onClick();
              } catch (error) {
                console.error(error);
              } finally {
                setIsSubmitting(false);
              }
            }
          : undefined
      }
      className="flex items-center justify-center gap-2"
      {...rest}
    >
      {children}
      {isSubmitting && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded-full bg-primary-foreground" />
        </div>
      )}
    </Button>
  );
};
