'use client';

import { useRouter } from 'next/navigation';

import Layout from './Layout';
import SelectButtonV2 from './SelectButtonV2';
import React from 'react';
import number from '../helpers/number';
import { $ } from '../../helpers/document';
import { wait } from '../../helpers/time';

const types = {
  sms: '',
  email: '',
};

export default function SendTypes(props: { page: string }) {
  const router = useRouter();

  const [selectCodes, setSelectCodes] = React.useState<string[]>([]);
  const [inputs, setInputs] = React.useState(types);
  const [inputCodes, setInputCodes] = React.useState(types);
  const [showInputCodes, setShowInputCodes] = React.useState(types);
  const [okInputs, setOkInputs] = React.useState(types);

  const sendAuthCode = React.useCallback(
    async (type: string, event) => {
      event.target.disabled = true;

      const { ok, msg } = await fetch(`http://localhost:4000/api/auth/${type}`, {
        method: 'POST',
        body: JSON.stringify({
          [type]: inputs[type],
        }),
        headers: {
          'Content-Type': 'application/json', // JSON 데이터임을 명시
        },
      })
        .then((res) => res.json())
        .finally(() => {});

      if (ok) {
        setShowInputCodes((prev) => {
          return {
            ...prev,
            [type]: true,
          };
        });

        await wait(150);

        $(`input[name='code[${type}]']`)?.focus();
      }

      if (msg) {
        alert(msg);
      }

      event.target.disabled = false;
    },
    [inputs],
  );

  const vertifyAuthCode = React.useCallback(
    async (type: string) => {
      const { ok, msg } = await fetch(`http://localhost:4000/api/auth/verfiy`, {
        method: 'POST',
        body: JSON.stringify({
          [type]: inputs[type],
          code: inputCodes[type],
          type: type,
        }),
        headers: {
          'Content-Type': 'application/json', // JSON 데이터임을 명시
        },
      })
        .then((res) => res.json())
        .finally(() => {});

      if (ok) {
        // SUCCESS CODE Go..
        setOkInputs((prev) => {
          return {
            ...prev,
            [type]: true,
          };
        });

        $(`input[name='email`)?.focus();
      }

      if (msg) {
        alert(msg);
      }
    },
    [inputs, inputCodes],
  );

  const completedAlarmSetting = React.useCallback(async () => {
    let res = {
      ok: true,
      msg: '',
    };

    if (selectCodes.length === 0) {
      res.ok = false;
      res.msg = '알림 유형을 최소 1개 선택해주세요';
    }

    if (selectCodes.length > 0) {
      for (const code of selectCodes) {
        const nameCode = code === 'talk' ? 'sms' : code;

        if (!okInputs[nameCode]) {
          res.ok = false;
          res.msg = `${nameCode} 인증을 완료해주세요`;
          $(`input[name='${nameCode}']`)?.focus();
          break;
        }
      }
    }

    if (!res.ok) {
      alert(res.msg);
      return;
    }

    // SUCCESS (LOGIN 등.. & 알림 서비스 시작...)
    const cloneInputs = { ...inputs };

    let isHaveSMS = false;

    if (selectCodes.includes('talk') || selectCodes.includes('sms')) {
      isHaveSMS = true;
    }

    if (!isHaveSMS) {
      delete cloneInputs['sms'];
    }

    if (!selectCodes.includes('email')) {
      delete cloneInputs['email'];
    }

    const apiRes1 = await fetch(`http://localhost:4000/api/user`, {
      method: 'POST',
      body: JSON.stringify({
        selectCodes: selectCodes,
        inputs: cloneInputs,
      }),
      headers: {
        'Content-Type': 'application/json', // JSON 데이터임을 명시
      },
    })
      .then((res) => res.json())
      .finally(() => {});

    if (!apiRes1.ok) {
      alert(apiRes1.msg);
      return;
    }

    const userSeq = apiRes1.id;
    window.localStorage.setItem('on_data_7', JSON.stringify(selectCodes));
    window.localStorage.setItem('on_data_user_seq', userSeq);

    router.push(`/onboarding/complete`);
  }, [selectCodes, okInputs, inputs]);

  return (
    <Layout
      des={
        <>
          알림유형을
          <br />
          선택해주세요
          <br />
        </>
      }
      isNext
      nextName="다음"
      nextOnClick={completedAlarmSetting}
    >
      <p className="text-silver mb-md -mt-sm">(중복 선택 가능)</p>
      <SelectButtonV2
        items={[
          { code: 'talk', name: '알림톡' },
          { code: 'sms', name: 'SMS' },
          { code: 'email', name: '이메일' },
        ]}
        onClick={async (code: string) => {
          // talk는 SMS과 동급 취급중..
          const isVertify = okInputs[code === 'talk' ? 'sms' : code];

          let cloneSelectCodes = [...selectCodes];
          const isHave = cloneSelectCodes.includes(code);

          if (isHave) {
            cloneSelectCodes = cloneSelectCodes.filter((item) => item !== code);
          } else {
            cloneSelectCodes.push(code);
          }

          setSelectCodes(cloneSelectCodes);

          if (!isVertify) {
            await wait(100);

            if (code === 'email') {
              $(`input[name='email']`)?.focus();
            } else {
              $(`input[name='sms']`)?.focus();
            }
          }
        }}
      />

      {selectCodes.length > 0 && (
        <>
          {(selectCodes.includes('talk') || selectCodes.includes('sms')) && (
            <div className="flex flex-col mt-md relative">
              <div>
                <label>전화번호</label>{' '}
                <span className="text-silver text-sm">(-를 제외하고 작성해주세요)</span>
              </div>

              <div className="w-full h-full flex items-center mt-sm">
                <input
                  type="number"
                  name="sms"
                  value={inputs.sms}
                  className="border-silver border  p-sm w-3/4 h-10"
                  onChange={(event) => {
                    const value = event.target.value;
                    setInputs((prev) => ({
                      ...prev,
                      sms: value,
                    }));
                  }}
                />
                <button
                  type="button"
                  className="w-2/5 bg-silver100 h-10 p-sm text-xs"
                  onClick={sendAuthCode.bind(this, 'sms')}
                >
                  인증번호 전송
                </button>
              </div>

              {showInputCodes.sms && (
                <div className="w-full h-full flex items-center mt-sm">
                  {okInputs.sms && (
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-primary opacity-90 text-primary">
                      인증되었습니다
                    </div>
                  )}
                  <input
                    type="number"
                    name="code[sms]"
                    value={inputCodes.sms}
                    className="border-silver border  p-sm w-3/4 h-10"
                    maxLength={7}
                    placeholder="인증번호를 입력해주세요"
                    onChange={(event) => {
                      number.maxLengthCheck(event.target);
                      setInputCodes((prev: any) => {
                        return {
                          ...prev,
                          sms: event.target.value,
                        };
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="w-2/5 bg-silver100 h-10 p-sm text-xs"
                    onClick={vertifyAuthCode.bind(this, 'sms')}
                  >
                    인증번호 확인
                  </button>
                </div>
              )}
            </div>
          )}

          {selectCodes.includes('email') && (
            <div className="flex flex-col mt-md relative">
              <div>
                <label>이메일</label> <span className="text-silver text-sm">(ex:홍길동@naver.com)</span>
              </div>

              <div className="w-full h-full flex items-center mt-sm">
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  className="border-silver border  p-sm w-3/4 h-10"
                  onChange={(event) => {
                    setInputs((prev) => {
                      return {
                        ...prev,
                        email: event.target.value,
                      };
                    });
                  }}
                />
                <button
                  type="button"
                  className="w-2/5 bg-silver100 h-10 p-sm text-xs"
                  onClick={sendAuthCode.bind(this, 'email')}
                >
                  인증번호 전송
                </button>
              </div>

              {showInputCodes.email && (
                <div className="w-full h-full flex items-center mt-sm">
                  {okInputs.email && (
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center bg-primary opacity-90 text-primary">
                      인증되었습니다
                    </div>
                  )}
                  <input
                    type="number"
                    name="code[email]"
                    value={inputCodes.email}
                    className="border-silver border  p-sm w-3/4 h-10"
                    maxLength={6}
                    placeholder="인증번호를 입력해주세요"
                    onChange={(event) => {
                      number.maxLengthCheck(event.target);
                      setInputCodes((prev: any) => {
                        return {
                          ...prev,
                          email: event.target.value,
                        };
                      });
                    }}
                  />
                  <button
                    type="button"
                    className="w-2/5 bg-silver100 h-10 p-sm text-xs"
                    onClick={vertifyAuthCode.bind(this, 'email')}
                  >
                    인증번호 확인
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
