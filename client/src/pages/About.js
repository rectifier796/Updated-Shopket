import React from 'react'
import Layout from '../components/Layout/Layout'

function About() {
  return (
    <Layout title={"About us - Ecommerce app"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/about.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p className="text-justify mt-2">
            This is an e-commerce website build by Ayush Singh (currently persuing B.tech in CSE from IIIT Vaodara).
            The primary purpose of our e-commerce website is to provide a platform for users to browse and purchase products conveniently from the comfort of their own homes. The website offers a wide range of products across various categories, ensuring that customers can find what they need easily. The intuitive user interface and smooth navigation enhance the overall shopping experience.
            Additionally, our e-commerce website incorporates various administrative functionalities. Admin users have access to a dashboard that allows them to manage products, track inventory, process orders, and generate reports. This functionality provides comprehensive control and analysis of the e-commerce operations.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default About