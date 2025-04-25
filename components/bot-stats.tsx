import { Server, ThumbsUp, Clock, Hash, Users, MessageSquare, Zap, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface BotStatsProps {
  votes: number
  servers: number
  createdAt: string | Date
  prefix: string
  shards?: number
  uptime?: number
  responseTime?: number 
  tags?: string[]
}

export function BotStats({ 
  votes, 
  servers, 
  createdAt, 
  prefix,
  shards = 1,
  uptime = 99.9,
  responseTime = 120,
  tags = []
}: BotStatsProps) {
  const formattedDate = typeof createdAt === 'string' 
    ? new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : createdAt instanceof Date 
      ? createdAt.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'Unknown date';
  
  const getTimeDifference = () => {
    const creationDate = typeof createdAt === 'string'
      ? new Date(createdAt)
      : createdAt instanceof Date
        ? createdAt
        : new Date();
    
    const diffMs = Date.now() - creationDate.getTime();
    return diffMs;
  };
  
  const formatTimeDifference = () => {
    const diffMs = getTimeDifference();
    
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (years > 0) {
      return `${years}y ${days % 365}d`;
    } else if (months > 0) {
      return `${months}m ${days % 30}d`;
    } else if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group-hover:shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ThumbsUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Votes</p>
                <p className="text-2xl font-bold">{votes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-primary/80 to-primary/20"></div>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-secondary/20 transition-all duration-300 group-hover:shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-full">
                <Server className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Servers</p>
                <p className="text-2xl font-bold">{servers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-secondary/80 to-secondary/20"></div>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/20 transition-all duration-300 group-hover:shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shards</p>
                <p className="text-2xl font-bold">{shards}</p>
              </div>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-accent/80 to-accent/20"></div>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group-hover:shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-2xl font-bold">{formatTimeDifference()}</p>
              </div>
            </div>
          </CardContent>
          <div className="h-1 w-full bg-gradient-to-r from-primary/80 to-primary/20"></div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Bot Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <Hash className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-muted-foreground">Prefix</span>
                </div>
                <span className="font-mono font-medium bg-secondary/5 px-2 py-1 rounded">{prefix}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <Clock className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-muted-foreground">Added On</span>
                </div>
                <span className="font-medium">{formattedDate}</span>
              </div>
              
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <Award className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-muted-foreground">Tags</span>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                      +{tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 