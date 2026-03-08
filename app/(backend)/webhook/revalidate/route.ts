import { NextRequest } from "next/server";

const handler = async (_req: NextRequest) => {
  console.log(_req);
};

export const GET = handler;
