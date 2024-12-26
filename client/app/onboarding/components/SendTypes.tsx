'use client';

import { useRouter } from 'next/navigation';

import Layout from './Layout';
import SelectButton from './SelectButton';
import SelectButtonV2 from './SelectButtonV2';

export default function SendTypes(props: { page: string }) {
  const router = useRouter();

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
      nextOnClick={() => {}}
    >
      <p className="text-silver mb-md -mt-sm">(중복 선택 가능)</p>
      <SelectButtonV2
        items={[
          { code: 'talk', name: '알림톡' },
          { code: 'sms', name: 'SMS' },
          { code: 'email', name: '이메일' },
        ]}
      />
    </Layout>
  );
}
