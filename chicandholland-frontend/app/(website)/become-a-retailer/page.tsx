const BecomeARetailer = () => {
  return (
    <div className="mb-8 flex flex-col gap-8">
      <section className="relative flex h-[50vh] items-center justify-center overflow-hidden">
        <img
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: "-1",
          }}
          className="col-12"
          src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/latest-content/0C4A9275%20copy.jpg"
          // src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/optimized-videos/bannervideo.mp4"
          // autoPlay={true}
          // muted={true}
          // loop={true}
          // playsInline={true}
          // controlsList="nodownload"
        />
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "-1",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        ></div>

        <h1 className="font-adornstoryserif text-4xl text-white">Become a Retailer</h1>
      </section>
      <div className="flex flex-col-reverse justify-between gap-2 px-8 md:flex-row">
        <div className="mx-auto h-[800px] w-full sm:w-[60%] md:w-[70%] lg:w-[30%] 3xl:h-[1200px]">
          <video
            src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/new-collection-videos/COUTURE/Sequence 04_1.mp4"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            controlsList="nodownload"
            className="m-0 h-full w-full rounded object-cover object-center p-0"
          ></video>
        </div>
        <div className="flex flex-col gap-4 px-2 py-4 text-lg 2xl:w-[60%] 2xl:px-0 3xl:gap-8">
          <h2 className="mb-10 text-2xl font-bold">
            THANK YOU FOR YOUR INTEREST IN BECOMING A CHIC & HOLLAND RETAILER!
          </h2>

          <p>
            We appreciate your interest in joining the Chic & Holland retailer
            network!
          </p>
          <p>
            We are overjoyed to hear that you find our brand appealing and would
            like to carry the brand.
          </p>
          <p>
            To start the process of becoming a Chic & Holland retailer, please
            send an email to{" "}
            <a href="mailto:info@chicandholland.com" className="text-blue-500">
              info@chicandholland.com
            </a>
          </p>
          <p>
            Please provide the store's name, address, phone number, website, and
            person to contact.
          </p>
          <p>
            We will carefully check your application when you submit it, and
            we'll get in touch with you as soon as possible.
          </p>
          <p>
            Do not hesitate to get in touch with us if you need any additional
            assistance or if you have any questions
          </p>
        </div>
      </div>
    </div>
  );
};

export default BecomeARetailer;
