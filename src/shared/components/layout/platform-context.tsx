import type { ReactNode } from 'react';
import { createContext, use, useLayoutEffect, useRef, useState } from 'react';

type PlatformContextValue = {
  title: string;
  setTitle: (title: string) => void;
  rightAction: ReactNode;
  setRightAction: (node: ReactNode) => void;
};

export const PlatformContext = createContext<PlatformContextValue | null>(null);

export function usePlatformContext() {
  const ctx = use(PlatformContext);
  if (!ctx) throw new Error('usePlatformContext must be used within PlatformLayout');
  return ctx;
}

type UseSetPlatformHeaderOptions = {
  title: string;
  rightAction?: ReactNode;
};

export function useSetPlatformHeader({ title, rightAction }: UseSetPlatformHeaderOptions) {
  const { setTitle, setRightAction } = usePlatformContext();

  // Use a ref so JSX rightAction doesn't cause the effect to re-run on every render
  const rightActionRef = useRef<ReactNode>(rightAction ?? null);
  rightActionRef.current = rightAction ?? null;

  useLayoutEffect(() => {
    setTitle(title);
    setRightAction(rightActionRef.current);
    return () => {
      setTitle('');
      setRightAction(null);
    };
  }, [title, setTitle, setRightAction]);
}

type PlatformProviderProps = {
  children: ReactNode;
};

export function PlatformProvider({ children }: PlatformProviderProps) {
  const [title, setTitle] = useState('');
  const [rightAction, setRightAction] = useState<ReactNode>(null);

  return (
    <PlatformContext.Provider value={{ title, setTitle, rightAction, setRightAction }}>
      {children}
    </PlatformContext.Provider>
  );
}
