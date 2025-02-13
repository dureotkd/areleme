'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <h1>오류가 발생했습니다!</h1>
        <p>{error.message}</p>
        <button onClick={() => reset()}>다시 시도</button>
      </body>
    </html>
  );
}
