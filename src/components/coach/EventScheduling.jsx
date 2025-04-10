import React, { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import Swal from "sweetalert2"; // SweetAlert2 for modal popups
const user = JSON.parse(localStorage.getItem("sport-science-token"));
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001";

const EventCalendar = ({ assigned }) => {
  console.log("this is assigned", assigned);
  const [events, setEvents] = useState([]);
  const [sport, setSport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const calendarRef = useRef(null); // Create a ref for FullCalendar

  //   const [events, setEvents] = useState([
  //     {
  //       id: 1,
  //       title: "Speed Training",
  //       start: "2025-04-13T08:00:00",
  //       end: "2025-04-13T09:30:00",
  //     },
  //     {
  //       id: 2,
  //       title: "Speed Training2",
  //       start: "2025-04-13T08:00:00",
  //       end: "2025-04-13T09:30:00",
  //     },
  //     {
  //       id: 3,
  //       title: "Team Meeting",
  //       start: "2025-04-14T15:00:00",
  //       end: "2025-04-14T16:00:00",
  //     },
  //     {
  //       id: 4,
  //       title: "Strength & Conditioning",
  //       start: "2025-04-12T10:00:00",
  //       end: "2025-04-12T12:00:00",
  //     },
  //   ]);

  useEffect(() => {
    if (assigned && assigned.assign_sports) {
      const eventData = assigned.assign_sports.flatMap((assignSport) => {
        return assignSport.sport.events.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
          sport_name: assignSport.sport.name, // Add sport name
        }));
      });

      setEvents(eventData); // Set the events data with sport names
      setLoading(false);
    }
  }, [assigned]);

