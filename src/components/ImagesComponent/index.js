//next imports
import Image from "next/image";

import { imagePath } from "@/utilities";

//import from store

import { useGetMovieImagesQuery } from "@/store/api/restApis";

const ImagesComponent = ({ id }) => {
  const { data } = useGetMovieImagesQuery({ id });

  const renderImages = (images, type) => (
    <>
      <h1 className="font-bold text-white my-3 text-2xl text-center">
        {type === "backdrops" ? "Back Drop Images" : "Posters"}
      </h1>
      <div className="flex flex-col overflow-x-auto w-full p-3">
        <div className="flex space-x-4">
          {images.map((image, idx) => (
            <Image
              key={idx}
              height={type === "backdrops" ? 700 : 300}
              width={type === "backdrops" ? 700 : 200}
              className={
                type === "backdrops"
                  ? "h-auto w-[500px]"
                  : "h-[300px] w-[200px]"
              }
              src={`${imagePath}${image.file_path || "/noimage.png"}`}
              alt={`image${idx}`}
            />
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-20 py-7">
      {data?.backdrops?.length > 0 && renderImages(data.backdrops, "backdrops")}
      {data?.posters?.length > 0 && renderImages(data.posters, "posters")}
    </div>
  );
};

export default ImagesComponent;
