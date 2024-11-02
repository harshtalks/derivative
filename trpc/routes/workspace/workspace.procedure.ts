import { members, workspaceMetadata, workspaces } from "@/database/schema";
import { insertWorkspaceSchema } from "@/database/schema.zod";
import { createTRPCRouter, twoFactorAuthenticatedProcedure } from "@/trpc/trpc";
import {
  getWorkspaceByIdInputSchema,
  inviteFlowWorkspaceSchema,
} from "./workspace.schema";
import { TRPCError } from "@trpc/server";
import Branded from "@/types/branded.type";
import {
  INVITE_COUNT,
  WEEKS_TO_EXPIRE,
  createInviteLink,
  verifyInviteLink,
} from "@/auth/invite";
import { TimeSpan } from "oslo";
import { eq } from "drizzle-orm";

const workspaceRouter = createTRPCRouter({
  create: twoFactorAuthenticatedProcedure
    .input(
      insertWorkspaceSchema.omit({
        createdBy: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // get database instance
      const {
        db,
        user: { id: userId },
      } = ctx;

      // creating a transaction
      const dbResult = await db.transaction(async (ctx) => {
        // insert the workspace
        const workspace = (
          await ctx
            .insert(workspaces)
            .values({ ...input, createdBy: userId })
            .returning()
        )[0];

        if (!workspace) {
          ctx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create workspace",
          });
        }

        // insert the user as a member
        const member = (
          await ctx
            .insert(members)
            .values({
              userId: userId,
              workspaceId: Branded.WorkspaceId(workspace.id),
              role: "admin",
              isCreator: true,
              permissions: ["member_controls", "read", "write"],
            })
            .returning()
        )[0];

        if (!member) {
          ctx.rollback();
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create workspace",
          });
        }

        // workspace metadata
        await ctx.insert(workspaceMetadata).values({
          inviteCount: 0,
          inviteLimit: INVITE_COUNT,
          workspaceId: workspace.id,
          inviteExpiry: WEEKS_TO_EXPIRE,
        });

        return { workspace, member };
      });

      return dbResult;
    }),
  // get all the workspaces of a user
  myWorkspaces: twoFactorAuthenticatedProcedure.query(async ({ ctx }) => {
    // here we will get all the factors that are mine (user)
    const {
      db,
      user: { id: userId },
    } = ctx;

    const membersDB = await db.query.members.findMany({
      columns: {
        workspaceId: true,
      },
      where: (members, { eq }) => eq(members.userId, userId),
    });

    if (membersDB.length === 0) {
      return [];
    }

    // get all the workspaces
    const workspacesDB = await db.query.workspaces.findMany({
      orderBy: (workspaces, { desc }) => desc(workspaces.createdAt),
    });

    return workspacesDB;
  }),
  // get the workspace by id
  workspace: twoFactorAuthenticatedProcedure
    .input(getWorkspaceByIdInputSchema)
    .query(async ({ ctx, input }) => {
      const { db, user } = ctx;
      const { workspaceId } = input;

      // get the workspace
      const dbResult = await db.transaction(async (ctx) => {
        const workspaceDB = await ctx.query.workspaces.findFirst({
          where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
          with: {
            metadata: true,
          },
        });

        if (!workspaceDB) {
          throw new TRPCError({
            message: "Workspace not found with given id " + workspaceId,
            code: "BAD_REQUEST",
          });
        }

        const members = await ctx.query.members.findMany({
          columns: {
            id: true,
          },
          where: (members, { eq }) => eq(members.workspaceId, workspaceId),
        });

        const creator = await ctx.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, workspaceDB.createdBy),
        });

        if (!creator) {
          throw new TRPCError({
            message: "Creator not found for workspace",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return { workspaceDB, creator, membersCount: members.length };
      });

      return dbResult;
    }),
  meta: twoFactorAuthenticatedProcedure
    .input(getWorkspaceByIdInputSchema)
    .query(async ({ ctx, input }) => {
      const { workspaceId } = input;
      const { db } = ctx;

      const response = await db.query.workspaceMetadata.findFirst({
        where: (metadata, { eq }) => eq(metadata.workspaceId, workspaceId),
      });

      if (!response) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Workspace metadata not found for given workspace.",
        });
      }

      const needToGenerateLink =
        response.inviteCount >= response.inviteLimit ||
        response.inviteExpiry < Date.now();

      if (needToGenerateLink) {
        const timespan = new TimeSpan(WEEKS_TO_EXPIRE, "w");

        const token = await createInviteLink(timespan, { workspaceId });
        await db
          .update(workspaceMetadata)
          .set({
            inviteCode: token,
            inviteExpiry: timespan.milliseconds(),
            inviteCount: 0,
          })
          .where(eq(workspaceMetadata.id, response.id));
      }

      return response;
    }),
  generateLink: twoFactorAuthenticatedProcedure
    .input(getWorkspaceByIdInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { workspaceId } = input;
      const { db } = ctx;

      const timespan = new TimeSpan(WEEKS_TO_EXPIRE, "w");

      const token = await createInviteLink(timespan, { workspaceId });

      const response = await db
        .update(workspaceMetadata)
        .set({
          inviteCode: token,
          inviteExpiry: timespan.milliseconds(),
        })
        .where(eq(workspaceMetadata.workspaceId, workspaceId))
        .returning();

      return response;
    }),
  inviteFlow: twoFactorAuthenticatedProcedure
    .input(inviteFlowWorkspaceSchema)
    .query(
      async ({ ctx, input: { inviteFlowStep, workspaceId, inviteCode } }) => {
        // sleep of (inviteflowstep + 1) * 2 seconds with promise
        // starts from 0 to 6
        //

        const { db, user } = ctx;

        switch (inviteFlowStep) {
          case 1: {
            const isWorkspaceThere = await db.query.workspaces.findFirst({
              where: (workspaces, { eq }) => eq(workspaces.id, workspaceId),
            });

            if (!isWorkspaceThere) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No such workspace has been found in our system.",
              });
            }

            return {
              success: true,
              nextStep: inviteFlowStep + 1,
              hasNext: inviteFlowStep < 6,
            };
          }
          case 2: {
            // check if the workspace has an associated metadata
            const metadata = await db.query.workspaceMetadata.findFirst({
              where: (workspaceMetadata, { eq }) =>
                eq(workspaceMetadata.workspaceId, workspaceId),
            });

            if (!metadata) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "We could not find any invite code attached to the workspaces",
              });
            }

            if (!inviteCode) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You can not proceed without having a token.",
              });
            }

            if (metadata.inviteCode !== inviteCode) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Sorry, the given token is not valid",
              });
            }

            // check it the quota exceeded for the invites.
            if (metadata.inviteCount >= metadata.inviteLimit) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Sorry, the invite quota has been finished for workspace",
              });
            }

            // check if the token is valid
            try {
              await verifyInviteLink(inviteCode);
            } catch {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "Sorry, the invite quota has been finished for workspace",
              });
            }

            await db
              .update(workspaceMetadata)
              .set({
                inviteCount: metadata.inviteCount + 1,
              })
              .where(eq(workspaceMetadata.workspaceId, workspaceId));

            return {
              success: true,
              nextStep: 3,
              hasNext: true,
            };
          }
          case 3: {
            const isAlreadyAMember = await db.query.members.findFirst({
              where: (members, { eq, and }) =>
                and(
                  eq(members.workspaceId, workspaceId),
                  eq(members.userId, user.id),
                ),
            });

            if (isAlreadyAMember) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message:
                  "You are already a member of the workspace. Please navigate to workspaces page to access this workspace.",
              });
            }

            return {
              success: true,
              nextStep: inviteFlowStep + 1,
              hasNext: inviteFlowStep < 6,
            };
          }
          case 4: {
            await db.insert(members).values({
              isCreator: false,
              permissions: ["read"],
              role: "dev",
              userId: user.id,
              workspaceId: workspaceId,
            });

            return {
              success: true,
              nextStep: inviteFlowStep + 1,
              hasNext: inviteFlowStep < 6,
            };
          }
          case 5: {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return {
              success: true,
              nextStep: inviteFlowStep + 1,
              hasNext: inviteFlowStep < 6,
            };
          }
          case 6: {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return {
              success: true,
              nextStep: inviteFlowStep + 1,
              hasNext: inviteFlowStep < 6,
            };
          }
          default: {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Invalid Step",
            });
          }
        }
      },
    ),
});

export default workspaceRouter;
