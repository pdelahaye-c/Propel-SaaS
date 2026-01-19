import React, { useState, useRef } from 'react';
import { DashboardLayout, ViewName } from './components/Layout';
import { ThemeProvider } from './components/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, cn, Separator } from './components/ui';
import { ActivityChart, PerformanceChart, CallAnalyticsChart } from './components/Charts';
import { MOCK_LEADS, MOCK_KPIS, MOCK_PROPERTIES, MOCK_BUYERS, MOCK_CONTRACTS, MOCK_CALL_LOGS } from './mockData';
import { LeadStatus, TimeRange, CallLog } from './types';
import { 
  ArrowUpRight, 
  Flame, 
  Phone, 
  MessageSquare, 
  Filter,
  RefreshCw,
  Search,
  CheckCircle2,
  Users,
  Building,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Euro,
  Plus,
  Copy,
  Check,
  ChevronDown,
  FileText,
  Calendar,
  Download,
  Play,
  PauseCircle,
  Briefcase,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Voicemail,
  Mail,
  Send,
  UserPlus
} from 'lucide-react';

// --- Utility Functions ---

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
}

const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return formatDate(dateString);
}

const formatDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

// --- Shared Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const s = status.toUpperCase();
  if (s === 'NEW') return <Badge variant="destructive" className="animate-pulse">New</Badge>;
  if (s === 'CONTACTED') return <Badge variant="warning">Contacted</Badge>;
  if (s === 'QUALIFIED') return <Badge variant="success">Qualified</Badge>;
  if (s === 'NEGOTIATION' || s === 'UNDER_OFFER' || s === 'ACTIVE') return <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-transparent">{status}</Badge>;
  if (s === 'CLOSED' || s === 'SOLD') return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent">Sold/Closed</Badge>;
  return <Badge variant="outline">{status}</Badge>;
};

const CopyButton = ({ text, className }: { text: string, className?: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className={cn("text-muted hover:text-primary transition-colors focus:outline-none", className)} title="Copy">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
    );
}

// --- Dashboard View ---

const DashboardView = ({ onViewChange }: { onViewChange: (view: ViewName) => void }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7D');
  
  return (
    <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                <p className="text-muted text-sm mt-1">Welcome back. You have <span className="text-primary font-semibold">3 high priority</span> tasks.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}><RefreshCw className="h-4 w-4" /></Button>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             {/* KPI Cards */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted">Total Leads</CardTitle>
                    <Users className="h-4 w-4 text-muted" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{MOCK_KPIS.totalLeads}</div>
                    <p className="text-xs text-emerald-500 flex items-center mt-1"><ArrowUpRight className="h-3 w-3 mr-1" /> +12%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted">Revenue Potential</CardTitle>
                    <Euro className="h-4 w-4 text-muted" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(MOCK_KPIS.revenuePotential)}</div>
                    <p className="text-xs text-emerald-500 flex items-center mt-1"><ArrowUpRight className="h-3 w-3 mr-1" /> +8%</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted">Active Contracts</CardTitle>
                    <FileText className="h-4 w-4 text-muted" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{MOCK_CONTRACTS.filter(c => c.status === 'Active').length}</div>
                    <div className="text-xs text-muted mt-1 cursor-pointer hover:text-primary underline" onClick={() => onViewChange('contracts')}>View details</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted">Properties Avail.</CardTitle>
                    <Building className="h-4 w-4 text-muted" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{MOCK_PROPERTIES.filter(p => p.status === 'FOR_SALE').length}</div>
                    <div className="text-xs text-muted mt-1 cursor-pointer hover:text-primary underline" onClick={() => onViewChange('properties')}>View inventory</div>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-[400px]">
            <div className="col-span-4 h-full"><ActivityChart range={timeRange} /></div>
            <div className="col-span-3 h-full"><PerformanceChart range={timeRange} /></div>
        </div>
    </div>
  );
};

// --- Leads View ---

