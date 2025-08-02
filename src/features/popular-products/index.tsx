import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

interface Product {
  name: string;
  orders: string;
  link: string;
}

interface PopularProductsProps {
  products: Product[][];
}

export function PopularProducts({ products }: PopularProductsProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Популярные товары</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((group, index) => (
          <div key={index} className="overflow-x-auto">
            <Table className="min-w-[300px]">
              <TableHeader>
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="text-gray-700">Товар</TableHead>
                  <TableHead className="text-right text-gray-700">Заказы</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.map((product, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50">
                    <TableCell>
                      <Link
                        href={product.link}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right text-gray-700">{product.orders}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}