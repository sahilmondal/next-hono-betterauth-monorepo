import { z } from "zod";
import { ValidationError } from "@/utils/errors";

export async function validateBody<T extends z.ZodSchema>(
  schema: T,
  data: unknown,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce(
        (acc, err) => {
          const path = err.path.join(".");
          acc[path] = err.message;
          return acc;
        },
        {} as Record<string, string>,
      );
      throw new ValidationError("Validation failed", fieldErrors);
    }
    throw error;
  }
}

export async function validateParams<T extends z.ZodSchema>(
  schema: T,
  data: unknown,
): Promise<z.infer<T>> {
  return validateBody(schema, data);
}

export async function validateQuery<T extends z.ZodSchema>(
  schema: T,
  data: unknown,
): Promise<z.infer<T>> {
  return validateBody(schema, data);
}

export function createValidator<T extends z.ZodSchema>(schema: T) {
  return {
    body: (data: unknown) => validateBody(schema, data),
    params: (data: unknown) => validateParams(schema, data),
    query: (data: unknown) => validateQuery(schema, data),
  };
}
