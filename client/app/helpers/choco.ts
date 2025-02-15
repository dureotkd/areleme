const BACKEND_URL =
  process.env.NODE_ENV === 'development' ? `http://localhost:4000/api` : 'https://api.okpann.com/api';

const choco = async ({ url, options = {}, final }: any) => {
  try {
    const response: Response = await fetch(`${BACKEND_URL}/${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`네트워크 오류가 발생하였습니다`);
    }

    const responseJson = await response.json();

    if (responseJson.code === 'fail') {
      throw new Error(responseJson.msg);
    }

    return responseJson;
  } catch (error) {
    throw new Error(error.message);
  } finally {
    if (final) {
      final();
    }
  }
};

export { BACKEND_URL };
export default choco;
