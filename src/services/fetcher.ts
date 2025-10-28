import type { RequestMethod } from "../types/types";

async function checkForError(response: Response) {
  // handle Error according to status code here
  if (response.status >= 400 && response.status <= 511) {
    if (response.status === 401 && localStorage.getItem("accessToken")) {
      if (response.statusText === "Unauthorized") {
        /* try {
          const response = await apiCalls.refreshToken();
          console.log(response);
          if (response.message === "Token generated successfully.") {
            localStorage.setItem(
              "accessToken",
              JSON.stringify(response.data.accessToken)
            );
            window.location.pathname = "/board"
          }
        } catch (err) {
          console.error(err);
        } */
      }
      return;
    }

    const contentType = response.headers.get("Content-Type");
    if (!contentType?.includes("application/json")) {
      return response;
    }
    return response;
  }
}

export const doFetch = async (
  url: string,
  method: RequestMethod,
  data?: any
) => {
  // const rewrittenUrl = `http://localhost:5000${url}`;

  const headers: { [key: string]: string } = {};
  const params: RequestInit = { headers };

  const accessToken = JSON.parse(localStorage.getItem("accessToken")!);

  if (accessToken) {
    headers["Authorization"] = accessToken;
  }

  if (url.includes("/api/refresh")) {
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken")!);
    if (refreshToken !== "") {
      headers["Authorization"] = refreshToken;
    }
  }

  if (method.toUpperCase() === "GET") {
    params.method = method;
    headers["Content-Type"] = "application/json";
  }

  if (method.toUpperCase() !== "GET") {
    params.method = method;
    if (data) {
      headers["Content-Type"] = "application/json";
      params.body = JSON.stringify(data);
    }
  }

  // console.log(params);

  // const response = await fetch(rewrittenUrl, params);
  const response = await fetch(url, params);
  checkForError(response);
  const contentType = response.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    return response.json();
  } else {
    return response;
  }
};
