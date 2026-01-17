"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";
import {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  formatDiscount,
  getOfferStatusLabel,
} from "../../../lib/offers";
import { Offer, OfferType, DiscountType } from "../../../lib/types/offers";
import { useToast } from "../../../components/ui/use-toast";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);
  const [salonId, setSalonId] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerType: "salon" as OfferType,
    productId: "",
    serviceId: "",
    discountType: "percentage" as DiscountType,
    discountValue: "",
    startsAt: "",
    endsAt: "",
    image: null as File | null,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      // Fetch salon data
      const salonResponse = await fetch("/api/salons/my-salons", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const salonData = await salonResponse.json();

      if (salonData.data && salonData.data.length > 0) {
        const salon = salonData.data[0];
        setSalonId(salon.id);

        // Fetch products
        const productsResponse = await fetch(
          `/api/products/salon/${salon.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const productsData = await productsResponse.json();
        setProducts(productsData.data || []);

        // Fetch services
        const servicesResponse = await fetch(
          `/api/services/salon/${salon.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const servicesData = await servicesResponse.json();
        setServices(servicesData.data || []);

        // Fetch offers
        await fetchOffers(salon.id, token);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async (sId: string, token: string) => {
    try {
      const response = await getOffers({ salonId: sId }, token);
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const offerData = {
        salonId,
        title: formData.title,
        description: formData.description,
        offerType: formData.offerType,
        ...(formData.offerType === "product" && {
          productId: formData.productId,
        }),
        ...(formData.offerType === "service" && {
          serviceId: formData.serviceId,
        }),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        startsAt: new Date(formData.startsAt).toISOString(),
        endsAt: new Date(formData.endsAt).toISOString(),
        ...(formData.image && { image: formData.image }),
      };

      if (editingOffer) {
        await updateOffer(editingOffer.id, offerData, token);
        toast({
          title: "Success",
          description: "Offer updated successfully",
        });
      } else {
        await createOffer(offerData, token);
        toast({
          title: "Success",
          description: "Offer created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      await fetchOffers(salonId, token);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save offer",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (
    offerId: string,
    currentStatus: boolean,
  ) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await toggleOfferStatus(offerId, !currentStatus, token);
      toast({
        title: "Success",
        description: `Offer ${!currentStatus ? "activated" : "deactivated"} successfully`,
      });
      await fetchOffers(salonId, token);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle offer status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!offerToDelete) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      await deleteOffer(offerToDelete, token);
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      });
      setDeleteDialogOpen(false);
      setOfferToDelete(null);
      await fetchOffers(salonId, token);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete offer",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description || "",
      offerType: offer.offerType,
      productId: offer.productId || "",
      serviceId: offer.serviceId || "",
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startsAt: new Date(offer.startsAt).toISOString().slice(0, 16),
      endsAt: new Date(offer.endsAt).toISOString().slice(0, 16),
      image: null,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      description: "",
      offerType: "salon",
      productId: "",
      serviceId: "",
      discountType: "percentage",
      discountValue: "",
      startsAt: "",
      endsAt: "",
      image: null,
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading offers...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            Promotional Offers
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage promotional offers for your salon
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffer ? "Edit Offer" : "Create New Offer"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details to create a promotional offer
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="e.g., Summer Sale"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your offer"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offerType">Offer Type *</Label>
                  <Select
                    value={formData.offerType}
                    onValueChange={(value: OfferType) =>
                      setFormData({ ...formData, offerType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salon">Salon-wide</SelectItem>
                      <SelectItem value="product">Specific Product</SelectItem>
                      <SelectItem value="service">Specific Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.offerType === "product" && (
                  <div className="space-y-2">
                    <Label htmlFor="productId">Product *</Label>
                    <Select
                      value={formData.productId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, productId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.offerType === "service" && (
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">Service *</Label>
                    <Select
                      value={formData.serviceId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, serviceId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: DiscountType) =>
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountValue: e.target.value,
                      })
                    }
                    required
                    placeholder={
                      formData.discountType === "percentage" ? "25" : "10.00"
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startsAt">Start Date & Time *</Label>
                  <Input
                    id="startsAt"
                    type="datetime-local"
                    value={formData.startsAt}
                    onChange={(e) =>
                      setFormData({ ...formData, startsAt: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endsAt">End Date & Time *</Label>
                  <Input
                    id="endsAt"
                    type="datetime-local"
                    value={formData.endsAt}
                    onChange={(e) =>
                      setFormData({ ...formData, endsAt: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Offer Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0] || null,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Max 5MB, JPEG, PNG, WebP, or GIF
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingOffer ? "Update Offer" : "Create Offer"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Offers Grid */}
      {offers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first promotional offer to attract customers
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Offer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const status = getOfferStatusLabel(offer);
            return (
              <Card
                key={offer.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  {offer.image && (
                    <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-muted">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <Badge variant={status.variant} className="mt-2">
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatDiscount(
                          offer.discountType,
                          offer.discountValue,
                        )}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offer.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {offer.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{offer.offerType}</span>
                      {offer.product && ` - ${offer.product.title}`}
                      {offer.service && ` - ${offer.service.name}`}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(offer.startsAt).toLocaleDateString()} -{" "}
                        {new Date(offer.endsAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(offer)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={offer.isActive ? "secondary" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleToggleStatus(offer.id, offer.isActive)
                      }
                    >
                      {offer.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setOfferToDelete(offer.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              offer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
