"use client";
import { CustomizedImage } from "@/components/custom/CustomizedImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import React from "react";

const SponserImages = ({ sponsor }: any) => {

  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        AutoPlay({
          delay: 2000,
          stopOnInteraction: false,
        }),
      ]}
    >
      {/* <CarouselContent>
        {sponsor &&
          sponsor.map((item: any, index: number) => (
            <CarouselItem className="basis-1 md:basis-1/2 lg:basis-1/3" key={index}>
              <div className="flex h-full flex-col items-center gap-2">
                <CustomizedImage
                  src={item.image_url}
                  alt="Miss Netherlands 2019"
                  unoptimized
                />
                <p className={"text-center"}>
                  {item.description && item.description}
                </p>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent> */}

      <CarouselContent>
        {sponsor &&
          sponsor.map((item: any, index: number) => (
            <CarouselItem
              className="basis-full md:basis-1/2 lg:basis-1/3"
              key={index}
            >
              <div className="flex h-full flex-col items-center gap-2">
                <CustomizedImage
                  src={item.image_url}
                  alt="Miss Netherlands 2019"
                  unoptimized
                />
                <p className={"text-center font-mysi md:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-3xl"}>
                  {item.description && item.description}
                </p>
              </div>
            </CarouselItem>
          ))}
      </CarouselContent>
    </Carousel>
  );
};

export default SponserImages;
