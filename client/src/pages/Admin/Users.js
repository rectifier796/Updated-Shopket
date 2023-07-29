import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import axios from 'axios'
import { useAuth } from '../../context/auth'

const Users = () => {

    const [list, setList] = useState([]);
    const [auth, setAuth] = useAuth();

    const getAllUser = async () => {
        try {
            const { data } = await axios.get(`/api/v1/auth/user-list`);
            setList(data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (auth?.token)
            getAllUser();
    }, [])

    return (
        <Layout title={"Dashboard - All Users"}>
            <div className='container-fluid m-3 p-3 dashboard'>
                <div className='row'>
                    <div className='col-md-3'>
                        <AdminMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>All Users</h1>
                        <div className='border shadow'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th scope='col'>#</th>
                                        <th scope='col'>Name</th>
                                        <th scope='col'>Email</th>
                                        <th scope='col'>Phone</th>
                                        <th scope='col'>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list?.map((o, i) => {
                                        return (
                                            <tr>
                                                <td>{i + 1}</td>
                                                <td>{o?.name}</td>
                                                <td>{o?.email}</td>
                                                <td>{o?.phone}</td>
                                                <td>{o?.address}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default Users