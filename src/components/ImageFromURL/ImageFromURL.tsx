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
      height={100}
      radius="md"
      fallbackSrc={`foodPlaceholder.png`}
      src={
        url === undefined || url === ""
          ? `https://www.themealdb.com/images/ingredients/${macroName}.png`
          : url
      }
      width={100}
      className="object-contain"
    />
  );
};

export default ImageFromURL;
