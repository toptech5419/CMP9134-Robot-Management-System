# Sequence Diagram — Move Robot Command

This diagram models the **interaction perspective**: tracing a "Move" command chronologically from the Commander through every system component, including token verification, API communication, database logging, and error handling.

## Diagram

```mermaid
sequenceDiagram
    actor C as Commander
    participant UI as Web Dashboard
    participant API as Backend API
    participant Auth as AuthService
    participant Sim as Virtual Robot (Docker)
    participant DB as Database

    C->>UI: Enter X=5, Y=10 and click "Move"
    UI->>UI: Validate input (integers, 0-20 range)

    alt Input invalid
        UI-->>C: Display error "Invalid coordinates"
    else Input valid
        UI->>API: POST /api/command {x: 5, y: 10, token: JWT}
        activate API

        API->>Auth: validateToken(JWT)
        Auth-->>API: User {role: COMMANDER}

        alt Token invalid
            API-->>UI: 401 Unauthorized
            UI-->>C: Display "Session expired, please log in"
        else Token valid, Role is VIEWER
            API-->>UI: 403 Forbidden
            UI-->>C: Display "Insufficient permissions"
            API->>DB: INSERT log (user, MOVE, REJECTED_ROLE, timestamp)
        else Token valid, Role is COMMANDER
            API->>Sim: POST /api/move {x: 5, y: 10}
            Sim-->>API: Response

            alt Robot API responds 200 OK
                API->>DB: INSERT log (user, MOVE, SUCCESS, timestamp)
                DB-->>API: Log saved
                API-->>UI: 200 OK {message: "Navigating to (5, 10)"}
                UI-->>C: Update grid, show robot moving to (5, 10)
            else Robot API unreachable
                API->>API: Retry with backoff (max 3 attempts)
                alt Retry succeeds
                    API->>Sim: POST /api/move {x: 5, y: 10}
                    Sim-->>API: 200 OK
                    API->>DB: INSERT log (user, MOVE, SUCCESS_AFTER_RETRY, timestamp)
                    API-->>UI: 200 OK
                    UI-->>C: Update grid, show robot moving
                else Max retries exceeded
                    API->>DB: INSERT log (user, MOVE, CONNECTION_FAILED, timestamp)
                    API-->>UI: 503 Service Unavailable
                    UI-->>C: Display "Signal Lost — Reconnecting..."
                end
            end
        end

        deactivate API
    end
```

## Interaction Flow

1. **Commander** enters coordinates and clicks "Move" on the dashboard.
2. **Web Dashboard** validates input client-side (integers, within 0-20 range). Rejects immediately if invalid.
3. **Backend API** receives the request with a JWT token.
4. **AuthService** validates the token. Rejects if expired or invalid.
5. **RBAC check** — verifies the user has COMMANDER role. Viewers are rejected with 403.
6. **Virtual Robot API** receives the POST /api/move command.
7. **Success path** — Robot responds 200 OK → log to DB → update dashboard.
8. **Failure path** — Robot unreachable → retry with backoff → if max retries exceeded → log failure → display "Signal Lost".

## Notes
- **Every path logs to the Database** — success, rejection, and failure are all audited.
- **Client-side AND server-side validation** — defence in depth.
- **Alt blocks** model conditional branching as per UML sequence diagram standards.
- This diagram directly maps to the Activity Diagram flow, providing the interaction-level detail.
