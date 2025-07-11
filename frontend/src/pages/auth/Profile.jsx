import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, updateUser } from "@/redux/features/authSlice";
import {
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "@/redux/api/authApi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  MapPin,
  Edit2,
  Image as ImageIcon,
  Trash2,
  Star,
} from "lucide-react";
import DeleteDialogLayout from "@/components/admin/shared/DeleteDialogLayout";
import AddressDialog from "@/components/auth/AddressDialog";

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const {
    data: addressesData,
    isLoading: isLoadingAddresses,
    refetch,
  } = useGetAddressesQuery();
  const addresses = addressesData?.addresses || [];
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    contact_number: user?.contact_number || "",
    image: user?.profile_picture?.url || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profile_picture?.url || ""
  );
  const fileInputRef = useRef(null);

  // Address form state
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: "",
    contact_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    is_default: false,
  });

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const openAddAddressDialog = () => {
    setEditingAddress(null);
    setAddressForm({
      name: "",
      contact_number: user?.contact_number || "",
      address_line1: "",
      address_line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      is_default: false,
    });
    setIsAddressDialogOpen(true);
  };
  const openEditAddressDialog = (address) => {
    setEditingAddress(address);
    setAddressForm({ ...address });
    setIsAddressDialogOpen(true);
  };
  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleAddressFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        const result = await updateAddress({
          id: editingAddress._id,
          ...addressForm,
        }).unwrap();
        toast.success(result.message || "Address updated!", {
          description: result.description || undefined,
        });
      } else {
        const result = await addAddress(addressForm).unwrap();
        toast.success(result.message || "Address added!", {
          description: result.description || undefined,
        });
      }
      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      setAddressForm({
        name: "",
        contact_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        is_default: false,
      });
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Failed to save address", {
        description: err.data?.description || undefined,
      });
    }
  };
  const handleDeleteAddress = (address) => {
    setAddressToDelete(address);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteAddress = async () => {
    try {
      const result = await deleteAddress(addressToDelete._id).unwrap();
      toast.success(result.message || "Address deleted!", {
        description: result.description || undefined,
      });
      refetch();
      setIsDeleteDialogOpen(false);
      setAddressToDelete(null);
    } catch (err) {
      toast.error(err.data?.message || "Failed to delete address", {
        description: err.data?.description || undefined,
      });
    }
  };

  const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] =
    useUpdateAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-2" />
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <p className="text-muted-foreground">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  // Avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Image upload logic (base64)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        setFormData((prev) => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile info edit
  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: user.name,
      username: user.username,
      contact_number: user.contact_number,
      image: user.profile_picture?.url || "",
    });
  };
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleProfileSave = async () => {
    try {
      const updatePayload = {
        name: formData.name,
        contact_number: formData.contact_number,
        image: formData.image,
      };
      const result = await updateProfile(updatePayload).unwrap();
      toast.success(result.message || "Profile updated!", {
        description: result.description || undefined,
      });
      setEditMode(false);
      dispatch(updateUser(result.user));
    } catch (err) {
      toast.error(err.data?.message || "Failed to update profile", {
        description: err.data?.description || undefined,
      });
    }
  };

  // Get default address for summary card
  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
  const locationString = defaultAddress
    ? [defaultAddress.city, defaultAddress.state, defaultAddress.country]
        .filter(Boolean)
        .join(", ")
    : "-";

  return (
    <div className=" py-10 px-5">
      <h1 className="text-3xl font-bold mb-2">Profile</h1>
      <p className="text-muted-foreground mb-8">
        Manage your account settings and preferences
      </p>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Profile summary */}
        <div className="bg-card rounded-2xl shadow p-6 w-full md:w-1/3 flex flex-col items-center gap-4 border border-border">
          <div className="relative group">
            <Avatar className="h-28 w-28 text-4xl">
              <AvatarImage src={avatarPreview} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
              disabled={!editMode}
            />
            {editMode && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 rounded-full shadow group-hover:opacity-100 opacity-80"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl font-bold">{user.name}</span>
            <span className="text-muted-foreground text-sm">
              @{user.username}
            </span>
            <Badge
              variant={user.is_verified ? "accent" : "destructive"}
              className="mt-1"
            >
              {user.is_verified ? (
                <>
                  <CheckCircle className="inline mr-1 h-4 w-4" /> Verified
                </>
              ) : (
                <>
                  <XCircle className="inline mr-1 h-4 w-4" /> Not Verified
                </>
              )}
            </Badge>
            {user.role !== "customer" && (
              <Badge variant="secondary" className="mt-1">
                <Star className="h-4 w-4 mr-1" />{" "}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4 w-full">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" /> {user.email}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {locationString}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" /> Joined{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Right: Profile info and addresses */}
        <div className="flex-1 bg-card rounded-2xl shadow p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            {!editMode ? (
              <Button onClick={handleEdit} variant="default">
                <Edit2 className="h-4 w-4 mr-1" /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleProfileSave} isLoading={isUpdating}>
                  Save
                </Button>
              </div>
            )}
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleProfileChange}
                disabled={!editMode}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleProfileChange}
                disabled={!editMode}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input name="email" value={user.email} disabled />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input
                name="contact_number"
                value={formData.contact_number}
                onChange={handleProfileChange}
                disabled={!editMode}
              />
            </div>
          </form>

          {/* Addresses */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Addresses
              </h3>
              {editMode && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={openAddAddressDialog}
                >
                  Add Address
                </Button>
              )}
            </div>
            {isLoadingAddresses ? (
              <div className="text-muted-foreground">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="text-muted-foreground">No addresses found.</div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-muted/50"
                  >
                    <div>
                      <div className="font-semibold">{address.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {address.address_line1}
                        {address.address_line2
                          ? ", " + address.address_line2
                          : ""}
                        {", " + address.city}
                        {address.state ? ", " + address.state : ""}
                        {", " + address.country}
                        {", " + address.postal_code}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {address.contact_number}
                      </div>
                    </div>
                    {address.is_default && (
                      <Badge
                        variant="accent"
                        className="self-start md:self-center"
                      >
                        Default
                      </Badge>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditAddressDialog(address)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDeleteAddress(address)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Address Add/Edit Dialog */}
      <AddressDialog
        open={isAddressDialogOpen}
        onOpenChange={setIsAddressDialogOpen}
        addressForm={addressForm}
        setAddressForm={setAddressForm}
        editingAddress={editingAddress}
        handleAddressFormChange={handleAddressFormChange}
        handleAddressFormSubmit={handleAddressFormSubmit}
        isLoading={isAdding || isUpdatingAddress}
      />

      {/* Delete Address Dialog */}
      <DeleteDialogLayout
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteAddress}
        itemName={addressToDelete?.name + " Address" || "this address"}
        itemType="Address"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Profile;
