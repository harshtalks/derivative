"use client";
import { BeamLoader } from "@/app/_components/beam-loader";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
} from "@/app/_components/timeline";
import { cn } from "@/lib/utils";
import clientApiTrpc from "@/trpc/client";
import { useEffect, useState } from "react";
import WorkspaceInvitationRoute from "../route.info";
import Branded from "@/types/branded.type";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { create } from "zustand";

interface StepState {
  step: number;
  increase: () => void;
}

const useStepStore = create<StepState>()((set) => ({
  step: 1,
  increase: () => set((state) => ({ step: state.step + 1 })),
}));

const steps = [
  {
    currentLabel: "Starting with the invite flow!",
    successLabel: "Invite flow has been started!",
    errorLabel: "Invite flow failed to start!",
    step: 1,
  },
  {
    currentLabel: "Validating the invite code!",
    successLabel: "Invite code validated!",
    errorLabel: "Invalid invite code!",
    step: 2,
  },
  {
    currentLabel: "Checking if you are already a member!",
    successLabel: "Congrats, We got you as a new Member!!",
    errorLabel: "Woops,You are already a member!",
    step: 3,
  },
  {
    currentLabel: "Assigning you a new membership!",
    successLabel: "Membership assigned!",
    errorLabel: "Membership assignment failed!",
    step: 4,
  },
  {
    currentLabel: "We need to remember this moment!",
    successLabel: "Event logged!!",
    errorLabel: "Event logging failed!",
    step: 5,
  },
  {
    currentLabel: "Redirecting you to the workspace dashboard!",
    successLabel: "Redirected!",
    errorLabel: "Redirect failed!",
    step: 6,
  },
];

const InviteFlow = () => {
  const { increase, step: currentStep } = useStepStore();
  const { workspaceId } = WorkspaceInvitationRoute.useParams();

  const query = clientApiTrpc.workspace.inviteFlow.useQuery(
    {
      inviteFlowStep: currentStep,
      workspaceId: Branded.WorkspaceId(workspaceId),
    },
    { retry: 0 },
  );

  useEffect(() => {
    if (query.isError) {
      toast.error("Something went wrong: " + query.error.message);
    }
  }, [query.error]);

  useEffect(() => {
    if (query.isSuccess && query.data.hasNext && currentStep < steps.length) {
      increase();
    }
  }, [query.data]);

  return (
    <div className="my-8 p-10 items-start max-w-[500px] flex flex-col mx-auto gap-4">
      <BeamLoader />
      <Timeline className="max-w-xl flex gap-4 flex-col py-6">
        {steps.map((step) => (
          <TimelineItem
            key={step.step}
            className={cn(
              currentStep < step.step ? "opacity-40" : "opacity-100",
              currentStep === step.step && query.isLoading
                ? "animate-pulse"
                : "",
            )}
          >
            <TimelineHeading
              className={cn(
                "text-muted-foreground text-sm",
                currentStep === step.step && query.isError
                  ? "text-red-500"
                  : "",
              )}
            >
              {currentStep === step.step
                ? query.isLoading
                  ? step.currentLabel
                  : query.isError
                    ? step.errorLabel
                    : query.isSuccess
                      ? step.successLabel
                      : step.currentLabel
                : currentStep > step.step
                  ? step.successLabel
                  : step.currentLabel}
            </TimelineHeading>
            <TimelineDot
              status={
                currentStep === step.step
                  ? query.isLoading
                    ? "current"
                    : query.isError
                      ? "error"
                      : "done"
                  : currentStep > step.step
                    ? "done"
                    : "default"
              }
            />
          </TimelineItem>
        ))}
      </Timeline>
      <div className="flex items-center justify-center">
        {query.isError ? (
          <Button onClick={() => query.refetch()}>Retry Step</Button>
        ) : null}
      </div>
    </div>
  );
};

export default InviteFlow;
