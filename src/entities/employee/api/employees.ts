import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const employees = [
      { id: '1', name: 'Shef', revenue: 0, profit: 0, receiptsCount: 0, averageReceipt: 0, averageTime: '0 секунд', serviceCharge: 0 },
      { id: '2', name: 'Sushi Chef', revenue: 504087.59, profit: 333481.66, receiptsCount: 2423, averageReceipt: 210.83, averageTime: '50 минут 29 секунд', serviceCharge: 19475 },
      { id: '3', name: 'Замира', revenue: 0, profit: 0, receiptsCount: 0, averageReceipt: 0, averageTime: '0 секунд', serviceCharge: 0 },
      { id: '4', name: 'Ситора', revenue: 0, profit: 0, receiptsCount: 0, averageReceipt: 0, averageTime: '0 секунд', serviceCharge: 0 },
    ];
    res.status(200).json(employees);
  } else if (req.method === 'DELETE') {
    res.status(204).end();
  } else {
    res.status(405).json({ message: 'Метод не поддерживается' });
  }
}