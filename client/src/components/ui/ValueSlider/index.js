import React from 'react';
import styles from './styles.module.scss';

export default function ValueSlider({ onPrev, onNext, value }) {
  return (
    <div className={styles.container}>
      <button onClick={onPrev} type="button">
        &lt;
      </button>
      <span>{value}</span>
      <button onClick={onNext} type="button">
        &gt;
      </button>
    </div>
  );
}
