import fs from "fs";

export function readUsers(): any[] {
  try {
    const data = fs.readFileSync("src/data/users.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users.json:", err);
    return [];
  }
}

export function readJobs(): any[] {
  try {
    const data = fs.readFileSync("src/data/jobs.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading jobs.json:", err);
    return [];
  }
}

export function writeJobs(jobs: any[]): void {
  try {
    fs.writeFileSync(
      "src/data/jobs.json",
      JSON.stringify(jobs, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.error("Error writing to jobs.json:", err);
  }
}

export function writeUsers(users: any[]): void {
  try {
    fs.writeFileSync(
      "src/data/users.json",
      JSON.stringify(users, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.error("Error writing to users.json:", err);
  }
}

export function readTokens(): any[] {
  try {
    const data = fs.readFileSync("src/data/refreshTokens.json", "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading refreshTokens.json:", err);
    return [];
  }
}

export function writeTokens(tokens: any[]): void {
  try {
    fs.writeFileSync(
      "src/data/refreshTokens.json",
      JSON.stringify(tokens, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.error("Error writing to refreshTokens.json:", err);
  }
}
