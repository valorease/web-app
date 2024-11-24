import RootLayout from "@/components/root-layout";
import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Filter, GhostIcon } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProductMetric = {
  name: string;
  publicId: string;
  priceIncrease: number;
  priceVariation: number;
  maxPrice: number;
  minPrice: number;
  media: number;
  priceVariations: { url: string, averagePrice: number }[]
};

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);

  const metrics = await prisma.product.findMany({
    where: {
      consumerId: session!.consumer.id,
    },
    include: {
      ProductHistory: true,
    },
    orderBy: {
      id: "desc"
    }
  });

  const productMetrics: any[] = metrics.map((product) => {
    const history = product.ProductHistory;

    if (history.length === 0) {
      return null;
    }

    const maxPrice = Math.max(...history.map((entry) => entry.price));
    const minPrice = Math.min(...history.map((entry) => entry.price));
    const media = product.average;
    const priceIncrease = maxPrice - minPrice;

    return {
      name: product.name,
      publicId: product.publicId,
      priceIncrease,
      priceVariation: ((maxPrice - minPrice) / minPrice * 100),
      maxPrice,
      minPrice,
      media
    };
  }).filter((metric) => metric !== null);

  return {
    props: {
      metrics: productMetrics,
    },
  };
};

const Dashboard = ({ metrics }: { metrics: ProductMetric[] }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chave, setChave] = useState<number>();
  useEffect(() => {
    const data = metrics.map((metric) => ({
      name: metric.name,
      maxPrice: metric.maxPrice,
      minPrice: metric.minPrice,
      avgPrice: metric.priceVariation
    }));

    setChartData(data);
  }, [metrics]);

  return (
    <RootLayout breadcrumb={["Dashboard"]} className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <p className="text-xl font-semibold">Métricas dos Produtos</p>
      </div>
      <div style={{ gap: '8px', display: 'flex' }}>
        <Button onClick={() => setChave(1)}><Filter />Mostrar Cards</Button>
        <Button onClick={() => setChave(2)}><Filter />Mostrar Gráfico</Button>
      </div>
      {metrics.length < 1 ? (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4">
          <GhostIcon className="h-20 w-20" />
          <p>Nenhuma métrica disponível.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {chave === 1 ?
            (
              metrics.map((metric) => (
                <Card key={metric.name} className="flex-1 max-w-96 flex flex-col justify-between" style={{width:'600px'}}>
                  <CardHeader>
                    <CardTitle>{metric.name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p>
                      Preço médio:{" "}
                      <span className="font-bold">
                        R$ {metric.media.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                    <p>
                      Amplitude de preço:{" "}
                      <span className="font-bold">
                        R$ {metric.priceIncrease.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                    <p>
                      Preço máximo:{" "}
                      <span className="font-bold">
                        R$ {metric.maxPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                    <p>
                      Preço mínimo:{" "}
                      <span className="font-bold">
                        R$ {metric.minPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </p>
                    <br />
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[{ name: metric.name, maxPrice: metric.maxPrice, minPrice: metric.minPrice, avgPrice: metric.media }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          content={({ payload }) => {
                            if (payload && payload.length > 0) {
                              const { name, maxPrice, minPrice, avgPrice } = payload[0].payload;
                              return (
                                <div className="tooltip-content">
                                  <p><strong>{name}</strong></p>
                                  <p>Máximo: R$ {maxPrice.toFixed(2).replace(".", ",")}</p>
                                  <p>Mínimo: R$ {minPrice.toFixed(2).replace(".", ",")}</p>
                                  <p>Média: R$ {avgPrice.toFixed(2).replace(".", ",")}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => {
                          if (value === "maxPrice") {
                            return 'Maior Preço'
                          }
                          else if (value === "minPrice") {
                            return 'Menor Preço'
                          }
                        }
                        } />
                        <Bar dataKey="maxPrice" fill="#5C6BC0" radius={[5, 5, 0, 0]} />
                        <Bar dataKey="minPrice" fill="#81C784" radius={[5, 5, 0, 0]} />
                        <Line dataKey="avgPrice" stroke="#FF7043" dot={false} activeDot={{ r: 8 }} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              ))
            ) :

            <ResponsiveContainer width="100%" height={580}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ payload }) => {
                    if (payload && payload.length > 0) {
                      const { name, maxPrice, minPrice, avgPrice } = payload[0].payload;
                      return (
                        <div className="tooltip-content">
                          <p><strong>{name}</strong></p>
                          <p>Máximo: R$ {maxPrice.toFixed(2).replace(".", ",")}</p>
                          <p>Mínimo: R$ {minPrice.toFixed(2).replace(".", ",")}</p>
                          <p>Média: R$ {avgPrice.toFixed(2).replace(".", ",")}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => {
                  if (value === "maxPrice") {
                    return 'Maior Preço'
                  }
                  else if (value === "minPrice") {
                    return 'Menor Preço'
                  }
                }
                } />
                <Bar dataKey="maxPrice" fill="#5C6BC0" radius={[5, 5, 0, 0]} />
                <Bar dataKey="minPrice" fill="#81C784" radius={[5, 5, 0, 0]} />
                <Line dataKey="avgPrice" stroke="#FF7043" dot={false} activeDot={{ r: 8 }} />
              </BarChart>
            </ResponsiveContainer>

          }
        </div>
      )}
    </RootLayout>
  );
};

export default Dashboard;
