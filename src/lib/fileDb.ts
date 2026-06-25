import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function readUsers(): any[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "users.json"), "utf-8"));
  } catch {
    return [];
  }
}

export function writeUsers(users: any[]): void {
  fs.writeFileSync(path.join(DATA_DIR, "users.json"), JSON.stringify(users, null, 2), "utf-8");
}

export function readJobs(): any[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "jobs.json"), "utf-8"));
  } catch {
    return [];
  }
}

export function writeJobs(jobs: any[]): void {
  fs.writeFileSync(path.join(DATA_DIR, "jobs.json"), JSON.stringify(jobs, null, 2), "utf-8");
}

export function readTokens(): string[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "refreshTokens.json"), "utf-8"));
  } catch {
    return [];
  }
}

export function writeTokens(tokens: string[]): void {
  fs.writeFileSync(path.join(DATA_DIR, "refreshTokens.json"), JSON.stringify(tokens, null, 2), "utf-8");
}
