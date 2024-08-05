// branded types

import { Brand } from "effect";

/**
 * Branded types are TypeScript types with an added
 * type tag that helps prevent accidental usage of
 * a value in the wrong context. They allow us to create
 * distinct types based on an existing underlying type,
 * enabling type safety and better code organization.
 */

namespace Branded {
  export type UserId = string & Brand.Brand<"UserId">;
  export const UserId = Brand.nominal<UserId>();

  export type WorkspaceId = string & Brand.Brand<"WorkspaceId">;
  export const WorkspaceId = Brand.nominal<WorkspaceId>();

  export type TemplateId = string & Brand.Brand<"TemplateId">;
  export const TemplateId = Brand.nominal<TemplateId>();

  export type InvoiceId = string & Brand.Brand<"InvoiceId">;
  export const InvoiceId = Brand.nominal<InvoiceId>();

  export type MemberId = string & Brand.Brand<"MemberId">;
  export const MemberId = Brand.nominal<MemberId>();

  export type SessionId = string & Brand.Brand<"SessionId">;
  export const SessionId = Brand.nominal<SessionId>();
}

export default Branded;
