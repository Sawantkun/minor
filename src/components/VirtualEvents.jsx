import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import EventRepository from "./EventRepository";

const VirtualEvents = ({ search = "" }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "eventRequests"));
      const approvedEvents = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => event.status === "approved" && event.meetLink);
      setEvents(approvedEvents);
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()) ||
    event.description.toLowerCase().includes(search.toLowerCase()) ||
    event.organizer.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedEvent) {
    return (
      <div className="max-w-3xl mx-auto ">
        <button
          className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold"
          onClick={() => setSelectedEvent(null)}
        >
          ← Back to Events
        </button>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 mb-8">
          <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-56 object-cover rounded-lg mb-2" />
          <h3 className="text-2xl font-bold">{selectedEvent.title}</h3>
          <div className="text-gray-600">{selectedEvent.description}</div>
          <div className="flex gap-4 text-gray-500 text-sm">
            <span>{selectedEvent.date}</span>
            <span>{selectedEvent.time}</span>
          </div>
          <div className="text-gray-700 font-semibold">Organizer: {selectedEvent.organizer}</div>
          <a
            href={selectedEvent.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-purple text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-purple-700 transition w-fit"
          >
            Join via Google Meet
          </a>
        </div>
        <EventRepository eventId={selectedEvent.id} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 col-span-2">
          <h2 className="text-2xl font-bold mb-4">Virtual Events</h2>
          <p className="text-gray-600">No virtual events found.</p>
        </div>
      ) : (
        filteredEvents.map(event => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 cursor-pointer hover:ring-2 hover:ring-purple transition-all duration-200"
            onClick={() => setSelectedEvent(event)}
          >
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-2" />
            <h3 className="text-xl font-bold">{event.title}</h3>
            <div className="text-gray-600">{event.description}</div>
            <div className="flex gap-4 text-gray-500 text-sm">
              <span>{event.date}</span>
              <span>{event.time}</span>
            </div>
            <div className="text-gray-700 font-semibold">Organizer: {event.organizer}</div>
            <span className="mt-2 bg-purple text-white px-4 py-2 rounded-lg font-semibold text-center w-fit">View & Join</span>
          </div>
        ))
      )}
    </div>
  );
};

export default VirtualEvents;
