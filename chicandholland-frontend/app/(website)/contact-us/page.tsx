import ContactForm from "./Form";

const ContactUs = () => {
  return (
    <div className="my-8 flex flex-col gap-8">
      <h1 className="text-center text-3xl font-adornstoryserif">Contact us</h1>

      <div className="bg-muted py-6 text-primary">
        <div className="container space-y-6">
          <div>
            <p className="font-bold">Call Our Headquarters</p>
            <p className="font-bold">+31621422813, +33758609484</p>
          </div>
          <div>
            <p className="font-bold">
              General Enquiries:{" "}
              <a
                href="mailto:info@chicandholland.com"
                className="text-blue-500"
              >
                info@chicandholland.com
              </a>
            </p>
            <p className="font-bold">
              Sales Enquiries:{" "}
              <a
                href="mailto:sales@chicandholland.com"
                className="text-blue-500"
              >
                sales@chicandholland.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-8 px-8 md:flex-row">
        <div className="h-[800px] flex-1">
          <video
            src="https://chicandholland-space.ams3.cdn.digitaloceanspaces.com/new-collection-videos/COUTURE/Sequence 01_6.mp4"
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            controlsList="nodownload"
            className="m-0 h-full w-full object-cover object-center p-0"
          ></video>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4">
          <h2 className="text-2xl">GET IN TOUCH WITH OUR TEAM</h2>

          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
