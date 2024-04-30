import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
  }
  function deleteCategory(category) {
    swal.fire({
      title: 'ნამდვილად გსურთ კატეგორიის წაშლა?',
      text: `გინდათ წაშალოთ: ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'დახურვა',
      confirmButtonText: 'წაშლა',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id);
        fetchCategories();
      }
    });
  }
  return (
    <Layout>
      <h1>კატეგორიები</h1>
      <label>
        {editedCategory
          ? `${editedCategory.name} - რედაქტირება`
          : 'ახალი კატეგორიის შექმნა'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'კატეგორიის სახელი'}
            onChange={ev => setName(ev.target.value)}
            value={name} />
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
              }}
              className="btn-default">დაბრუნება</button>
          )}
          <button type="submit"
            className="btn-primary py-1">
            კატეგორიის დამახსოვრება
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>კატეგორიის სახელი</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 && categories.map(category => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default mr-1"
                  >
                    რედაქტირება
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="btn-red">წაშლა</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
