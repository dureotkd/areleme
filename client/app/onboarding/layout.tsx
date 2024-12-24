import { NextPage } from 'next';

type Props = {
  children: React.ReactNode;
};

const Layout: NextPage<Props> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen items-start p-xl relative">
      <h2 className="font-semibold text-3xl text-left">
        매물 유형을 <br />
        선택해주세요
      </h2>
      <div>{children}</div>
      <button className="w-full absolute bottom-0 left-0 bg-danger h-12 text-primary" type="button">
        이전
      </button>
    </div>
  );
};

export default Layout;
