import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { generateLoanId } from '@/utils/loanUtils';

export function LoanForm({ open, onOpenChange, onSubmit, customers, loan }) {
  const isEdit = !!loan;
  const [formData, setFormData] = useState({
    customerId: '',
    loanAmount: '',
    interestRate: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'ongoing',
    id: undefined
  });

  useEffect(() => {
    if (open) {
      if (isEdit) {
        setFormData({
          customerId: loan.customer_id || loan.customerId || '',
          loanAmount: loan.loan_amount || loan.loanAmount || '',
          interestRate: loan.interest_rate || loan.interestRate || '',
          startDate: loan.start_date || loan.startDate || new Date().toISOString().split('T')[0],
          status: loan.status || 'ongoing',
          id: loan.id
        });
      } else {
      setFormData({
        customerId: '',
        loanAmount: '',
        interestRate: '',
          startDate: new Date().toISOString().split('T')[0],
          status: 'ongoing',
          id: undefined
      });
      }
    }
  }, [open, isEdit, loan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.loanAmount || !formData.interestRate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    if (parseFloat(formData.loanAmount) <= 0) {
      toast({
        title: "Error",
        description: "Loan amount must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    if (parseFloat(formData.interestRate) <= 0) {
      toast({
        title: "Error",
        description: "Interest rate must be greater than 0",
        variant: "destructive"
      });
      return;
    }
    const loanData = {
      id: formData.id || generateLoanId(),
      customerId: formData.customerId,
      loanAmount: parseFloat(formData.loanAmount),
      interestRate: parseFloat(formData.interestRate),
      startDate: formData.startDate,
      status: formData.status || 'ongoing',
      created_at: loan && loan.created_at ? loan.created_at : new Date().toISOString()
    };
    onSubmit(loanData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {isEdit ? 'Edit Loan' : 'Create New Loan'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer *</Label>
            <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })} disabled={isEdit}>
              <SelectTrigger className="border-2 focus:border-green-500">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount *</Label>
            <Input
              id="loanAmount"
              type="number"
              step="0.01"
              value={formData.loanAmount}
              onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
              placeholder="Enter loan amount"
              className="border-2 focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%) *</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              placeholder="Enter interest rate"
              className="border-2 focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="border-2 focus:border-green-500"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              {isEdit ? 'Update Loan' : 'Create Loan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}