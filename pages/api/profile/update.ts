import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') return res.status(405).end();
  try {
    const { user, headline, bio, website, location } = req.body;

    const profileExist = await prisma.profile.findUnique({
      where: {
        userId: user,
      },
    });

    if (!profileExist)
      return res.status(400).json({
        message: `Profile isn't created for this user`,
      });

    if (!user)
      return res.status(400).json({ message: 'Usder Id must be valid' });
    const profile = await prisma.profile.update({
      where: {
        userId: user,
      },
      data: { headline, bio, website, location },
    });
    return res.status(200).json({
      profile,
      message: 'Profile Updated Successfully',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
