import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { SupportFormData } from "@/hooks/use-support-form";

interface SupportFormProps {
  formData: SupportFormData;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof SupportFormData, value: string) => void;
}

const SupportForm = ({ formData, isLoading, onSubmit, onChange }: SupportFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Input
          placeholder="Message Title"
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white"
        />
      </div>
      <div>
        <Textarea
          placeholder="Your Message"
          value={formData.message}
          onChange={(e) => onChange("message", e.target.value)}
          required
          className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
};

export default SupportForm;