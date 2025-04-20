
import PaymentForm from "@/components/payment/PaymentForm";
import { useLocation } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const plan = location.state?.plan || 'monthly';

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <PaymentForm plan={plan} />
      </div>
    </div>
  );
}
