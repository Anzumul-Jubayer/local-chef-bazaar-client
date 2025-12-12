import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PlatformStatistics = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [ordersData, setOrdersData] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);

  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    // Fetch total users
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((usersArray) => {
        setTotalUsers(usersArray.length);
      })
      .catch((err) => console.error(err));

    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((data) => {
        const orders = data.data;
        setOrdersData(orders);

        const total = orders.reduce(
          (sum, order) => sum + (order.paymentInfo?.amount || 0),
          0
        );
        console.log(total)
        setTotalPayment(total);
      });
  }, []);

  const orderStats = [
    {
      name: "Pending",
      value: ordersData.filter((o) => o.orderStatus !== "delivered").length,
    },
    {
      name: "Delivered",
      value: ordersData.filter((o) => o.orderStatus === "delivered").length,
    },
  ];

  return (
    <>
    <Helmet>
      <title>Platform Statistics | Local chef Bazar</title>
    </Helmet>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Platform Statistics</h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 bg-blue-100 rounded shadow">
            <h3 className="text-lg font-semibold text-blue-800">Total Users</h3>
            <p className="text-2xl font-bold text-blue-900">{totalUsers}</p>
          </div>
          <div className="p-4 bg-green-100 rounded shadow">
            <h3 className="text-lg font-semibold text-green-800">
              Total Payment ($)
            </h3>
            <p className="text-2xl font-bold text-green-900">{totalPayment}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow">
            <h3 className="text-lg font-semibold text-yellow-800">Orders</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {ordersData.length}
            </p>
          </div>
        </div>

        {/* Orders Pie Chart */}
        <div className="flex justify-around">
          <PieChart width={400} height={300}>
            <Pie
              data={orderStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {orderStats.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          {/* Payment Bar Chart */}
          <BarChart
            width={400}
            height={300}
            data={[{ name: "Payments", amount: totalPayment }]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </>
  );
};

export default PlatformStatistics;
