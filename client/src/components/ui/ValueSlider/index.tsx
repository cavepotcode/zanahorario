import React from 'react';
import mousetrap from 'mousetrap';
import HotkeyHelp from '../../ui/HotkeyHelp';
import styles from './styles.module.scss';

type Props = {
  onNext: () => void;
  onPrev: () => void;
  value: string;
  disabled?: boolean;
  hotkeyNext: string;
  hotkeyPrev: string;
  hotkeyReset?: string;
  onReset?: () => void;
};

function ValueSlider({ disabled, onReset, onPrev, onNext, value, hotkeyPrev, hotkeyNext, hotkeyReset }: Props) {
  React.useEffect(() => {
    mousetrap.bind(hotkeyPrev, onPrev);
    mousetrap.bind(hotkeyNext, onNext);
    if (onReset && hotkeyReset) {
      mousetrap.bind(hotkeyReset, onReset);
    }

    return () => {
      mousetrap.unbind(hotkeyPrev);
      mousetrap.unbind(hotkeyNext);
      if (onReset && hotkeyReset) {
        mousetrap.unbind(hotkeyReset);
      }
    };
  }, [onPrev, onNext, onReset, hotkeyNext, hotkeyPrev, hotkeyReset]);

  return (
    <div className={styles.container}>
      <button onClick={onPrev} type="button" disabled={disabled}>
        &lt;
        <HotkeyHelp keys={hotkeyPrev} />
      </button>
      <span>{value}</span>
      <button onClick={onNext} type="button" disabled={disabled}>
        &gt;
        <HotkeyHelp keys={hotkeyNext} />
      </button>
    </div>
  );
}

export default React.memo(ValueSlider);
