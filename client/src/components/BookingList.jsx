"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Building, Plane } from "lucide-react"

export function BookingsList() {
  const [activeTab, setActiveTab] = useState("upcoming")

  // Mock data for bookings
  const upcomingBookings = [
    {
      id: "HTL-12345678",
      type: "hotel",
      name: "Grand Plaza Hotel",
      location: "New York, USA",
      image: "/placeholder.svg?height=200&width=300",
      checkIn: "Jun 15, 2023",
      checkOut: "Jun 20, 2023",
      guests: "2 Adults",
      room: "Deluxe King",
      price: 1245,
      status: "Confirmed",
    },
    {
      id: "FLT-87654321",
      type: "flight",
      name: "New York to Los Angeles",
      airline: "Delta Airlines",
      image: "/placeholder.svg?height=200&width=300",
      departure: "Jun 25, 2023 • 08:30 AM",
      arrival: "Jun 25, 2023 • 11:45 AM",
      passengers: "1 Adult",
      class: "Economy",
      price: 349,
      status: "Confirmed",
    },
    {
      id: "HTL-23456789",
      type: "hotel",
      name: "Mountain View Lodge",
      location: "Denver, USA",
      image: "/placeholder.svg?height=200&width=300",
      checkIn: "Jul 10, 2023",
      checkOut: "Jul 15, 2023",
      guests: "2 Adults, 1 Child",
      room: "Family Suite",
      price: 1680,
      status: "Pending",
    },
  ]

  const pastBookings = [
    {
      id: "HTL-98765432",
      type: "hotel",
      name: "Oceanview Resort & Spa",
      location: "Miami, USA",
      image: "/placeholder.svg?height=200&width=300",
      checkIn: "Mar 10, 2023",
      checkOut: "Mar 15, 2023",
      guests: "2 Adults",
      room: "Ocean View Suite",
      price: 1795,
      status: "Completed",
    },
    {
      id: "FLT-12345678",
      type: "flight",
      name: "New York to Miami",
      airline: "American Airlines",
      image: "/placeholder.svg?height=200&width=300",
      departure: "Mar 10, 2023 • 10:15 AM",
      arrival: "Mar 10, 2023 • 01:30 PM",
      passengers: "2 Adults",
      class: "Economy",
      price: 598,
      status: "Completed",
    },
    {
      id: "FLT-23456789",
      type: "flight",
      name: "Miami to New York",
      airline: "American Airlines",
      image: "/placeholder.svg?height=200&width=300",
      departure: "Mar 15, 2023 • 03:45 PM",
      arrival: "Mar 15, 2023 • 07:00 PM",
      passengers: "2 Adults",
      class: "Economy",
      price: 612,
      status: "Completed",
    },
  ]

  const cancelledBookings = [
    {
      id: "HTL-34567890",
      type: "hotel",
      name: "City Lights Boutique Hotel",
      location: "Chicago, USA",
      image: "/placeholder.svg?height=200&width=300",
      checkIn: "Apr 05, 2023",
      checkOut: "Apr 10, 2023",
      guests: "1 Adult",
      room: "Standard Queen",
      price: 875,
      status: "Cancelled",
      refundStatus: "Refunded",
    },
    {
      id: "FLT-45678901",
      type: "flight",
      name: "New York to Chicago",
      airline: "United Airlines",
      image: "/placeholder.svg?height=200&width=300",
      departure: "Apr 05, 2023 • 09:30 AM",
      arrival: "Apr 05, 2023 • 11:15 AM",
      passengers: "1 Adult",
      class: "Economy",
      price: 289,
      status: "Cancelled",
      refundStatus: "Refunded",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground">View and manage your upcoming and past bookings</p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No upcoming bookings</h3>
              <p className="text-muted-foreground mt-1">
                You don't have any upcoming trips. Start planning your next adventure!
              </p>
              <Button className="mt-4" asChild>
                <Link href="/">Explore destinations</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => <BookingCard key={booking.id} booking={booking} isPast />)
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No past bookings</h3>
              <p className="text-muted-foreground mt-1">You don't have any past trips with us yet.</p>
              <Button className="mt-4" asChild>
                <Link href="/">Book your first trip</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map((booking) => <BookingCard key={booking.id} booking={booking} isCancelled />)
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No cancelled bookings</h3>
              <p className="text-muted-foreground mt-1">You don't have any cancelled bookings.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking, isPast = false, isCancelled = false }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 relative h-40 md:h-auto rounded-md overflow-hidden">
            <Image
              src={booking.image || "/placeholder.svg"}
              alt={booking.name}
              fill
              className="object-cover"
            />
            <Badge className="absolute top-2 left-2">
              {booking.type === "hotel" ? "Hotel" : "Flight"}
            </Badge>
            {isCancelled && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-base py-1 px-3">
                  Cancelled
                </Badge>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{booking.name}</h3>
                {booking.type === "hotel" ? (
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {booking.location}
                  </p>
                ) : (
                  <p className="text-muted-foreground">{booking.airline}</p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                  {booking.type === "hotel" ? (
                    <>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Check-in
                        </p>
                        <p className="text-sm">{booking.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Check-out
                        </p>
                        <p className="text-sm">{booking.checkOut}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Guests
                        </p>
                        <p className="text-sm">{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          Room
                        </p>
                        <p className="text-sm">{booking.room}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-medium flex items-center gap-1">
