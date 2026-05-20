import { Image } from "@nextui-org/react";
import placeholder from "../../../public/foodPlaceholder.svg";

const ImageFromURL = ({
  url,
  macroName,
}: {
  url: string | undefined;
  macroName: string;
}) => {
  return (
    <Image
      alt={macroName}
      height={75}
      width={75}
      radius="md"
      fallbackSrc={placeholder.src}
      src={
        !url
          ? `https://www.themealdb.com/images/ingredients/${macroName}.png`
          : url
      }
      // This forces NextUI to scale the structural image element properly inside its wrapper frame
      classNames={{
        img: "object-contain w-full h-full",
        wrapper: "bg-zinc-800/20", // Optional: gives a nice subtle backdrop if images have transparency
      }}
    />
  );
};

export default ImageFromURL;
