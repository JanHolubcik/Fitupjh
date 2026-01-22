import { FaPencilAlt } from "react-icons/fa";

const ProfileInfoButton = ({
  headline,
  value,
}: {
  headline: string;
  value?: string | number;
}) => {
  return (
    <div className=" flex flex-row w-[165px] justify-between">
      <p>
        {" "}
        {headline}: {value}{" "}
      </p>
      <FaPencilAlt className="mr-1" />
    </div>
  );
};

export default ProfileInfoButton;
