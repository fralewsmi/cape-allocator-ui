import { createServerFn } from "@tanstack/react-start";

import {
  allocationRequestSchema,
  allocationResponseSchema,
  capeVariantsResponseSchema,
  errorResponseSchema,
  healthResponseSchema,
  marketInputsResponseSchema,
  sensitivityDataPointSchema,
  sensitivityRequestSchema,
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

export const getMarketInputs = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch(`${API_BASE_URL}/api/market-inputs?cape_variant=component_10y`);
  const data = await readJsonResponse(response);

  return marketInputsResponseSchema.parse(data);
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

export const getSensitivity = createServerFn({ method: "GET" })
  .inputValidator(sensitivityRequestSchema)
  .handler(async ({ data }) => {
    const params = new URLSearchParams({
      gamma_min: String(data.gamma_min),
      gamma_max: String(data.gamma_max),
      cape_min: String(data.cape_min),
      cape_max: String(data.cape_max),
      cape_step: String(data.cape_step),
      tips_yield: String(data.tips_yield),
      sigma: String(data.sigma),
    });

    const response = await fetch(`${API_BASE_URL}/api/sensitivity?${params}`);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      const parsedError = errorResponseSchema.safeParse(data);
      const message = parsedError.success
        ? parsedError.data.detail
        : `Sensitivity API request failed with ${response.status}`;
      throw new Error(message);
    }

    const text = await response.text();
    return text
      .split("\n")
      .filter(Boolean)
      .map((line) => sensitivityDataPointSchema.parse(JSON.parse(line)));
  });
