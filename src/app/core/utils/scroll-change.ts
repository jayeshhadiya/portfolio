import { DestroyRef, NgZone, inject } from '@angular/core';
import { PlatformCheckService } from '@core/services/platform-check.service';

// Listens to window scroll outside Angular's zone, so scrolling alone doesn't run change
// detection, and calls `update` inside the zone only when `read()` returns a new value.
// Call from a constructor; the listener is removed when the component is destroyed.
export function onScrollChange<T>(read: () => T, update: (value: T) => void): void {
  if (!inject(PlatformCheckService).onBrowser) return;
  const zone = inject(NgZone);
  let last: T | undefined;
  const listener = () => {
    const value = read();
    if (value !== last) {
      last = value;
      zone.run(() => update(value));
    }
  };
  zone.runOutsideAngular(() => window.addEventListener('scroll', listener, { passive: true }));
  inject(DestroyRef).onDestroy(() => window.removeEventListener('scroll', listener));
}
