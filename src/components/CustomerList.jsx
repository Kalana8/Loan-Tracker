
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomerForm } from '@/components/CustomerForm';
import { toast } from '@/components/ui/use-toast';

export function CustomerList({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }) {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone and will also remove associated loans and payments.')) {
      onDeleteCustomer(customerId);
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      });
    }
  };

  const handleSubmit = (customerData) => {
    if (editingCustomer) {
      onUpdateCustomer(customerData);
    } else {
      onAddCustomer(customerData);
    }
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Customer Management
        </h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {customers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-gradient border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-md sm:text-lg font-semibold text-gray-900">
                    {customer.name}
                  </CardTitle>
                  <Badge 
                    variant={customer.status === 'active' ? 'default' : 'secondary'}
                    className={`${customer.status === 'active' ? 'status-paid' : 'bg-gray-500 text-white'} text-xs`}
                  >
                    {customer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {customer.description && (
                    <p className="text-xs sm:text-sm text-gray-600">{customer.description}</p>
                  )}
                  {customer.mobile && (
                    <p className="text-xs sm:text-sm text-gray-600">📱 {customer.mobile}</p>
                  )}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(customer)}
                      className="hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(customer.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No customers found</div>
          <p className="text-gray-400 mt-2">Add your first customer to get started</p>
        </div>
      )}

      <CustomerForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingCustomer(null);
        }}
        onSubmit={handleSubmit}
        customer={editingCustomer}
      />
    </div>
  );
}
