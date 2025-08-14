import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ViewLayout from "@/components/admin/shared/ViewLayout";
import { useGetAllTicketsQuery } from "@/redux/api/paymentApi";

const Tickets = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useGetAllTicketsQuery();
  const tickets = data?.tickets || [];

  const columns = [
    {
      accessorKey: "purchaseId",
      header: "Purchase ID",
      cell: ({ row }) => (
        <div className="font-mono">{row.original.purchase_id}</div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.original.customer_name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.customer_email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "lotterySet",
      header: "Lottery Set",
      cell: ({ row }) => row.original.lottery_set,
    },
    {
      accessorKey: "purchaseDate",
      header: "Purchase Date",
      cell: ({ row }) => row.original.purchase_date,
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <Badge className=" bg-emerald-100 text-emerald-600">
          ${Number(row.original.total_amount).toFixed(2)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(row.original)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <ViewLayout
        title="Tickets"
        description="Manage lottery tickets and purchases."
        columns={columns}
        data={tickets}
        isLoading={isLoading}
      />
    </>
  );
};

export default Tickets;
