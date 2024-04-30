/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";

export default function ProductForm({
  _id,
  title: existingTitle,
  fullDescription: existingFullDescription,
  categories: assignedCategories,
  cardImage: existingCardImage,
  price: existingPrice,
  // discountedPrice: existingDiscountedPrice,
  // hasDiscount: existingHasDiscount
}) {
  // const assignedCategoryIds = assignedCategories.map(category => category._id);

  const [title, setTitle] = useState(existingTitle || '');
  const [fullDescription, setFullDescription] = useState(existingFullDescription || "");
  const [categories, setCategories] = useState(() => {
    if (assignedCategories) {
      return assignedCategories;
    } else {
      return [];
    }
  });
  const [cardImage, setCardImage] = useState(existingCardImage || "");
  const [price, setPrice] = useState(existingPrice || '');
  // const [discountedPrice, setDiscountedPrice] = useState(existingDiscountedPrice || "");
  // const [hasDiscount, setHasDiscount] = useState(existingHasDiscount || false);

  const [goToProducts, setGoToProducts] = useState(false);
  const [isCardImageUploading, setIsCardImageUploading] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setFetchedCategories(result.data);
    });
  }, []);

  const handleCategoryChange = (categoryId) => {
    // Find the category object based on the categoryId
    const category = fetchedCategories.find((cat) => cat._id === categoryId);

    if (!category) {
      // Handle the case where the category is not found (optional)
      console.error('Category not found:', categoryId);
      return;
    }

    if (categories.find((cat) => cat._id === categoryId)) {
      // Category is already selected, so remove it
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat._id !== categoryId)
      );
    } else {
      // Category is not selected, so add it
      setCategories([...categories, category]);
    }
  };

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      fullDescription,
      categories,
      cardImage,
      price,
    };
    if (_id) {
      //update
      await axios.put('/api/products', { ...data, _id });
    } else {
      //create
      await axios.post('/api/products', data);
    }

    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push('/products');
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setCardImage(res.data.link);
      setIsCardImageUploading(false);
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label className="mb-3 inline-block">პროდუქტის სახელი</label>
      <input
        type="text"
        placeholder="პროდუქტის სახელი"
        value={title}
        onChange={ev => setTitle(ev.target.value)} />

      <label className="my-3 inline-block">კატეგორიები</label>
      <div className="grid grid-cols-4 gap-2 p-3 shadow-lg max-h-32 overflow-auto mb-5">
        {fetchedCategories.map((category) => (

          <div key={category._id}>
            <label className="flex items-center gap-1 text-base">
              {category.name}
              <input
                className="w-auto p-0 m-0"
                type="checkbox"
                value={category._id}
                defaultChecked={categories.find((cat) => cat._id === category._id)}
                onChange={(ev) => handleCategoryChange(category._id)}
              />
            </label>
          </div>
        ))}
      </div>

      <label className="mb-3 inline-block">
        მთავარი ფოტო
      </label>
      <div className="mb-2 flex flex-wrap gap-1">
        {cardImage.length > 0 &&
          <div className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
            <img src={cardImage} alt="" className="rounded-lg" />
          </div>}
        {isCardImageUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            ატვირთვა
          </div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <div>
        <label className="mb-3 inline-block">ფასი</label>
        <input
          type="number"
          placeholder="ფასი"
          value={price}
          onChange={ev => setPrice(ev.target.value)}
        />
      </div>



      {/* <div className="flex items-center justify-between gap-2">
          <div>
            <label className="mr-2">ფასდაკლება</label>
            <input
              className="w-auto m-0 p-0"
              type="checkbox"
              checked={hasDiscount}
              onChange={(ev) => {
                setHasDiscount(ev.target.checked);
                if (!ev.target.checked) {
                  setDiscountedPrice(''); // Reset to an empty string when unchecked
                }
              }}
            />
          </div>


          {hasDiscount &&
            <div>
              <label className="mb-3 inline-block">ფასდაკლებული ფასი</label>
              <input
                type="number"
                placeholder="ფასდაკლებული ფასი"
                value={discountedPrice}
                onChange={ev => setDiscountedPrice(ev.target.value)}
              />
            </div>
          }
        </div> */}

      <div>
        <label className="mb-3 inline-block">პროდუქტის აღწერა</label>
        <textarea
          placeholder="სრული აღწერა"
          value={fullDescription}
          onChange={ev => setFullDescription(ev.target.value)}
        />
      </div>


      <button
        type="submit"
        className="btn-primary">
        პროდუქტის დამატება
      </button>
    </form >
  );
}
