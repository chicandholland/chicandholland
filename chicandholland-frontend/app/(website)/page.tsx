import { CustomizedImage } from "@/components/custom/CustomizedImage";
import TopSectionCarousel from "./TopSectionCarousel";
import TrendsCarousel from "./TrendsCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LazyVideo from "@/components/custom/LazyVideo";
import HlsVideo from "@/components/custom/HlsVideo";

export default function Home() {
  return (
    <div>
      <>
        <div className="w-full bg-black">
          {/* Image 1 */}
          {/* <CustomizedImage
            src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-images/new_image_60aza.webp"
            alt="Picture of chic and holland dresses"
            className="m-0 h-auto w-1/3 object-cover p-0"
            priority
            unoptimized
          /> */}

          {/* Video Container */}
          <div className="relative h-auto md:h-screen">
            <HlsVideo
              src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/first-video/hls/playlist.m3u8"
              fallbackSrc="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/first-video/original.mp4"
              startLevel={1}
              maxBufferLength={30}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controlsList="nodownload"
              className="m-0 h-full w-full object-cover p-0"
              poster="https://ymts.blr1.cdn.digitaloceanspaces.com/ /GROUPPHOTOS2024NEW/1I1A4800ssx.avif"
            />

            <Link
              href="/collections/72/80"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 text-xs text-white md:text-base 3xl:text-2xl 4xl:text-3xl"
            >
              VIEW THE COLLECTION
            </Link>
          </div>

          {/* Image 2 */}
          {/* <CustomizedImage
            src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-images/new_image_w7baj5.webp"
            alt="Picture of chic and holland dresses"
            className="m-0 h-auto w-1/3 object-cover p-0"
            priority
            unoptimized
          /> */}
        </div>

        {/* <TopSectionCarousel /> */}
      </>

      <div className="bg-muted py-8">
        <div className="container grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-center font-adornstoryserif text-xl md:text-xl 2xl:text-2xl 3xl:text-5xl 4xl:py-2 4xl:text-5xl">
                Timeless Elegance
              </h2>
              <p className="md:p-x-4 px-2 text-center font-mysi text-lg leading-5 text-muted-foreground md:px-4 md:text-lg md:leading-5 2xl:px-1 2xl:text-xl 2xl:leading-5 3xl:px-7 3xl:text-4xl 3xl:!leading-[29px] 4xl:px-16 4xl:text-4xl 4xl:!leading-[27px]">
                Chic & Holland's aim is to design and create dresses that will
                never go out of style - something that our discerning customers
                will be able to enjoy and appreciate for many years to come.
              </p>
            </div>
            <Link href={"/product/1153"}>
              <CustomizedImage
                src={
                  "https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/homepage/0C4A5453%20copy.jpg"
                }
                loading="lazy"
                // blurDataURL="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/COUTURE2024NEW/HF110376.avif"
                alt="Picture of chic and holland dresses"
                unoptimized
              />
            </Link>
          </div>
          <div className="flex flex-col gap-8 md:flex-col-reverse">
            <div className="space-y-2">
              <h2 className="text-center font-adornstoryserif text-xl md:text-xl 2xl:text-2xl 3xl:text-5xl 4xl:py-2 4xl:text-5xl">
                Truly Handmade
              </h2>
              <p className="md:p-x-4 4xl:px-15 4xl:!leading-12 px-2 text-center font-mysi text-lg leading-5 text-muted-foreground md:px-4 md:text-lg md:leading-5 2xl:px-1 2xl:text-xl 2xl:leading-5 3xl:px-7 3xl:text-4xl 3xl:!leading-[29px] 4xl:px-16 4xl:text-4xl 4xl:!leading-[27px]">
                We believe ourselves to be the guardians of this craft! In an
                age when everything is being made by machines, we chose to
                lovingly handcraft all of our garments at our own atelier.
              </p>
            </div>

            <Link href={"/product/1150"}>
              <CustomizedImage
                src={
                  "https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/homepage/HF110537.jpg"
                }
                loading="lazy"
                alt="Picture of chic and holland dresses"
                unoptimized
              />
            </Link>
          </div>
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h2 className="text-center font-adornstoryserif text-xl md:text-xl 2xl:text-2xl 3xl:text-5xl 4xl:py-2 4xl:text-5xl">
                Crystals & Embellishment
              </h2>
              <p className="md:p-x-4 4xl:px-15 4xl:!leading-12 px-2 text-center font-mysi text-lg leading-5 text-muted-foreground md:px-4 md:text-lg md:leading-5 2xl:px-1 2xl:text-xl 2xl:leading-5 3xl:px-7 3xl:text-4xl 3xl:!leading-[29px] 4xl:px-16 4xl:text-4xl 4xl:!leading-[27px]">
                One of our signature elements is our obsession with crystals.
                Each dress uses several types of crystals and beads, each using
                its own distinct language to communicate its purpose, to
                accentuate a curve, to tell you its own story…
              </p>
            </div>
            <Link href={"/product/1154"}>
              <CustomizedImage
                src={
                  "https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/homepage/0C4A5674%20copy.jpg"
                }
                loading="lazy"
                alt="Picture of chic and holland dresses"
                unoptimized
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="flex w-full flex-col items-center gap-2 md:flex-row md:justify-between">
          <div className="w-full md:w-1/2">
            <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-2 md:px-5 md:py-4">
              <h2 className="mb-2 text-center font-adornstoryserif text-lg font-semibold md:text-4xl 2xl:text-3xl 3xl:text-5xl 4xl:text-6xl">
                “300 HOURS”
              </h2>
              <p className="p-2 text-center font-mysi text-xs leading-tight text-gray-700 md:w-full md:px-6 md:text-base md:leading-5 2xl:text-xl 2xl:leading-5 3xl:px-6 3xl:text-3xl 3xl:!leading-[26px] 4xl:px-14 4xl:text-3xl 4xl:leading-[29px]">
                TIME IS THE RAREST LUXURY—AND IN 300 HOURS,
                <br />
                CHIC & HOLLAND CAPTURES, STITCHES, AND CRAFTS IT INTO WEARABLE
                ART. THIS COUTURE COLLECTION IS A HOMAGE TO THE SILENT HOURS
                BEHIND EVERY MASTERPIECE, WHERE HANDS WORK WITH REVERENCE,
                CRYSTALS ARE SEWN WITH PRECISION, AND EVERY BEAD IS A HEARTBEAT.
                EACH GOWN IS THE RESULT OF OVER 300 HOURS OF METICULOUS
                CRAFTSMANSHIP, WHERE NO DETAIL IS OVERLOOKED. DELICATE
                HAND-EMBROIDERY, LAYERED DRAPERY, SCULPTED BODICES, AND
                GLISTENING EMBELLISHMENTS COME TOGETHER IN HARMONY, CREATING
                SILHOUETTES THAT FEEL BOTH REGAL AND ETHEREAL. 300 HOURS IS MORE
                THAN A NUMBER—IT’S A PHILOSOPHY. IT IS A TESTAMENT TO THE
                ARTISANS WHO BRING THESE CREATIONS TO LIFE, AND TO THE WOMEN WHO
                WEAR THEM WITH GRACE, PURPOSE, AND QUIET POWER.
              </p>
            </div>
          </div>
          <div className="flex w-full items-center justify-center md:w-1/2">
            <HlsVideo
              src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/Sequence%2001_5/hls/playlist.m3u8"
              fallbackSrc="https://chicandholland-space.ams3.digitaloceanspaces.com/Homepage-videos/Sequence%2001_5.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover p-0 md:h-[30%] md:max-w-[50%]"
            />
          </div>
        </div>
      </div>

      {/* 
      <div className="flex flex-col gap-4 py-8">
        <div className="flex flex-col items-center">
          <h2 className="font-prata text-2xl">"HARMONY OF HEARTS"</h2>
          <p className="font-prata text-lg">COUTURE SPRING 2024</p>
        </div>

        <div className="flex flex-row">
          <Link href="">
            <video
              src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2005.mp4"
              autoPlay
              muted
              loop
              playsInline
              controlsList="nodownload"
              className="m-0 h-full w-1/4 p-0"
            ></video>
          </Link>

          <Link href="">
            <video
              src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2003.mp4"
              autoPlay
              muted
              loop
              playsInline
              controlsList="nodownload"
              className="m-0 h-full w-1/4 p-0"
            ></video>
          </Link>

          <Link href="">
            <video
              src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2002.mp4"
              autoPlay
              muted
              loop
              playsInline
              controlsList="nodownload"
              className="m-0 h-full w-1/4 p-0"
            ></video>
          </Link>

          <Link href="">

          <video
            src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2004.mp4"
            autoPlay
            muted
            loop
            playsInline
            controlsList="nodownload"
            className="m-0 h-full w-1/4 p-0"
          ></video>
          </Link>

        </div>
      </div> */}

      <div className="flex flex-col gap-4 py-8">
        <div className="flex flex-col items-center">
          <h2 className="font-adornstoryserif text-2xl md:text-3xl 2xl:text-3xl 3xl:text-5xl 4xl:text-6xl">
            300 HOURS
          </h2>
          <p className="font-mysi text-lg md:text-xl 2xl:text-xl 3xl:text-3xl 4xl:text-5xl">
            COUTURE 2025/26
          </p>
        </div>

        <div className="flex flex-row">
          <Link href="/collections/72/80" className="block h-full w-1/4">
            <HlsVideo
              src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/Sequence%2005/hls/playlist.m3u8"
              fallbackSrc="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2005.mp4"
              autoPlay
              muted
              loop
              playsInline
              controlsList="nodownload"
              className="h-full w-full object-cover"
            />
          </Link>

          <Link href="/collections/72/80" className="block h-full w-1/4">
            <HlsVideo
              src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/Sequence%2003/hls/playlist.m3u8"
              fallbackSrc="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2003.mp4"
              autoPlay
              muted
              loop
              playsInline
              controlsList="nodownload"
              className="h-full w-full object-cover"
            />
          </Link>

          <Link href="/collections/72/80" className="block h-full w-1/4">
            <HlsVideo
              src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/Sequence%2002/hls/playlist.m3u8"
              fallbackSrc="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2002.mp4"
              autoPlay
              muted
              loop
              playsInline
              controlsList="nodownload"
              className="h-full w-full object-cover"
            />
          </Link>

          <Link href="/collections/72/80" className="block h-full w-1/4">
            <HlsVideo
              src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/Sequence%2004/hls/playlist.m3u8"
              fallbackSrc="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2004.mp4"
              autoPlay
              muted
              loop
              playsInline
              controlsList="nodownload"
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 py-8">
        <div className="flex flex-col items-center">
          <h2 className="font-adornstoryserif text-2xl md:text-3xl 2xl:text-3xl 3xl:text-5xl 4xl:text-6xl">
            Editorial Campaign
          </h2>
          <p className="font-mysi text-lg md:text-xl 2xl:text-xl 3xl:text-3xl 4xl:text-5xl">
            AS SEEN ON SOCIAL MEDIA
          </p>
        </div>

        <TrendsCarousel />
      </div>

      <div className="relative flex w-full flex-col gap-4 py-8">
        <div className="flex flex-col items-center">
          <h2 className="font-adornstoryserif text-2xl md:text-3xl 2xl:text-3xl 3xl:text-5xl 4xl:text-6xl">
            300 HOURS
          </h2>
          <p className="font-mysi text-lg md:text-xl 2xl:text-xl 3xl:text-3xl 4xl:text-5xl">
            PROM 2025/26
          </p>
        </div>

        <div className="h-auto md:h-screen">
          <HlsVideo
            src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/Sequence%2001_1/hls/playlist.m3u8"
            fallbackSrc="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2001_1.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controlsList="nodownload"
            className="m-0 h-full w-full object-cover p-0"
            poster="https://ymts.blr1.cdn.digitaloceanspaces.com/ /GROUPPHOTOS2024NEW/1I1A4800ssx.avif"
          />
        </div>
        <Link
          href="/collections/92/82"
          className="absolute bottom-14 left-1/2 -translate-x-1/2 px-4 py-2 text-xs text-white md:text-base 3xl:text-2xl 4xl:text-3xl"
        >
          VIEW THE COLLECTION
        </Link>
      </div>

      {/* <div className="py-8">
        <div className="container flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-28">
          <div className="flex flex-col justify-center gap-4">
            <h2 className="text-center font-prata text-2xl">
              Discover COUTURE SPRINGS 2024 <br />
              "HARMONY OF HEARTS"
            </h2>
            <p className="text-center text-muted-foreground">
              IN A WORLD WHERE TRUST AND FAITH ARE WHISPERS IN THE WIND,
              "HARMONY OF HEARTS" WEAVES A NARRATIVE OF UNITY.
            </p>
            <p className="text-center text-muted-foreground">
              BLENDING GEOMETRIC MOTIFS WITH CONTEMPORARY TWISTS, THIS COUTURE
              COLLECTION EPITOMIZES SOPHISTICATION AND ALLURE.
            </p>
            <p className="text-center text-muted-foreground">
              RICH HUES AND DELICATE PASTELS EXUDE TIMELESS CHARM. INTRICATE 3D
              EMBROIDERY AND ARABESQUE-INSPIRED DESIGNS OFFER TACTILE ELEGANCE.
            </p>
            <p className="text-center text-muted-foreground">
              CELEBRATE THE ARTISTRY OF REFLECTED SYMMETRY AND THE DELICATE
              CRAFTSMANSHIP THAT DEFINES OUR HANDMADE EMBELLISHED DRESSES.
            </p>
          </div>
          <LazyVideo
            src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-videos/KNFG8875.mp4"
            className="m-0 p-0 md:h-full md:w-[100%]"
          /> */}
      {/* <video
            src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-videos/KNFG8875.mp4"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            controlsList="nodownload"
            className="m-0 md:h-full p-0 md:w-[50%]"
          ></video> */}
      {/* </div>
      </div> */}

      <div className="bg-muted py-8">
        <div className="container flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-28">
          <div className="flex-1">
            <Link href="/product/1201">
              <CustomizedImage
                src={
                  "https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/homepage/PH120116B.jpg"
                }
                alt="Picture of chic and holland dresses"
                loading="lazy"
                unoptimized
              />
            </Link>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <h2 className="text-center font-adornstoryserif text-2xl md:text-2xl 2xl:text-3xl 3xl:text-5xl 4xl:py-3 4xl:text-6xl">
              Find A Nearest Store Now
            </h2>
            <p className="text-center font-mysi text-muted-foreground md:px-5 md:text-lg md:leading-5 2xl:px-4 2xl:text-xl 3xl:text-4xl 4xl:px-6 4xl:text-4xl">
              Chic & Holland is also available in many stores around the world
              and has more than 100 authorized retailers within 25 countries
              carrying the brand across Europe, USA, Canada, Australia, Mexico,
              Puerto Ricco and UK.
            </p>
            <Link href={"/contact-us"} className="4xl:py-4">
              <Button className="font-adornstoryserif md:mt-3 3xl:mt-4 3xl:text-lg 4xl:px-5 4xl:py-5 4xl:text-3xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col gap-4 md:pt-5 2xl:pt-6 3xl:pt-7">
        <div className="flex flex-col items-center">
          <h2 className="font-adornstoryserif text-2xl md:text-3xl 2xl:text-3xl 3xl:text-5xl 4xl:text-6xl">
            300 HOURS
          </h2>
          <p className="font-mysi text-lg md:text-xl 2xl:text-xl 3xl:text-3xl 4xl:text-5xl">
            BRIDAL 2025/26
          </p>
        </div>
        <div className="h-auto md:h-screen">
          <HlsVideo
            src="https://chicandholland-space.ams3.digitaloceanspaces.com/homepage/new-collection-videos/Sequence%2001_4/hls/playlist.m3u8"
            fallbackSrc="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/Homepage-videos/Sequence%2001_4.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controlsList="nodownload"
            className="m-0 h-full w-full object-cover p-0"
            poster="https://ymts.blr1.cdn.digitaloceanspaces.com/ /GROUPPHOTOS2024NEW/1I1A4800ssx.avif"
          />
        </div>
        <Link
          href="/collections/71/84"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 text-xs text-white md:text-base 3xl:text-2xl 4xl:text-3xl"
        >
          VIEW THE COLLECTION
        </Link>
      </div>
    </div>
  );
}
