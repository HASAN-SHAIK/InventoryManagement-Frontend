import React from "react";
import StatBox from "../../common/StatBox/StatBox";
import TableComponent from "../../common/TableComponent/TableComponent";
import { useState, useEffect } from "react";
import "./DashboardOverview.css";
import api from "../../../utils/axios";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";



const DashboardOverview = ({navigate}) => {
  const sellingColumns = ["Name", "Price", "Company","Profit", "NoOfSold"];
  const profitColumns = ["Name", "Price", "Seller", "Company", "NoOfSold"];
  const stockColumns = ["ProductId","Name", "ActualPrice", "Seller","Quantity", "TimeForDelivery"];
  const [isLoading, setIsLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({});
  const [lastMonthStats, setLastMonthStats] = useState({});
  const [mostSellingTable, setMostSellingTable] = useState([]);
  const [profitByProductTable, setProfitByProduct] = useState([]);
  const [inventoryData, setInventoryData] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try{
      const [daily, monthly, inventory] = await Promise.all([
        api.get(`/reports/daily`).then(res => res.data),
        api.get(`/reports/sales`).then(res => res.data),
        api.get(`/reports/inventory`).then(res => res.data)
      ]);
  
      if(!daily.message)
      setTodayStats({
        revenue: daily.total_revenue,
        profit: daily.profit,
        orders: daily.total_orders
      });
      if(!monthly.message)
      setLastMonthStats({
        revenue: monthly.total_revenue,
        profit: monthly.totalProfit,
        orders: monthly.total_orders
      });
  
      setMostSellingTable(monthly.bestSellingProducts);
      setProfitByProduct(monthly.profitByProduct);
  
      setInventoryData({
        totalStock: inventory.total_stock,
        lowStockProducts: inventory.low_stock_products,
        outOfStockProducts: inventory.out_of_stock_products,
        totalValue: inventory.total_inventory_value,
        actualValue: inventory.total_inventory_actual_value,
        estimatedProfit: inventory.estimatedProfit
      });
    }
    catch(err){
      if(err.response.data.message === "Invalid Token" || err.response.status === 400){
        alert("Token Expired Please Login Again!!");
        navigate('/login');
      }
      console.log(err)
    }
    };
  
    fetchDashboardData().then(()=>setIsLoading(false));
  }, []);

  return (
    <div className="dashboard">
      {/* <div className="floating-shape circle red"></div>
      <div className="floating-shape triangle purple"></div>
      <div className="floating-shape square yellow"></div>
      <div className="floating-shape wave pink"></div>
      <div className="floating-shape ring orange"></div>
      <div className="floating-shape cube green"></div>
      <div className="floating-shape logincube green"></div>
      <div className="floating-shape logincircle red"></div> */}
     {/* Navbar */}
    {
         isLoading ?
         <LoadingSpinner />
        :
    
<>
    { 
    
      <div className="stat-row">
        {todayStats.revenue >=0 && <StatBox label="Today's Revenue" value={todayStats.revenue || 0} />}
        {todayStats.profit >=0 && <StatBox label="Today's Profit" value={todayStats.profit || 0} />}
        {todayStats.orders >=0 && <StatBox label="Today's Orders" value={todayStats.orders || 0} /> }
        {lastMonthStats.revenue >=0 && <StatBox label="Last Month Revenue" value={lastMonthStats.revenue || 0} />}
        {lastMonthStats.profit >=0 && <StatBox label="Last Month Profit" value={lastMonthStats.profit || 0} />}
        {lastMonthStats.orders >=0 &&<StatBox label="Last Month Orders" value={lastMonthStats.orders || 0} />}
      </div>}

      {/* <div className="stat-row">
        <StatBox label="Last Month Revenue" value={lastMonthStats.revenue || 0} />
        <StatBox label="Last Month Profit" value={lastMonthStats.profit || 0} />
        <StatBox label="Last Month Orders" value={lastMonthStats.orders || 0} />
      </div> */}

      <div className="tables-section row">
        {mostSellingTable &&mostSellingTable.length >0 && <TableComponent title="Most Selling Products" columns={sellingColumns} data={mostSellingTable} />}
        {profitByProductTable && profitByProductTable.length > 0 && <TableComponent title="Most Profitable Products" columns={profitColumns} data={profitByProductTable} />}
        {inventoryData.outOfStockProducts && inventoryData.outOfStockProducts.length > 0 && <TableComponent color='red' title="Out of Stock Products" columns={stockColumns} data={inventoryData.outOfStockProducts} />}
        {inventoryData.lowStockProducts && inventoryData.lowStockProducts.length > 0 && <TableComponent color='orange' title="Low on Stock" columns={stockColumns} data={inventoryData.lowStockProducts} />}
      </div>

      <div className="summary-row">
        <StatBox label="Total Products" value={inventoryData.totalStock} />
        {inventoryData.totalValue && <StatBox label="Cost of Stock" value={inventoryData.totalValue} />}
        {inventoryData.estimatedProfit && <StatBox label="Estimated Profit" value={inventoryData.estimatedProfit}/>}
      </div>

      </>
}
</div>
  );
};

export default DashboardOverview;