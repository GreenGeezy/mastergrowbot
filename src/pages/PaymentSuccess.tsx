
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // For testing, we'll simulate different subscription types
  const subscriptionTypes = ['weekly', 'quarterly', 'yearly'];
  const [selectedType, setSelectedType] = useState('yearly');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In real implementation, we'd get these from Square's response
      const mockOrderId = `test_${Date.now()}`;
      const expiresAt = new Date();
      
      // Set expiration based on subscription type
      switch(selectedType) {
        case 'weekly':
          expiresAt.setDate(expiresAt.getDate() + 7);
          break;
        case 'quarterly':
          expiresAt.setMonth(expiresAt.getMonth() + 3);
          break;
        case 'yearly':
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          break;
      }

      const { error } = await supabase
        .from('pending_subscriptions')
        .insert([{
          email,
          square_order_id: mockOrderId,
          subscription_type: selectedType,
          expires_at: expiresAt.toISOString()
        }]);

      if (error) throw error;

      toast.success("Test subscription created! You can now sign up with this email.");
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to create test subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Test Payment Success</h1>
          <p className="text-gray-400">Enter an email to create a test subscription</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-black/40 p-6 rounded-lg backdrop-blur-sm border border-primary/20">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              Subscription Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {subscriptionTypes.map(type => (
                <Button
                  key={type}
                  type="button"
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => setSelectedType(type)}
                  className="w-full"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Test Subscription"}
          </Button>
        </form>
      </div>
    </div>
  );
}
