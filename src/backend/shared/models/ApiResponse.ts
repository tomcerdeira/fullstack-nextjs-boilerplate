import { StatusCodes } from "http-status-codes";

export interface ApiResponseOptions {
  data?: unknown;
  headers?: Record<string, string>;
  status?: number;
}

export class ApiResponse {
  private readonly data?: unknown;
  private readonly headers: Record<string, string>;
  private readonly status: number;

  constructor(options: ApiResponseOptions = {}) {
    this.data = options.data;
    this.headers = options.headers || {};
    this.status = options.status || StatusCodes.OK;
  }

  public toResponse(requestId?: string): Response {
    if(this.status === StatusCodes.NO_CONTENT) {
      return new Response(null, {
        status: this.status,
        headers: {
          ...this.headers,
          ...(requestId && { 'X-Req-Id': requestId })
        }
      });
    }
    const responseBody = typeof this.data === 'object' && this.data !== null
      ? { ...this.data }
      : {
          ...(this.data !== undefined && { data: this.data })
        };

    return new Response(JSON.stringify(responseBody), {
      status: this.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
        ...(requestId && { 'X-Req-Id': requestId }),
        ...this.headers
      }
    });
  }
}