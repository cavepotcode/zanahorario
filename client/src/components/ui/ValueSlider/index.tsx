import React from 'react';
import mousetrap from 'mousetrap';
import HotkeyHelp from '../../ui/HotkeyHelp';
import styles from './styles.module.scss';

type Props = {
  onNext: () => void;
  onPrev: () => void;
  value: string;
  disabled?: boolean;
  hotkeyNext: string | string[];
  hotkeyPrev: string | string[];
  hotkeyReset?: string | string[];
  onReset?: () => void;
};

function ValueSlider({ disabled, onReset, onPrev, onNext, value, hotkeyPrev, hotkeyNext, hotkeyReset }: Props) {
  React.useEffect(() => {
    mousetrap.bind(hotkeyPrev, (e: any) => {
      e.preventDefault();
      if (!disabled) {
        onPrev();
      }
    });
    mousetrap.bind(hotkeyNext, (e: any) => {
      e.preventDefault();
      if (!disabled) {
        onNext();
      }
    });

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
  }, [disabled, onPrev, onNext, onReset, hotkeyNext, hotkeyPrev, hotkeyReset]);

  return (
    <div className={styles.container}>
      <button onClick={onPrev} type="button" disabled={disabled} className="ripple">
        <span>&lt;</span>
        <HotkeyHelp keys={hotkeyPrev} />
      </button>
      <span>{value}</span>
      <button onClick={onNext} type="button" disabled={disabled}>
        <span>&gt;</span>
        <HotkeyHelp keys={hotkeyNext} />
      </button>
    </div>
  );
}

export default React.memo(ValueSlider);
