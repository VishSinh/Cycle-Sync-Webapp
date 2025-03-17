type Event = {
  date: string;
  title: string;
  type: "cycle" | "exercise" | "health" | "wellness";
};

type UpcomingEventsProps = {
  events: Event[];
};

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  // Get color based on event type
  const getEventColor = (type: string) => {
    switch (type) {
      case "cycle": return "bg-red-100 text-red-800";
      case "exercise": return "bg-green-100 text-green-800";
      case "health": return "bg-blue-100 text-blue-800";
      case "wellness": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-3">
      {events.map((event, i) => (
        <div key={i} className="flex items-center p-2 border-b">
          <div className="w-16 text-center mr-3">
            <p className="text-sm font-bold">{event.date.split(" ")[1]}</p>
            <p className="text-xs">{event.date.split(" ")[0]}</p>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{event.title}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getEventColor(event.type)}`}>
              {event.type}
            </span>
          </div>
        </div>
      ))}
      <button className="w-full text-sm text-purple-600 font-medium text-center pt-2">
        View full calendar →
      </button>
    </div>
  );
}