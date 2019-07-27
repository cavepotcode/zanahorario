import React from 'react';
import mousetrap from 'mousetrap';

type Callback = (e: any, combo: string) => any;
export default function useHotkey(hotkey: string, callback: Callback) {
  React.useEffect(() => {
    mousetrap.bind(hotkey, callback);

    return () => {
      mousetrap.unbind(hotkey);
    };
  }, [hotkey, callback]);
}
