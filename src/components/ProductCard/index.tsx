import { ProductMetric } from "../../pages/api/product/metrics"; 
type ProductCardProps = {
  metric: ProductMetric;
};

const ProductCard = ({ metric }: ProductCardProps) => {
  return (
    <div className="product-card">
      <h3>Produto: {metric.publicId}</h3>
      <p><strong>Aumento de Preço:</strong> {metric.priceIncrease}</p>
      <p><strong>Variação de Preço:</strong> {metric.priceVariation}%</p>
      <p><strong>Preço Máximo:</strong> R${metric.maxPrice}</p>
      <p><strong>Preço Mínimo:</strong> R${metric.minPrice}</p>
    </div>
  );
};

export default ProductCard;
