import React from 'react';
import mousetrap from 'mousetrap';

type Callback = (e: any, combo: string) => any;
export default function useHotkey(hotkey?: string | string[], callback?: Callback) {
  React.useEffect(() => {
    if (hotkey && callback) {
      mousetrap.bind(hotkey, callback);
    }

    return () => {
      if (hotkey && callback) {
        mousetrap.unbind(hotkey);
      }
    };
  }, [hotkey, callback]);
}
