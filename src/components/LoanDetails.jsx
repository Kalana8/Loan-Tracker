import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PaymentForm } from '@/components/PaymentForm';
import { formatDate, getNextMonthDate } from '@/utils/dateUtils';
import { calculateMonthlyInterest, calculateTotalInterestPaid, getLoanStatus, generatePaymentId } from '@/utils/loanUtils';
import { formatCurrency } from '@/utils/currencyUtils';
import { LoanForm } from '@/components/LoanForm';


export function LoanDetails({ loan, customer, payments, onBack, onAddPayment, onUpdatePayment, onCloseLoan, onUpdateLoan }) {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const monthlyInterest = calculateMonthlyInterest(loan.loan_amount, loan.interest_rate);
  const totalInterestPaid = calculateTotalInterestPaid(payments);
  const status = getLoanStatus(loan, payments);

  const handleRecordPayment = (paymentData) => {
    if (selectedPayment) {
      onUpdatePayment(paymentData);
    } else {
      onAddPayment(paymentData);
    }
    setSelectedPayment(null);
  };

  const handleCloseLoanAction = () => {
    if (window.confirm('Are you sure you want to mark this loan as fully paid?')) {
      onCloseLoan(loan.id);
    }
  };

  const generateNextPayment = () => {
    const lastPayment = payments.sort((a,b) => new Date(b.due_date) - new Date(a.due_date))[0];
    const nextDueDate = lastPayment 
      ? getNextMonthDate(lastPayment.due_date)
      : getNextMonthDate(loan.start_date);

    const newPayment = {
      id: generatePaymentId(),
      loanId: loan.id, 
      amount: monthlyInterest,
      dueDate: nextDueDate,
      status: 'pending',
      type: 'interest',
      created_at: new Date().toISOString()
    };

    onAddPayment(newPayment);
  };

  const getPaymentStatusIcon = (payment) => {
    if (payment.status === 'paid') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (new Date(payment.due_date) < new Date() && payment.status !== 'paid') {
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
    return <Clock className="h-4 w-4 text-yellow-600" />;
  };

  const getPaymentStatusColor = (payment) => {
    if (payment.status === 'paid') return 'status-paid';
    if (new Date(payment.due_date) < new Date() && payment.status !== 'paid') return 'status-overdue';
    return 'status-pending';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Loans
        </Button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Loan Details - {customer.name}
        </h2>
        <Button
          variant="outline"
          className="ml-auto border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={() => setShowEditForm(true)}
        >
          Edit Loan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Loan Information
                <Badge className={getPaymentStatusColor({ status, due_date: new Date() })}>
                  {status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Customer:</span>
                  <span className="font-semibold">{customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">{formatCurrency(loan.loan_amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">{loan.interest_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Interest:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(monthlyInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Start Date:</span>
                  <span className="font-semibold">{formatDate(loan.start_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Interest Paid:</span>
                  <span className="font-semibold text-blue-600">${totalInterestPaid.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <Button 
                  onClick={generateNextPayment}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={loan.status === 'fully_paid'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Entry
                </Button>
                {loan.status !== 'fully_paid' && (
                  <Button 
                    onClick={handleCloseLoanAction}
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Mark as Fully Paid
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payments recorded yet
                  </div>
                ) : (
                  payments.sort((a,b) => new Date(a.due_date) - new Date(b.due_date)).map((payment, index) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-white/50"
                    >
                      <div className="flex items-center space-x-3">
                        {getPaymentStatusIcon(payment)}
                        <div>
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                          <div className="text-sm text-gray-600">
                            Due: {formatDate(payment.due_date)}
                          </div>
                          {payment.payment_date && (
                            <div className="text-sm text-green-600">
                              Paid: {formatDate(payment.payment_date)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPaymentStatusColor(payment)}>
                          {payment.status === 'paid' ? 'Paid' : 
                           new Date(payment.due_date) < new Date() && payment.status !== 'paid' ? 'Overdue' : 'Pending'}
                        </Badge>
                        {payment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowPaymentForm(true);
                            }}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            Record Payment
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <PaymentForm
        open={showPaymentForm}
        onOpenChange={(openStatus) => {
          setShowPaymentForm(openStatus);
          if (!openStatus) setSelectedPayment(null);
        }}
        onSubmit={handleRecordPayment}
        payment={selectedPayment}
      />

      <LoanForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        onSubmit={onUpdateLoan}
        customers={[customer]}
        loan={loan}
      />
    </div>
  );
}
