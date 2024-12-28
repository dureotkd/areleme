import dayjs from 'dayjs';

export const wait = (sec: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, sec);
  });
};

export const getNowDate = () => {
  const formattedNow = dayjs().format('YYYY-MM-DD HH:mm:ss');

  return formattedNow;
};
