import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Counter.module.scss';
import {
  decrement,
  increment, selectCount
} from './counterSlice';

export default function Counter() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
    </div>
  );
}
