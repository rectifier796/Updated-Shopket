import React from 'react'
import Layout from '../components/Layout/Layout'

function Policy() {
  return (
    <Layout>
    <div className="row contactus ">
      <div className="col-md-6 ">
        <img
          src="/images/contactus.jpeg"
          alt="contactus"
          style={{ width: "100%" }}
        />
      </div>
      <div className="col-md-4">
        <p style={{fontWeight:"600"}}>1. Users must provide accurate shipping addresses and contact information for order delivery.</p>
        <p style={{fontWeight:"600"}}>2. Users must make payment for the orders in a timely manner and comply with the accepted payment methods and terms</p>
        <p style={{fontWeight:"600"}}>3. Any fraudulent or unauthorized payment activities will be reported to the appropriate authorities.</p>
        <p style={{fontWeight:"600"}}>4. The estimated delivery times provided are approximate and may be subject to factors beyond your control, such as shipping carriers or customs procedures.</p>
        <p style={{fontWeight:"600"}}>5. Users should review and comply with any shipping restrictions or guidelines, including those related to international shipments or hazardous materials.</p>
      </div>
    </div>
  </Layout>
  )
}

export default Policy