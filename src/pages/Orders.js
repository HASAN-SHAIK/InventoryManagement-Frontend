import React from 'react'
import OrdersPage from '../components/OrdersPage/OrdersPage'

export default function Orders({userRole, navigate}) {
  return (
    <div className='container-fluid'>
        <OrdersPage navigate={navigate} userRole={userRole}/>
    </div>
  )
}
