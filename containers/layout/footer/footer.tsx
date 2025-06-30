/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useSettings } from "contexts/settings/settings.context";
import dynamic from "next/dynamic";

const uiTypes = {
  "1": dynamic(() => import("containers/layout/footer/v1")),
  "2": dynamic(() => import("containers/layout/footer/v2")),
  "3": dynamic(() => import("containers/layout/footer/v2")),
  "4": dynamic(() => import("containers/layout/footer/v2")),
};

type Props = {
  onOpenVoiceOrder?: () => void;
};

export default function Footer({ onOpenVoiceOrder }: Props) {
  const { settings } = useSettings();

  const Ui = uiTypes[settings?.ui_type as keyof typeof uiTypes];
  const FooterV1 = uiTypes["1"];

  return !!Ui ? <Ui onOpenVoiceOrder={onOpenVoiceOrder} /> : <FooterV1 onOpenVoiceOrder={onOpenVoiceOrder} />;
}
