"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
// import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {Link} from 'i18n/navigation';


import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import CategoryIcon from "@mui/icons-material/Category";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { signOut, useSession } from "next-auth/react";
import { cn } from "lib/utils";

export function SidebarDemo({ children }) {
  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <HomeIcon className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Order",
      href: "/order",
      icon: (
        <SpeakerNotesIcon className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Minimum price",
      href: "/min_price",
      icon: (
        <AccountBalanceIcon className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Categories",
      href: "/products_categorie",
      icon: (
        <CategoryIcon className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Produits",
      href: "/Produits",
      icon: (
        <ProductionQuantityLimitsIcon className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Ajouté produit",
      href: "/add_product",
      icon: (
        <AddTaskIcon className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <AccountBoxOutlinedIcon className="text-white dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col lg:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto   dark:border-neutral-700 overflow-hidden max-w-screen-2xl",
        // for your use case, use `h-screen` instead of `h-[60vh]`
        "min-h-screen "
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <SidebarLink link={link} className={undefined} />
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* <SidebarLink
              link={{
                label: "Admin",
                href: "#",
                icon: (
                  <Image
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
              className={undefined}
            /> */}
          </div>
        </SidebarBody>
      </Sidebar>

      <Dashboard children={children} />
    </div>
  );
}
export const Logo = () => {
  return (
    // <Link
    //   href="#"
    //   className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    // >
    <div className=" flex justify-center">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white dark:text-white whitespace-pre"
      >
        <Image
          src={"/img_logo/logo-crystal-annaba-removebg-preview.webp"}
          width={150}
          height={150}
          alt={""}
          //  unoptimized={true} 
        />
      </motion.span>
    </div>
    // </Link>
  );
};

// Dummy dashboard component with content
const Dashboard = ({ children }) => {
  const { data: session, status } = useSession();
  return (
    <div className="flex flex-1 ">
    
        <div className=" rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-screen overflow-auto">
          {children}
        </div>
    </div>
  );
};

{
  /* <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-screen">
            <div className="flex gap-2">
              {[...new Array(4)].map((i, index) => (
                <div
                  key={index}
                  className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                ></div>
              ))}
            </div>
            <div className="flex gap-2 flex-1">
              {[...new Array(2)].map((i, index) => (
                <div
                  key={index}
                  className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                ></div>
              ))}
            </div>
          </div> */
}
