import { Image } from "@nextui-org/react";

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
      radius="md"
      height={80}
      fallbackSrc={`foodPlaceholder.png`}
      src={
        url === undefined || url === ""
          ? `https://www.themealdb.com/images/ingredients/${macroName}.png`
          : url
      }
      className="object-contain"
    />
  );
};

export default ImageFromURL;
