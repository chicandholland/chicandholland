"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CustomizedImage } from "./CustomizedImage";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";

const RelatedProducts = ({
  relatedProducts,
}: {
  relatedProducts: {
    id: number;
    createdAt: string;
    name: string;
    isMain: boolean;
    productId: number;
  }[];
}) => {
  const router = useRouter();

  return (
    <div className="row mt-5">
      <p className="text-center text-3xl">Related Products</p>
      <div className="mx-auto mt-5 w-[80%] 3xl:w-[70%]">
        <Carousel
          opts={{
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
        >
          <CarouselContent>
            {relatedProducts.map((image) => (
              <CarouselItem
                key={image.id}
                className="cursor-pointer md:basis-1/2 xl:basis-1/3"
              >
                <div
                  className="object-contain md:h-[450px] lg:h-[600px] 2xl:h-[700px] 3xl:h-[800px] 4xl:h-[1200px]"
                  onClick={() => {
                    router.push(`/product/${image.productId}`);
                  }}
                >
                  <CustomizedImage
                    src={image.name}
                    alt={image.name}
                    unoptimized
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:inline-flex" />
          <CarouselNext className="hidden md:inline-flex" />
        </Carousel>
      </div>
    </div>
  );
};

export default RelatedProducts;
