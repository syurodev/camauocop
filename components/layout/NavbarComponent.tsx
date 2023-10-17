import { Session, getServerSession } from "next-auth";
import React from "react";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Nav from "./Nav";

const NavbarComponent: React.FC = async () => {
  const session: Session | null = await getServerSession(authOptions)

  const sessionData = JSON.stringify(session)

  return (
    <Nav sessionData={sessionData} />
  );
};

export default NavbarComponent;
