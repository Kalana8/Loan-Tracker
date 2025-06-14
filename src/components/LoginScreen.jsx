import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Building2, KeyRound, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (username === 'Chamika' && password === 'ChamikaD') {
      toast({ title: "Login Successful!", description: "Welcome back, Chamika!" });
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
      toast({ title: "Login Failed", description: "Invalid username or password.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4 safe-area-bottom">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-sm glass-effect shadow-2xl">
          <CardHeader className="text-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto mb-4 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg"
            >
              <Building2 className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-800">Micro Loan Tracker</CardTitle>
            <CardDescription className="text-gray-600">Please sign in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 border-gray-300 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-base transition-all duration-300 ease-in-out transform hover:scale-105">
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Micro Loan Tracker. All rights reserved.</p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
