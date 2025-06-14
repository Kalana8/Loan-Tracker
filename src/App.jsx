import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { Dashboard } from '@/components/Dashboard';
import { CustomerList } from '@/components/CustomerList';
import { LoanList } from '@/components/LoanList';
import { LoanDetails } from '@/components/LoanDetails';
import { DuePayments } from '@/components/DuePayments';
import { BottomNavigation } from '@/components/BottomNavigation';
import { LoginScreen } from '@/components/LoginScreen'; 
import { motion } from 'framer-motion';
import { Building2, Users, CreditCard, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

function App() {
  const { 
    customers, 
    loans, 
    payments, 
    loading: dataLoading, 
    handleAddCustomer, 
    handleUpdateCustomer, 
    handleDeleteCustomer,
    handleAddLoan,
    handleUpdateLoan,
    handleCloseLoan,
    handleAddPayment,
    handleUpdatePayment,
    getLoanPayments
  } = useData();

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);

    setTimeout(() => {
      setAppLoading(false);
    }, 1500); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleViewLoan = (loan) => {
    setSelectedLoan(loan);
    setActiveTab('loan-details');
  };

  const getSelectedCustomer = () => {
    if (!selectedLoan) return null;
    return customers.find(c => c.id === selectedLoan.customer_id);
  };

  const handleTabChange = (tabValue) => {
    if (tabValue === 'loan-details' && !selectedLoan) {
      setActiveTab(activeTab === 'loan-details' ? 'loans' : activeTab);
      return;
    }
    setActiveTab(tabValue);
  };

  if (appLoading || dataLoading) {
    return (
      <div className="min-h-screen gradient-bg flex flex-col items-center justify-center text-white">
        <Loader2 className="h-16 w-16 animate-spin mb-4" />
        <p className="text-xl">{appLoading ? 'Initializing App...' : 'Loading Loan Data...'}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen gradient-bg pb-16 md:pb-0">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3">
            <Building2 className="h-8 w-8 sm:h-10 sm:w-10" />
            Micro Loan Tracker
          </h1>
          <p className="text-white/80 text-sm sm:text-lg">
            Welcome, Chamika! Manage customers, loans, and payments.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-3 sm:p-6"
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            {!isMobile && (
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="loans" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Loans
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Due Payments
                </TabsTrigger>
                <TabsTrigger 
                  value="loan-details" 
                  className="flex items-center gap-2"
                  disabled={!selectedLoan}
                >
                  <CreditCard className="h-4 w-4" />
                  Loan Details
                </TabsTrigger>
              </TabsList>
            )}

            <TabsContent value="dashboard">
              <Dashboard 
                customers={customers}
                loans={loans}
                payments={payments}
              />
            </TabsContent>

            <TabsContent value="customers">
              <CustomerList
                customers={customers}
                onAddCustomer={handleAddCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
              />
            </TabsContent>

            <TabsContent value="loans">
              <LoanList
                loans={loans}
                customers={customers}
                payments={payments}
                onAddLoan={handleAddLoan}
                onViewLoan={handleViewLoan}
              />
            </TabsContent>

            <TabsContent value="payments">
              <DuePayments
                payments={payments}
                customers={customers}
                loans={loans}
                onUpdatePayment={handleUpdatePayment}
              />
            </TabsContent>

            <TabsContent value="loan-details">
              {selectedLoan && getSelectedCustomer() ? (
                <LoanDetails
                  loan={selectedLoan}
                  customer={getSelectedCustomer()}
                  payments={getLoanPayments(selectedLoan.id)}
                  onBack={() => setActiveTab('loans')}
                  onAddPayment={handleAddPayment}
                  onUpdatePayment={handleUpdatePayment}
                  onCloseLoan={handleCloseLoan}
                  onUpdateLoan={handleUpdateLoan}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No loan selected.</p>
                  <p className="text-gray-400 mt-2">Please select a loan from the Loans tab to view details.</p>
                  <button 
                    onClick={() => setActiveTab('loans')} 
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Go to Loans
                  </button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      {isMobile && (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          selectedLoan={selectedLoan}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;