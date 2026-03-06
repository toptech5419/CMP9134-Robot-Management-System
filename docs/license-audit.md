# Open-Source License Audit

This audit evaluates the legal constraints of third-party dependencies used in the Robot Management System, in accordance with LEPSI (Legal, Ethical, Professional, Social, Interoperability) design principles covered in CMP9134.

## Dependency Licences

| Component | Purpose in System | Licence Type | Permissive / Copyleft |
|---|---|---|---|
| **React** | View layer — renders the dashboard UI (grid map, telemetry, alerts) | MIT | Permissive |
| **Express.js** | Controller layer — HTTP routing, middleware pipeline, API gateway | MIT | Permissive |
| **Vite** | Frontend build tool and dev server for the React application | MIT | Permissive |
| **better-sqlite3** | Model layer — synchronous SQLite driver for user accounts and mission logs | MIT | Permissive |
| **jsonwebtoken** | Authentication — JWT token generation and verification for RBAC | MIT | Permissive |
| **Axios** | HTTP client used by RobotClient to communicate with the Virtual Robot API | MIT | Permissive |

## Conclusion

All six dependencies are released under the **MIT licence**, which is permissive: it allows unrestricted use, modification, and distribution provided the original copyright notice is retained. No copyleft obligations propagate to our codebase, meaning the Ground Control Station can be distributed under any licence without legal conflict. The only requirement is to include each dependency's MIT licence text in any distributed copies, which is handled automatically by `node_modules` and standard bundler configurations.
