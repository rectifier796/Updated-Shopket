import Layout from '../components/Layout/Layout';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import "../styles/CategoryProductStyles.css";

import { useCart } from '../context/cart';
import toast from "react-hot-toast";

const CategoryProduct = () => {

    const [cart, setCart] = useCart();


    const params = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);

    const getProductByCat = async()=>{
        try {
            const {data} = await axios.get(`/api/v1/product/product-category/${params.slug}`);
            setProducts(data?.products);
            setCategory(data?.category);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(params?.slug)
        getProductByCat();
    },[params?.slug]);

  return (
    <Layout>
        <div className='container mt-3 category'>
            <h4 className='text-center'>Category - {category?.name}</h4>
            <h6 className='text-center'>{products?.length} results found</h6>
            <div className='row'>
                  <div className='col-md-9 offset-1'>
                      <div className='d-flex flex-wrap justify-content-center'>
                          {products?.map((p) => {
                              return (
                                  <div key={p._id} className='card m-2' style={{ width: "18rem" }}>
                                      <img src={`/api/v1/product/product-photo/${p._id}`} className='card-img-top' alt={p.name} />
                                      <div className='card-body'>
                                          <h5 className='card-title'>{p.name}</h5>
                                          <p className='card-text'>{p.description.substring(0, 60)}</p>
                                          <p className='card-text'>{p.price.toLocaleString("en-IN", {
                                              style: "currency",
                                              currency: "INR",
                                          })}</p>
                                          <button className='btn btn-info ms-1' onClick={() => { navigate(`/product/${p.slug}`); window.scrollTo(0, 0); }}>More Details</button>
                                          <button className='btn btn-dark ms-1 mt-2' onClick={() => {
                                              setCart([...cart, p]);
                                              localStorage.setItem(
                                                  "cart",
                                                  JSON.stringify([...cart, p])
                                              );
                                              toast.success("Item Added to cart");
                                          }}>Add To Cart</button>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
            </div>
        </div>
    </Layout>
  )
}

export default CategoryProduct