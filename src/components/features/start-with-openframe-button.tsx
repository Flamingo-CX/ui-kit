
import * as React from 'react';
import { Button, type ButtonProps } from "../ui/button";
import { OpenFrameLogo } from "../icons";
import { cn } from "../../utils";

export interface StartWithOpenFrameButtonProps extends Omit<ButtonProps, 'variant' | 'size' | 'leftIcon'> {
  children?: React.ReactNode;
  mode?: 'outline' | 'yellow' | 'pink' | 'purple';
  buttonSize?: 'sm' | 'md' | 'lg';
}

/**
 * "Start with OpenFrame" button for Flamingo header
 * – Four modes: 'outline' (default), 'yellow', 'pink', and 'purple'
 * – Shows OpenFrame icon on the left
 * – Same pattern as OpenFrame Github button in hero section
 */
export const StartWithOpenFrameButton = React.forwardRef<
  HTMLButtonElement,
  StartWithOpenFrameButtonProps
>(({ children = 'Start Free Trial', mode = 'outline', className, buttonSize, ...props }, ref) => {
  const isYellow = mode === 'yellow';
  const isPink = mode === 'pink' || mode === 'purple';
  
  // Map buttonSize to Button component's size prop
  const mappedSize = buttonSize === 'md' ? 'default' : buttonSize;
  
  // Determine button variant and class names based on mode
  let buttonVariant: 'primary' | 'outline' = 'outline';
  let modeClassName = '';
  let iconLowerPath = "var(--ods-open-yellow-base)";
  let iconUpperPath = "var(--ods-system-greys-white)";
  
  if (isYellow) {
    buttonVariant = 'primary';
    modeClassName = 'bg-[var(--ods-open-yellow-base)] hover:bg-[var(--ods-open-yellow-hover)] text-ods-text-on-accent border-[var(--ods-open-yellow-base)]';
    iconLowerPath = "var(--ods-system-greys-white)";
    iconUpperPath = "var(--ods-system-greys-black)";
  } 
  if (isPink) {
    buttonVariant = 'primary';
    modeClassName = 'bg-[var(--ods-flamingo-pink-base)] hover:bg-[var(--ods-flamingo-pink-hover)] text-ods-text-primary border-[var(--ods-flamingo-pink-base)]';
    iconLowerPath = "var(--ods-system-greys-black)";
    iconUpperPath = "var(--ods-system-greys-white)";
  }
  
  return (
    <Button
      ref={ref}
      {...props}
      size={mappedSize}
      variant={buttonVariant}
      className={cn(
        modeClassName,
        className
      )}
      leftIcon={<OpenFrameLogo className="w-6 h-6" 
        lowerPathColor={iconLowerPath} 
        upperPathColor={iconUpperPath} />}
    >
      {children}
    </Button>
  );
});
StartWithOpenFrameButton.displayName = 'StartWithOpenFrameButton'; 