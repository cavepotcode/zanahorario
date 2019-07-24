import React from 'react';
import styles from './styles.module.scss';
import classes from '../../../utils/classes';
import Arrow from '../Arrow';

export interface ICarouselItem {
  id: number;
  name: string;
  hours: number;
}

type Props = {
  entries: ICarouselItem[];
  max?: number;
};

type ItemEntry = {
  id: number;
  name: string;
  hours?: number;
};

export default function Carousel({ entries, max = 3 }: Props) {
  const [itemIndex, setIndex] = React.useState(0);
  const [entriesWindow, setWindow] = React.useState([] as ICarouselItem[]);

  React.useEffect(() => {
    if (itemIndex >= 0) {
      if (itemIndex + max <= entries.length) {
        const entriesList = entries.slice(itemIndex, itemIndex + max);
        setWindow(entriesList);
      } else {
        setWindow(entries);
      }
    }
  }, [itemIndex, max, entries]);

  const showArrows = entries.length > max;
  const disabledPrev = itemIndex === 0;
  const disableNext = itemIndex + max >= entries.length;

  return (
    <div className={styles.carousel}>
      <Arrow show={showArrows} left onClick={moveWindow} step={-1} disabled={disabledPrev} />

      {entriesWindow.map(({ id, name, hours }: ItemEntry, index: number) => (
        <div className={classes(styles.item, index === entriesWindow.length - 1 && styles.last)} key={id}>
          <div>{name}</div>
          <div>{hours}</div>
        </div>
      ))}

      <Arrow show={showArrows} right onClick={moveWindow} step={1} disabled={disableNext} />
    </div>
  );

  function moveWindow(step: number): void {
    setIndex(itemIndex + step);
  }
}
