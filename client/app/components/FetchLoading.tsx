'use client';

import Lottie from 'react-lottie-player';
import animationData from '../../static/lotties/loading.json';

export default function FetchLoading({ className = '' }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie className="flex justify-center items-center w-2/3" loop play animationData={animationData} />
    </div>
  );
}
