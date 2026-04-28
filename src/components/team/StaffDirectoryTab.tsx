import { useMemo, useState } from "react"
import { Filter, Key, Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStaffQuery } from "@/hooks/useStaffQuery"
import { cn } from "@/lib/utils"

const statusColorMap: Record<string, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Training: "border-amber-200 bg-amber-50 text-amber-700",
}

function formatStartDate(value: string) {
  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function StaffDirectoryTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, isError, refetch, isFetching } = useStaffQuery(page, limit)

  const filteredStaff = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const staff = data?.staff ?? []

    if (!normalizedQuery) {
      return staff
    }

    return staff.filter((member) =>
      [
        member.fullName,
        member.email,
        member.phone,
        member.role,
        member.employmentType,
        member.branch,
        member.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
  }, [data?.staff, searchQuery])

  const pagination = data?.pagination
  const showingFrom =
    filteredStaff.length === 0 || !pagination ? 0 : (pagination.page - 1) * pagination.limit + 1
  const showingTo =
    filteredStaff.length === 0 || !pagination
      ? 0
      : showingFrom + filteredStaff.length - 1

  return (
    <Card className="mt-6 border border-slate-200/80 bg-white py-0 shadow-sm">
      <CardContent className="px-0">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search staff by name, role, or contact..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-sm text-slate-700 shadow-none placeholder:text-slate-400"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            className="h-10 shrink-0 justify-start text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          >
            <Filter className="size-4" />
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Loading staff directory...
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
            <p className="text-sm text-slate-500">
              Unable to load the staff directory right now.
            </p>
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="border-slate-200 bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="px-5 py-4 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      Name
                    </TableHead>
                    <TableHead className="py-4 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      Role
                    </TableHead>
                    <TableHead className="py-4 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      Status
                    </TableHead>
                    <TableHead className="py-4 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      Branch
                    </TableHead>
                    <TableHead className="py-4 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      Start Date
                    </TableHead>
                    <TableHead className="py-4 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      Login Code
                    </TableHead>
                    <TableHead className="py-4 pr-5 text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      Access
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((member) => (
                      <TableRow key={member.id} className="border-slate-100">
                        <TableCell className="px-5 py-5 align-middle whitespace-normal">
                          <div className="flex items-center gap-3">
                            <Avatar size="lg" className="ring-1 ring-slate-200/80">
                              <AvatarImage src={member.avatarUrl} alt={member.fullName} />
                              <AvatarFallback>
                                {member.fullName
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p className="text-[15px] leading-tight font-semibold text-slate-800">
                                {member.fullName}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {member.employmentType}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-5 whitespace-normal">
                          <Badge
                            variant="outline"
                            className="h-8 rounded-full border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600"
                          >
                            {member.role}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-5">
                          <Badge
                            variant="outline"
                            className={cn(
                              "h-7 rounded-full px-3 text-[13px] font-semibold",
                              statusColorMap[member.status] ??
                                "border-slate-200 bg-slate-50 text-slate-600"
                            )}
                          >
                            {member.status}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-5 text-[15px] whitespace-normal text-slate-500">
                          {member.branch}
                        </TableCell>

                        <TableCell className="py-5 text-[15px] text-slate-500">
                          {formatStartDate(member.startDate)}
                        </TableCell>

                        <TableCell className="py-5">
                          <Badge
                            variant="secondary"
                            className="h-8 rounded-lg bg-slate-100 px-3 text-[13px] font-semibold text-slate-500"
                          >
                            {member.loginCode}
                          </Badge>
                        </TableCell>

                        <TableCell className="py-5 pr-5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            aria-label={`Manage access for ${member.fullName}`}
                          >
                            <Key className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="px-5 py-12 text-center text-sm text-slate-500"
                      >
                        {searchQuery.trim()
                          ? "No staff matched your search on this page."
                          : "No staff found for this page."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <div>
                Showing {showingFrom}-{showingTo} of {pagination?.total ?? 0} staff
                members
              </div>

              <div className="flex items-center gap-2">
                {isFetching && !isLoading ? (
                  <span className="text-xs text-slate-400">Refreshing...</span>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!pagination?.hasPrevPage}
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!pagination?.hasNextPage}
                  onClick={() => setPage((currentPage) => currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
