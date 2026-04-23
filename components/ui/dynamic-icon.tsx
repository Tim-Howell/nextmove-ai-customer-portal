"use client";

import { lazy, Suspense, useMemo } from "react";
import { LucideProps, Flag } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface DynamicIconProps extends Omit<LucideProps, "ref"> {
  name: string;
}

const fallbackIcon = Flag;

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const LucideIcon = useMemo(() => {
    const iconName = name as keyof typeof dynamicIconImports;
    
    if (!(iconName in dynamicIconImports)) {
      return fallbackIcon;
    }
    
    return lazy(dynamicIconImports[iconName]);
  }, [name]);

  return (
    <Suspense fallback={<Flag {...props} />}>
      <LucideIcon {...props} />
    </Suspense>
  );
}
