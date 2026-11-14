"use client";

import { Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteResponse } from "@/hooks/useDeleteResponse";
import type { SurveyResponse } from "@/types";

export function DeleteResponseDialog({
  response,
  open,
  onOpenChange,
}: {
  response: SurveyResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const deleteResponse = useDeleteResponse();

  const handleDelete = () => {
    if (!response) return;
    deleteResponse.mutate(response.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this response?</AlertDialogTitle>
          <AlertDialogDescription>
            The response from {response?.fullName ?? "this respondent"} will be
            permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteResponse.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteResponse.isPending}
          >
            {deleteResponse.isPending ? "Deleting..." : "Delete response"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
