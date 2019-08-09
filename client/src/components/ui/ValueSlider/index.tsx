import React from 'react';
import HotkeyHelp from '../../ui/HotkeyHelp';
import styles from './styles.module.scss';
import useHotkey from '../../../hooks/useHotkey';

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
  useHotkey(hotkeyReset, onReset);
  useHotkey(hotkeyPrev, (e: any) => {
    e.preventDefault();
    if (!disabled) {
      onPrev();
    }
  });
  useHotkey(hotkeyNext, (e: any) => {
    e.preventDefault();
    if (!disabled) {
      onNext();
    }
  });

  return (
    <div className={styles.container}>
      <button onClick={onPrev} type="button" disabled={disabled}>
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
