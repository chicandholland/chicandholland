import { CustomizedImage } from "@/components/custom/CustomizedImage";
import { getSponsors } from "@/lib/data";
import SponserImages from "./SponserImages";

const BrandPage = async () => {
  const { sponsor } = await getSponsors({});

  return (
    <div>
      <div>
        <div className="container relative flex flex-col justify-between gap-8 py-8 md:flex-row">
          <div className="hidden md:block absolute right-0 sm:right-16 top-5 z-[-1]  h-[600px] opacity-[0.1] md:w-[40%] 2xl:w-[30%] 3xl:w-[40%] 4xl:w-[34%]">
            <CustomizedImage
              src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/CH%20Monogram_Rose%20Gold.png"
              alt="logo"
              unoptimized
            />
          </div>

          <div className="h-[600px] md:w-[40%] lg:w-[30%] 3xl:w-[20%]">
            <CustomizedImage
              src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/faiza%20talat.webp"
              alt="Faiza Talat"
              unoptimized
            />
          </div>
          <div className="flex flex-col md:w-[70%] md:justify-center 3xl:w-[80%]">
            <p className="hidden font-mysi text-lg leading-8 md:block md:text-justify md:text-xl 2xl:text-2xl 3xl:pl-40 3xl:pr-56 3xl:text-4xl 4xl:pl-40 4xl:pr-72 4xl:text-4xl">
              Faiza Talat founded chic & holland in 2015, realizing a childhood
              dream of bringing her vision exquisitely crafted dresses to the
              world. Based in the Netherlands, chic & holland designs and
              manufactures luxurious, hand-crafted dresses for every special
              occasion in a woman's life. Each collection is dedicated to the
              purity of couture-of color, texture and refined embellishment
              details. Our dresses are filled with endless mesmerizing, delicate
              patterns of embellishments imposing a perfectly glamorous
              silhouette to the indescribable magic of colors. Each dress is
              handmade in our own atelier, passing through at least 25 pairs of
              hands from start to finish - ensuring unparalleled quality and
              level of craftsmanship in every silhouette.
            </p>
            <div className="block relative md:hidden">
              <p className="font-mysi text-lg leading-8">
                Faiza Talat founded chic & holland in 2015, realizing a
                childhood dream of bringing her vision exquisitely crafted
                dresses to the world. Based in the Netherlands, chic & holland
                designs and manufactures luxurious, hand-crafted dresses for
                every special occasion in a woman's life.
              </p>
              <p className="my-4 font-mysi text-lg leading-8">
                {" "}
                Each collection is dedicated to the purity of couture-of color,
                texture and refined embellishment details. Our dresses are
                filled with endless mesmerizing, delicate patterns of
                embellishments imposing a perfectly glamorous silhouette to the
                indescribable magic of colors.
              </p>
              <p className="font-mysi text-lg leading-8">
                Each dress is handmade in our own atelier, passing through at
                least 25 pairs of hands from start to finish - ensuring
                unparalleled quality and level of craftsmanship in every
                silhouette.
              </p>
              <div className="absolute  z-[-1] top-10 right-0  h-full opacity-[0.1] w-full">
                <CustomizedImage
                  src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/CH%20Monogram_Rose%20Gold.png"
                  alt="logo"
                  unoptimized
                 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black text-primary-foreground">
        <div className="container flex flex-col gap-12 py-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-adornstoryserif text-2xl text-[#C9A39A] 3xl:text-3xl 4xl:text-5xl">
              THE LABEL
            </h2>
            <div className={"w-full md:w-[40%]"}>
              <CustomizedImage
                src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/CH%20Monogram_Rose%20Gold.png"
                alt="Choices"
                unoptimized
              />
            </div>
            <p className="mt-9 w-[70%] font-mysi md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
              Women's wear label headquartered in the Netherlands that creates,
              manufactures, and distributes hand-crafted, high-end gowns for
              special events. Chic & Holland have more than 150 authorized
              retailers within 25 countries.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-adornstoryserif text-2xl text-[#C9A39A] 3xl:text-3xl 4xl:text-5xl">
              CHOICES
            </h2>
            <div className={"w-full md:w-[40%]"}>
              <CustomizedImage
                src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/B406-38-PaperFinish.png"
                alt="Choices"
                unoptimized
              />
            </div>
            <p className="w-[70%] font-mysi md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
              The captivating, delicate patterns of embellishment impose a
              breathtaking silhouette to the ineffable enchantment of hues in
              these handcrafted evening dresses. The label also has a bespoke
              range where you may create your own special day gown.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CustomizedImage
              src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/image2.webp"
              alt="Choices"
              unoptimized
            />
            <CustomizedImage
              src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/image3.webp"
              alt="Choices"
              unoptimized
            />
            <CustomizedImage
              src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/image4.webp"
              alt="Choices"
              unoptimized
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-adornstoryserif text-2xl text-[#C9A39A] 3xl:text-3xl 4xl:text-5xl">
              CRAFTMANSHIP
            </h2>
            <p className="w-[70%] font-mysi md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
              Each Season one-of-a-kind design is created with special care at
              their own Atelier. A single silhouette can take up to hundreds of
              man-hours to complete, ensuring delivery within the time frame.
              The design team themselves seeks out the high-quality raw
              materials and the proper implementation of each design.
            </p>
          </div>

          <video
            src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/chick&.mov"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            controlsList="nodownload"
            className="m-0 h-full p-0"
          ></video>

          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-adornstoryserif text-2xl text-[#C9A39A] 3xl:text-3xl 4xl:text-5xl">
              OFFICIAL SPONSOR
            </h2>
            <p className="w-[70%] font-mysi md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
              Chic & Holland partnered with MISS WORLD NETHERLANDS and the MISS
              NETHERLANDS show to design gowns for participants and other
              celebrities.
            </p>
          </div>

          {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-3"> */}
          <SponserImages sponsor={sponsor} />

          {/* <div className="flex flex-col items-center gap-2">
              <CustomizedImage
                src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/image5.webp"
                alt="Miss Netherlands 2019"
                unoptimized
              />
              <p className={"text-center"}>
                Sharon Pieksms crowned Miss Netherlands 2019
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomizedImage
                src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/image6.webp"
                alt="Miss Denmark 2021"
                unoptimized
              />
              <p className={"text-center"}>
                Johanne Grundt crowned Miss Denmark 2021
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CustomizedImage
                src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/image7.webp"
                alt="Miss Denmark 2021"
                unoptimized
              />
              <p className={"text-center"}>
                Eliza Joanne de Jong crowned MISS INTERNATIONAL NETHERLAND 2019
              </p>
            </div> */}
          {/* </div> */}
        </div>
      </div>

      <div className="space-y-12 py-8">
        <div className="bg-black py-2">
          <h2 className="text-center font-adornstoryserif text-2xl text-[#C9A39A] 3xl:text-3xl 4xl:text-5xl">
            DISCOVER THE AESTHETIC OF THE HOUSE
          </h2>
        </div>

        <div className="container space-y-24">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="md:w-[50%]">
              <CustomizedImage
                src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/41749c84-03e6-4a9e-894a-ecdfde95f634.jpeg"
                alt="Chic & Holland - Brand page images"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-8 md:w-[70%] md:justify-center">
              <h2 className="text-center font-adornstoryserif text-2xl text-[#C9A39A] underline 3xl:text-3xl 4xl:text-5xl">
                WORLD
              </h2>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                The Chic & Holland Design Team is at the core of the brand. They
                seek innovation, high-quality raw materials, and the proper
                implementation of each proposal., Each silhouette goes through
                multiple phases and includes a lot of fine details.
              </p>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                The following sections make up the manufacturing process:
                Creative Design, Pattern Department, Sewing Unit, Handmade
                ornamentation Department, 1st Stage- Quality Control, End Stage,
                and Final Quality Control.
              </p>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                In collaboration with the Sales and Production teams, the Design
                Department meticulously plans the design of every CHIC & HOLLAND
                Dress. All gowns are made in a specified and regulated manner,
                with care and love applied at all stages.
              </p>
            </div>
          </div>

          {/* <div className="flex flex-col gap-12">
            <h2 className="text-center font-prata text-2xl text-[#C9A39A] underline">
              CLASSIC MEET COMTEMPORARY
            </h2>
            <div className="flex flex-col gap-8 md:flex-row md:justify-between">
              <div className="flex flex-col gap-8 md:w-[70%] md:justify-center">
                <p className="text-center font-mysi text-lg leading-8">
                  A quick look through the Chic and Holland collections reveals
                  gown after gown meant to make a woman feel like a tall glass
                  of beauty. The collection's color palette, extravagant
                  detailing, and neckline or décolletage decorations are what
                  make it modern.
                </p>
                <p className="text-center font-mysi text-lg leading-8">
                  Chic and Holland woman is tough, elegant and sophisticated.
                  She knows what she wants and dresses for herself. She believes
                  in timeless elegance which can be worn to any event rather
                  than trendy pieces which will only last a season or two. She
                  cares about the quality and attention to detail.
                </p>
              </div>
              <div className="md:w-[50%]">
                <CustomizedImage
                  src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/0C4A5447%20copy.jpg"
                  alt="Chic & Holland - Brand page images"
                  unoptimized
                />
              </div>
            </div>
          </div> */}

          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="flex flex-col gap-8 md:w-[70%] md:justify-center">
              <h2 className="text-center font-adornstoryserif text-2xl text-[#C9A39A] underline 3xl:text-3xl 4xl:text-5xl">
                CLASSIC MEET CONTEMPORARY
              </h2>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                A quick look through the Chic and Holland collections reveals
                gown after gown meant to make a woman feel like a tall glass of
                beauty. The collection's color palette, extravagant detailing,
                and neckline or décolletage decorations are what make it modern.
              </p>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                Chic and Holland woman is tough, elegant and sophisticated. She
                knows what she wants and dresses for herself. She believes in
                timeless elegance which can be worn to any event rather than
                trendy pieces which will only last a season or two. She cares
                about the quality and attention to detail.
              </p>
            </div>
            <div className="md:w-[50%]">
              <CustomizedImage
                src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/0C4A5447%20copy.jpg"
                alt="Chic & Holland - Brand page images"
                unoptimized
              />
            </div>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="md:w-[50%]">
              <CustomizedImage
                src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/0C4A5809%20copy.jpg"
                alt="Chic & Holland - Brand page images"
                unoptimized
              />
            </div>
            <div className="flex flex-col gap-8 md:w-[70%] md:justify-center">
              <h2 className="text-center font-adornstoryserif text-2xl text-[#C9A39A] underline 3xl:text-4xl 4xl:text-5xl">
                TIMELESS ELEGANCE
              </h2>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                Our aim at Chic & Holland is to design and make dresses that
                will never go out of fashion - something that our discerning
                customers will be able to enjoy and appreciate for many years to
                come. The colour palette, the modern fabrics, the extravagant
                detailing and the classic silhouette when used together lend a
                very contemporary air to our collections.
              </p>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                The Chic & Holland woman is tough, elegant and sophisticated.
                She knows what she wants and dresses for herself! She
                appreciates the finer details and the effort that goes into a
                high-quality handmade garment.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="flex flex-col gap-8 md:w-[70%] md:justify-center">
              <h2 className="text-center font-adornstoryserif text-2xl text-[#C9A39A] underline 3xl:text-4xl 4xl:text-5xl">
                TRULY HANDMADE
              </h2>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                We consider ourselves guardians of this craft! In a world where
                things are increasingly being made by machines, we choose to
                painstakingly make all of our dresses by hand, at our own
                atelier - something very few brands can truly claim. The
                craftsmen who've chosen to work with us have been engaged in
                this craft for decades which helps us maintain the highest
                quality, consistently.
              </p>
              <p className="text-center font-mysi text-lg leading-8 md:text-xl 2xl:text-2xl 3xl:text-4xl 4xl:text-4xl">
                Our dresses can take hundreds of man-hours to produce, because
                we'd want nothing but the very best for our customers.
              </p>
            </div>
            <div className="md:w-[50%]">
              <CustomizedImage
                src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/0C4A5674%20copy.jpg"
                alt="Chic & Holland - Brand page images"
                unoptimized
              />
            </div>
          </div>
          {/* 
          <div className="flex flex-col gap-12">
            <h2 className="text-center font-prata text-2xl text-[#C9A39A] underline">
              TRULY HANDMADE
            </h2>
            <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <div className="flex flex-col gap-8 md:w-[70%] md:justify-center">
                <p className="text-center font-mysi text-lg leading-8">
                  We consider ourselves guardians of this craft! In a world
                  where things are increasingly being made by machines, we
                  choose to painstakingly make all of our dresses by hand, at
                  our own atelier - something very few brands can truly claim.
                  The craftsmen who've chosen to work with us have been engaged
                  in this craft for decades which helps us maintain the highest
                  quality, consistently.
                </p>
                <p className="text-center font-mysi text-lg leading-8">
                  Our dresses can take hundreds of man-hours to produce, because
                  we'd want nothing but the very best for our customers.
                </p>
              </div>
              <div className="md:w-[40%]">
                 <video
                  src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-videos/5.mp4"
                  autoPlay={true}
                  muted={true}
                  loop={true}
                  playsInline={true}
                  controlsList="nodownload"
                  className="m-0 h-full w-full bg-black object-fill p-0 xl:!h-[500px]"
                ></video> 
                <CustomizedImage
                  src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/brand_page/0C4A5674%20copy.jpg"
                  alt="Chic & Holland - Brand page images"
                  unoptimized
                />
              </div>
            </div>
          </div> */}

          {/* <div className="flex flex-col gap-12">
            <h2 className="text-center font-prata text-2xl">
              SOPHISTICATED SELECTIONS
            </h2>

            <div className="flex flex-col items-center gap-2 space-y-2">
              <div className="h-[600px]">
                <CustomizedImage
                  src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/Brand_New/image11.webp"
                  alt="Chic & Holland - Brand page images"
                  unoptimized
                />
              </div>

              <div className="flex flex-col gap-8">
                <p className="text-center text-lg leading-8">
                  Evening attire Aesthetics of chic and Holland have a number of
                  characteristics. The first of which is the fit of the dresses
                  is fairly column-like, emphasizing sheath. These designs help
                  to lengthen the body, making it appear taller and thinner, by
                  employing patterns as well as the color all the way up and
                  down in a straight vertical line. Many dresses include a short
                  sweep train, which lends a silky, seductive touch to the
                  design. Including ornamentation around the torso, upper arms,
                  or neck, which makes them look more modern and draw attention.
                </p>
                <p className="text-center text-lg leading-8">
                  Prices are subject to design and production. for bespoke
                  embellishment Work, the price depends upon embellishing
                  materials, complexity, size, and design time
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
