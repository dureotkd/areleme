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

export const waitRandom = async (sec: number) => {
  // 0~10000 밀리초 (0~10초)
  const randomDelay = Math.floor(Math.random() * sec);

  console.log(`\n random Delay :: ${randomDelay} \n`);

  return new Promise((resolve) => setTimeout(resolve, randomDelay));
};
