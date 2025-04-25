import { Badge } from "@/components/ui/badge"
import { type UserRole, RoleConfig } from "@/lib/models/user"
import { cn } from "@/lib/utils"

interface RoleBadgeProps {
  role: string
  className?: string
  showIcon?: boolean
}

export function RoleBadge({ role, className, showIcon = true }: RoleBadgeProps) {
  const roleInfo = RoleConfig[role as UserRole] || {
    name: role,
    color: "bg-gray-500",
    textColor: "text-gray-500",
    icon: null,
  }

  const Icon = roleInfo.icon

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-2 font-medium flex items-center gap-1",
        roleInfo.textColor,
        `border-${roleInfo.color.split("-")[1]}`,
        className,
      )}
    >
      {showIcon && Icon && <Icon className="h-3 w-3" />}
      {roleInfo.name}
    </Badge>
  )
}

