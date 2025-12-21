"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  ShoppingBag,
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  MapPin,
  User,
  Calendar,
  Eye,
  RefreshCw,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Separator } from "../../../components/ui/separator";
import { useToast } from "../../../components/ui/use-toast";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";

interface Product {
  id: string;
  salonId: string;
  title: string;
  sku?: string;
  price: string;
  quantity: number;
  images?: string[];
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product: Product;
}

interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface Salon {
  id: string;
  ownerId?: string;
  name: string;
  address?: string;
  verified?: boolean;
}

interface Order {
  id: string;
  userId: string;
  salonId: string;
  total: string;
  status:
    | "PENDING"
    | "PAYMENT_PENDING"
    | "PAYMENT_FAILED"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
  notes?: string;
  createdAt: string;
  orderItems: OrderItem[];
  address?: Address;
  salon?: Salon;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<Order["status"]>("PENDING");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [activeTab, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to view orders",
          variant: "destructive",
        });
        return;
      }

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      if (activeTab !== "all") {
        params.append("status", activeTab.toUpperCase());
      }

      const queryString = params.toString();
      const response = await fetch(`/api/orders?${queryString}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setOrders(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSelectedOrder(result.data);
        setShowDetailsDialog(true);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch order details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        });
        setShowStatusDialog(false);
        setShowDetailsDialog(false);
        await fetchOrders();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update order status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Order cancelled successfully",
        });
        setShowDetailsDialog(false);
        await fetchOrders();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to cancel order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "PAYMENT_PENDING":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            <CreditCard className="w-3 h-3 mr-1" />
            Payment Pending
          </Badge>
        );
      case "PAYMENT_FAILED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Payment Failed
          </Badge>
        );
      case "CONFIRMED":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Package className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Truck className="w-3 h-3 mr-1" />
            Shipped
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "PAYMENT_PENDING":
        return <CreditCard className="w-5 h-5 text-orange-600" />;
      case "PAYMENT_FAILED":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "CONFIRMED":
        return <Package className="w-5 h-5 text-blue-600" />;
      case "SHIPPED":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getValidNextStatuses = (
    currentStatus: Order["status"]
  ): Order["status"][] => {
    switch (currentStatus) {
      case "PENDING":
        return ["PAYMENT_PENDING", "CONFIRMED", "CANCELLED"];
      case "PAYMENT_PENDING":
        return ["CONFIRMED", "PAYMENT_FAILED", "CANCELLED"];
      case "PAYMENT_FAILED":
        return ["PAYMENT_PENDING", "CANCELLED"];
      case "CONFIRMED":
        return ["SHIPPED", "CANCELLED"];
      case "SHIPPED":
        return ["DELIVERED"];
      case "DELIVERED":
      case "CANCELLED":
        return [];
      default:
        return [];
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.salon?.name?.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    );
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    paymentPending: orders.filter((o) => o.status === "PAYMENT_PENDING").length,
    confirmed: orders.filter((o) => o.status === "CONFIRMED").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-col md:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            Orders
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track all product orders
          </p>
        </div>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{pagination.total}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{orderStats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Payment</p>
                <p className="text-2xl font-bold">
                  {orderStats.paymentPending}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{orderStats.confirmed}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Shipped</p>
                <p className="text-2xl font-bold">{orderStats.shipped}</p>
              </div>
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold">{orderStats.delivered}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold">{orderStats.cancelled}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search orders by ID, salon, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="payment_pending">Payment</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="payment_failed">Failed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <RefreshCw className="w-8 h-8 mx-auto animate-spin text-primary mb-3" />
                <p className="text-muted-foreground">Loading orders...</p>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            {getStatusIcon(order.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">
                                Order #{order.id.substring(0, 8)}
                              </h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                              {order.salon && (
                                <div className="flex items-center gap-1">
                                  <ShoppingBag className="w-3 h-3" />
                                  <span className="truncate">
                                    {order.salon.name}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />$
                                {parseFloat(order.total).toFixed(2)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {order.address && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>
                                  {order.address.city}, {order.address.state}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(order.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Pagination - Add after TabsContent and before closing Dialog */}
      {!loading && filteredOrders.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {orders.length} of {pagination.total} orders
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={currentPage === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && `Order #${selectedOrder.id.substring(0, 12)}`}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <Separator />

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-medium text-xs break-all">
                    {selectedOrder.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Amount
                  </p>
                  <p className="font-medium text-lg">
                    ${parseFloat(selectedOrder.total).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Date
                  </p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedOrder.salon && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Salon</p>
                    <p className="font-medium">{selectedOrder.salon.name}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Delivery Address */}
              {selectedOrder.address && (
                <>
                  <div>
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1 pl-6">
                      <p className="font-medium text-foreground">
                        {selectedOrder.address.name}
                      </p>
                      <p>{selectedOrder.address.phone}</p>
                      <p>{selectedOrder.address.addressLine1}</p>
                      {selectedOrder.address.addressLine2 && (
                        <p>{selectedOrder.address.addressLine2}</p>
                      )}
                      <p>
                        {selectedOrder.address.city},{" "}
                        {selectedOrder.address.state}{" "}
                        {selectedOrder.address.zipCode}
                      </p>
                      <p>{selectedOrder.address.country}</p>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Order Items */}
              <div>
                <p className="font-medium mb-3">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-3 bg-muted rounded-lg"
                    >
                      {item.product.images && item.product.images.length > 0 ? (
                        <Avatar className="w-16 h-16 rounded-md">
                          <AvatarImage
                            src={item.product.images[0]}
                            alt={item.product.title}
                          />
                          <AvatarFallback>
                            {item.product.title.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-16 h-16 bg-background rounded-md flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product.title}</p>
                        {item.product.sku && (
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.product.sku}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantity: {item.quantity} × $
                          {parseFloat(item.unitPrice).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        $
                        {(parseFloat(item.unitPrice) * item.quantity).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${parseFloat(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium mb-2">Notes</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.notes}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                {getValidNextStatuses(selectedOrder.status).length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewStatus(selectedOrder.status);
                      setShowStatusDialog(true);
                    }}
                  >
                    Update Status
                  </Button>
                )}
                {selectedOrder.status !== "CANCELLED" &&
                  selectedOrder.status !== "DELIVERED" &&
                  selectedOrder.status !== "SHIPPED" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelOrder(selectedOrder.id)}
                    >
                      Cancel Order
                    </Button>
                  )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of this order. Only valid status transitions are
              shown.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as Order["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedOrder &&
                    getValidNextStatuses(selectedOrder.status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
