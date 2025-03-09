
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, Mail } from "lucide-react";

export const EmailTester = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTestEmail = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      
      // Call the edge function directly
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: { email },
      });

      if (error) {
        throw error;
      }

      setResult({ success: true, data });
      toast.success("Test email sent successfully! Check your inbox");
      console.log("Email function response:", data);
    } catch (error) {
      console.error("Error testing email function:", error);
      setResult({ success: false, error: error.message });
      toast.error(`Failed to send test email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" /> 
          Email Function Tester
        </CardTitle>
        <CardDescription>
          Test the send-verification-email function by sending a test email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Test Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email to test"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {result && (
          <div className={`mt-4 p-3 rounded-md text-sm ${result.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {result.success ? (
              <div>
                <p className="font-medium">Success! Email functionality is working.</p>
                <p className="text-xs mt-1 opacity-80">Check the email inbox for the test message.</p>
              </div>
            ) : (
              <div>
                <p className="font-medium">Error testing email function:</p>
                <p className="text-xs mt-1 opacity-80">{result.error}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestEmail} 
          disabled={loading || !email} 
          className="w-full flex items-center justify-center gap-2"
        >
          {loading ? "Sending..." : "Send Test Email"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};
