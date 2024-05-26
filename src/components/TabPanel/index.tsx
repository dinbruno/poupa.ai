// components/TabPanel.tsx
"use client";

import { useState, useEffect } from "react";
import {
  BuildingOfficeIcon,
  CreditCardIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "Entradas", href: "/my-account", icon: UserIcon },
  { name: "Saídas", href: "/company", icon: CreditCardIcon },
  { name: "Configurações", href: "/team", icon: UsersIcon },
];

export default function TabPanel() {
  const router = useRouter();
  const params = usePathname();

  console.log(params, "aqui");

  const [currentTab, setCurrentTab] = useState("");

  // Atualiza o tab atual com base na rota
  useEffect(() => {
    const activeTab = tabs.find((tab) => params === tab.href);
    setCurrentTab(activeTab ? activeTab.name : tabs[0].name);
  }, [params]);

  const handleTabClick = (href: string) => {
    router.push(href);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          value={currentTab}
          onChange={(e) =>
            handleTabClick(
              tabs.find((tab) => tab.name === e.target.value)?.href || ""
            )
          }
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.name === currentTab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                )}
                aria-current={tab.name === currentTab ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(tab.href);
                }}
              >
                <tab.icon
                  className={classNames(
                    tab.name === currentTab
                      ? "text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
