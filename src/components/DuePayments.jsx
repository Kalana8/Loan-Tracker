import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PaymentForm } from '@/components/PaymentForm';
import { formatDate, getDaysUntilDue } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyUtils';

export function DuePayments({ payments, customers, loans, onUpdatePayment }) {
  const [filter, setFilter] = useState('all');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);

  useEffect(() => {
    if (!payments || !Array.isArray(payments)) {
      console.log('No payments data available');
      setFilteredPayments([]);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    const filtered = payments.filter(payment => {
      if (!payment || !payment.dueDate) return false;

      const dueDate = new Date(payment.dueDate);
      if (isNaN(dueDate.getTime())) return false;

      switch (filter) {
        case 'due_today':
          return dueDate.toDateString() === today.toDateString();
        case 'this_week':
          return dueDate >= today && dueDate <= oneWeekFromNow;
        case 'overdue':
          return dueDate < today && payment.status !== 'paid';
        case 'paid':
          return payment.status === 'paid';
        default: // 'all'
          return true;
      }
    }).sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });

    console.log('Filter:', filter);
    console.log('Filtered payments:', filtered);
    setFilteredPayments(filtered);
  }, [payments, filter]);

  const getCustomerName = (loanId) => {
    const loan = loans?.find(l => l.id === loanId);
    if (!loan) return 'Unknown';
    const customer = customers?.find(c => c.id === loan.customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const getPaymentStatusIcon = (payment) => {
    const dueDate = new Date(payment.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (payment.status === 'paid') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (dueDate < today) {
      return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  const getPaymentStatusColor = (payment) => {
    const dueDate = new Date(payment.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (payment.status === 'paid') return 'bg-green-100 text-green-800';
    if (dueDate < today) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getPaymentStatusText = (payment) => {
    if (payment.status === 'paid') return 'Paid';
    
    const dueDate = new Date(payment.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue (${Math.abs(diffDays)}d)`;
    if (diffDays === 0) return 'Due Today';
    return `Due in ${diffDays}d`;
  };

  const handleRecordPayment = (paymentData) => {
    onUpdatePayment(paymentData);
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Due Payments
        </h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter payments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="due_today">Due Today</SelectItem>
            <SelectItem value="this_week">This Week</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No payments found for the selected filter.
          </div>
        ) : (
          filteredPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-gradient border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      {getPaymentStatusIcon(payment)}
                      <div>
                        <div className="font-semibold text-md sm:text-lg text-gray-900">
                          {getCustomerName(payment.loanId)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Due: {formatDate(payment.dueDate)}
                        </div>
                        {payment.paymentDate && payment.status === 'paid' && (
                          <div className="text-xs sm:text-sm text-green-600">
                            Paid: {formatDate(payment.paymentDate)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:space-x-4 w-full sm:w-auto">
                      <div className="text-right w-full sm:w-auto">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                        <Badge className={`${getPaymentStatusColor(payment)} text-xs`}>
                          {getPaymentStatusText(payment)}
                        </Badge>
                      </div>
                      
                      {payment.status !== 'paid' && (
                        <Button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowPaymentForm(true);
                          }}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 w-full sm:w-auto text-xs sm:text-sm"
                          size="sm"
                        >
                          Record Payment
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <PaymentForm
        open={showPaymentForm}
        onOpenChange={(open) => {
          setShowPaymentForm(open);
          if (!open) setSelectedPayment(null);
        }}
        onSubmit={handleRecordPayment}
        payment={selectedPayment}
      />
    </div>
  );
}
