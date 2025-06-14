import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { generateCustomerId, generateLoanId, generatePaymentId } from '@/utils/loanUtils';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: customersData, error: customersError } = await supabase.from('customers').select('*');
      if (customersError) throw customersError;
      setCustomers(customersData || []);

      const { data: loansData, error: loansError } = await supabase.from('loans').select('*');
      if (loansError) throw loansError;
      setLoans(loansData || []);

      const { data: paymentsData, error: paymentsError } = await supabase.from('payments').select('*');
      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Error", description: `Failed to fetch data: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddCustomer = async (customerData) => {
    const newCustomer = { 
      ...customerData, 
      id: customerData.id || generateCustomerId(),
      created_at: customerData.created_at || new Date().toISOString() 
    };
    delete newCustomer.createdAt; 

    const { data, error } = await supabase.from('customers').insert([newCustomer]).select();
    if (error) {
      console.error("Error adding customer:", error);
      toast({ title: "Error", description: `Failed to add customer: ${error.message}`, variant: "destructive" });
      return null;
    }
    if (data) {
      setCustomers(prevCustomers => [...prevCustomers, data[0]]);
      toast({ title: "Success", description: "Customer added successfully!" });
      return data[0];
    }
    return null;
  };

  const handleUpdateCustomer = async (updatedCustomer) => {
    const customerToUpdate = { ...updatedCustomer };
    delete customerToUpdate.created_at; 
    delete customerToUpdate.createdAt;

    const { data, error } = await supabase.from('customers').update(customerToUpdate).eq('id', updatedCustomer.id).select();
    if (error) {
      console.error("Error updating customer:", error);
      toast({ title: "Error", description: `Failed to update customer: ${error.message}`, variant: "destructive" });
      return;
    }
    if (data) {
      setCustomers(prevCustomers => prevCustomers.map(c => c.id === updatedCustomer.id ? data[0] : c));
      toast({ title: "Success", description: "Customer updated successfully!" });
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    const { data: customerLoans, error: fetchLoansError } = await supabase
      .from('loans')
      .select('id')
      .eq('customer_id', customerId);

    if (fetchLoansError) {
      console.error("Error fetching customer loans for deletion:", fetchLoansError);
      toast({ title: "Error", description: `Failed to fetch loans for customer: ${fetchLoansError.message}`, variant: "destructive" });
      return;
    }

    if (customerLoans && customerLoans.length > 0) {
      const loanIdsToDelete = customerLoans.map(l => l.id);
      const { error: paymentsError } = await supabase.from('payments').delete().in('loan_id', loanIdsToDelete);
      if (paymentsError) {
          console.error("Error deleting customer payments by loan_id:", paymentsError);
          toast({ title: "Error", description: `Failed to delete payments for customer's loans: ${paymentsError.message}`, variant: "destructive" });
          return;
      }
    }
    
    const { error: paymentsDirectError } = await supabase.from('payments').delete().eq('customer_id', customerId);
     if (paymentsDirectError) {
        console.error("Error deleting customer payments directly:", paymentsDirectError);
        toast({ title: "Error", description: `Failed to delete customer payments: ${paymentsDirectError.message}`, variant: "destructive" });
        return;
    }

    const { error: loansError } = await supabase.from('loans').delete().eq('customer_id', customerId);
    if (loansError) {
        console.error("Error deleting customer loans:", loansError);
        toast({ title: "Error", description: `Failed to delete customer loans: ${loansError.message}`, variant: "destructive" });
        return;
    }
    
    const { error: customerError } = await supabase.from('customers').delete().eq('id', customerId);
    if (customerError) {
        console.error("Error deleting customer:", customerError);
        toast({ title: "Error", description: `Failed to delete customer: ${customerError.message}`, variant: "destructive" });
        return;
    }
    setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== customerId));
    setLoans(prevLoans => prevLoans.filter(l => l.customer_id !== customerId));
    
    setPayments(prevPayments => prevPayments.filter(p => {
        const loanForPayment = loans.find(l => l.id === p.loan_id); 
        return loanForPayment && loanForPayment.customer_id !== customerId && p.customer_id !== customerId;
    }));
    toast({ title: "Success", description: "Customer and associated data deleted successfully!" });
  };

  const handleAddLoan = async (loanData) => {
    const customerExists = customers.find(c => c.id === loanData.customerId);
    if (!customerExists) {
        toast({ title: "Error", description: `Customer with ID ${loanData.customerId} does not exist. Please create the customer first.`, variant: "destructive" });
        return;
    }

    const newLoan = { 
      id: loanData.id || generateLoanId(),
      customer_id: loanData.customerId, 
      loan_amount: loanData.loanAmount,
      interest_rate: loanData.interestRate,
      start_date: loanData.startDate,
      status: loanData.status || 'ongoing',
      created_at: loanData.created_at || new Date().toISOString()
    };
    
    const { data, error } = await supabase.from('loans').insert([newLoan]).select();
    if (error) {
      console.error("Error adding loan:", error);
      toast({ title: "Error", description: `Failed to add loan: ${error.message}`, variant: "destructive" });
      return;
    }
    if (data) {
      setLoans(prevLoans => [...prevLoans, data[0]]);
      toast({ title: "Success", description: "Loan added successfully!" });
    }
  };

  const handleUpdateLoan = async (updatedLoan) => {
    const loanToUpdate = {
      customer_id: updatedLoan.customerId,
      loan_amount: updatedLoan.loanAmount,
      interest_rate: updatedLoan.interestRate,
      start_date: updatedLoan.startDate,
      status: updatedLoan.status,
    };
    const { data, error } = await supabase.from('loans').update(loanToUpdate).eq('id', updatedLoan.id).select();
    if (error) {
      console.error("Error updating loan:", error);
      toast({ title: "Error", description: `Failed to update loan: ${error.message}`, variant: "destructive" });
      return;
    }
    if (data) {
      setLoans(prevLoans => prevLoans.map(l => l.id === updatedLoan.id ? data[0] : l));
      toast({ title: "Success", description: "Loan updated successfully!" });
    }
  };

  const handleCloseLoan = async (loanId) => {
    const { data, error } = await supabase.from('loans').update({ status: 'fully_paid' }).eq('id', loanId).select();
    if (error) {
      console.error("Error closing loan:", error);
      toast({ title: "Error", description: `Failed to close loan: ${error.message}`, variant: "destructive" });
      return;
    }
    if (data) {
      setLoans(prevLoans => prevLoans.map(l => l.id === loanId ? data[0] : l));
      toast({ title: "Success", description: "Loan closed successfully!" });
    }
  };

  const handleAddPayment = async (paymentData) => {
    const loan = loans.find(l => l.id === paymentData.loanId);
    if (!loan) {
      toast({ title: "Error", description: `Loan with ID ${paymentData.loanId} not found.`, variant: "destructive" });
      return;
    }
    const newPayment = {
      id: paymentData.id || generatePaymentId(),
      loan_id: paymentData.loanId,
      customer_id: loan.customer_id, 
      amount: paymentData.amount,
      due_date: paymentData.dueDate,
      status: paymentData.status || 'pending',
      type: paymentData.type || 'interest',
      created_at: paymentData.created_at || new Date().toISOString()
    };
    
    if (paymentData.paymentDate) {
      newPayment.payment_date = paymentData.paymentDate;
    }


    const { data, error } = await supabase.from('payments').insert([newPayment]).select();
    if (error) {
      console.error("Error adding payment:", error);
      toast({ title: "Error", description: `Failed to add payment: ${error.message}`, variant: "destructive" });
      return;
    }
    if (data) {
      setPayments(prevPayments => [...prevPayments, data[0]]);
      toast({ title: "Success", description: "Payment added successfully!" });
    }
  };

  const handleUpdatePayment = async (updatedPayment) => {
    const paymentToUpdate = { 
      amount: updatedPayment.amount,
      due_date: updatedPayment.dueDate,
      payment_date: updatedPayment.paymentDate,
      status: updatedPayment.status,
      type: updatedPayment.type
    };

    const { data, error } = await supabase.from('payments').update(paymentToUpdate).eq('id', updatedPayment.id).select();
    if (error) {
      console.error("Error updating payment:", error);
      toast({ title: "Error", description: `Failed to update payment: ${error.message}`, variant: "destructive" });
      return;
    }
    if (data) {
      setPayments(prevPayments => prevPayments.map(p => p.id === updatedPayment.id ? {...p, ...data[0]} : p));
      toast({ title: "Success", description: "Payment updated successfully!" });
    }
  };

  const getLoanPayments = (loanId) => {
    return payments.filter(p => p.loan_id === loanId);
  };

  return (
    <DataContext.Provider value={{
      customers,
      loans,
      payments,
      loading,
      fetchData,
      handleAddCustomer,
      handleUpdateCustomer,
      handleDeleteCustomer,
      handleAddLoan,
      handleUpdateLoan,
      handleCloseLoan,
      handleAddPayment,
      handleUpdatePayment,
      getLoanPayments
    }}>
      {children}
    </DataContext.Provider>
  );
};