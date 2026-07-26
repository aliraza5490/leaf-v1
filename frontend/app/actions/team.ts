"use server";

import { getTeam } from "@/lib/api/conversations";
import type { ActionResponse } from "@/app/actions/auth";
import type { TeamResponse } from "@/types";

export async function getTeamAction(): Promise<ActionResponse<TeamResponse>> {
  try {
    const res = await getTeam();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch team" };
  }
}
