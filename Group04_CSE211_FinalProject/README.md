# CSE211 Web Development Final Project - EventsX

## Backend (PHP + MySQL)

EventsX includes a small JSON API built with PHP and MySQL (PDO). The front-end uses `fetch()` with credentials: `"include"` and PHP sessions to keep users logged in.

### Tech

- **PHP** (session-based auth)
- **MySQL** (via PDO)
- **JSON** responses for all API endpoints

---

## API Endpoints

### GET /api/events.php
Returns the events list from the events table: 
'''json
{ "ok": true, "events": [...] }
'''

### POST /api/auth/register.php

Creates a new user (validates required fields + minimum password length) and stores a hashed password (`password_hash`). Also starts a logged-in session.

### POST /api/auth/login.php

Logs in using either email or username + password, then stores a safe user object in `$_SESSION["user"]`.

### GET /api/auth/me.php

Returns the currently logged-in session user (or `{ "ok": false, "user": null }`).

### POST /api/auth/logout.php

Intended to clear the session (note: this file currently references a missing `db.php`, so it may need a small fix to work as-is).

### POST /api/registrations/register.php

Requires login. Registers the current user for an event (prevents duplicate registrations per user + event).

### GET /api/registrations/list.php

Requires login. Returns up to 20 most recent registrations for the current user.

---

## Database Tables

* **users**: `id`, `username`, `name`, `email`, `phone`, `role`, `password_hash`
* **events**: `id`, `name`, `category`, `date`, `location`, `cost`, `image`
* **registrations**: `id`, `user_id`, `event_key`, `event_name`, `created_at`

