import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, CheckCircle2, Loader2 } from "lucide-react";

const DeletionRequestForm = () => {
  const [email, setEmail] = useState("");
  const [profileName, setProfileName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!confirmed) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm that you want to delete your data.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("deletion_requests")
        .insert({
          email: email.trim().toLowerCase(),
          profile_name: profileName.trim() || null,
        });

      if (error) {
        console.error("Deletion request error:", error);
        toast({
          title: "Submission Failed",
          description: "Something went wrong. Please try again or contact support@futuristiccannabis.ai.",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitted(true);
      toast({
        title: "Request Received",
        description: "Your data deletion request has been submitted successfully.",
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-muted/30 border border-primary/20 rounded-lg p-6 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
        <h3 className="text-xl font-semibold text-white">Request Received</h3>
        <p className="text-foreground max-w-md mx-auto">
          Your request has been received. Our team will process your data deletion within 7 days.
          For urgent inquiries, contact{" "}
          <a
            href="mailto:support@futuristiccannabis.ai"
            className="text-primary hover:underline"
          >
            support@futuristiccannabis.ai
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-foreground">
        To request deletion of your account and all associated data (plant logs, photos, and profile
        information), please fill out the form below. You may also email us directly at{" "}
        <a
          href="mailto:support@futuristiccannabis.ai"
          className="text-primary hover:underline"
        >
          support@futuristiccannabis.ai
        </a>
        .
      </p>

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="deletion-email" className="text-white">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="deletion-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={255}
          className="bg-background/50 border-border/50"
        />
      </div>

      {/* Profile Name field */}
      <div className="space-y-2">
        <Label htmlFor="deletion-profile-name" className="text-white">
          Profile Name <span className="text-foreground text-xs">(Optional)</span>
        </Label>
        <Input
          id="deletion-profile-name"
          type="text"
          placeholder="Your profile name"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          maxLength={100}
          className="bg-background/50 border-border/50"
        />
      </div>

      {/* Confirmation checkbox */}
      <div className="flex items-start space-x-3 rounded-md border border-border/50 bg-background/30 p-4">
        <Checkbox
          id="deletion-confirm"
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked === true)}
          className="mt-0.5"
        />
        <Label
          htmlFor="deletion-confirm"
          className="text-sm text-foreground leading-relaxed cursor-pointer"
        >
          I confirm I want to permanently delete all my plant logs, photos, and profile data from
          MasterGrowbot AI.
        </Label>
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting || !email || !confirmed}
        variant="destructive"
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Trash2 className="mr-2 h-4 w-4" />
            Submit Request
          </>
        )}
      </Button>
    </form>
  );
};

export default DeletionRequestForm;
