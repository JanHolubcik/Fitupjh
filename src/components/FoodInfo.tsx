import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";

type Food = {
  name: string;
  description: string;
  image?: File;
}



const NavbarComponent = (props : Food) => {
 
  return (
    <Card className="max-w-[400px]">
      <CardHeader></CardHeader>
    
    <CardBody className="flex-row">
    <Image
        alt="nextui logo"
        height={150}
        radius="sm"
        src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
        width={150}
      />
      <div className="flex-column">
      <p>{props.name}</p>
      <p  className="text-ellipsis overflow-hidden ...">{props.description}</p>
      </div>
    </CardBody>
    <Divider/>
   
  </Card>
  );
};

export default NavbarComponent;
