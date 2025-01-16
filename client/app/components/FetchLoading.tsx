'use client';

import Lottie from 'react-lottie-player';
import animationData from '../../static/lotties/loading.json';

export default function FetchLoading() {
  return (
    <div className="w-full flex justify-center items-center">
      <Lottie className="flex justify-center items-center w-2/3" loop play animationData={animationData} />
    </div>
  );
}
