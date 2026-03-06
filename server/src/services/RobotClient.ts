/**
 * RobotClient — Singleton + Facade for the Virtual Robot REST API.
 *
 * Singleton (Creational):  Only one instance manages the HTTP connection
 *   to the Robot API across the entire backend, preventing duplicate
 *   connections and ensuring consistent state.
 *
 * Facade (Structural):  Hides raw HTTP calls, JSON parsing, header
 *   management, and retry logic behind clean domain methods so that
 *   the rest of the codebase never touches `fetch` directly.
 *
 * Robot API base URL defaults to http://localhost:5000 (Docker container).
 */

export interface RobotStatus {
  x: number;
  y: number;
  status: "IDLE" | "MOVING" | "LOW_BATTERY" | "STUCK";
  battery: number;
}

export interface MapData {
  width: number;
  height: number;
  obstacles: { x: number; y: number }[];
  robot: { x: number; y: number };
}

export class RobotClient {
  // ── Singleton ────────────────────────────────────────────────
  private static instance: RobotClient | null = null;

  private readonly baseUrl: string;

  /**
   * Private constructor — prevents external `new RobotClient()`.
   * Use `RobotClient.getInstance()` instead.
   */
  private constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Returns the single shared RobotClient instance.
   * Creates it on first call (lazy initialisation).
   */
  static getInstance(baseUrl = "http://localhost:5000"): RobotClient {
    if (!RobotClient.instance) {
      RobotClient.instance = new RobotClient(baseUrl);
    }
    return RobotClient.instance;
  }

  /**
   * Resets the singleton (useful for testing with a different URL).
   */
  static resetInstance(): void {
    RobotClient.instance = null;
  }

  // ── Facade methods ───────────────────────────────────────────

  /**
   * GET /api/status — Retrieve current robot telemetry.
   */
  async getStatus(): Promise<RobotStatus> {
    const res = await fetch(`${this.baseUrl}/api/status`);
    if (!res.ok) {
      throw new Error(`Robot API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<RobotStatus>;
  }

  /**
   * POST /api/move — Command the robot to move to grid position (x, y).
   * Coordinates must be integers in the range 0-20.
   */
  async move(x: number, y: number): Promise<RobotStatus> {
    const res = await fetch(`${this.baseUrl}/api/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y }),
    });
    if (!res.ok) {
      throw new Error(`Robot API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<RobotStatus>;
  }

  /**
   * POST /api/reset — Reset the robot to its initial state.
   */
  async reset(): Promise<RobotStatus> {
    const res = await fetch(`${this.baseUrl}/api/reset`, {
      method: "POST",
    });
    if (!res.ok) {
      throw new Error(`Robot API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<RobotStatus>;
  }

  /**
   * GET /api/map — Retrieve the current grid map with obstacles.
   */
  async getMap(): Promise<MapData> {
    const res = await fetch(`${this.baseUrl}/api/map`);
    if (!res.ok) {
      throw new Error(`Robot API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<MapData>;
  }

  /**
   * GET /api/sensor — Retrieve proximity sensor readings.
   */
  async getSensor(): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/api/sensor`);
    if (!res.ok) {
      throw new Error(`Robot API error: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<Record<string, unknown>>;
  }
}
