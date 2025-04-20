
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Square: any;
  }
}

const SQUARE_APP_ID = 'sandbox-sq0idb-YOUR-APP-ID'; // Replace with your Square Application ID
const SQUARE_LOCATION_ID = 'YOUR-LOCATION-ID'; // Replace with your Square Location ID

export default function PaymentForm({ plan = 'monthly' }: { plan?: 'monthly' | 'annual' }) {
  const [loaded, setLoaded] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Square Web Payments SDK
    const script = document.createElement('script');
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
    script.onload = initializeSquare;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeSquare = async () => {
    if (!window.Square) {
      toast.error('Failed to load Square payment system');
      return;
    }

    try {
      const payments = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      const card = await payments.card();
      await card.attach('#card-container');
      setCard(card);
      setLoaded(true);
    } catch (e) {
      console.error('Error initializing Square:', e);
      toast.error('Failed to initialize payment system');
    }
  };

  const handlePayment = async () => {
    if (!card) {
      toast.error('Payment system not initialized');
      return;
    }

    setProcessing(true);
    try {
      const result = await card.tokenize();
      if (result.status === 'OK') {
        // Process the payment with our Supabase function
        const { error } = await supabase.functions.invoke('square-webhook', {
          body: {
            paymentId: result.token,
            email: 'user@example.com', // You'll want to get this from your form
            subscriptionType: plan
          }
        });

        if (error) throw error;

        toast.success('Payment processed successfully!');
        navigate('/thank-you', { 
          state: { 
            email: 'user@example.com',
            subscription_type: plan 
          }
        });
      }
    } catch (e) {
      console.error('Payment error:', e);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {plan === 'annual' ? 'Annual' : 'Monthly'} Subscription
      </h2>
      
      <div className="mb-6">
        <div 
          id="card-container" 
          className="bg-background border rounded-md p-4 min-h-[100px]"
        >
          {!loaded && (
            <div className="flex items-center justify-center h-[100px]">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handlePayment}
        disabled={!loaded || processing}
        className="w-full"
      >
        {processing ? (
          <span className="flex items-center gap-2">
            Processing...
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-background"></div>
          </span>
        ) : (
          `Pay ${plan === 'annual' ? '$99.99' : '$9.99'}`
        )}
      </Button>
    </div>
  );
}
