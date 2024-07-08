import { CanDeactivateFn } from '@angular/router';

export const newGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
