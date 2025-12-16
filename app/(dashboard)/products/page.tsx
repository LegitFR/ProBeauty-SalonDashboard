"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Package,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Eye,
  EyeOff,
  ShoppingCart,
  Star,
  Loader2,
} from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import Image from "next/image";
import { inherits } from "util";

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
  category?: string;
  isActive?: boolean;
  cost?: number;
  sold?: number;
  revenue?: number;
  rating?: number;
  brand?: string;
  minStock?: number;
  originalStock?: number; // Store original stock before hiding
}

interface NewProduct {
  salonId: string;
  title: string;
  sku: string;
  price: number;
  quantity: number;
  images: string[]; // https://plus.unsplash.com/premium_photo-1670537994863-5ad53a3214e0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
}

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editProd, setEditProd] = useState<Partial<Product> | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProd, setNewProd] = useState<NewProduct | null>(null);
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newProductImages, setNewProductImages] = useState<File[]>([]);
  const [editProductImages, setEditProductImages] = useState<File[]>([]);
  const { toast } = useToast();

  const categories = [
    { id: "all", label: "All Products" },
    { id: "haircare", label: "Hair Care" },
    { id: "skincare", label: "Skin Care" },
    { id: "makeup", label: "Makeup" },
    { id: "nails", label: "Nail Products" },
    { id: "tools", label: "Tools & Equipment" },
    { id: "accessories", label: "Accessories" },
  ];

  const statusOptions = [
    { id: "all", label: "All Status" },
    { id: "in-stock", label: "In Stock" },
    { id: "low-stock", label: "Low Stock" },
    { id: "out-of-stock", label: "Out of Stock" },
  ];

  useEffect(() => {
    fetchSalon();
  }, []);

  const fetchSalon = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to continue",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/salons/my-salons", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch salon");
      }

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setSalon(data.data[0]); // Use first salon
        // Fetch products after salon is loaded
        fetchProductsForSalon(data.data[0].id);
      } else {
        toast({
          title: "No salon found",
          description: "Please create a salon first",
          variant: "destructive",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching salon:", error);
      toast({
        title: "Error",
        description: "Failed to load salon information",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!salon?.id) return;
    await fetchProductsForSalon(salon.id);
  };

  const fetchProductsForSalon = async (salonId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`/api/products/salon/${salonId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log(data.data);

      // Map API fields to frontend fields
      const mappedProducts = (data.data || []).map((product: any) => ({
        ...product,
        stock: product.quantity || 0, // Map 'quantity' from API to 'stock' for frontend
        images: Array.isArray(product.images) ? product.images : [], // Ensure images is always an array
        // If product has 0 quantity, it's hidden; otherwise it's visible
        isActive: product.quantity > 0,
        // Store original stock - if quantity is 0 (hidden), default to 1 so it can be re-enabled
        originalStock: product.quantity > 0 ? product.quantity : 1,
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to delete products",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  async function handleAddProduct() {
    console.log("=== handleAddProduct called ===");
    console.log("newProd state:", newProd);

    const token = localStorage.getItem("accessToken");

    console.log("Token:", token ? "Present" : "Missing");
    console.log("Salon:", salon);

    if (!salon?.id) {
      console.log("ERROR: No salon found");
      toast({
        title: "Error",
        description: "Salon information not found. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    console.log("Salon loaded:", salon);

    // Validate required fields
    console.log("Validating fields:", {
      title: newProd?.title,
      price: newProd?.price,
      quantity: newProd?.quantity,
    });

    if (!newProd?.title || !newProd?.price || !newProd?.quantity) {
      console.log("ERROR: Missing required fields");
      toast({
        title: "Error",
        description:
          "Please fill in all required fields (Product Name, Price, Stock)",
        variant: "destructive",
      });
      return;
    }

    console.log("Validation passed!");

    // Create FormData for multipart/form-data submission
    const formData = new FormData();
    formData.append("salonId", salon.id);
    formData.append("title", newProd.title);
    formData.append("sku", newProd.sku || `SKU-${Date.now()}`);
    formData.append("price", String(newProd.price));
    formData.append("quantity", String(newProd.quantity));

    // Append image files (up to 5)
    newProductImages.forEach((file) => {
      formData.append("images", file);
    });

    console.log("Sending product data with", newProductImages.length, "images");

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to add product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      // Reset form and close dialog
      setNewProd(null);
      setNewProductImages([]);
      setShowAddDialog(false);
      fetchProducts();
    } catch (e) {
      console.error("Error:", e);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEditProduct() {
    if (!selectedProduct || !editProd) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication required. Please login again.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!editProd.title || !editProd.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Product Name, Price)",
        variant: "destructive",
      });
      return;
    }

    console.log(
      "Updating product:",
      selectedProduct.id,
      "with",
      editProductImages.length,
      "new images"
    );

    setSubmitting(true);
    try {
      let res;

      // If there are images, use FormData; otherwise use JSON
      if (editProductImages.length > 0) {
        const formData = new FormData();
        if (editProd.title) formData.append("title", editProd.title);
        if (editProd.price !== undefined)
          formData.append("price", String(editProd.price));
        if (editProd.stock !== undefined)
          formData.append("quantity", String(editProd.stock));

        editProductImages.forEach((file) => {
          formData.append("images", file);
        });

        res = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        const updateData: any = {};
        if (editProd.title) updateData.title = editProd.title;
        if (editProd.price !== undefined)
          updateData.price = String(editProd.price);
        if (editProd.stock !== undefined)
          updateData.quantity = String(editProd.stock);

        res = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        });
      }

      const data = await res.json();
      console.log("Update response:", data);

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to update product",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      // Reset form and close dialog
      setSelectedProduct(null);
      setEditProd(null);
      setEditProductImages([]);
      setShowEditDialog(false);
      fetchProducts();
    } catch (e) {
      console.error("Error:", e);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const oldProducts = [
    {
      id: 1,
      name: "Premium Argan Oil Shampoo",
      description:
        "Luxurious sulfate-free shampoo enriched with organic argan oil",
      category: "haircare",
      price: 28.99,
      cost: 12.5,
      stock: 45,
      minStock: 10,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      sold: 78,
      revenue: 2260.22,
      rating: 4.8,
      brand: "Luxury Hair Co.",
    },
    {
      id: 2,
      name: "Hydrating Face Serum",
      description: "Anti-aging serum with hyaluronic acid and vitamin C",
      category: "skincare",
      price: 65.0,
      cost: 22.0,
      stock: 23,
      minStock: 15,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      sold: 34,
      revenue: 2210.0,
      rating: 4.9,
      brand: "SkinGlow",
    },
    {
      id: 3,
      name: "Professional Hair Dryer",
      description: "Ionic ceramic hair dryer with multiple heat settings",
      category: "tools",
      price: 145.0,
      cost: 75.0,
      stock: 8,
      minStock: 5,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      sold: 12,
      revenue: 1740.0,
      rating: 4.7,
      brand: "ProStyle",
    },
    {
      id: 4,
      name: "Matte Lipstick Set",
      description: "Set of 6 long-lasting matte lipsticks in popular shades",
      category: "makeup",
      price: 42.99,
      cost: 18.0,
      stock: 0,
      minStock: 20,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: false,
      sold: 56,
      revenue: 2407.44,
      rating: 4.6,
      brand: "ColorPop Beauty",
    },
    {
      id: 5,
      name: "Nail Polish Collection",
      description: "Premium nail polish collection with 12 trending colors",
      category: "nails",
      price: 89.99,
      cost: 35.0,
      stock: 31,
      minStock: 15,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      sold: 19,
      revenue: 1709.81,
      rating: 4.5,
      brand: "Nail Art Pro",
    },
    {
      id: 6,
      name: "Cleansing Oil",
      description: "Gentle makeup removing cleansing oil for all skin types",
      category: "skincare",
      price: 35.5,
      cost: 14.0,
      stock: 67,
      minStock: 25,
      image:
        "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTgwNTgyMjl8MA&ixlib=rb-4.1.0&q=80&w=400",
      isActive: true,
      sold: 43,
      revenue: 1526.5,
      rating: 4.8,
      brand: "Pure Botanicals",
    },
  ];

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return "out-of-stock";
    if (product.stock <= 10) return "low-stock";
    return "in-stock";
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-500/10 text-green-600";
      case "low-stock":
        return "bg-yellow-500/10 text-yellow-600";
      case "out-of-stock":
        return "bg-red-500/10 text-red-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return TrendingUp;
      case "low-stock":
        return AlertTriangle;
      case "out-of-stock":
        return TrendingDown;
      default:
        return Package;
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || getStockStatus(product) === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleProductStatus = async (productId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please login to update products",
          variant: "destructive",
        });
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      console.log("Toggle product:", {
        id: productId,
        currentStock: product.stock,
        originalStock: product.originalStock,
        isActive: product.isActive,
      });

      // Toggle visibility state
      // isActive=true means visible (checked), isActive=false means hidden (unchecked)
      const currentVisibleState = product.isActive ?? true;
      const newVisibleState = !currentVisibleState;

      // Calculate what quantity to send
      let quantityToSend: string;
      if (newVisibleState) {
        // Showing the product - restore from originalStock
        quantityToSend = String(product.originalStock || 1);
      } else {
        // Hiding the product - send "0"
        quantityToSend = "0";
      }

      console.log("Sending quantity:", quantityToSend);

      const updateData: any = {
        quantity: quantityToSend,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      const responseData = await response.json();
      console.log("Update response:", responseData);

      // Update local state
      setProducts(
        products.map((p) => {
          if (p.id === productId) {
            const parsedQuantity = parseInt(quantityToSend);
            const updatedQuantity =
              responseData.data?.quantity ??
              (!isNaN(parsedQuantity) ? parsedQuantity : 0);

            // Calculate originalStock to preserve
            let newOriginalStock = p.originalStock;
            if (!newVisibleState && p.stock > 0) {
              // We're hiding a visible product - save its current stock
              newOriginalStock = p.stock;
            } else if (newVisibleState) {
              // We're showing a product - keep the originalStock or use the restored value
              newOriginalStock = p.originalStock || updatedQuantity;
            }

            console.log("State update:", {
              isActive: newVisibleState,
              stock: updatedQuantity,
              originalStock: newOriginalStock,
            });

            return {
              ...p,
              isActive: newVisibleState,
              stock: updatedQuantity,
              originalStock: newOriginalStock,
            };
          }
          return p;
        })
      );

      toast({
        title: "Success",
        description: `Product is now ${
          newVisibleState ? "visible" : "hidden"
        } on landing page`,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product status",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.label || categoryId;
  };

  const getMargin = (price: number, cost: number) => {
    return (((price - cost) / price) * 100).toFixed(1);
  };

  const totalValue = products.reduce(
    (sum, p) => sum + p.stock * (p.cost || 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => getStockStatus(p) === "low-stock"
  ).length;
  const outOfStockCount = products.filter(
    (p) => getStockStatus(p) === "out-of-stock"
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold">Product Inventory</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 flex-1">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-name" className="mb-2">
                    Product Name
                  </Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Premium Argan Oil Shampoo"
                    onChange={(e) => {
                      setNewProd((prev) => {
                        if (!prev) {
                          return {
                            salonId: "",
                            title: e.target.value,
                            sku: "",
                            price: 0,
                            quantity: 0,
                            images: [],
                          };
                        }
                        return { ...prev, title: e.target.value };
                      });
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="product-sku" className="mb-2">
                    SKU (Stock Keeping Unit)
                  </Label>
                  <Input
                    id="product-sku"
                    placeholder="e.g., ARG-SHAM-250"
                    onChange={(e) => {
                      setNewProd((prev) => {
                        if (!prev) {
                          return {
                            salonId: "",
                            title: "",
                            sku: e.target.value,
                            price: 0,
                            quantity: 0,
                            images: [],
                          };
                        }
                        return { ...prev, sku: e.target.value };
                      });
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to auto-generate
                  </p>
                </div>
                <div>
                  <Label htmlFor="product-brand" className="mb-2">
                    Brand
                  </Label>
                  <Input
                    id="product-brand"
                    placeholder="e.g., Luxury Hair Co."
                  />
                </div>
                <div>
                  <Label htmlFor="product-category" className="mb-2">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-price" className="mb-2">
                      Retail Price ($)
                    </Label>
                    <Input
                      id="product-price"
                      type="number"
                      placeholder="28.99"
                      onChange={(e) => {
                        setNewProd((prev) => {
                          const value = Number(e.target.value);
                          const price =
                            !isNaN(value) && isFinite(value) ? value : 0;
                          if (!prev) {
                            return {
                              salonId: "",
                              title: "",
                              sku: "",
                              price: price,
                              quantity: 0,
                              images: [],
                            };
                          }
                          return { ...prev, price: price };
                        });
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-cost" className="mb-2">
                      Cost Price ($)
                    </Label>
                    <Input
                      id="product-cost"
                      type="number"
                      placeholder="12.50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* <div>
                    <Label htmlFor="product-stock" className="mb-2">
                      Current Stock
                    </Label>
                    <Input id="product-stock" type="number" placeholder="45" />
                  </div> */}
                  <div>
                    <Label htmlFor="product-min-stock" className="mb-2">
                      Stock
                    </Label>
                    <Input
                      id="product-min-stock"
                      type="number"
                      placeholder="10"
                      onChange={(e) => {
                        setNewProd((prev) => {
                          const value = Number(e.target.value);
                          const quantity =
                            !isNaN(value) && isFinite(value) ? value : 0;
                          if (!prev) {
                            return {
                              salonId: "",
                              title: "",
                              sku: "",
                              price: 0,
                              quantity: quantity,
                              images: [],
                            };
                          }
                          return { ...prev, quantity: quantity };
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-description" className="mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="product-description"
                    placeholder="Describe your product..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="product-images" className="mb-2">
                    Product Images (Max 5)
                  </Label>
                  <Input
                    id="product-images"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 5) {
                        toast({
                          title: "Too many files",
                          description: "You can only upload up to 5 images",
                          variant: "destructive",
                        });
                        return;
                      }
                      setNewProductImages(files);
                    }}
                    className="cursor-pointer"
                  />
                  {newProductImages.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {newProductImages.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewProductImages([]);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddProduct}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 flex-1">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-product-name" className="mb-2">
                    Product Name
                  </Label>
                  <Input
                    id="edit-product-name"
                    value={editProd?.title || ""}
                    onChange={(e) => {
                      setEditProd((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-product-brand" className="mb-2">
                    Brand
                  </Label>
                  <Input
                    id="edit-product-brand"
                    value={editProd?.brand || ""}
                    onChange={(e) => {
                      setEditProd((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-product-category" className="mb-2">
                    Category
                  </Label>
                  <Select
                    value={editProd?.category || ""}
                    onValueChange={(value) => {
                      setEditProd((prev) => ({
                        ...prev,
                        category: value,
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-product-price" className="mb-2">
                      Retail Price ($)
                    </Label>
                    <Input
                      id="edit-product-price"
                      type="number"
                      value={editProd?.price || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setEditProd((prev) => ({
                          ...prev,
                          price: !isNaN(value) && isFinite(value) ? value : 0,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-product-cost" className="mb-2">
                      Cost Price ($)
                    </Label>
                    <Input
                      id="edit-product-cost"
                      type="number"
                      value={editProd?.cost || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setEditProd((prev) => ({
                          ...prev,
                          cost: !isNaN(value) && isFinite(value) ? value : 0,
                        }));
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-product-stock" className="mb-2">
                      Current Stock
                    </Label>
                    <Input
                      id="edit-product-stock"
                      type="number"
                      value={editProd?.stock || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setEditProd((prev) => ({
                          ...prev,
                          stock: !isNaN(value) && isFinite(value) ? value : 0,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-product-min-stock" className="mb-2">
                      Min Stock Level
                    </Label>
                    <Input
                      id="edit-product-min-stock"
                      type="number"
                      value={editProd?.minStock || ""}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setEditProd((prev) => ({
                          ...prev,
                          minStock:
                            !isNaN(value) && isFinite(value) ? value : 0,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-product-description" className="mb-2">
                    Description
                  </Label>
                  <Textarea
                    id="edit-product-description"
                    value={editProd?.description || ""}
                    onChange={(e) => {
                      setEditProd((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-product-images" className="mb-2">
                    Product Images (Max 5, replaces existing)
                  </Label>
                  <Input
                    id="edit-product-images"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 5) {
                        toast({
                          title: "Too many files",
                          description: "You can only upload up to 5 images",
                          variant: "destructive",
                        });
                        return;
                      }
                      setEditProductImages(files);
                    }}
                    className="cursor-pointer"
                  />
                  {editProductImages.length > 0 ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      {editProductImages.length} new file(s) selected
                    </p>
                  ) : selectedProduct?.images &&
                    selectedProduct.images.length > 0 ? (
                    <p className="text-sm text-muted-foreground mt-2">
                      Current: {selectedProduct.images.length} image(s)
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                  setSelectedProduct(null);
                  setEditProd(null);
                  setEditProductImages([]);
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleEditProduct}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-bold">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {lowStockCount}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {outOfStockCount}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, brands, or descriptions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
            <p className="text-muted-foreground mt-4">Loading products...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            const StockIcon = getStockIcon(stockStatus);

            return (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1624574966266-1cdd65b74500?w=400"
                    }
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className={getStockColor(stockStatus)}>
                      <StockIcon className="w-3 h-3 mr-1" />
                      {stockStatus.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 z-20 pointer-events-auto">
                    <Switch
                      checked={product.isActive ?? true}
                      onCheckedChange={() => toggleProductStatus(product.id)}
                    />
                  </div>
                  {product.isActive === false && (
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center z-10 pointer-events-none">
                      <Badge
                        variant="secondary"
                        className="bg-white text-black"
                      >
                        <EyeOff className="w-3 h-3 mr-1" />
                        Hidden
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold line-clamp-1">
                        {product.title}
                      </h3>
                      {product.brand && (
                        <p className="text-sm text-muted-foreground">
                          {product.brand}
                        </p>
                      )}
                      {product.category && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {getCategoryLabel(product.category)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedProduct(product);
                          setEditProd({
                            title: product.title,
                            price: product.price,
                            stock: product.stock,
                            description: product.description,
                            category: product.category,
                            brand: product.brand,
                          });
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description || "No description available"}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Retail Price
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ${(product.price || 0).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stock</p>
                      <p className="text-lg font-bold">{product.stock}</p>
                    </div>
                  </div>

                  {(product.sold ||
                    product.revenue ||
                    product.cost ||
                    product.rating) && (
                    <div className="grid grid-cols-4 gap-2 text-center border-t border-border pt-3">
                      {product.sold !== undefined && (
                        <div>
                          <p className="text-sm font-medium">{product.sold}</p>
                          <p className="text-xs text-muted-foreground">Sold</p>
                        </div>
                      )}
                      {product.revenue !== undefined && (
                        <div>
                          <p className="text-sm font-medium">
                            ${(product.revenue || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Revenue
                          </p>
                        </div>
                      )}
                      {product.cost !== undefined && (
                        <div>
                          <p className="text-sm font-medium">
                            {getMargin(product.price, product.cost)}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Margin
                          </p>
                        </div>
                      )}
                      {product.rating !== undefined && (
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <p className="text-sm font-medium">
                              {product.rating}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Rating
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* No results */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              No products found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
