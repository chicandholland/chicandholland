"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableCell } from "@/components/ui/table";
import { useState } from "react";
import { getImageByStockId } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/custom/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { CustomizedImage } from "@/components/custom/CustomizedImage";
import ProductCard from "@/components/custom/ProductCard";

const StyleNoImage = ({ details }: { details: any }) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        onClick={async () => {
          const response = await getImageByStockId(details.id);

          setImages(response.images);
          setOpen(true);
        }}
      >
        <div className="relative h-[100%]">
          <p className="absolute right-1 top-0 z-[2] bg-black text-white">
            {details.product.productCode}
          </p>
          
          {/* <img
            className="aspect-square cursor-pointer object-cover"
            src={details.images.name}
            alt="profile-picture"
            width={400}
            height={1000}
          /> */}

          <CustomizedImage
            src={details.images.name}
            alt={"profile-picture"}
            className="object-contain cursor-pointer"
            width={400}
            height={700}
            quality={100}
          />
        </div>
      </DialogTrigger>
      <DialogContent
        className={
          "xs:max-w-[40%] h-[95%] max-w-[90%] md:max-w-[50%] lg:max-w-[40%] 2xl:max-w-[30%]"
        }
      >
        <DialogHeader>
          <DialogTitle> {details.product.productCode}</DialogTitle>
        </DialogHeader>

        <Carousel opts={{ loop: true, dragFree: true }}>
          <CarouselContent>
            {images.map((image: any, index: number) => (
              <CarouselItem key={image.id}>
                <div className="space-y-2">
                  <CustomizedImage
                    src={image.name}
                    alt={image.alt}
                    className="h-[calc(100vh-22vh)] w-full"
                    unoptimized
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};

export default StyleNoImage;
