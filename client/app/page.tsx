import Image from 'next/image';
import Link from 'next/link';

type todos = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

async function getData() {
  const a = await fetch('https://jsonplaceholder.typicode.com/todos');
  return a.json();
}

export default async function Home() {
  const a: todos[] = await getData();

  return (
    <>
      <main className="mt-md">
        <h1 className="text-3xl font-semibold">매물 알리미</h1>
        <Image
          className="rounded-lg mt-lg"
          src="/static/images/logo.png"
          alt="로고"
          width={300}
          height={200}
        />
        <h3 className="text-lg mt-md">3대 플랫폼, 하나의 설정으로 알림 끝</h3>
        <Link href="onboarding/1" className="block mt-xl w-[300px] bg-primary p-md text-primary rounded-lg">
          바로 시작하기
        </Link>
      </main>

      <footer className="mt-xxl">
        <Link
          href="/onboarding"
          className="underline font-semibold text-md"
          style={{ textUnderlineOffset: '5px' }}
        >
          이전에 로그인하신 적이 있나요?
        </Link>

        <div className="mt-sm text-sm">
          로그인시{' '}
          <Link href="/zzz" className="underline" style={{ textUnderlineOffset: '5px' }}>
            서비스이용약관
          </Link>{' '}
          및{' '}
          <Link href="/zzz" className="underline" style={{ textUnderlineOffset: '5px' }}>
            개인정보처리방침
          </Link>
          에 동의합니다.
        </div>

        <div className="text-tiny mt-lg">
          상호명 : 솔루션하우스 | 대표 : 신성민
          <br />
          사업자등록번호 : 854-37-01547
          <br />
          대전광역시 유성구 둔곡동 80 우미린
        </div>
      </footer>
    </>
  );
}
