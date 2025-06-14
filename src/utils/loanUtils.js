
export function calculateMonthlyInterest(loanAmount, interestRate) {
  return (loanAmount * interestRate) / 100;
}

export function calculateTotalInterestPaid(payments) {
  return payments.reduce((total, payment) => {
    return payment.status === 'paid' ? total + payment.amount : total;
  }, 0);
}

export function calculateRemainingBalance(loanAmount, totalInterestPaid, isFullyPaid) {
  if (isFullyPaid) return 0;
  return loanAmount;
}

export function generateLoanId() {
  return 'LOAN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export function generateCustomerId() {
  return 'CUST-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export function generatePaymentId() {
  return 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export function getLoanStatus(loan, payments) {
  if (loan.status === 'fully_paid') return 'Fully Paid';
  
  const overduePayments = payments.filter(payment => 
    payment.status === 'pending' && new Date(payment.due_date) < new Date()
  );
  
  if (overduePayments.length > 0) return 'Overdue';
  return 'Active';
}
