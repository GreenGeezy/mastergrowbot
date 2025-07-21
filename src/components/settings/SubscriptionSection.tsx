import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, Settings } from 'lucide-react';
import { useSubscriptionStatus } from '@/hooks/use-subscription-status';

const SubscriptionSection = () => {
  const { hasAccess, subscriptionType, isLoading } = useSubscriptionStatus();

  if (isLoading) {
    return (
      <Card data-testid="subscription-section" className="bg-card/50 border-accent/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-accent/20 rounded w-1/3"></div>
            <div className="h-8 bg-accent/20 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="subscription-section" className="bg-card/50 border-accent/20 hover:border-accent/40 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-accent" />
            <div>
              <CardTitle className="text-xl text-white">Subscription</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your Master Growbot subscription
              </CardDescription>
            </div>
          </div>
          {hasAccess && (
            <Badge className="bg-accent/20 text-accent border-accent/30">
              Active
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-accent" />
              <div>
                <p className="font-medium text-white">Plan Type</p>
                <p className="text-sm text-gray-400">
                  {subscriptionType ? subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1) : 'Free'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-background/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-accent" />
              <div>
                <p className="font-medium text-white">Status</p>
                <p className="text-sm text-gray-400">
                  {hasAccess ? 'Active subscription' : 'No active subscription'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-accent/20">
          <Button 
            variant="outline" 
            className="w-full border-accent/30 hover:border-accent/50 hover:bg-accent/10"
          >
            {hasAccess ? 'Manage Subscription' : 'Upgrade Plan'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionSection;