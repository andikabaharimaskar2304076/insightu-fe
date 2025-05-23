'use client';

import { CalendarIcon, ClockIcon, MessageSquareIcon, PlusCircleIcon, Undo2Icon, UserIcon } from 'lucide-react';
import Image from 'next/image';

export default function PsychologistDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard Psikolog</h2>
          <p className="text-gray-600">Halo, Sandy</p>
        </div>
        
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* New Session Requests */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">New Session Requests</h3>
          <div className="space-y-3">
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Alex Thompson</p>
                  <p className="text-sm text-gray-600">Requested: Today, 2:30 PM</p>
                  <p className="text-sm text-gray-600">Need to discuss academic stress and time management</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-800">✓</button>
                  <button className="text-red-600 hover:text-red-800">✕</button>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Maria Garcia</p>
                  <p className="text-sm text-gray-600">Requested: Today, 1:15 PM</p>
                  <p className="text-sm text-gray-600">Would like career guidance counseling</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-green-600 hover:text-green-800">✓</button>
                  <button className="text-red-600 hover:text-red-800">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200">
              <PlusCircleIcon size={16} /> Add Availability
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200">
              <Undo2Icon size={16} /> Session History
            </button>
            <button className="flex items-center gap-2 p-3 bg-gray-100 rounded hover:bg-gray-200">
              <MessageSquareIcon size={16} /> Send Message
            </button>
          </div>
        </div>
      </div>

      {/* Today's Sessions */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Today's Sessions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">9:00 AM</p>
            <p className="text-sm text-gray-600">John Smith</p>
            <p className="text-xs text-gray-500">Career Guidance</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">10:00 AM</p>
            <p className="text-sm text-gray-600">Available</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">11:00 AM</p>
            <p className="text-sm text-gray-600">Emma Wilson</p>
            <p className="text-xs text-gray-500">Academic Support</p>
          </div>
          <div className="bg-gray-100 p-3 rounded-md text-center">
            <p className="font-medium">12:00 PM</p>
            <p className="text-sm text-gray-600">Lunch Break</p>
          </div>
        </div>
      </div>
    </div>
  );
}
