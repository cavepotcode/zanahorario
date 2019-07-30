import React from 'react';
import HotkeyHelp from '../../ui/HotkeyHelp';
import styles from './styles.module.scss';
import useHotkey from '../../../hooks/useHotkey';
import classes from '../../../utils/classes';

type HotkeyType = {
  key: string | string[];
  handler: () => void;
};

type Props = {
  className?: string;
  value: string;
  disabled?: boolean;
  hotkeys: {
    prev: HotkeyType;
    next: HotkeyType;
    reset: HotkeyType;
  };
};

function ValueSlider({ className, disabled, value, hotkeys }: Props) {
  const { reset, prev, next } = hotkeys;
  useHotkey(reset.key, reset.handler);
  useHotkey(prev.key, prev.handler);
  useHotkey(next.key, next.handler);

  return (
    <div className={classes(styles.container, className)}>
      <button onClick={handlePrev} type="button" disabled={disabled}>
        <span>&lt;</span>
        <HotkeyHelp keys={prev.key} />
      </button>
      <span>{value}</span>
      <button onClick={handleNext} type="button" disabled={disabled}>
        <span>&gt;</span>
        <HotkeyHelp keys={next.key} />
      </button>
    </div>
  );

  function handlePrev(e: any) {
    e.preventDefault();
    if (!disabled) {
      prev.handler();
    }
  }

  function handleNext(e: any) {
    e.preventDefault();
    if (!disabled) {
      next.handler();
    }
  }
}

export default React.memo(ValueSlider);
export { useValueSlider } from './useValueSlider';
