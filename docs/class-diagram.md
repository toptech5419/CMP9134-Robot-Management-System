# Class Diagram — Robot Management System

This diagram models the **structural perspective**: the Object-Oriented architecture of the backend, showing classes, attributes, operations, and their relationships.

## Diagram

```mermaid
classDiagram
    class User {
        -int id
        -String username
        -String email
        -String passwordHash
        -Role role
        -DateTime createdAt
        +register(username, email, password) bool
        +login(email, password) String
        +getRole() Role
        +verifyToken(token) bool
    }

    class Role {
        <<enumeration>>
        VIEWER
        COMMANDER
        AUDITOR
    }

    class RobotController {
        -String apiEndpoint
        -int maxRetries
        -int retryDelayMs
        +getStatus() RobotStatus
        +moveRobot(int x, int y) MoveResponse
        +getMap() MapData
        +getSensorData() SensorData
        +resetSimulation() bool
        +emergencyStop() bool
        -handleConnectionError() void
    }

    class RobotStatus {
        -String id
        -Position position
        -float battery
        -OperationalState status
    }

    class Position {
        -int x
        -int y
    }

    class OperationalState {
        <<enumeration>>
        IDLE
        MOVING
        LOW_BATTERY
        STUCK
    }

    class MapData {
        -int width
        -int height
        -int[][] grid
        +isObstacle(int x, int y) bool
        +isFreeSpace(int x, int y) bool
    }

    class MissionLog {
        -int id
        -DateTime timestamp
        -String username
        -String commandType
        -String commandDetails
        -String responseStatus
        +createEntry(user, command, details, status) void
        +getLogsByUser(username) MissionLog[]
        +getLogsByDateRange(start, end) MissionLog[]
        +deleteUserData(username) bool
    }

    class AuthService {
        -String jwtSecret
        -int tokenExpiryMs
        +generateToken(user) String
        +validateToken(token) User
        +hashPassword(password) String
        +verifyPassword(password, hash) bool
    }

    class Dashboard {
        -RobotController robotController
        -WebSocket telemetrySocket
        -String connectionState
        +renderGrid(MapData, RobotStatus) void
        +displayTelemetry(RobotStatus) void
        +showAlert(String message, String severity) void
        +updateConnectionIndicator(String state) void
    }

    %% Relationships

    User --> Role : has

    RobotStatus --> Position : contains
    RobotStatus --> OperationalState : has

    User "1" --> "0..*" MissionLog : generates
    RobotController "1" *-- "0..*" MissionLog : logs to (Composition)

    AuthService "1" --> "0..*" User : authenticates
    Dashboard "1" --> "1" RobotController : uses
    RobotController "1" --> "1" RobotStatus : retrieves
    RobotController "1" --> "1" MapData : fetches
    Dashboard "1" --> "0..*" MissionLog : displays
```

## Class Responsibilities

| Class | Responsibility |
|---|---|
| **User** | Manages user registration, login, and role assignment |
| **Role** | Enum defining VIEWER, COMMANDER, AUDITOR permissions |
| **AuthService** | Handles JWT token generation, validation, and password hashing (Bcrypt) |
| **RobotController** | Single point of contact with the Virtual Robot API — encapsulates all HTTP calls and retry logic |
| **RobotStatus** | Data model representing the robot's current state from GET /api/status |
| **Position** | Value object for x, y coordinates on the 21x21 grid |
| **OperationalState** | Enum for robot states: IDLE, MOVING, LOW_BATTERY, STUCK |
| **MapData** | Represents the 21x21 grid with obstacle detection methods |
| **MissionLog** | Audit trail entity — logs every command with timestamp, user, type, and response. Supports GDPR deletion. |
| **Dashboard** | Frontend controller — renders the grid, telemetry, alerts, and connection state |

## Design Decisions
- **Composition** between RobotController and MissionLog — logs cannot exist without the controller context. Every API interaction is logged.
- **MissionLog.deleteUserData()** — satisfies GDPR "Right to Erasure" requirement.
- **AuthService** is separated from User — Single Responsibility Principle. Authentication logic is not mixed with user data.
- **RobotController** encapsulates retry logic internally (handleConnectionError) — keeps error handling out of the Dashboard layer.
