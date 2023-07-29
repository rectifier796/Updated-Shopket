import "../styles/Homepage.css";

import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

const HomePage = () => {

  const [cart,setCart] = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadPage, setLoadPage] = useState(false);
  const [total, setTotal] =useState(0);
  const [page, setPage] =useState(1);

  const navigate = useNavigate();

  // get total count
  const getTotal = async()=>{
    try {
      const {data} = await axios.get('/api/v1/product/product-count');
      setTotal(data.total);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(page===1)
    return;
    loadMore();
  },[page]);

  // load More
  const loadMore=async()=>{
    try {
      setLoadPage(true);
      const {data} = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts([...products, ...data?.products]);
      setLoadPage(false);
    } catch (error) {
      console.log(error);
      setLoadPage(false);
    }
  }


  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // get all category
  const getAllCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
        setLoading(false);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    }
    else {
      all = all.filter(c => c !== id);
    }
    setChecked(all);
  }

  useEffect(() => {
    if (!checked.length || !radio.length)
      getAllProducts();
    //eslint-disable-next-line
  }, [checked.length, radio.length]);

  // get filtered product
  const filterProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/v1/product/product-filters', { checked, radio });
      setProducts(data?.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (checked.length || radio.length)
      filterProduct();
  }, [checked, radio])

  return (
    <Layout title={"Welcome to Shopket - All Products - Best Offers"}>
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}/>
      {loading ? (<div className="d-flex align-items-center justify-content-center"><div className="spinner-border text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div></div>) : (<></>)}
      <div className='row mt-3 container-fluid home-page'> 
        <div className='col-md-3 filters'>
          {/* Category Filter */}
          <h4 className='text-center'>Filter By Category</h4>
          <div className='d-flex flex-column'>
            {categories?.map((c) => (
              <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* Price Filter */}
          <h4 className='text-center mt-4'>Filter By Price</h4>
          <div className='d-flex flex-column'>
            <Radio.Group onChange={e => setRadio(e.target.value)}>
              {Prices?.map(p => {
                return (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                )
              })}
            </Radio.Group>
          </div>
          <div className='d-flex flex-column'>
            <button className='btn btn-danger' onClick={()=>window.location.reload()}>RESET FILTERS</button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => { navigate(`/product/${p.slug}`); window.scrollTo(0, 0);}}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='m-2 p-3'>
            {products && products.length <total && (
              <button className='btn loadmore' onClick={(e)=>{
                e.preventDefault();
                setPage(page+1);
              }}>
                {loadPage?"Loading...":"Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default HomePage