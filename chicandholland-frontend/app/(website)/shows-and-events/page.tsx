import "./Shows.css";
const ShowsAndEvents = () => {
  const showsAndEvents = [
    {
      location: "Germany",
      image:
        "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/germany.jpg",
    },
    {
      location: "Barcelona",
      image:
        "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/image4.webp",
    },
    // {
    //   location: "USA",
    //   image:
    //     "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/image2.webp",
    // },
    {
      location: "USA",
      image:
        "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/image%20(1).png",
    },
    // {
    //   location: "Italy",
    //   image:
    //     "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/image5.webp",
    // },
     {
      location: "Italy",
      image:
        "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/image%20(2).png",
    },
    {
      location: "Harrogate UK",
      image:
        "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/image1.webp",
    },
    {
      location: "Chicago",
      image:
        "https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/shows-and-events/image7.jpg",
    },
  ];

  return (
    <div className="my-8 3xl:h-[calc(100vh-441px)]">
      <div className="container grid grid-cols-1 md:grid-cols-3">
        {showsAndEvents.map((show, index) => (
          <>
            <div className="flip-container" key={index}>
              <div className="flip-card h-[200px] border border-primary p-2 shadow-sm transition-all hover:shadow-md md:h-[400px]">
                <div className="front text-center text-xl font-bold font-adornstoryserif 3xl:text-2xl">
                  {show.location}
                </div>
                <div className="back">
                  <img src={show.image} alt="" />
                </div>
              </div>
            </div>

            {/* <div
            
              className="h-[400px] space-y-2 border p-3 shadow-sm transition-all hover:border-primary hover:shadow-md"
            >
              <div className="h-[340px] overflow-hidden">
                <CustomizedImage
                  src={show.image}
                  alt={show.location}
                  unoptimized
                />
              </div>
              <h1 className="text-center text-xl font-bold">{show.location}</h1>
            </div> */}
          </>
        ))}
      </div>
    </div>
  );
};

export default ShowsAndEvents;