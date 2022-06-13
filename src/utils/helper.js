import { DefaultLayout } from 'components';
import _ from 'lodash';
import moment from 'moment';
import { Fragment } from 'react';

//#region routes helper get layout
export const getLayout = (layout) => {
  let Layout = DefaultLayout;

  if (layout) {
    Layout = layout;
  } else if (layout === null) {
    Layout = Fragment;
  }
  return Layout;
};
//#endregion

//#region localStorage helper
export const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key));
export const getLocalStorageWithoutParse = (key) => localStorage.getItem(key);
export const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const removeLocalStorage = (key) => localStorage.removeItem(key);
//#endregion

//#region split last name + first name
export const splitDisplayName = (displayName) => {
  const [firstName, ...rest] = displayName.split(' ');
  const lastName = rest.join(' ');
  return { firstName, lastName };
};
//#endregion

//#region get destination URL
export const getDestinationURL = (path) => {
  const url = window.location.pathname;
  return _.replace(url, url.split('/')[url.split('/').length - 1], path);
};
//#endregion

//#region get date
export const getDateByField = (date, time, direction) => {
  const _date = moment(date);
  const days = [];
  for (let index = 0; index < time; index++) {
    direction === 'forward'
      ? _date.set('date', _date.toDate().getDate() + 1)
      : _date.set('date', _date.toDate().getDate() - 1);
    days.push(_date.toDate());
  }
  return direction === 'forward' ? days : days.reverse();
};

export function getDaysInWeek(date = new Date()) {
  const days = [];
  for (let i = 1; i <= 7; i++) {
    if (moment(date).toDate().getDay() === 0) {
      days.push(moment(date).weekday(-7).day(i).toDate());
    } else {
      days.push(moment(date).day(i).toDate());
    }
  }
  return days;
}

export function getDaysInMonth() {
  let daysInMonth = moment().daysInMonth();
  let days = [];

  while (daysInMonth) {
    const current = moment().date(daysInMonth).toDate();
    days.push(current);
    daysInMonth--;
  }
  days = days.reverse();

  return [
    ...getDateByField(days[0], days[0].getDay() - 1),
    ...days,
    ...getDateByField(days[days.length - 1], 7 - days[days.length - 1].getDay(), 'forward')
  ];
}

export const isDateInWeek = (date, dayInWeek = getDaysInWeek()) =>
  dayInWeek.some(
    (day) => moment(day).isSame(date, 'day') && moment(day).isSame(date, 'month') && moment(day).isSame(date, 'year')
  );

export const compareDate = (date, _date) =>
  moment(date).isSame(_date, 'day') && moment(date).isSame(_date, 'month') && moment(date).isSame(_date, 'year');
//#endregion
