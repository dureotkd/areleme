'use client';

import React from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import ViewButton from './ViewButton';
import FetchLoading from '../../components/FetchLoading';
import Image from 'next/image';
import { Button } from '@mui/material';

const TypingAnimation = ({ text, className = '', onComplete = () => {}, show = false }) => {
  // 텍스트를 줄 단위로 나눕니다.
  const lines = text.split('\n');

  if (show) {
    return (
      <div className={`text-left ${className}`}>
        {text.split('\n').map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      className="typing-container"
      variants={container}
      onAnimationStart={() => {
        window.scrollTo(0, 10000000000);
      }}
      onAnimationComplete={onComplete}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className={`text-left ${className}`}>
          {line.split('').map((letter, letterIndex) => (
            <motion.span key={letterIndex} variants={child}>
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

const Explain = () => {
  const [steps, setSteps] = React.useState([1]);
  const [selectCode, setSelectCode] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const [seeExplain, setSeeExplain] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    const explain = window.localStorage.getItem('explain');

    if (explain) {
      setSteps([1, 2, 3, 4]);
      setSeeExplain(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <FetchLoading />;
  }

  return (
    <div className="w-full min-h-screen">
      {steps.includes(1) && (
        <div className="flex p-md mt-md">
          <Image
            className="rounded-lg mr-sm w-[50px] h-[50px]"
            src="/static/images/ai_profile.png"
            alt="로고"
            width={50}
            height={50}
          />
          <TypingAnimation
            text={`안녕하세요, 안내원 케빈입니다.\n매물 알리미 서비스에 대해 설명드리겠습니다.`}
            show={seeExplain}
            onComplete={() => {
              const lastSteps = steps[steps.length - 1];
              setSteps((prev) => [...prev, lastSteps + 1]);
            }}
          />
        </div>
      )}

      {steps.includes(2) && (
        <div className="flex justify-end p-md mr-sm mt-md">
          <TypingAnimation
            text={`좋아, 자세하게 알려줄래?`}
            show={seeExplain}
            onComplete={() => {
              const lastSteps = steps[steps.length - 1];
              setSteps((prev) => [...prev, lastSteps + 1]);
            }}
          />
        </div>
      )}

      {steps.includes(3) && (
        <div className="flex p-md mt-md">
          <Image
            className="rounded-lg mr-sm w-[50px] h-[50px]"
            src="/static/images/ai_profile.png"
            alt="로고"
            width={50}
            height={50}
          />
          <TypingAnimation
            text={`네, 저희가 제공하는 알리미는 2가지가 있습니다\n1. 모든 매물 : 오늘부터 등록되는 모든 매물\n2. AI 맞춤형 매물 : 오늘부터 등록되는 매물 중 AI가 선별한 가치 있는 매물`}
            show={seeExplain}
            onComplete={() => {
              const lastSteps = steps[steps.length - 1];
              setSteps((prev) => [...prev, lastSteps + 1]);
            }}
          />
        </div>
      )}

      {steps.includes(4) && (
        <div className="flex p-md mt-md">
          <Image
            className="rounded-lg mr-sm w-[50px] h-[50px]"
            src="/static/images/ai_profile.png"
            alt="로고"
            width={50}
            height={50}
          />

          <div className="flex-col">
            <TypingAnimation text={`아래 버튼중에 선택해주세요`} show={seeExplain} />
            <div />

            <motion.div
              className="flex mt-tiny"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Button
                variant="contained"
                color="inherit"
                onClick={() => {
                  setSelectCode('all');
                  const lastSteps = steps[steps.length - 1];
                  setSteps((prev) => [...prev, lastSteps + 1]);
                }}
                className="mr-sm mt-tiny bg-blue-200"
              >
                모든 매물
              </Button>
              <Button
                variant="contained"
                color="info"
                style={{ marginLeft: 6 }}
                onClick={() => {
                  setSelectCode('ai');
                  const lastSteps = steps[steps.length - 1];
                  setSteps((prev) => [...prev, lastSteps + 1]);
                }}
              >
                AI 맞춤형 매물
              </Button>
            </motion.div>
          </div>
        </div>
      )}

      {steps.includes(5) && (
        <div className="flex p-md mt-md">
          <Image
            className="rounded-lg mr-sm w-[50px] h-[50px]"
            src="/static/images/ai_profile.png"
            alt="로고"
            width={50}
            height={50}
          />
          <TypingAnimation
            text={`오늘부터 새로운 매물이 나오면\n아래와 같이 전송될 예정입니다`}
            onComplete={() => {
              const lastSteps = steps[steps.length - 1];
              setSteps((prev) => [...prev, lastSteps + 1]);
            }}
          />
        </div>
      )}

      {steps.includes(6) && (
        <div className="flex p-md">
          <motion.img
            key={1}
            src="/static/images/email_alarm.png"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onAnimationComplete={async () => {
              const lastSteps = steps[steps.length - 1];
              setSteps((prev) => [...prev, lastSteps + 1]);
            }}
          />
        </div>
      )}

      {steps.includes(7) && (
        <div className="flex p-md items-center">
          <Image
            className="rounded-lg mr-sm w-[50px] h-[50px]"
            src="/static/images/ai_profile.png"
            alt="로고"
            width={50}
            height={50}
          />
          <div className="flex items-center">
            <TypingAnimation
              text={`이제 몇가지 질문이 시작됩니다`}
              onComplete={() => {
                setTimeout(() => {
                  window.localStorage.setItem(`on_data_0`, selectCode);
                  window.localStorage.setItem('explain', '1');
                  router.push(`/onboarding/1`);
                }, 4000);
              }}
            />
            <FetchLoading className="w-[100px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Explain;