const LeadsView = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
                    <p className="text-muted text-sm">Manage inbound inquiries and sales opportunities.</p>
                </div>
                <Button><Plus className="h-4 w-4 mr-2" /> Add Lead</Button>
            </div>
            
            <Card>
                <div className="p-4 border-b border-border flex justify-between items-center gap-4">
                     <div className="relative max-w-sm w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" />
                        <Input placeholder="Search name, email, phone..." className="pl-9" />
                    </div>
                    <div className="flex gap-2">
                         <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                         <Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted uppercase bg-surface/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3 font-medium">Name</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Score</th>
                                <th className="px-6 py-3 font-medium">Source</th>
                                <th className="px-6 py-3 font-medium">Last Interaction</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {MOCK_LEADS.map(lead => (
                                <tr key={lead.id} className="group hover:bg-surface/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        <div>{lead.name}</div>
                                        <div className="text-xs text-muted font-normal">{lead.phone}</div>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={lead.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-orange-500 font-bold">
                                            <Flame className="h-4 w-4 fill-current" /> {lead.heatScore}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted">{lead.source}</td>
                                    <td className="px-6 py-4 max-w-[200px]">
                                        <div className="truncate" title={lead.lastInteractionSummary}>{lead.lastInteractionSummary}</div>
                                        <div className="text-xs text-muted">{new Date(lead.lastInteractionTime).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

// --- Buyers View ---

const BuyersView = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Buyers</h1>
                    <p className="text-muted text-sm">Qualified contacts actively looking for properties.</p>
                </div>
                <Button><Plus className="h-4 w-4 mr-2" /> Add Buyer</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_BUYERS.map(buyer => (
                    <Card key={buyer.id} className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {buyer.name.charAt(0)}
                                </div>
                                <Badge variant="outline">{buyer.type}</Badge>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{buyer.name}</h3>
                            <div className="text-sm text-muted space-y-1 mb-4">
                                <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {buyer.phone}</p>
                                <p className="flex items-center gap-2"><MessageSquare className="h-3 w-3" /> {buyer.email}</p>
                            </div>
                            <Separator className="my-3" />
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Budget</span>
                                    <span className="font-semibold">{formatCurrency(buyer.budget)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Last Active</span>
                                    <span>{buyer.lastActive}</span>
                                </div>
                                <div>
                                    <span className="text-xs text-muted uppercase font-bold">Requirements</span>
                                    <p className="text-sm mt-1 bg-surface/50 p-2 rounded border border-border/50">
                                        {buyer.requirements}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button className="w-full" variant="outline" size="sm">Match Properties</Button>
                                <Button className="w-full" size="sm">Contact</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

// --- Call Logs View ---

const CallLogItem = ({ log }: { log: CallLog }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioProgressRef = useRef<HTMLDivElement>(null);

    return (
        <Card className={cn(
            "transition-all duration-300 border-l-4 overflow-hidden",
            log.sentiment === 'POSITIVE' ? "border-l-emerald-500" : log.sentiment === 'NEGATIVE' ? "border-l-red-500" : "border-l-border",
            isExpanded ? "ring-1 ring-primary/20 shadow-md" : "hover:bg-surface/50"
        )}>
            {/* Header Row (Always Visible) */}
            <div 
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                        log.direction === 'INBOUND' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" : "bg-purple-100 text-purple-600 dark:bg-purple-900/30",
                        log.status === 'MISSED' && "bg-red-100 text-red-600 dark:bg-red-900/30"
                    )}>
                        {log.status === 'MISSED' ? <PhoneMissed className="h-5 w-5" /> : 
                         log.status === 'VOICEMAIL' ? <Voicemail className="h-5 w-5" /> :
                         log.direction === 'INBOUND' ? <PhoneIncoming className="h-5 w-5" /> : <PhoneOutgoing className="h-5 w-5" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{log.callerName}</h3>
                            {log.isKnownContact ? (
                                <Badge variant="outline" className="text-xs py-0 h-5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Contact</Badge>
                            ) : (
                                <Badge variant="outline" className="text-xs py-0 h-5 border-dashed">New Lead</Badge>
                            )}
                            {log.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-surface border px-1.5 rounded-full text-muted">{tag}</span>
                            ))}
                        </div>
                        <p className="text-sm text-muted">{log.phoneNumber} • {formatDuration(log.duration)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted pl-14 md:pl-0">
                    <div className="hidden md:block text-right">
                        <p className="font-medium text-foreground">{formatTimeAgo(log.timestamp)}</p>
                        <p className="text-xs">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <Button variant="ghost" size="icon" className={cn("transition-transform", isExpanded ? "rotate-180" : "")}>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-border bg-surface/30 animate-in slide-in-from-top-2 duration-200">
                    
                    {/* Audio Player Strip */}
                    <div className="px-4 py-3 bg-background border-b border-border flex items-center gap-4">
                         <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full bg-primary text-white hover:bg-primary/90"
                            onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                        >
                            {isPlaying ? <PauseCircle className="h-5 w-5" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </Button>
                        <div className="flex-1 h-8 flex items-center gap-1 cursor-pointer group" ref={audioProgressRef}>
                            {/* Fake Waveform */}
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div 
                                    key={i} 
                                    className={cn(
                                        "w-1 rounded-full transition-all duration-300",
                                        isPlaying && i < 15 ? "bg-primary h-6" : "bg-muted/30 group-hover:bg-muted/60 h-3"
                                    )}
                                    style={{ height: `${Math.max(20, Math.random() * 100)}%` }}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-mono text-muted">{formatDuration(log.duration)}</span>
                        <Button variant="outline" size="sm" className="h-7 text-xs"><Download className="h-3 w-3 mr-1" /> Save</Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border">
                        
                        {/* Transcript Section */}
                        <div className="col-span-2 p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" /> Transcript
                                </h4>
                                <CopyButton text={log.transcript} />
                            </div>
                            <div className="bg-background rounded-lg p-4 border border-border text-sm leading-relaxed whitespace-pre-wrap font-mono text-muted-foreground max-h-[300px] overflow-y-auto shadow-inner">
                                {log.transcript}
                            </div>
                        </div>

                        {/* AI Actions / Summary Section */}
                        <div className="col-span-1 p-6 bg-surface/50 space-y-6">
                            
                            {/* Summary */}
                            <div>
                                <h4 className="text-xs uppercase tracking-wider text-muted font-bold mb-2">AI Summary</h4>
                                <p className="text-sm text-foreground">{log.summary}</p>
                            </div>

                            <Separator />

                            {/* Actions Timeline */}
                            <div>
                                <h4 className="text-xs uppercase tracking-wider text-muted font-bold mb-3">Autonomous Actions</h4>
                                <div className="space-y-4 relative pl-2">
                                    {/* Vertical Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-border" />
                                    
                                    {log.aiActions.map((action, idx) => (
                                        <div key={action.id} className="relative flex gap-3 items-start">
                                            <div className={cn(
                                                "h-6 w-6 rounded-full border-2 shrink-0 flex items-center justify-center z-10 bg-surface",
                                                action.status === 'SUCCESS' ? "border-emerald-500 text-emerald-500" : "border-amber-500 text-amber-500"
                                            )}>
                                                {action.type === 'EMAIL' && <Mail className="h-3 w-3" />}
                                                {action.type === 'SMS' && <MessageSquare className="h-3 w-3" />}
                                                {action.type === 'WHATSAPP' && <Send className="h-3 w-3" />}
                                                {action.type === 'CALENDAR' && <Calendar className="h-3 w-3" />}
                                                {action.type === 'CRM_UPDATE' && <UserPlus className="h-3 w-3" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{action.description}</p>
                                                <p className="text-[10px] text-muted">{formatTimeAgo(action.timestamp)} • {action.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Manual Action Suggestions */}
                            <div className="pt-2">
                                <Button className="w-full" size="sm">
                                    <Phone className="h-3 w-3 mr-2" /> Call Back Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    )
}

const CallLogsView = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Call Logs</h1>
                    <p className="text-muted text-sm">Review voice interactions and AI autonomous follow-ups.</p>
                </div>
                 <div className="flex gap-2">
                    <Button variant="outline"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
                    <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
                </div>
            </div>

            {/* Analytics Graphics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CallAnalyticsChart />
                </div>
                
                {/* Side Stats */}
                <div className="space-y-4 flex flex-col">
                     <Card className="flex-1 p-6 flex flex-col justify-center gap-2 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <p className="text-sm text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Qualified Leads</p>
                        </div>
                        <div className="mt-2">
                            <span className="text-4xl font-bold text-foreground">18</span>
                            <span className="text-sm text-muted ml-2">from 42 calls</span>
                        </div>
                        <p className="text-xs text-muted mt-1">42% Conversion Rate (+12% vs last week)</p>
                    </Card>

                    <Card className="flex-1 p-6 flex flex-col justify-center gap-2 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                                <PhoneMissed className="h-5 w-5" />
                            </div>
                            <p className="text-sm text-red-700 dark:text-red-400 font-bold uppercase tracking-wider">Missed Opportunities</p>
                        </div>
                        <div className="mt-2">
                            <span className="text-4xl font-bold text-foreground">3</span>
                            <span className="text-sm text-muted ml-2">calls missed</span>
                        </div>
                         <p className="text-xs text-muted mt-1">Requires immediate callback.</p>
                    </Card>
                </div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-4">
                {MOCK_CALL_LOGS.map(log => (
                    <CallLogItem key={log.id} log={log} />
                ))}
            </div>
        </div>
    )
}

// --- New Views ---

const PropertiesView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted text-sm">Manage your property portfolio.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Add Property</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROPERTIES.map(property => (
          <Card key={property.id} className="overflow-hidden group">
            <div className="relative h-48 w-full overflow-hidden">
               <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute top-2 right-2">
                 <StatusBadge status={property.status} />
               </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold text-lg truncate">{property.title}</h3>
              <p className="text-muted text-sm flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" /> {property.city}</p>
              <div className="flex justify-between items-center mb-4">
                 <span className="text-lg font-bold text-primary">{formatCurrency(property.price)}</span>
                 <div className="text-xs text-muted flex gap-2">
                    <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" /> {property.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="h-3 w-3" /> {property.baths}</span>
                    <span className="flex items-center gap-1"><Maximize className="h-3 w-3" /> {property.surface}m²</span>
                 </div>
              </div>
              <Button variant="outline" className="w-full">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const ContractsView = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
                    <p className="text-muted text-sm">Track active and closed contracts.</p>
                </div>
                 <Button><Plus className="h-4 w-4 mr-2" /> New Contract</Button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted uppercase bg-surface/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3 font-medium">Ref</th>
                                <th className="px-6 py-3 font-medium">Stage</th>
                                <th className="px-6 py-3 font-medium">Price</th>
                                <th className="px-6 py-3 font-medium">Agency Fees</th>
                                <th className="px-6 py-3 font-medium">Dates</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/10">
                            {MOCK_CONTRACTS.map(contract => (
                                <tr key={contract.id} className="group hover:bg-surface/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{contract.reference}</td>
                                    <td className="px-6 py-4"><StatusBadge status={contract.status} /> <div className="text-xs text-muted mt-0.5">{contract.stage}</div></td>
                                    <td className="px-6 py-4">{formatCurrency(contract.price)}</td>
                                    <td className="px-6 py-4">{formatCurrency(contract.agencyFees)}</td>
                                    <td className="px-6 py-4 text-xs text-muted">
                                        <div>Offer: {contract.offerDate || '-'}</div>
                                        <div>Sign: {contract.signDate || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                         <Button variant="ghost" size="sm">View</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

const PlaceholderView = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-300">
        <div className="h-20 w-20 rounded-full bg-surface border border-border flex items-center justify-center mb-6">
            <Briefcase className="h-10 w-10 text-muted" />
        </div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted max-w-md mt-2">This module is currently under development. Check back later for updates.</p>
    </div>
)

const App = () => {
    const [currentView, setCurrentView] = useState<ViewName>('dashboard');

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <DashboardView onViewChange={setCurrentView} />;
            case 'properties': return <PropertiesView />;
            case 'leads': return <LeadsView />;
            case 'buyers': return <BuyersView />;
            case 'contracts': return <ContractsView />;
            case 'call-logs': return <CallLogsView />;
            case 'inbox': return <PlaceholderView title="Inbox" />;
            case 'reports': return <PlaceholderView title="Reports" />;
            default: return <DashboardView onViewChange={setCurrentView} />;
        }
    }

    return (
        <ThemeProvider>
            <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
                {renderView()}
            </DashboardLayout>
        </ThemeProvider>
    );
};

export default App;