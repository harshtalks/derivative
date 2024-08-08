import { UseQueryResult } from "@tanstack/react-query";
import { ReactElement } from "react";

/**
 * @name QueryWrapper
 * @description higher order wrapper for components that are consuming useQueries.
 * @returns JSX.Element
 */

const QueryWrapper = <Udata, Tdata extends UseQueryResult<Udata>>({
  query,
  children,
  fallbackLoader,
  fallbackError,
}: {
  query: Tdata;
  children: (
    _props: Extract<Tdata, { isSuccess: true }>["data"],
  ) => ReactElement;
  fallbackLoader?: ReactElement;
  fallbackError?: (
    _props: Extract<Tdata, { isError: true }>["error"],
  ) => ReactElement;
}) => {
  // return loading
  if (query.isLoading) {
    return fallbackLoader || <p>loading...</p>;
  }

  // return error
  if (query.status !== "success") {
    if (query.status === "error") {
      return (
        fallbackError?.(query.error) || (
          <p>
            {query.error instanceof Error
              ? query.error.message
              : "Error Occured"}
          </p>
        )
      );
    } else {
      return (
        fallbackError?.(new Error("Something went wrong")) || (
          <p>Error Occured</p>
        )
      );
    }
  }

  // return child
  return children(query.data);
};

export default QueryWrapper;
