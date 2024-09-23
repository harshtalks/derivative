// tunnel

import { createStore } from "@xstate/store";
import { useSelector } from "@xstate/store/react";
import { ReactNode, useEffect } from "react";

export type InletProps = {
  children: ReactNode;
};

const tunnel = () => {
  const tunnelStore = createStore(
    {
      currentChildren: [] as ReactNode[],
    },
    {
      setCurrent: (_, event: { value: ReactNode }) => {
        return {
          currentChildren: [..._.currentChildren, event.value],
        };
      },

      removeCurrent: (_, event: { value: ReactNode }) => {
        return {
          currentChildren: _.currentChildren.filter(
            (child) => child !== event.value,
          ),
        };
      },
    },
  );

  return {
    Inlet: ({ children }: InletProps) => {
      // running effect, evertime we call this component, we will update the store to include the children in the currentChildren Array.

      useEffect(() => {
        tunnelStore.send({
          type: "setCurrent",
          value: children,
        });

        return () => {
          tunnelStore.send({
            type: "removeCurrent",
            value: children,
          });
        };
      }, [children]);

      // this is just to declare, we do not actually care about what it returns.
      return null;
    },

    Outlet: () => {
      const children = useSelector(
        tunnelStore,
        (state) => state.context.currentChildren,
      );

      return <> {children} </>;
    },
  };
};

export default tunnel;
