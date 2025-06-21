
import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  BarChart3,
  Brain,
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Github,
  Home,
  LineChart,
  Mail,
  Menu,
  Moon,
  MoreHorizontal,
  Newspaper,
  Play,
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';

export type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const Icons = {
  logo: Home,
  close: X,
  spinner: ({ ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      {...props}
    >
      <path d="21 12a9 9 0 11-6.219-8.56" />
    </svg>
  ),
  // Navigation icons
  dashboard: BarChart3,
  analytics: LineChart,
  settings: Settings,
  user: User,
  users: Users,
  
  // Action icons
  add: Plus,
  search: Search,
  filter: Filter,
  menu: Menu,
  more: MoreHorizontal,
  
  // Status icons
  bell: Bell,
  star: Star,
  shield: Shield,
  zap: Zap,
  target: Target,
  brain: Brain,
  activity: Activity,
  
  // Directional icons
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  arrowRight: ArrowRight,
  trendingUp: TrendingUp,
  trendingDown: TrendingDown,
  
  // Content icons
  calendar: Calendar,
  clock: Clock,
  eye: Eye,
  mail: Mail,
  newspaper: Newspaper,
  
  // Theme icons
  sun: Sun,
  moon: Moon,
  
  // Misc icons
  dollarSign: DollarSign,
  alertTriangle: AlertTriangle,
  play: Play,
  github: Github,
};

export default Icons;
