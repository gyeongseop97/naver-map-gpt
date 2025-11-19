export default function Home() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>🚗 Naver Map GPT API</h1>
      <p>✅ 서버가 정상 작동 중입니다.</p>
      <p>예시 호출:</p>
      <pre>
        https://your-vercel-app.vercel.app/api/findRoute?start=서울역&goal=강남역
      </pre>
    </div>
  );
}
