'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/auth-context';
import api from '@/lib/api';
import ProtectedRoute from '@/components/auth/protected-route';
import { ArrowLeft, Check, Gift } from 'lucide-react';

export default function RedemptionPage() {
  const { t } = useI18n();
  const { refreshUser } = useAuth();
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError(t('errors.missingParameters'));
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await api.post('/api/user/topup', { key: code.trim() });
      
      if (response.success) {
        setSuccess(t('pricing.redemption.success'));
        setCode('');
        
        // Refresh user data to update quota
        await refreshUser();
      } else {
        setError(response.message || t('pricing.redemption.failed'));
      }
    } catch (err) {
      console.error('Redemption error:', err);
      setError(t('errors.unknownError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center">
          <Link
            href="/pricing"
            className="mr-4 p-2 rounded-full hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">{t('pricing.redemption.title')}</h1>
        </div>
        
        <div className="bg-card rounded-lg shadow p-6">
          <p className="mb-6">{t('pricing.redemption.description')}</p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">
                {t('pricing.redemption.code')}
              </label>
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="block w-full rounded-l-md border border-input bg-background px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <Gift className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !code.trim()}
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-primary-foreground rounded-full"></span>
                      {t('common.loading')}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Check className="mr-2 h-4 w-4" />
                      {t('pricing.redemption.redeem')}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Redemption History */}
        <div className="bg-card rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t('pricing.redemption.history')}</h2>
          
          {/* This would be populated with actual redemption history data */}
          <p className="text-muted-foreground text-center py-4">
            {t('common.noData')}
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
