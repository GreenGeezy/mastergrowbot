
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import { Textarea } from "@/components/ui/textarea";
import { Copy } from "lucide-react";

export default function EmailTest() {
  const [email, setEmail] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [verificationLink, setVerificationLink] = useState("");
  const [squareOrderId, setSquareOrderId] = useState("");

  const handleGenerateLink = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      // Generate verification link that can be added to Square emails
      const { data, error } = await supabase.functions.invoke('send-subscription-email', {
        body: { 
          email, 
          subscriptionType,
          squareOrderId
        }
      });

      if (error) {
        throw error;
      }

      // Display the verification link
      if (data.verificationLink) {
        setVerificationLink(data.verificationLink);
        toast.success(`Verification link generated for ${email}`);
      } else {
        toast.error("Could not generate verification link");
      }
      
      console.log("Response:", data);
    } catch (error) {
      console.error("Error generating verification link:", error);
      toast.error(`Failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationLink);
    toast.success("Verification link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-10">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Square Email Integration</CardTitle>
            <CardDescription>
              Generate verification links to include in your Square emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Customer Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="customer@example.com"
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
            <div className="space-y-2">
              <Label htmlFor="order-id">Square Order ID (optional)</Label>
              <Input
                id="order-id"
                type="text"
                placeholder="Order ID from Square"
                value={squareOrderId}
                onChange={(e) => setSquareOrderId(e.target.value)}
              />
            </div>
            
            {verificationLink && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="verification-link">Verification Link (Add to Square Email)</Label>
                <div className="flex gap-2">
                  <Textarea 
                    id="verification-link"
                    value={verificationLink}
                    readOnly
                    rows={3}
                    className="font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Copy this link and include it in your Square confirmation emails or marketing messages. When customers click it, they'll be able to sign up with their subscription already activated.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerateLink} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? "Generating..." : "Generate Verification Link"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
