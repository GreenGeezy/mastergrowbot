
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";

export default function EmailTest() {
  const [email, setEmail] = useState("eliduffy@gmail.com");
  const [subscriptionType, setSubscriptionType] = useState("basic");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      // Direct call to our edge function
      const { data, error } = await supabase.functions.invoke('send-subscription-email', {
        body: { 
          email, 
          subscriptionType
        }
      });

      if (error) {
        throw error;
      }

      toast.success(`Test subscription email sent to ${email}`);
      console.log("Email sent response:", data);
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error(`Failed to send email: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Subscription Email Test</CardTitle>
            <CardDescription>
              Send a subscription confirmation email to test the functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subscription-type">Subscription Type</Label>
              <Select
                value={subscriptionType}
                onValueChange={setSubscriptionType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSendEmail} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? "Sending..." : "Send Subscription Email"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
