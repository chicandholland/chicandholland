"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

const HeaderFavouritesIcon = ({ favourites }: { favourites: any }) => {
  return (
    <Link href={"/my-favourites"} className={"relative ml-2"}>
      <p
        className={
          "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[#C9A39A]"
        }
      >
        {favourites.length}
      </p>
      {/* <Heart color="#000000" strokeWidth={3} /> */}
      <Heart
        className="text-[#C9A39A] hover:text-white 4xl:text-9xl"
        strokeWidth={3}
      />
    </Link>
  );
};

export default HeaderFavouritesIcon;
