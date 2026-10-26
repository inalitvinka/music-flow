import { effect, Signal, WritableSignal } from '@angular/core';

interface ResetterProps {
  formModel: Signal<unknown>;
  error: WritableSignal<string>;
}

export const useServerErrorResetter = ({ formModel, error }: ResetterProps) => {
  let lastSubmittedSnapshot = '';

  effect(() => {
    if (error() && lastSubmittedSnapshot !== JSON.stringify(formModel())) {
      error.set('');
    }
  });
  return {
    markAsSubmitted() {
      lastSubmittedSnapshot = JSON.stringify(formModel());
    },
  };
};
