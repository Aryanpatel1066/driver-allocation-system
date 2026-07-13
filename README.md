# 🚖 Real-Time Driver Allocation System

A backend service that simulates the core driver allocation workflow of a ride-hailing platform (similar to Uber/Ola).

The system supports:

- Geo-based driver discovery using Redis GEO
- Real-time driver allocation
- Atomic ride assignment using Redis Lua Script
- Timeout & retry allocation
- Idempotent driver acceptance
- Ride lifecycle state management

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Redis
- Mongoose

---

## Features

### Driver Management

- Create Driver
- Update Driver Live Location
- Driver Availability Management

### Ride Management

- Request Ride
- Find Nearby Drivers
- Notify Multiple Drivers (Simulation)
- Driver Accept Ride
- Timeout & Retry
- Ride State Management

### Redis Features

- GEOADD
- GEOSEARCH
- Lua Script
- Redis Hash
- Redis Set

---

## Ride States

| State | Description |
|--------|-------------|
| SEARCHING | Searching nearby available drivers |
| ASSIGNED | Driver assigned successfully |
| TIMEOUT | No driver accepted within timeout |

---

# API Endpoints

## Create Driver

POST

```http
/api/drivers
```

Body

```json
{
  "name": "Driver One"
}
```

---

## Update Driver Location

PUT

```http
/api/drivers/:driverId/location
```

Body

```json
{
  "lat":23.0225,
  "lng":72.5714
}
```

---

## Request Ride

POST

```http
/api/rides/request
```

Body

```json
{
  "riderId":"RIDER_100",
  "lat":23.0225,
  "lng":72.5714
}
```

---

## Accept Ride

POST

```http
/api/rides/:rideId/accept
```

Body

```json
{
  "driverId":"driverObjectId"
}
```

---

# Concurrency Handling

To prevent multiple drivers from getting assigned to the same ride, the project uses a Redis Lua Script.

The Lua Script executes atomically inside Redis.

It guarantees:

- Only one driver can assign a ride.
- Duplicate acceptance is idempotent.
- Late acceptance after timeout is rejected.

---

# Driver Allocation Flow

1. Rider requests a ride.
2. Ride state changes to **SEARCHING**.
3. Driver locations are searched using Redis GEO.
4. Nearby available drivers are selected.
5. Top nearby drivers are notified.
6. Multiple drivers may attempt to accept simultaneously.
7. Redis Lua Script ensures only one driver wins.
8. Ride becomes **ASSIGNED**.
9. If nobody accepts within timeout, allocation retries with remaining drivers.
10. If no drivers remain, ride becomes **TIMEOUT**.

---

# Project Structure

```
src
│
├── config
│
├── controllers
│
├── models
│
├── routes
│
├── services
│
└── server.js
```

---

# Installation

Clone repository

```bash
git clone <repository-url>
```

Install packages

```bash
npm install
```

Create .env

```env
PORT=1066

MONGO_URI=mongodb://127.0.0.1:27017/driver_allocation

REDIS_HOST=127.0.0.1

REDIS_PORT=6379
```

Run server

```bash
npm run dev
```

---

# Architecture

```
                Rider
                  │
                  │
        POST /rides/request
                  │
                  ▼
          Create Ride (MongoDB)
                  │
                  ▼
      Store Ride Status (Redis Hash)
                  │
                  ▼
        Redis GEO Search Drivers
                  │
                  ▼
      Filter Available Drivers
                  │
                  ▼
        Notify Top Drivers
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
   Driver A    Driver B    Driver C
      │           │           │
      └───────────┼───────────┘
                  ▼
       Redis Lua Script (Atomic)
                  │
        Only One Driver Wins
                  │
                  ▼
     Update Ride & Driver (MongoDB)
                  │
                  ▼
          Ride State = ASSIGNED
```

---

# Screenshots

Add screenshots here.

Example

```
screenshots/

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/5da6c4fe-b787-4663-9310-3aaab523dffc" />

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/573bf92f-8ca0-49e6-99a5-a1aa8e728d94" />

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/d258e6a1-a20a-41fd-92d7-d1b5b3134be7" />

<img width="1470" height="956" alt="Image" src="https://github.com/user-attachments/assets/49e025e2-47bd-4965-b2f6-1fe2be127728" />
```

---

# Future Improvements

- WebSocket Driver Notification
- BullMQ for Retry Scheduling
- Driver Online/Offline Status
- Authentication
- Ride Cancellation
- Production Logging

---

# Author

Aryan Patel

Backend Developer
