"use client";

import { getCurrentLocation } from "@/actions/address";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type IProps = {
  latitude?: number;
  longitude?: number;
};

const Transport: React.FC<IProps> = () => {
  // useEffect(() => {
  //   const fetchApi = async () => {
  //     const res: GHNApiProvinceResponse = await getGHNLocationCode();
  //   };
  //   fetchApi();
  // }, []);

  return <div></div>;
};
export default React.memo(Transport);
