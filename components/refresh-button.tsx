"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface RefreshButtonProps {
  botId: string
}

export function RefreshButton({ botId }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      toast.promise(
        fetch(`/api/bots/${botId}/refresh`, {
          method: 'POST',
        }).then(async response => {
          const contentType = response.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Server returned an invalid response. Please try again later.");
          }
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Failed to refresh bot information");
          }
          
          return response.json();
        }),
        {
          loading: 'Refreshing bot information...',
          success: (data) => {
            const updatedInfo = [];
            
            if (data.updates?.name) {
              updatedInfo.push(`Name: ${data.updates.name}`);
            }
            
            if (data.updates?.servers !== undefined) {
              updatedInfo.push(`Servers: ${data.updates.servers.toLocaleString()}`);
            }
            
            if (data.updates?.avatar) {
              updatedInfo.push('Avatar updated');
            }
            
            setTimeout(() => window.location.reload(), 2000);
            
            return updatedInfo.length > 0
              ? `Bot information updated: ${updatedInfo.join(', ')}`
              : 'Bot information refreshed successfully';
          },
          error: (err) => err.message,
        }
      );
    } catch (error) {
      toast.error("An error occurred while refreshing bot information");
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <Button 
      variant="outline" 
      size="lg" 
      className="border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/30"
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      Refresh Bot Info
    </Button>
  )
} 