//   useEffect(() => {
//     if (calendarRef.current) {
//       calendarRef.current.getApi().removeAllEvents(); // Remove existing events
//       calendarRef.current.getApi().addEventSource(events); // Add updated events
//     }
//   }, [events]); // This useEffect will trigger re-render of FullCalendar when events change


  const handleDateClick = (arg) => {
    // Display SweetAlert2 modal to create event
    const sportsOptions = assigned?.assign_sports
      ?.map((sport) => {
        return `<option value="${sport?.sport?.id}">${sport?.sport?.name}</option>`;
      })
      .join(""); // Create the select options dynamically

    Swal.fire({
      title: `Create Event for ${arg.dateStr}`,
      html: `
        <div class="w-full">
            <div>
                <select id="sportSelect" class="w-full p-2 border border-gray-500">
                    <option value="" disabled selected>Select a sport</option>
                    ${sportsOptions}
                </select>
            </div>
          <div class="flex flex-col items-start mb-2">
            <label for="title">Event Title:</label>
            <input type="text" id="title" class="w-full p-2 border border-gray-500" placeholder="Event title" required>
          </div>
          <div class="flex justify-between gap-4 mb-2">
                <div class="flex flex-col items-start w-full">
                    <label for="startTime">Start Time:</label>
                    <input type="time" id="startTime" class="border p-2 border-gray-500 w-full" required>
                </div>
                <div class="flex flex-col items-start w-full">
                    <label for="endTime">End Time:</label>
                    <input type="time" id="endTime" class="border p-2 border-gray-500 w-full" required>
                </div>
          </div>
          <div class="flex flex-col items-start w-full">
            <label for="description">Description:</label>
            <textarea id="description" class="border p-2 border-gray-500 w-full" placeholder="Event description"></textarea>
          </div>
          
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Create Event",
      preConfirm: () => {
        const selectedSportId = document.getElementById("sportSelect").value;
        const title = document.getElementById("title").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const description = document.getElementById("description").value;

        if (!selectedSportId || !title || !startTime || !endTime) {
          Swal.showValidationMessage("Please fill all required fields");
          return false;
        }

        const newEvent = {
          id: events.length + 1,
          title,
          start: `${arg.dateStr}T${startTime}`,
          end: `${arg.dateStr}T${endTime}`,
          description,
          sport_id: selectedSportId, // Add sport_id to the event
        };

        // Send the new event to the server
        return fetch(`${API_BASE_URL}/api/coach/create/event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newEvent),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to create event");
            }
            return response.json();
          })
          .then((data) => {
            setEvents([...events, newEvent]); // Add the new event to the state if successful
            return newEvent; // Return the new event for confirmation
          })
          .catch((error) => {
            Swal.showValidationMessage(`Error: ${error.message}`);
            return false;
          });
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Event Created",
          "Your event has been created successfully!",
          "success"
        );
      }
    });
  };

  const handleEventClick = (clickInfo) => {
    // alert(`Event clicked: ${clickInfo.event.title}`);
    console.log(clickInfo.event.id);
    const event = clickInfo.event;

    // Pre-populate the SweetAlert2 modal with the current event data
    Swal.fire({
      title: `Edit Event: ${event.title}`,
      html: `
      <div class="w-full">
        <div>
          <select id="sportSelect" class="w-full p-2 border border-gray-500">
            <option value="${event.sport_id}" selected>${
        event.extendedProps.sport_name
      }</option>
            ${assigned?.assign_sports
              ?.map((sport) => {
                return `<option value="${sport?.sport?.id}">${sport?.sport?.name}</option>`;
              })
              .join("")}
          </select>
        </div>
        <div class="flex flex-col items-start mb-2">
          <label for="title">Event Title:</label>
          <input type="text" id="title" class="w-full p-2 border border-gray-500" placeholder="Event title" value="${
            event.title
          }" required>
        </div>
        <div class="flex justify-between gap-4 mb-2">
          <div class="flex flex-col items-start w-full">
            <label for="startTime">Start Time:</label>
            <input type="time" id="startTime" class="border p-2 border-gray-500 w-full" value="${event.start
              .toISOString()
              .slice(11, 16)}" required>
          </div>
          <div class="flex flex-col items-start w-full">
            <label for="endTime">End Time:</label>
            <input type="time" id="endTime" class="border p-2 border-gray-500 w-full" value="${event.end
              .toISOString()
              .slice(11, 16)}" required>
          </div>
        </div>
        <div class="flex flex-col items-start w-full">
          <label for="description">Description:</label>
          <textarea id="description" class="border p-2 border-gray-500 w-full" placeholder="Event description">${
            event.extendedProps.description
          }</textarea>
        </div>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      showDenyButton: true,
      denyButtonText: "Delete Event",
      preConfirm: () => {
        const selectedSportId = document.getElementById("sportSelect").value;
        const title = document.getElementById("title").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const description = document.getElementById("description").value;

        if (!selectedSportId || !title || !startTime || !endTime) {
          Swal.showValidationMessage("Please fill all required fields");
          return false;
        }

        const updatedEvent = {
          id: event.id,
          title,
          start: `${event.start.toISOString().slice(0, 10)}T${startTime}`,
          end: `${event.end.toISOString().slice(0, 10)}T${endTime}`,
          description,
          sport_id: selectedSportId,
        };

        // Send the updated event to the server
        return fetch(`${API_BASE_URL}/api/coach/update/event/${clickInfo.event.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(updatedEvent),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update event");
            }
            return response.json();
          })
          .then((data) => {
            // Update the event locally in the state
            setEvents((prevEvents) =>
              prevEvents.map((e) =>
                e.id === updatedEvent.id ? { ...e, ...updatedEvent } : e
              )
            );
            window.location.reload(true)
            return updatedEvent;
          })
          .catch((error) => {
            Swal.showValidationMessage(`Error: ${error.message}`);
            return false;
          });
      },
      preDeny: () => {
        // Handle event deletion
        return fetch(`${API_BASE_URL}/api/coach/delete/event/${event.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to delete event");
            }
            // Remove the event from state if deletion is successful
            setEvents((prevEvents) =>
              prevEvents.filter((e) => e.id !== event.id)
            );
            return true;
          })
          .catch((error) => {
            Swal.showValidationMessage(`Error: ${error.message}`);
            return false;
          });
      },
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Event Updated",
          "Your event has been updated successfully!",
          "success"
        );
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-md">
      <FullCalendar
       ref={calendarRef} // Attach ref to FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
    </div>
  );
};

// Custom render function for event content
function renderEventContent(eventInfo) {
  return (
    <div
      className="text-xs w-full text-center p-1 rounded-md bg-gray-100 hover:bg-blue-200 transition cursor-pointer overflow-hidden"
      title={eventInfo.event.title}
    >
      {/* <div className="font-semibold">{eventInfo.timeText}</div> */}
      <div className="text-sm text-primary font-semibold">
        {eventInfo.event.extendedProps.sport_name}
      </div>
      <div className="font-medium">{eventInfo.event.title}</div>
      {/* Display the sport name alongside the event */}
    </div>
  );
}

export default EventCalendar;
