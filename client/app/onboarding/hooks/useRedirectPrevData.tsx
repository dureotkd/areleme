import React from 'react';

function useRedirectPrevData(page: string) {
  React.useEffect(() => {
    let res = true;
    let replaceUrl = '';

    for (let i = 1; i < parseInt(page); i++) {
      const onData = window.localStorage.getItem(`on_data_${i}`);

      if (!onData) {
        res = false;
        replaceUrl = `/onboarding/${i}`;
        break;
      }
    }

    if (!res) {
      window.location.replace(replaceUrl);
    }
  }, []);

  return <div>useRedirectPrevData</div>;
}

export default useRedirectPrevData;
