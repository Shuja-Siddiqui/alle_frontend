/**
 * Root Providers
 * Combines all context providers for the application
 */

"use client";

import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import { LessonProvider } from './LessonContext';
import { LessonFlowProvider } from './LessonFlowContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <UIProvider>
      <AuthProvider>
        <LessonProvider>
          <LessonFlowProvider>
            {children}
          </LessonFlowProvider>
        </LessonProvider>
      </AuthProvider>
    </UIProvider>
  );
}

