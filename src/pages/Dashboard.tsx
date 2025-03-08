import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Financial Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Balance"
            value="$12,345.67"
            change="+15.3%"
            isPositive={true}
            icon={<Wallet className="h-6 w-6" />}
          />
          <StatCard
            title="Monthly Revenue"
            value="$2,890.00"
            change="+8.1%"
            isPositive={true}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatCard
            title="Active Investments"
            value="5"
            change="-2"
            isPositive={false}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        <div className="card h-[400px]">
          <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={{ fill: '#0EA5E9' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, change, isPositive, icon }: {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="card"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className="p-2 bg-gray-700/50 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="flex items-center mt-4">
      {isPositive ? (
        <ArrowUpRight className="h-4 w-4 text-green-400" />
      ) : (
        <ArrowDownRight className="h-4 w-4 text-red-400" />
      )}
      <span className={`ml-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </span>
    </div>
  </motion.div>
);

export default Dashboard;