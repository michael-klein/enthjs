import { getHost } from './component';

export function createEvent(
  name: string,
  customEventInit: Omit<CustomEventInit, 'detail'> = {
    bubbles: true,
    composed: true,
  }
) {
  const host = getHost();
  return (value?: any) =>
    host.dispatchEvent(
      new CustomEvent(name, {
        ...customEventInit,
        detail: value,
      })
    );
}
