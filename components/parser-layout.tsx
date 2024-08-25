// This is a layer for parsing out the params from the URL

import { ZodSchema } from "zod";
import { RouteConfig } from "tempeh";
import React from "react";

const ParserLayout = <
  TParams extends ZodSchema,
  TSearchParams extends ZodSchema,
>({
  routeInfo,
  params,
  searchParams,
  children,
}: {
  routeInfo: RouteConfig<TParams, TSearchParams>;
  params: unknown;
  searchParams: unknown;
  children: (props: {
    params: TParams["_output"];
    searchParams: TSearchParams["_output"];
  }) => React.JSX.Element | Promise<React.JSX.Element>;
}) => {
  const parsedParams = routeInfo.parseParams(params);
  const parsedSearchParams = routeInfo.parseSearchParams(searchParams);

  return children({
    params: parsedParams,
    searchParams: parsedSearchParams,
  });
};

export default ParserLayout;
