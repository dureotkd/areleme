const BACKEND_URL = `http://localhost:4000/api11`;
const choco = async ({ url, options = {}, final }: any) => {
  let retries = 2; // 기본 재시도 횟수 설정
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await fetch(`${BACKEND_URL}/${url}`, {
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

      if (attempt >= retries) {
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

export { BACKEND_URL };
export default choco;
