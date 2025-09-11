"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, TrendingUp } from "lucide-react";
import useHttp from "@/lib/hooks/usePost";

interface SubCategory {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}

interface BulkPriceIncreaseProps {
  subCategories: SubCategory[];
}

export default function BulkPriceIncrease({ subCategories }: BulkPriceIncreaseProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [percentage, setPercentage] = useState("");
  
  const router = useRouter();
  const { loading, error, executeAsync } = useHttp("subcategories/bulk-price-increase");

  const handleSubCategoryToggle = (subCategoryId: number) => {
    setSelectedSubCategories(prev => 
      prev.includes(subCategoryId)
        ? prev.filter(id => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubCategories.length === subCategories.length) {
      setSelectedSubCategories([]);
    } else {
      setSelectedSubCategories(subCategories.map(sub => sub.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedSubCategories.length === 0) {
      toast.error("Please select at least one subcategory");
      return;
    }

    if (!percentage || Number(percentage) <= 0) {
      toast.error("Please enter a valid percentage");
      return;
    }

    try {
      const response = await executeAsync(
        {
          subcategoryIds: selectedSubCategories,
          percentage: Number(percentage),
        },
        {},
        (error) => {
          toast.error("Failed to update prices");
        }
      );

      toast.success(response.message || "Prices updated successfully");
      setIsOpen(false);
      setSelectedSubCategories([]);
      setPercentage("");
      router.refresh();
    } catch (err) {
      toast.error("Failed to update prices", {
        description: error?.message,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Bulk Price Increase
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Price Increase</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage Increase (%)</Label>
            <Input
              id="percentage"
              type="number"
              min="0"
              step="0.1"
              placeholder="Enter percentage (e.g., 10)"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Prices will be rounded to the nearest 5 or 10
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Subcategories</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedSubCategories.length === subCategories.length ? "Deselect All" : "Select All"}
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-4">
              {subCategories.map((subCategory) => (
                <div key={subCategory.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcategory-${subCategory.id}`}
                    checked={selectedSubCategories.includes(subCategory.id)}
                    onCheckedChange={() => handleSubCategoryToggle(subCategory.id)}
                  />
                  <Label
                    htmlFor={`subcategory-${subCategory.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    {subCategory.name}
                    <span className="text-muted-foreground ml-2">
                      ({subCategory.category.name})
                    </span>
                  </Label>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              Selected: {selectedSubCategories.length} of {subCategories.length} subcategories
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Prices
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}