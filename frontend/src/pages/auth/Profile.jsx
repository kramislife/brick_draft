import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, updateUser } from "@/redux/features/authSlice";
import {
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
  useGetAddressesQuery,
  // You should implement useAddAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation for full CRUD
} from "@/redux/api/authApi";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  MapPin,
  Edit2,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Star,
} from "lucide-react";

// Cloudinary upload logic (frontend, using unsigned preset)
const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "brick_draft/avatars");
  data.append("folder", "brick_draft/avatars");
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );
  const result = await res.json();
  if (!result.secure_url) throw new Error("Upload failed");
  return { public_id: result.public_id, url: result.secure_url };
};

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
  const [updateAvatar] = useUpdateAvatarMutation();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    contact_number: user?.contact_number || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(
    user?.profile_picture?.url || ""
  );
  const fileInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Address form state
  const [addressForm, setAddressForm] = useState({
    name: "",
    contact_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    country_code: "",
    is_default: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

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

  // Handle avatar upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      // Upload to Cloudinary
      const imageData = await uploadToCloudinary(file);
      setAvatarPreview(imageData.url);
      // Update backend
      await updateAvatar({ avatar: imageData.url }).unwrap();
      toast.success("Profile picture updated!");
      dispatch(updateUser({ profile_picture: imageData }));
    } catch (err) {
      toast.error("Failed to upload avatar");
    } finally {
      setAvatarUploading(false);
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
    });
  };
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleProfileSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated!");
      setEditMode(false);
      dispatch(updateUser(formData));
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // Address form handlers (add only, for now)
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      // Call backend to add address (implement mutation if needed)
      // await addAddress(addressForm).unwrap();
      toast.success("Address added!");
      setShowAddressForm(false);
      setAddressForm({
        name: "",
        contact_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
        country_code: "",
        is_default: false,
      });
      refetch();
    } catch (err) {
      toast.error("Failed to add address");
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
              disabled={avatarUploading}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute bottom-2 right-2 rounded-full shadow group-hover:opacity-100 opacity-80"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
            >
              {avatarUploading ? (
                <UploadCloud className="animate-spin h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </Button>
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
                <Button
                  onClick={handleProfileSave}
                  variant="accent"
                  isLoading={isUpdating}
                >
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
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
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowAddressForm((v) => !v)}
              >
                Add Address
              </Button>
            </div>
            {showAddressForm && (
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-muted/50 p-4 rounded-lg mb-4"
                onSubmit={handleAddAddress}
              >
                <Input
                  name="name"
                  placeholder="Address Name"
                  value={addressForm.name}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  name="contact_number"
                  placeholder="Phone"
                  value={addressForm.contact_number}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  name="address_line1"
                  placeholder="Address Line 1"
                  value={addressForm.address_line1}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  name="address_line2"
                  placeholder="Address Line 2"
                  value={addressForm.address_line2}
                  onChange={handleAddressChange}
                />
                <Input
                  name="city"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  name="state"
                  placeholder="State"
                  value={addressForm.state}
                  onChange={handleAddressChange}
                />
                <Input
                  name="postal_code"
                  placeholder="Postal Code"
                  value={addressForm.postal_code}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  name="country"
                  placeholder="Country"
                  value={addressForm.country}
                  onChange={handleAddressChange}
                  required
                />
                <Input
                  name="country_code"
                  placeholder="Country Code"
                  value={addressForm.country_code}
                  onChange={handleAddressChange}
                />
                <label className="flex items-center gap-2 col-span-2">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={addressForm.is_default}
                    onChange={handleAddressChange}
                  />
                  Set as default
                </label>
                <div className="col-span-2 flex gap-2 justify-end">
                  <Button type="submit" variant="accent" size="sm">
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddressForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
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
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
