import { Image } from "@heroui/react";
import placeholder from "../../../public/foodPlaceholder.svg";

const ImageFromURL = ({
  url,
  macroName,
  width = 75,
  height = 75,
}: {
  url: string | undefined;
  macroName: string;
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      alt={macroName}
      height={width}
      width={height}
      radius="md"
      fallbackSrc={placeholder.src}
      src={
        !url
          ? `https://www.themealdb.com/images/ingredients/${macroName}.png`
          : url
      }
      // This forces NextUI to scale the structural image element properly inside its wrapper frame
      classNames={{
        img: "object-contain ",
        wrapper: "dark:bg-zinc-800/20",
      }}
      className="dark:bg-zinc-950/50"
    />
  );
};

export default ImageFromURL;
