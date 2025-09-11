import { CustomizedImage } from "@/components/custom/CustomizedImage";

const SizeChart = () => {
  return (
    <div className="min-h-screen">
      <div className="mx-auto h-full py-10 md:w-[60%] lg:w-[50%] xl:w-[40%]">
        <CustomizedImage
          src="https://ymts.blr1.cdn.digitaloceanspaces.com/chicandholland/size-chart/image1.jpeg"
          alt="Size Chart"
          unoptimized
        />
      </div>
    </div>
  );
};

export default SizeChart;
