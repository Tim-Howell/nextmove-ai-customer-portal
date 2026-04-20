"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { setShowDemoData } from "@/app/actions/settings";

interface DemoDataToggleProps {
  initialValue: boolean;
}

export function DemoDataToggle({ initialValue }: DemoDataToggleProps) {
  const [isChecked, setIsChecked] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  async function handleChange(checked: boolean) {
    setIsLoading(true);
    setIsChecked(checked);

    const result = await setShowDemoData(checked);

    if (result.error) {
      setIsChecked(!checked);
    }

    setIsLoading(false);
  }

  return (
    <Switch
      checked={isChecked}
      onCheckedChange={handleChange}
      disabled={isLoading}
    />
  );
}
