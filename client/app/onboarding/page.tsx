import { NextPage } from 'next';

type Local = {
  seq: number;
  code: number;
  lat: string;
  lng: string;
  name: string;
};

async function fetchLocalList() {
  const { data } = await fetch('http://localhost:4000/api/address/local').then((res) => res.json());

  return data;
}

const Page: NextPage = async ({}) => {
  const localList: Local[] = await fetchLocalList();

  return (
    <div>
      {localList.length > 0 &&
        localList.map((item) => {
          return <div key={item.seq}>{item.name}</div>;
        })}
    </div>
  );
};

export default Page;
