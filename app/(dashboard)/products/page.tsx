"use client";
import { useState } from "react";
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
} from "lucide-react";
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

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  const [products, setProducts] = useState([
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
  ]);

  const getStockStatus = (product: any) => {
    if (product.stock === 0) return "out-of-stock";
    if (product.stock <= product.minStock) return "low-stock";
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
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || getStockStatus(product) === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleProductStatus = (productId: number) => {
    setProducts(
      products.map((product) =>
        product.id === productId
          ? { ...product, isActive: !product.isActive }
          : product
      )
    );
  };

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((cat) => cat.id === categoryId)?.label || categoryId;
  };

  const getMargin = (price: number, cost: number) => {
    return (((price - cost) / price) * 100).toFixed(1);
  };

  const totalValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Premium Argan Oil Shampoo"
                  />
                </div>
                <div>
                  <Label htmlFor="product-brand">Brand</Label>
                  <Input
                    id="product-brand"
                    placeholder="e.g., Luxury Hair Co."
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Category</Label>
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
                    <Label htmlFor="product-price">Retail Price ($)</Label>
                    <Input
                      id="product-price"
                      type="number"
                      placeholder="28.99"
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-cost">Cost Price ($)</Label>
                    <Input
                      id="product-cost"
                      type="number"
                      placeholder="12.50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="product-stock">Current Stock</Label>
                    <Input id="product-stock" type="number" placeholder="45" />
                  </div>
                  <div>
                    <Label htmlFor="product-min-stock">Min Stock Level</Label>
                    <Input
                      id="product-min-stock"
                      type="number"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    placeholder="Describe your product..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label>Product Image</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload product image
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Add Product
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
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={getStockColor(stockStatus)}>
                    <StockIcon className="w-3 h-3 mr-1" />
                    {stockStatus.replace("-", " ")}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Switch
                    checked={product.isActive}
                    onCheckedChange={() => toggleProductStatus(product.id)}
                  />
                </div>
                {!product.isActive && (
                  <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                    <Badge variant="secondary" className="bg-white text-black">
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
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {getCategoryLabel(product.category)}
                    </Badge>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Retail Price
                    </p>
                    <p className="text-lg font-bold text-primary">
                      ${product.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="text-lg font-bold">{product.stock}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center border-t border-border pt-3">
                  <div>
                    <p className="text-sm font-medium">{product.sold}</p>
                    <p className="text-xs text-muted-foreground">Sold</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {getMargin(product.price, product.cost)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Margin</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <p className="text-sm font-medium">{product.rating}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
