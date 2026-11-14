"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/lib/utils";
import type { SurveyResponse } from "@/types";

export interface ResponseColumnActions {
  onView: (response: SurveyResponse) => void;
  onEdit: (response: SurveyResponse) => void;
  onDelete: (response: SurveyResponse) => void;
}

const sortableHeader = (title: string) => {
  const Header = ({ column }: { column: Column<SurveyResponse, unknown> }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-7 gap-1"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDownIcon className="size-3.5 text-muted-foreground" />
    </Button>
  );
  Header.displayName = `${title}Header`;
  return Header;
};

export function getResponseColumns({
  onView,
  onEdit,
  onDelete,
}: ResponseColumnActions): ColumnDef<SurveyResponse>[] {
  return [
    {
      accessorKey: "fullName",
      header: sortableHeader("Name"),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.fullName}</span>
      ),
    },
    {
      accessorKey: "age",
      header: sortableHeader("Age"),
    },
    {
      accessorKey: "gender",
      header: "Gender",
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.gender}</Badge>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      enableSorting: false,
    },
    {
      accessorKey: "educationLevel",
      header: "Education",
      enableSorting: false,
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.educationLevel}</Badge>
      ),
    },
    {
      accessorKey: "university",
      header: "University",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="block max-w-52 truncate">
          {row.original.university}
        </span>
      ),
    },
    {
      accessorKey: "occupation",
      header: "Occupation",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.occupation ?? "-"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: sortableHeader("Submitted"),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onView(row.original)}>
                <EyeIcon />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <PencilIcon />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
