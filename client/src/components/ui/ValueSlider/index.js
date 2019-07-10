import React from 'react';
import styles from './styles.module.scss';

export default function ValueSlider({ disabled, onPrev, onNext, value }) {
  return (
    <div className={styles.container}>
      <button onClick={onPrev} type="button" disabled={disabled}>
        &lt;
      </button>
      <span>{value}</span>
      <button onClick={onNext} type="button" disabled={disabled}>
        &gt;
      </button>
    </div>
  );
}
