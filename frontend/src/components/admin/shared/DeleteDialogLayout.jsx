import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const DeleteDialogLayout = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  itemType = "item",
  isLoading = false,
}) => {
  const defaultTitle = `Delete ${itemType}`;
  const defaultDescription = itemName ? (
    <>
      Are you sure you want to delete{" "}
       <span className="font-bold text-destructive">{itemName}</span>? This
      action cannot be undone.
    </>
  ) : (
    <>
      Are you sure you want to delete this{" "}
      <span className="font-bold text-destructive">{itemType}</span>? This
      action cannot be undone.
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive pb-2">
            <AlertTriangle className="h-5 w-5" />
            {title || defaultTitle}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialogLayout;
