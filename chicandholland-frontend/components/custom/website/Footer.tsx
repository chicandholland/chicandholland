import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    // original
    // <footer className="bg-primary text-primary-foreground">
    //   <div className="container flex flex-col gap-8 py-8">
    //     <div className="grid grid-cols-2 justify-items-stretch md:grid-cols-3 md:justify-items-center">
    //       <div className="flex flex-col gap-2">
    //         <Link className="footer-links text-[#C9A39A]" href={"/"}>
    //           Home
    //         </Link>
    //         <Link className="footer-links text-[#C9A39A]" href={"/brand"}>
    //           Brand
    //         </Link>
    //         <Link
    //           className="footer-links text-[#C9A39A]"
    //           href={"/shows-and-events"}
    //         >
    //           Shows/Events
    //         </Link>
    //         <Link
    //           className="footer-links text-[#C9A39A]"
    //           href={"/become-a-retailer"}
    //         >
    //           Become a Retailer
    //         </Link>
    //       </div>
    //       <div className="flex flex-col gap-2">
    //         <Link className="footer-links text-[#C9A39A]" href={"/contact-us"}>
    //           Contact us
    //         </Link>
    //         <Link
    //           className="footer-links text-[#C9A39A]"
    //           href={"/find-a-store"}
    //         >
    //           Find a store
    //         </Link>
    //         <Link className="footer-links text-[#C9A39A]" href={"/size-chart"}>
    //           Size Chart
    //         </Link>
    //       </div>
    //       <div className="col-span-2 mt-3 flex flex-col gap-2 md:col-span-1 md:mt-0">
    //         <p className="text-xl text-[#C9A39A]">Follow us</p>
    //         <div className="flex flex-col gap-2">
    //           <Link
    //             className="footer-links text-[#C9A39A]"
    //             href={"https://www.facebook.com/chicandholland"}
    //           >
    //             <p className="inline text-[#C9A39A]">Facebook</p>{" "}
    //             <Facebook className="inline text-[#C9A39A]" size={24} />
    //           </Link>
    //           <Link
    //             className="footer-links"
    //             href={"https://www.instagram.com/chicandholland/"}
    //           >
    //             <p className="inline text-[#C9A39A]">Instagram</p>{" "}
    //             <Instagram className="inline text-[#C9A39A]" size={24} />
    //           </Link>
    //         </div>
    //       </div>
    //     </div>

    //     <h1 className="text-center font-vivaldi text-[50px] text-[#C9A39A] md:text-[100px] lg:text-[150px]">
    //       Chic & Holland
    //     </h1>
    //   </div>
    // </footer>

    <footer className="bg-black text-primary-foreground">
      <div className="flex flex-col items-center justify-between px-4 py-8 md:flex-row md:items-center md:gap-10">
        <div className="md:w-4/4 flex w-full flex-col items-center gap-8 md:ml-56 2xl:gap-y-10">
          <div className="grid grid-cols-2 gap-x-14 gap-y-6 md:grid-cols-3 md:justify-items-center md:gap-x-48">
            <div className="flext-start flex flex-col gap-1">
              <Link
                className="footer-links font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl"
                href={"/"}
              >
                <p>HOME</p>
              </Link>
              <Link
                className="footer-linksn font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl"
                href={"/brand"}
              >
                <p>BRAND</p>
              </Link>
              <Link
                className="footer-links font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl"
                href={"/shows-and-events"}
              >
                <p>SHOWS/EVENTS</p>
              </Link>
              <Link
                className="footer-links font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl"
                href={"/become-a-retailer"}
              >
                <p>BECOME A RETAILER</p>
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <Link
                className="footer-links font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl"
                href={"/contact-us"}
              >
                <p>CONTACT US</p>
              </Link>
              <Link
                className="footer-links font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl"
                href={"/find-a-store"}
              >
                <p>FIND A STORE</p>
              </Link>
              <Link
                className="footer-links font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl"
                href={"/size-chart"}
              >
                <p> SIZE CHART</p>
              </Link>
            </div>
            <div className="col-span-2 mt-3 flex flex-col gap-1 md:col-span-1 md:mt-0">
              <p className="footer-links font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">
                FOLLOW US
              </p>
              <div className="flex flex-col gap-1">
                <Link
                  className="text-[#C9A39A]"
                  href={"https://www.facebook.com/chicandholland"}
                >
                  <p className="footer-links inline font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">
                    FACEBOOK
                  </p>
                </Link>
                <Link
                  className="text-[#C9A39A]"
                  href={"https://www.instagram.com/chicandholland/"}
                >
                  <p className="footer-links inline font-adornstoryserif text-[#C9A39A] 2xl:text-xl 3xl:text-2xl 4xl:text-3xl">
                    INSTAGRAM
                  </p>
                </Link>
              </div>
            </div>
          </div>

          <h1 className="text-center font-mysi text-[40px] text-[#C9A39A] md:text-[50px] 4xl:py-6">
            <Link href={"/"}>
              <img
                // src="/brand-logo.png"
                src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/brand-logo.png"
                alt="Chic & Holland"
                className="w-[250px] md:w-full 2xl:w-[1000px]"
              />
            </Link>
          </h1>
        </div>

        <div className="mt-8 flex w-full justify-center md:mt-0 md:w-auto md:justify-end">
          <Link href={"/"}>
            <img
              src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/CH%20Monogram_Rose%20Gold.png"
              alt="Chic & Holland"
              className="w-[75px] md:w-[400px]"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
