import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { start, goal, option = "trafast" } = req.query;

  if (!start || !goal) {
    return res.status(400).json({ error: "start와 goal 파라미터는 필수입니다." });
  }

  const headers = {
    "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID!,
    "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET!,
  };

  try {
    // 1️⃣ 주소 → 좌표 변환
    const geo = async (query: string) => {
      const resp = await axios.get("https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode", {
        headers,
        params: { query },
      });
      const addr = resp.data.addresses?.[0];
      if (!addr) throw new Error(`주소를 찾을 수 없습니다: ${query}`);
      return `${addr.x},${addr.y}`; // 경도,위도
    };

    const startCoord = await geo(String(start));
    const goalCoord = await geo(String(goal));

    // 2️⃣ 경로 탐색 요청
    const routeResp = await axios.get("https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving", {
      headers,
      params: { start: startCoord, goal: goalCoord, option },
    });

    res.status(200).json(routeResp.data);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}
