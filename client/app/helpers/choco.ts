const choco = async ({ url, options = {}, final }: any) => {
  let retries = 2; // 기본 재시도 횟수 설정
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      attempt++;

      alert(`서버 오류가 발생하였습니다\n다시 요청합니다(${attempt + 1})`);

      if (attempt >= retries) {
        alert(`네트워크 오류로인해 서비스 제공이 불가합니다`);
        throw new Error('Max retries reached');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    } finally {
      if (final) {
        final();
      }
    }
  }
};

export default choco;
