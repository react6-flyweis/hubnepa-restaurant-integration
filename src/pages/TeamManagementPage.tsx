import { useMemo, useState } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  MessageSquare,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/ui/page-header"
import { AddStaffDialog } from "@/components/AddStaffDialog"
import { StaffDirectoryTab } from "@/components/team/StaffDirectoryTab"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type TeamTab = "directory" | "schedule" | "requests" | "payroll"

type TeamTabItem = {
  key: TeamTab
  label: string
  icon: LucideIcon
}

const teamTabs: TeamTabItem[] = [
  { key: "directory", label: "Staff Directory", icon: Users },
  { key: "schedule", label: "Schedule", icon: CalendarDays },
  { key: "requests", label: "Requests", icon: MessageSquare },
  { key: "payroll", label: "Payroll", icon: DollarSign },
]

// schedule-related types and sample data

type Shift = {
  start: string // e.g. "09:00"
  end: string // e.g. "17:00"
  employees: string[]
}

type DaySchedule = {
  dayName: string
  date: string // human readable, e.g. "Feb 12"
  shifts: Shift[]
}

const scheduleSample: DaySchedule[] = [
  {
    dayName: "Monday",
    date: "Feb 12",
    shifts: [
      {
        start: "09:00",
        end: "17:00",
        employees: ["Sarah Jenkins", "Michael Chen", "David Wilson"],
      },
      {
        start: "17:00",
        end: "23:00",
        employees: ["Emma Thompson", "Jessica Wu"],
      },
    ],
  },
  {
    dayName: "Tuesday",
    date: "Feb 13",
    shifts: [
      {
        start: "09:00",
        end: "17:00",
        employees: ["Sarah Jenkins", "Michael Chen"],
      },
      {
        start: "17:00",
        end: "23:00",
        employees: ["Emma Thompson", "Jessica Wu", "David Wilson"],
      },
    ],
  },
  {
    dayName: "Wednesday",
    date: "Feb 14",
    shifts: [
      {
        start: "09:00",
        end: "17:00",
        employees: ["Sarah Jenkins", "Michael Chen", "David Wilson"],
      },
      {
        start: "17:00",
        end: "23:00",
        employees: ["Emma Thompson", "Jessica Wu"],
      },
    ],
  },
]

// request-related types and data

type RequestType = "Time Off" | "Shift Swap"
type RequestStatus = "Pending" | "Approved" | "Rejected"

type StaffRequest = {
  id: string
  type: RequestType
  employee: string
  dateRange?: string
  note: string
  status: RequestStatus
}

const sampleRequests: StaffRequest[] = [
  {
    id: "req-001",
    type: "Time Off",
    employee: "Jessica Wu",
    dateRange: "Feb 20 - Feb 22",
    note: '"Family wedding"',
    status: "Pending",
  },
  {
    id: "req-002",
    type: "Shift Swap",
    employee: "David Wilson",
    note: "Swap Feb 14 Evening with Emma Thompson",
    status: "Approved",
  },
]

// payroll-related types & sample

type PayrollEntry = {
  employee: string
  role: string
  hours: string
  rate: string
  total: string
}

const samplePayroll: PayrollEntry[] = [
  {
    employee: "Sarah Jenkins",
    role: "Manager",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00",
  },
  {
    employee: "Michael Chen",
    role: "Head Chef",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00",
  },
  {
    employee: "Jessica Wu",
    role: "Chef",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00",
  },
  {
    employee: "David Wilson",
    role: "Front Staff",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00",
  },
  {
    employee: "Emma Thompson",
    role: "Front Staff",
    hours: "80 hrs",
    rate: "$22.00/hr",
    total: "$1,760.00",
  },
]


function TeamTabButton({
  item,
  isActive,
  onClick,
}: {
  item: TeamTabItem
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-white text-slate-700 shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      )}
      onClick={onClick}
    >
      <item.icon className="size-4" />
      <span>{item.label}</span>
    </button>
  )
}

