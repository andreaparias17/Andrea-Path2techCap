import { useParams } from "react-router-dom";

export default function Product() {
  const { id } = useParams(); 

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Product Details</h1>
      <p className="mt-2 text-gray-600">
        This is a placeholder for product <span className="font-mono">{id}</span>.
      </p>
    </div>
  );
}
