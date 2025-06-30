import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IPushNotification, NotificationData } from "interfaces";
import { messageListener } from "utils/firebaseMessageListener";
import CloseFillIcon from "remixicon-react/CloseFillIcon";
import { ClickAwayListener } from "@mui/material";
import Link from "next/link";
import { useSettings } from "contexts/settings/settings.context";

type Props = {};

export default function PushNotification({}: Props) {
  const { t } = useTranslation();
  const [data, setData] = useState<IPushNotification | undefined>(undefined);
  const [notificationData, setNotificationData] = useState<NotificationData | undefined>(undefined);
  const { settings } = useSettings();

  useEffect(() => {
    if (settings?.push_notification) {
      messageListener(setData, setNotificationData);
    }
  }, [settings?.push_notification]);

  function handleClose() {
    setData(undefined);
    setNotificationData(undefined);
  }

  function getLink(data: NotificationData) {
    switch (data.type) {
      case "order":
        return `/orders/${data.id}`;
      default:
        return "/";
    }
  }

  if (!data?.title) {
    return <div />;
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className="push-notification">
        {notificationData?.id && <Link href={getLink(notificationData)} />}
        <button className="btn-close" onClick={handleClose}>
          <CloseFillIcon />
        </button>
        <div className="content">
          <h5 className="title">{data?.title || t("new.notification")}</h5>
          <p className="text">{data?.body}</p>
        </div>
      </div>
    </ClickAwayListener>
  );
}
