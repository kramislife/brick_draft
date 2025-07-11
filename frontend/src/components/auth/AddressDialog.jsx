import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const AddressDialog = ({
  open,
  onOpenChange,
  addressForm,
  setAddressForm,
  editingAddress,
  handleAddressFormChange,
  handleAddressFormSubmit,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? "Edit Address" : "Add a New Address"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is the address add/edit dialog
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddressFormSubmit} className="space-y-5 mt-2">
          {/* Country */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              name="country"
              placeholder="Enter Country"
              value={addressForm.country}
              onChange={handleAddressFormChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Address Label & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-2">
            <div className="space-y-2">
              <Label>Address Label</Label>
              <Input
                name="name"
                placeholder="Home, Work, etc."
                value={addressForm.name}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                name="contact_number"
                placeholder="Enter Phone Number"
                value={addressForm.contact_number}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="space-y-2">
            <Label>Street Address</Label>
            <Input
              name="address_line1"
              placeholder="Enter Street Address"
              value={addressForm.address_line1}
              onChange={handleAddressFormChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Apartment, suite, etc. */}
          <div className="space-y-2">
            <Label>Apartment, suite, etc. (optional)</Label>
            <Input
              name="address_line2"
              placeholder="Enter Apartment, suite, etc."
              value={addressForm.address_line2}
              onChange={handleAddressFormChange}
              disabled={isLoading}
            />
          </div>

          {/* City, State, Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-2">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                name="city"
                placeholder="Enter City"
                value={addressForm.city}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>State/Province</Label>
              <Input
                name="state"
                placeholder="Enter State/Province"
                value={addressForm.state}
                onChange={handleAddressFormChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>Postal Code</Label>
              <Input
                name="postal_code"
                placeholder="Enter Postal Code"
                value={addressForm.postal_code}
                onChange={handleAddressFormChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Default address checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={addressForm.is_default}
              onCheckedChange={(checked) =>
                setAddressForm((prev) => ({ ...prev, is_default: checked }))
              }
              disabled={isLoading}
            />
            <Label htmlFor="is_default">Set as default address</Label>
          </div>

          {/* Footer buttons */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingAddress
                ? "Update Address"
                : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