function ScheduleTab({ schedule }: { schedule: DaySchedule[] }) {
  // compute readable week range
  const weekLabel = useMemo(() => {
    if (schedule.length === 0) return ""
    const first = schedule[0].date
    const last = schedule[schedule.length - 1].date
    return `Week of ${first} - ${last}`
  }, [schedule])

  return (
    <Card className="mt-6 border border-slate-200">
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-slate-800">{weekLabel}</h2>
            <button
              type="button"
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              aria-label="Previous week"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              aria-label="Next week"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <Button size="lg" className="h-10 bg-black">
            Publish Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {schedule.map((day) => (
            <div key={day.dayName} className="border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">{day.dayName}</p>
                <p className="text-sm text-slate-500">{day.date}</p>
              </div>
              <div className="mt-2 space-y-3">
                {day.shifts.map((shift, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-slate-500" />
                      <p className="text-sm font-medium text-slate-700">
                        {shift.start} - {shift.end}
                      </p>
                    </div>
                    <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                      {shift.employees.map((emp) => (
                        <li key={emp}>{emp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
              >
                Add Shift
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// icons and color maps for request types
const requestIconMap: Record<RequestType, LucideIcon> = {
  "Time Off": CalendarDays,
  "Shift Swap": Users,
}

const requestBgMap: Record<RequestType, string> = {
  "Time Off": "bg-amber-100 text-amber-600",
  "Shift Swap": "bg-blue-100 text-blue-600",
}

function RequestsTab({ requests }: { requests: StaffRequest[] }) {
  return (
    <Card className="mt-6 border border-slate-200">
      <CardContent>
        <h2 className="text-2xl font-semibold text-slate-900">
          Staff Requests
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage time-off requests and shift swaps.
        </p>

        <div className="mt-4 space-y-4">
          {requests.map((req) => {
            const Icon = requestIconMap[req.type]
            return (
              <div
                key={req.id}
                className="flex items-center gap-4 border-b border-slate-200 pb-4 last:border-b-0"
              >
                <div className={cn("rounded-full p-2", requestBgMap[req.type])}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">
                    {req.employee} · {req.type}
                  </p>
                  {req.dateRange && (
                    <p className="text-sm text-slate-500">{req.dateRange}</p>
                  )}
                  <p className="mt-1 text-sm text-slate-600 italic">
                    {req.note}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {req.status === "Pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
                      >
                        Approve
                      </Button>
                    </>
                  )}
                  {req.status === "Approved" && (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      Approved
                    </Badge>
                  )}
                  {req.status === "Rejected" && (
                    <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function PayrollTab({ payroll }: { payroll: PayrollEntry[] }) {
  return (
    <Card className="mt-6 border border-slate-200">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Payroll Overview
            </h2>
            <p className="text-sm text-slate-500">
              Salary period: Feb 1 – Feb 14
            </p>
          </div>
          <Button size="lg" className="h-10 bg-black">
            Run Payroll
          </Button>
        </div>

        <Table className="mt-4">
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Hours Worked</TableHead>
              <TableHead>Hourly Rate</TableHead>
              <TableHead>Total Pay</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payroll.map((p) => (
              <TableRow key={p.employee} className="border-t">
                <TableCell className="py-3">{p.employee}</TableCell>
                <TableCell className="py-3 text-slate-600">{p.role}</TableCell>
                <TableCell className="py-3">{p.hours}</TableCell>
                <TableCell className="py-3">{p.rate}</TableCell>
                <TableCell className="py-3 font-semibold text-emerald-600">
                  {p.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function TeamPlaceholder({ label }: { label: string }) {
  return (
    <Card className="mt-6 border border-dashed border-slate-200 bg-white shadow-sm">
      <CardContent className="flex min-h-64 items-center justify-center px-6 py-12 text-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {label}
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            This section is reserved for the next Team Management modules. The
            Staff Directory is fully available now.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState<TeamTab>("directory")
  const [isAddDialogOpen, setAddDialogOpen] = useState(false)

  const activeTabLabel = teamTabs.find((item) => item.key === activeTab)?.label

  return (
    <div className="p-6">
      <PageHeader
        title="Team Management"
        description="Manage staff, schedules, payroll, and access controls."
        right={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 border-slate-200 bg-white text-slate-600 shadow-sm"
            >
              <FileText className="size-4" />
              Export Payroll
            </Button>

            <Button
              type="button"
              size="lg"
              className="h-10"
              onClick={() => setAddDialogOpen(true)}
            >
              <UserPlus className="size-4" />
              Add Staff Member
            </Button>
          </div>
        }
      />

      <div className="mt-5 inline-flex flex-wrap rounded-lg bg-slate-100 p-1">
        {teamTabs.map((item) => (
          <TeamTabButton
            key={item.key}
            item={item}
            isActive={activeTab === item.key}
            onClick={() => setActiveTab(item.key)}
          />
        ))}
      </div>

      {activeTab === "directory" ? (
        <StaffDirectoryTab />
      ) : activeTab === "schedule" ? (
        <ScheduleTab schedule={scheduleSample} />
      ) : activeTab === "requests" ? (
        <RequestsTab requests={sampleRequests} />
      ) : activeTab === "payroll" ? (
        <PayrollTab payroll={samplePayroll} />
      ) : (
        <TeamPlaceholder label={activeTabLabel ?? "Team"} />
      )}

      {/* add staff dialog */}
      <AddStaffDialog
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
      />
    </div>
  )
}
