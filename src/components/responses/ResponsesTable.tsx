"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  FileTextIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteResponseDialog } from "@/components/responses/DeleteResponseDialog";
import { ResponseEditDialog } from "@/components/responses/ResponseEditDialog";
import { ResponseViewDialog } from "@/components/responses/ResponseViewDialog";
import { getResponseColumns } from "@/components/responses/columns";
import { useExportCsv, useResponses } from "@/hooks/useResponses";
import { EDUCATION_LEVELS } from "@/schemas/survey.schema";
import type {
  EducationLevel,
  ResponseSort,
  SurveyResponse,
} from "@/types";

const PAGE_SIZES = [10, 20, 50];

const resolveSort = (sorting: SortingState): ResponseSort => {
  const first = sorting[0];
  if (!first) return "newest";

  switch (first.id) {
    case "fullName":
      return first.desc ? "name-desc" : "name-asc";
    case "age":
      return first.desc ? "age-desc" : "age-asc";
    case "createdAt":
      return first.desc ? "newest" : "oldest";
    default:
      return "newest";
  }
};

export function ResponsesTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState<
    EducationLevel | undefined
  >(undefined);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [viewTarget, setViewTarget] = useState<SurveyResponse | null>(null);
  const [editTarget, setEditTarget] = useState<SurveyResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SurveyResponse | null>(
    null
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
      educationLevel,
      sort: resolveSort(sorting),
    }),
    [page, limit, search, educationLevel, sorting]
  );

  const { data, isLoading, isError, isFetching, refetch } =
    useResponses(params);
  const exportCsv = useExportCsv();

  const columns = useMemo(
    () =>
      getResponseColumns({
        onView: setViewTarget,
        onEdit: setEditTarget,
        onDelete: setDeleteTarget,
      }),
    []
  );

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    pageCount: data?.totalPages ?? 1,
    state: { sorting, pagination },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      setPage(1);
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      setPage(next.pageIndex + 1);
      setLimit(next.pageSize);
    },
  });

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const hasFilters = search.length > 0 || Boolean(educationLevel);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setEducationLevel(undefined);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search name, university, department, phone"
              className="pl-8 sm:w-80"
            />
          </div>

          <Select
            value={educationLevel ?? "all"}
            onValueChange={(value) => {
              setEducationLevel(
                value === "all" ? undefined : (value as EducationLevel)
              );
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={() => exportCsv.mutate()}
          disabled={exportCsv.isPending || total === 0}
        >
          <DownloadIcon />
          {exportCsv.isPending ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {isError ? (
        <Card>
          <CardHeader>
            <CardTitle>Could not load responses</CardTitle>
            <CardDescription>
              Check that the API server is running and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                className={isFetching && !isLoading ? "opacity-60" : undefined}
              >
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, rowIndex) => (
                    <TableRow key={`skeleton-${rowIndex}`}>
                      {columns.map((_, cellIndex) => (
                        <TableCell key={`skeleton-${rowIndex}-${cellIndex}`}>
                          <Skeleton className="h-4 w-full max-w-32" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className="flex flex-col items-center gap-2 py-12 text-center">
                        <span className="flex size-10 items-center justify-center rounded-full bg-muted">
                          <FileTextIcon className="size-5 text-muted-foreground" />
                        </span>
                        <p className="text-sm font-medium">
                          No responses found
                        </p>
                        <p className="max-w-sm text-sm text-muted-foreground">
                          {hasFilters
                            ? "Try a different search or education level filter."
                            : "Responses will appear here after the public survey is submitted."}
                        </p>
                        {hasFilters && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                          >
                            <XIcon />
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {start}-{end} of {total} responses
              {isFetching && !isLoading ? " (updating)" : ""}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={String(limit)}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger size="sm" className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} / page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1 || isLoading}
              >
                <ChevronLeftIcon />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page >= totalPages || isLoading}
              >
                Next
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </>
      )}

      <ResponseViewDialog
        response={viewTarget}
        open={Boolean(viewTarget)}
        onOpenChange={(open) => {
          if (!open) setViewTarget(null);
        }}
      />
      <ResponseEditDialog
        response={editTarget}
        open={Boolean(editTarget)}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null);
        }}
      />
      <DeleteResponseDialog
        response={deleteTarget}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
