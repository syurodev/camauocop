"use client";

import { getCurrentLocation, getGHNLocationCode } from "@/actions/address";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type IProps = {
  latitude: number;
  longitude: number;
};

const Transport: React.FC = () => {
  useEffect(() => {
    const fetchApi = async () => {
      const res: GHNApiProvinceResponse = await getGHNLocationCode();
      console.log(res);
    };
    fetchApi();
  }, []);

  return <div></div>;
};
export default Transport;
