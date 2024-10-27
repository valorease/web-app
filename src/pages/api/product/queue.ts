import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  id: string;
  targets: { name: string; slug: string }[];
  average: number;
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>
) {
  switch (request.method) {
    case "GET": {
      response.status(200).json({
        id: "8cd263bb-e988-41d5-be4f-a11c81e94a04",
        targets: [
          {
            name: "ML",
            slug: "iphone-15",
          },
          {
            name: "AZ",
            slug: "iphone+15",
          },
        ],
        average: 6599.99,
      });

      break;
    }

    case "POST": {
      break;
    }

    default: {
      response.status(405).end();
    }
  }
}
