import { BeamLoader } from "@/app/_components/beam-loader";
import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
} from "@/app/_components/timeline";

const steps = [
  {
    currentLabel: "Validating the invite code!",
    successLabel: "Invite code validated!",
    errorLabel: "Invalid invite code!",
  },
  {
    currentLabel: "Checking if you are already a member",
    successLabel: "New Member!!",
    errorLabel: "You are already a member!",
  },
  {
    currentLabel: "Assigning you a new membership",
    successLabel: "Membership assigned!",
    errorLabel: "Membership assignment failed!",
  },
  {
    currentLabel: "Redirecting you to the workspace dashboard",
    successLabel: "Redirected!",
    errorLabel: "Redirect failed!",
  },
];

const InviteFlow = () => {
  return (
    <div className="my-8 p-10 max-w-[500px] flex flex-col mx-auto gap-4">
      <BeamLoader />
      <Timeline className="max-w-xl flex gap-4 items-start flex-col justify-center mx-auto py-6">
        {steps.map((step, index) => (
          <TimelineItem key={index} className="opacity-40">
            <TimelineHeading className="text-muted-foreground text-sm">
              {step.currentLabel}
            </TimelineHeading>
            <TimelineDot status="custom" />
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default InviteFlow;
