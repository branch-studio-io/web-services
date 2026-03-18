"use client";

import TabBar from "@/components/TabBar";
import { RegInstructions } from "@/components/vr-rules/RegInstructions";
import { Authority } from "@/types/democracyWorks";
import { useState } from "react";

type EligibilityRequirmentsProps = {
  authority: Authority;
};

export function EligibilityRequirments({
  authority,
}: EligibilityRequirmentsProps) {
  const [selectedTabId, setSelectedTabId] = useState<string>("");

  const tabs = [];

  if (authority.registration.online?.supported) {
    tabs.push({
      id: "online",
      name: "ONLINE REGISTRATION",
      regInstructions: authority.registration.online?.instructions ?? null,
      preRegInstructions:
        authority.youthRegistration.onlineInstructions ?? null,
    });
  }

  const byMail = authority.registration.byMail;
  if (byMail?.supported) {
    const parts = [
      byMail.idInstructions,
      byMail.signatureInstructions,
      byMail.citizenInstructions,
      byMail.newVoterInstructions,
    ].filter((s): s is string => Boolean(s?.trim()));

    const regInstructions = parts.length > 0 ? parts.join("<br>") : null;

    tabs.push({
      id: "by-mail",
      name: "BY MAIL REGISTRATION",
      regInstructions,
      preRegInstructions:
        authority.youthRegistration.byMailInstructions ?? null,
    });
  }

  if (tabs.length === 0) {
    return <div className="space-y-4 pt-2" />;
  }

  const tabBarTabs = tabs.map(({ id, name }) => ({ id, name }));
  const effectiveSelectedId =
    tabBarTabs.some((tab) => tab.id === selectedTabId) && selectedTabId
      ? selectedTabId
      : tabBarTabs[0].id;
  const activeTab =
    tabs.find((tab) => tab.id === effectiveSelectedId) ?? tabs[0];

  return (
    <div className="space-y-4 pt-2">
      <div className="w-fit">
        <TabBar
          tabs={tabBarTabs}
          selectedId={effectiveSelectedId}
          onClick={setSelectedTabId}
        />
      </div>
      <RegInstructions
        regInstructions={activeTab.regInstructions}
        preRegInstructions={activeTab.preRegInstructions}
      />
    </div>
  );
}
