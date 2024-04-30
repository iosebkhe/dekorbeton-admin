import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const prId = router.query.id?.[0];

  useEffect(() => {
    if (!prId) {
      return;
    }
    axios.get('/api/products?id=' + prId).then(response => {
      const product = response.data.find(product => product._id === prId);
      setProductInfo(product);
    });
  }, [prId]);

  function goBack() {
    router.push('/products');
  }

  async function deleteProduct() {
    await axios.delete('/api/products?id=' + prId);
    goBack();
  }

  return (
    <Layout>
      <h1 className="text-center">გსურთ წაშალოთ
        &nbsp;&quot;{productInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteProduct}
          className="btn-red">წაშლა</button>
        <button
          className="btn-default"
          onClick={goBack}>
          უკან დაბრუნება
        </button>
      </div>
    </Layout>
  );
}
