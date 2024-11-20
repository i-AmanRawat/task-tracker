import { useState } from "react";
import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { enIN, enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import "./data-calendar.css";
import { EventCard } from "./event-card";

import { Task } from "../types";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
  "en-IN": enIN,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalendarProps {
  data: Task[];
}

export function DataCalendar({ data }: DataCalendarProps) {
  const [date, setDate] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    id: task.$id,
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
  }));

  function handleNavigate(action: "PREV" | "NEXT" | "TODAY") {
    if (action === "PREV") {
      setDate(subMonths(date, 1));
    } else if (action === "NEXT") {
      setDate(addMonths(date, 1));
    } else if (action === "TODAY") {
      setDate(new Date());
    }
  }

  return (
    <Calendar
      localizer={localizer}
      date={date}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      // style={{ height: 500 }}
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => (
          <CustomToolbar onNavigate={handleNavigate} date={date} />
        ),
      }}
    />
  );
}

interface CustomToolbarProps {
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  date: Date;
}

export function CustomToolbar({ onNavigate, date }: CustomToolbarProps) {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        onClick={() => onNavigate("PREV")}
        variant="secondary"
        size="icon"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input rounded-md px-3 py-2 h-8 w-full lg:w-auto">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        onClick={() => onNavigate("NEXT")}
        variant="secondary"
        size="icon"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
