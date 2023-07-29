import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import { json, useNavigate, useParams } from 'react-router-dom';
import { Select } from 'antd';

const { Option } = Select;



const UpdateProduct = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [photo, setPhoto] = useState("");
    const [id,setId]=useState("");

    const navigate = useNavigate();
    const params=useParams();

    //get single product
    const getSingleProduct=async()=>{
        try {
            const {data}=await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setName(data.product.name);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setCategory(data.product.category?._id);
            setShipping(data.product.shipping);
            setId(data.product._id);

        } catch (error) {
            console.log(error);
            toast.success("Error Occurred !!!");
        }
    }

    useEffect(()=>{
        getSingleProduct();
        //eslint-disable-next-line
    },[]);


    // get all category
    const getAllCategory = async () => {
        try {
            const { data } = await axios.get("/api/v1/category/get-category");
            if (data?.success) {
                setCategories(data?.category);
            }
        }
        catch (error) {
            console.log(error);
            toast.error('Something went wrong while fetching category');
        }
    }

    useEffect(() => {
        getAllCategory();
    }, []);

    // create product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category);

            const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData);
            console.log(data)
            if (data?.success) {
                navigate("/dashboard/admin/products");
                toast.success("Product Updated Successfully");
            }
            else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something Went Wrong');
        }
    }

    // Delete product
    const handleDelete=async()=>{
        try {
            let answer=window.prompt("Are You Sure want to delete this product ?");
            if(!answer) return;
            const {data} = await axios.delete(`/api/v1/product/delete-product/${id}`);
            toast.success(data?.message);
            navigate("/dashboard/admin/products");
        } catch (error) {
            console.log(error);
            toast.error("Something Went wrong - Client Side");
        }
    }

  return (
      <Layout title={"Dashboard - Create Product"}>
          <div className='container-fluid m-3 p-3'>
              <div className='row'>
                  <div className='col-md-3'>
                      <AdminMenu />
                  </div>
                  <div className='col-md-9'>
                      <h1>Update Product</h1>
                      <div className='m-1 w-75'>
                          <Select bordered={false} placeholder="Select a category" size='large' showSearch
                              className='form-select mb-3' onChange={(value) => { setCategory(value) }} value={category}>
                              {categories?.map(c => {
                                  return (
                                      <Option key={c._id} value={c._id}>{c.name}</Option>
                                  )
                              })}
                          </Select>
                          <div className='mb-3'>
                              <label className='btn btn-outline-secondary col-md-12'>
                                  {photo ? photo.name : "Upload Photo"}
                                  <input type='file' name='photo' accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} hidden />
                              </label>
                          </div>
                          <div className='mb-3'>
                              {photo ? (
                                  <div className='text-center'>
                                      <img src={URL.createObjectURL(photo)} alt='product_photo' height={"200px"}
                                          className='img img-responsive' />
                                  </div>
                              ) : (
                                  <div className='text-center'>
                                      <img src={`/api/v1/product/product-photo/${id}`} alt='product_photo' height={"200px"}
                                          className='img img-responsive' />
                                  </div>
                              ) }
                          </div>
                          <div className='mb-3'>
                              <input type='text' value={name} placeholder='Write product name' className='form-control' onChange={(e) => setName(e.target.value)} />
                          </div>
                          <div className='mb-3'>
                              <textarea type='text' value={description} placeholder='Write product description' className='form-control' onChange={(e) => setDescription(e.target.value)} />
                          </div>
                          <div className='mb-3'>
                              <input type='text' value={price} placeholder='Write product price' className='form-control' onChange={(e) => setPrice(e.target.value)} />
                          </div>
                          <div className='mb-3'>
                              <input type='text' value={quantity} placeholder='Write product quantity' className='form-control' onChange={(e) => setQuantity(e.target.value)} />
                          </div>
                          <div className='mb-3'>
                              <Select bordered={false} placeholder="Select Shipping" size='large' showSearch className='form-select mb-3' onChange={(value) => { setShipping(value) }} value={shipping?"Yes":"No"}>
                                  <Option value='0'>No</Option>
                                  <Option value='1'>Yes</Option>
                              </Select>
                          </div>
                          <div className='mb-3'>
                              <button className='btn btn-primary' onClick={handleUpdate}>UPDATE PRODUCT</button>
                          </div>
                          <div className='mb-3'>
                              <button className='btn btn-danger' onClick={handleDelete}>DELETE PRODUCT</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </Layout>
  )
}

export default UpdateProduct