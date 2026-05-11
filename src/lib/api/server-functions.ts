import { createServerFn } from "@tanstack/react-start";

import {
  allocationRequestSchema,
  allocationResponseSchema,
  capeVariantsResponseSchema,
  errorResponseSchema,
  healthResponseSchema,
} from "./schemas";

const API_BASE_URL = process.env.CAPE_API_BASE_URL ?? "http://localhost:8000";

async function readJsonResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const parsedError = errorResponseSchema.safeParse(data);
    const message = parsedError.success
      ? parsedError.data.detail
      : `Allocator API request failed with ${response.status}`;

    throw new Error(message);
  }

  return data;
}

export const getHealth = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  const data = await readJsonResponse(response);

  return healthResponseSchema.parse(data);
});

export const getCapeVariants = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(`${API_BASE_URL}/api/cape-variants`);
  const data = await readJsonResponse(response);

  return capeVariantsResponseSchema.parse(data);
});

export const computeAllocation = createServerFn({ method: "POST" })
  .inputValidator(allocationRequestSchema)
  .handler(async ({ data }) => {
    const response = await fetch(`${API_BASE_URL}/api/allocation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const responseData = await readJsonResponse(response);

    return allocationResponseSchema.parse(responseData);
  });
