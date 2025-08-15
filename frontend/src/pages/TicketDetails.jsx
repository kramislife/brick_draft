import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Confetti from "react-confetti";
import { CheckCircle, ArrowLeft, X, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TicketDetailsCard from "@/components/ticket-details/TicketDetailsCard";
import ShippingAddressCard from "@/components/ticket-details/ShippingAddressCard";
import PaymentSummary from "@/components/ticket-details/PaymentSummary";
import TicketIdsGrid from "@/components/ticket-details/TicketIdsGrid";
import PriorityListDialog from "@/components/ticket-details/PriorityListDialog";
import {
  useGetPaymentSuccessDetailsQuery,
  useGetPriorityListQuery,
  useCreatePriorityListMutation,
  useUpdatePriorityListMutation,
  useDeletePriorityListMutation,
  paymentApi,
} from "@/redux/api/paymentApi";

const TicketDetails = () => {
  const { purchaseId } = useParams();
  const dispatch = useDispatch();

  // General state
  const [copied, setCopied] = useState(false);
  const [copiedTicketId, setCopiedTicketId] = useState(null);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);

  // Priority list state
  const [selectedParts, setSelectedParts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [selectAllLoading, setSelectAllLoading] = useState(false);
  const [isSelectAllMode, setIsSelectAllMode] = useState(false);

  // Pagination state
  const [paginationParams, setPaginationParams] = useState({
    sort: "name", // Set initial sort to trigger proper sorting from the start
    page: 1,
    limit: 20,
  });

  // Wrapper function to handle pagination changes and reset select all mode
  const handlePaginationChange = (params) => {
    setPaginationParams(params);
    setIsSelectAllMode(false);
  };

  const copyToClipboard = async (text, type = "general") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "ticket") {
        setCopiedTicketId(text);
        setTimeout(() => setCopiedTicketId(null), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const {
    data,
    isLoading: loading,
    error,
  } = useGetPaymentSuccessDetailsQuery(purchaseId, {
    skip: !purchaseId,
  });

  // Priority list queries
  const {
    data: priorityListData,
    isLoading,
    refetch,
  } = useGetPriorityListQuery(
    { purchaseId, params: paginationParams },
    { skip: !purchaseId }
  );
  const [createPriorityList] = useCreatePriorityListMutation();
  const [updatePriorityList] = useUpdatePriorityListMutation();
  const [deletePriorityList] = useDeletePriorityListMutation();

  // Check if priority list exists (for button text)
  const {
    data: existingPriorityListData,
    isLoading: isExistingPriorityLoading,
  } = useGetPriorityListQuery(
    { purchaseId, params: {} },
    { skip: !purchaseId }
  );

  const hasPriorityList = !!existingPriorityListData?.priorityList;

  // Auto-open PriorityListDialog once after successful payment
  useEffect(() => {
    if (data && purchaseId && data.payment_status === "paid") {
      const shownKey = `priorityDialogShown_${purchaseId}`;
      const hasBeenShown = localStorage.getItem(shownKey);

      if (!hasBeenShown) {
        // Auto-open dialog after a short delay
        setTimeout(() => {
          setPriorityDialogOpen(true);
          toast.success(
            "Set your priority list to get your favorite pieces first!",
            {
              duration: 4000,
            }
          );
        }, 1500); // Delay to let confetti animation play first

        // Mark as shown so it won't open again
        localStorage.setItem(shownKey, "true");
      }
    }
  }, [data, purchaseId]);

  // When data loads, set selectedParts from priorityList
  useEffect(() => {
    if (priorityListData?.priorityList?.priorityItems) {
      setSelectedParts(priorityListData.priorityList.priorityItems);
    } else {
      // Clear selected parts if no priority list or empty priority items
      setSelectedParts([]);
    }
  }, [priorityListData?.priorityList?.priorityItems]);

  // Compute available parts (not in selectedParts)
  const availableParts = useMemo(() => {
    if (!priorityListData?.parts) return [];
    const selectedIds = new Set(selectedParts.map((p) => p.item._id || p.item));
    return priorityListData.parts.filter((part) => !selectedIds.has(part._id));
  }, [priorityListData, selectedParts]);

  // Add part to priority list
  const handleAddPart = (part) => {
    if (selectedParts.some((p) => (p.item._id || p.item) === part._id)) return;
    setSelectedParts([
      ...selectedParts,
      {
        item: part,
        priority: selectedParts.length + 1,
      },
    ]);
    setIsSelectAllMode(false);
  };

  // Remove part from priority list
  const handleRemovePart = (partId) => {
    setSelectedParts(
      selectedParts.filter((p) => (p.item._id || p.item) !== partId)
    );
  };

  // Move part up in priority list
  const handleMoveUp = (index) => {
    if (index === 0) return; // Can't move up if already at top

    const newSelectedParts = [...selectedParts];
    const temp = newSelectedParts[index];
    newSelectedParts[index] = newSelectedParts[index - 1];
    newSelectedParts[index - 1] = temp;

    setSelectedParts(newSelectedParts);
  };

  // Move part down in priority list
  const handleMoveDown = (index) => {
    if (index === selectedParts.length - 1) return; // Can't move down if already at bottom

    const newSelectedParts = [...selectedParts];
    const temp = newSelectedParts[index];
    newSelectedParts[index] = newSelectedParts[index + 1];
    newSelectedParts[index + 1] = temp;

    setSelectedParts(newSelectedParts);
  };

  // Save priority list
  const handleSave = async () => {
    setSaving(true);
    try {
      const priorityItems = selectedParts.map((p, i) => ({
        item: p.item._id || p.item,
        priority: i + 1,
      }));

      let result;
      if (priorityListData?.priorityList) {
        // Update existing priority list
        result = await updatePriorityList({
          purchaseId,
          priorityItems,
        }).unwrap();
      } else {
        // Create new priority list
        result = await createPriorityList({
          purchaseId,
          priorityItems,
        }).unwrap();
      }

      refetch();
      setPriorityDialogOpen(false);
      toast.success(result?.message || "Priority list saved successfully");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to save priority list"
      );
    } finally {
      setSaving(false);
    }
  };

  // Select all parts for the lottery set (not just current page)
  const handleSelectAll = async () => {
    setSelectAllLoading(true);
    setIsSelectAllMode(true);
    try {
      const result = await dispatch(
        paymentApi.endpoints.getPriorityList.initiate({
          purchaseId,
          params: {
            ...paginationParams,
            limit: "all",
          },
        })
      ).unwrap();
      const allParts = result.parts || [];
      const selectedIds = new Set(
        selectedParts.map((p) => p.item._id || p.item)
      );
      const toAdd = allParts.filter((part) => !selectedIds.has(part._id));
      setSelectedParts([
        ...selectedParts,
        ...toAdd.map((part, idx) => ({
          item: part,
          priority: selectedParts.length + idx + 1,
        })),
      ]);
      toast.success("All parts added to your priority list");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to select all parts"
      );
    } finally {
      setSelectAllLoading(false);
    }
  };

  // Clear all selected parts
  const handleClearAll = () => {
    setSelectedParts([]);
    setIsSelectAllMode(false);
    toast.success("Priority list cleared");
  };

  // Pagination helpers
  const totalPages = priorityListData?.totalPages || 1;
  const currentPage = priorityListData?.page || 1;
  const startEntry = priorityListData?.startEntry || 0;
  const endEntry = priorityListData?.endEntry || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-muted rounded-full mx-auto mb-5"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Loading your tickets...</h2>
            <p className="text-muted-foreground text-sm">
              Please wait a moment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-5">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Tickets Not Found
          </h2>
          <p className="text-muted-foreground mb-5">
            {error?.data?.message ||
              error?.message ||
              "The tickets you're looking for don't exist or you don't have permission to view them."}
          </p>
          <Link to="/">
            <Button variant="destructive" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { tickets, ticket_count, lottery } = data;
  const address = data.address || {};
  const shippingAddress = {
    ...address,
    address_line1: address?.line1,
    address_line2: address?.line2,
  };
  const paymentSummary = {
    payment_reference: data.payment_reference,
    payment_method: data.payment_method,
    address_type: data.address_type,
    ticket_price: data.tickets?.[0]?.ticket_price || 0,
    quantity: data.quantity || 1,
    subtotal: (data.tickets?.[0]?.ticket_price || 0) * (data.quantity || 1),
    shipping_fee: data.shipping_fee || 0,
    tax: data.tax || 0,
    total: data.amount_total / 100 || 0,
  };

  return (
    <div className="min-h-screen px-5 py-10">
      <Confetti
        numberOfPieces={150}
        recycle={false}
        gravity={0.15}
        colors={["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"]}
      />

      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full mb-5">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-5">
          Payment Successful!
        </h1>
        <p className=" text-muted-foreground max-w-xl mx-auto mb-5">
          🎉 Congratulations! Your {ticket_count} lottery ticket
          {ticket_count > 1 ? "s have" : " has"} been confirmed. Good luck in
          the upcoming draw!
        </p>
        <Button
          variant="accent"
          className="gap-2"
          onClick={() => {
            setPriorityDialogOpen(true);
          }}
          disabled={
            isExistingPriorityLoading || lottery?.lottery_status === "completed"
          }
        >
          <ListTodo className="w-4 h-4" />
          {isExistingPriorityLoading
            ? "Loading..."
            : lottery?.lottery_status === "completed"
            ? "Lottery Completed"
            : hasPriorityList
            ? "Update Priority List"
            : "Set Priority List"}
        </Button>
      </div>

      <PriorityListDialog
        open={priorityDialogOpen}
        onClose={() => {
          setPriorityDialogOpen(false);
        }}
        // Data props
        selectedParts={selectedParts}
        availableParts={availableParts}
        totalPages={totalPages}
        currentPage={currentPage}
        startEntry={startEntry}
        endEntry={endEntry}
        // Handler props
        handleAddPart={handleAddPart}
        handleRemovePart={handleRemovePart}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleSave={handleSave}
        handleSelectAll={handleSelectAll}
        handleClearAll={handleClearAll}
        // Loading states
        saving={saving}
        selectAllLoading={selectAllLoading}
        isLoading={isLoading}
        // Data from API
        data={priorityListData}
        // Callback for when params change
        onParamsChange={handlePaginationChange}
        // Select all mode state
        isSelectAllMode={isSelectAllMode}
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <TicketDetailsCard lottery={lottery} />
          <ShippingAddressCard
            shippingAddress={shippingAddress}
            addressType={data.address_type}
          />
        </div>
        <div className="lg:sticky lg:top-5 lg:self-start space-y-5">
          <TicketIdsGrid
            tickets={tickets}
            ticket_count={ticket_count}
            copyToClipboard={(id) => copyToClipboard(id, "ticket")}
            copiedTicketId={copiedTicketId}
          />
          <PaymentSummary
            summary={paymentSummary}
            copyToClipboard={copyToClipboard}
            copied={copied}
            setCopied={setCopied}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
