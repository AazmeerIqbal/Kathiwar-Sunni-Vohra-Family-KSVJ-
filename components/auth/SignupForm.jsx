import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateEmail, validatePassword } from '../../utils/validation';

export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors[0];
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    console.log('Signup attempt:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        icon={<User className="w-5 h-5" />}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        icon={<Mail className="w-5 h-5" />}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
        error={errors.password}
        icon={<Lock className="w-5 h-5" />}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        error={errors.confirmPassword}
        icon={<Lock className="w-5 h-5" />}
      />

      <Button type="submit" isLoading={isLoading} fullWidth>
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};