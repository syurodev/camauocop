type SpecialtysData = {
  _id: string,
  name: string,
  productCount: number,
  images: string[]
}

type SpecialtysDetail = {
  _id: string,
  name: string,
  productCount: number,
  description: {
    type: string;
    content: any[];
  };
  images: string[]
}