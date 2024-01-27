// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  // Assuming the message is sent in the request body with a key "message"
  const { message } = req.body;

  // Return the message in the response
  res.status(200).json({ message });
}
