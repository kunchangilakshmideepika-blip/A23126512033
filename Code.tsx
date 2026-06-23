interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

const priorityMap: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function getTopNotifications(): Promise<Notification[]> {
  const response = await fetch(
    "http://4.224.186.213/evaluation-service/notifications"
  );

  const data = await response.json();

  const notifications: Notification[] = data.notifications;

  notifications.sort((a, b) => {
    const priorityDiff =
      priorityMap[b.Type] - priorityMap[a.Type];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return (
      new Date(b.Timestamp).getTime() -
      new Date(a.Timestamp).getTime()
    );
  });

  return notifications.slice(0, 10);
}

getTopNotifications().then((top10) => {
  console.log("Top 10 Notifications:");
  console.table(top10);
});
