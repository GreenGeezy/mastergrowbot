import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function DeletionRequestForm() {
  return (
    <Card className="w-full max-w-md mx-auto mt-8 bg-black/40 border-green-900/30">
      <CardHeader>
        <CardTitle className="text-xl text-green-400">Data Deletion Request</CardTitle>
        <CardDescription className="text-gray-400">
          To request the complete deletion of your account and associated data, please fill out our secure deletion form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <a href="https://forms.gle/nSWzcVPnB1am6GxZ7" target="_blank" rel="noopener noreferrer">
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
            Submit Deletion Request <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}
