import React, { useEffect, useState } from 'react';
import './TransactionsPage.css';
import api from '../../utils/axios';
import InfoCard from '../common/InfoCard/InfoCard';
import BadgeStatus from '../common/BadgeStatus/BadgeStatus';
import HighlightedTable from '../common/HighlightedTable/HighLightedTable';
import TableComponent from '../common/TableComponent/TableComponent';



const TransactionsPage = ({navigate}) => {
  const [transactions, setTransactions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchTransactions().then(()=> setIsLoading(false));
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (err) {
          if(err.response.data.message === 'Invalid Token' || err.response.status === '400' || err.response.status == '401' || err.response.status === '403'){
      alert("Token Expired Please Login Again!");
      navigate('/login');
    }
    else{
      console.error('Error fetching transactions:', err);
    }
    }
  };

  return (
    isLoading ? 
    <div className=' mt-5 d-flex justify-content-center align-items-center'>
    <div class="text-center spinner-border" role="status"></div> 
    </div>
   :
   <div style={{background:'linear-gradient(to right top, #6ba0f6, #0c52bb)'}}>
    <div className="container-fluid  pt-4 transactions-page">
      {/* <h2 className="mb-4 brand-title">Transactions</h2> */}
    { !transactions ? 'Loading...' : <>
      <div className="row mb-4">
        {transactions && transactions.total_income && <InfoCard title="Total Revenue" value={transactions&&transactions.total_income} icon="bi text-info bi-bank fs-1" />}
        {transactions && transactions.total_cash && <InfoCard title="Total Cash"  value={transactions&&transactions.total_cash} icon="bi text-light bi-cash-stack fs-1" />}
        {transactions && transactions.total_online && <InfoCard title="Total Online" value={transactions&&transactions.total_online} icon="bi text-primary bi-phone-flip fs-1" />}
        <InfoCard title="Total Transactions" value={transactions && transactions.transactions.length} icon="bi bi-arrow-down-up text-warning fs-1" />
        <InfoCard title="Success Rate" value="100%" icon="bi bi-hand-thumbs-up text-success fs-1" />
      </div>
      <HighlightedTable
        title={'Transactions'}
        columns={['OrderId', 'User', 'Amount(Mode)','Type', 'Status', 'Date']}
        data={transactions.transactions && transactions.transactions.map(txn => ({
          OrderId: txn.order_id,
          User: txn.user,
          'Amount(Mode)': `₹${txn.total_price}(${txn.payment_mode})`,
          Type: txn.transaction_type,
          Status: <BadgeStatus status={txn.order_status} />,
          Date: new Date(txn.transaction_date).toLocaleDateString()
        }))}
      // <HighlightedTable
      //   columns={['OrderId', 'User', 'Amount(Mode)','Type', 'Status', 'Date']}
      //   data={transactions.transactions && transactions.transactions.map(txn => ({
      //     OrderId: txn.order_id,
      //     User: txn.user,
      //     'Amount(Mode)': `₹${txn.total_price}(${txn.payment_mode})`,
      //     Type: txn.transaction_type,
      //     Status: <BadgeStatus status={txn.order_status} />,
      //     Date: new Date(txn.transaction_date).toLocaleDateString()
      //   }))}
      />
      </>
  }
    </div>
      </div>
  );
};

export default TransactionsPage;