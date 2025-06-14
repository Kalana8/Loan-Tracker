import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, CreditCard, Calendar } from 'lucide-react';

const navItems = [
  { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { value: 'customers', label: 'Customers', icon: Users },
  { value: 'loans', label: 'Loans', icon: CreditCard },
  { value: 'payments', label: 'Due', icon: Calendar },
];

export function BottomNavigation({ activeTab, onTabChange, selectedLoan }) {
  const handleTabChange = (tabValue) => {
    if (tabValue === 'loan-details' && !selectedLoan) {
      return; 
    }
    onTabChange(tabValue);
  };

  return (
    <motion.nav
      className="bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {navItems.map((item) => (
        <button
          key={item.value}
          onClick={() => handleTabChange(item.value)}
          className={`bottom-nav-item ${activeTab === item.value ? 'active' : ''}`}
        >
          <item.icon />
          <span>{item.label}</span>
        </button>
      ))}
    </motion.nav>
  );
}