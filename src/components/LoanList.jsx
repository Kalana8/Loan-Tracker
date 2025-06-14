import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoanForm } from '@/components/LoanForm';
import { formatDate } from '@/utils/dateUtils';
import { calculateMonthlyInterest, getLoanStatus } from '@/utils/loanUtils';
import { formatCurrency } from '@/utils/currencyUtils';

export function LoanList({ loans, customers, payments, onAddLoan, onViewLoan }) {
  const [showForm, setShowForm] = useState(false);

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getLoanPayments = (loanId) => {
    return payments.filter(p => p.loan_id === loanId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Fully Paid': return 'status-paid';
      case 'Overdue': return 'status-overdue';
      default: return 'status-pending';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Loan Management
        </h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Loan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loans.map((loan, index) => {
          const loanPayments = getLoanPayments(loan.id);
          const status = getLoanStatus(loan, loanPayments);
          
          const loanAmount = loan.loan_amount !== undefined && loan.loan_amount !== null ? loan.loan_amount : 0;
          const interestRate = loan.interest_rate !== undefined && loan.interest_rate !== null ? loan.interest_rate : 0;
          const monthlyInterest = calculateMonthlyInterest(loanAmount, interestRate);
          
          return (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-gradient border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-md sm:text-lg font-semibold text-gray-900">
                      {getCustomerName(loan.customer_id)}
                    </CardTitle>
                    <Badge className={`${getStatusColor(status)} text-xs`}>
                      {status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Loan Amount:</span>
                      <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Interest Rate:</span>
                      <span className="font-semibold">{interestRate}%</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Monthly Interest:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(monthlyInterest)}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-semibold">{loan.start_date ? formatDate(loan.start_date) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-end space-x-2 pt-3 sm:pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewLoan(loan)}
                        className="hover:bg-blue-50"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {loans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No loans found</div>
          <p className="text-gray-400 mt-2">Create your first loan to get started</p>
        </div>
      )}

      <LoanForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={onAddLoan}
        customers={customers.filter(c => c.status === 'active')}
      />
    </div>
  );
}
