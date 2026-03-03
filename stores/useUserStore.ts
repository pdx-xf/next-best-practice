import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type UserStoreType = {
  name: string;
  setName: () => void;
  age: number;
  setAge: () => void;
};

export const useUserStore = create<UserStoreType>()(
  devtools(
    persist(
      immer((set) => ({
        name: "张三",
        setName: () => {
          set(
            (state) => {
              if (state.name == "张三") {
                state.name = "李四";
              } else {
                state.name = "张三";
              }
            },
            undefined,
            "user/setName",
          );
        },
        age: 12,
        setAge: () => {
          set(
            (state) => {
              ++state.age;
            },
            undefined,
            "user/setAge",
          );
        },
      })),
      { name: "user-storage" },
    ),
    { name: "userStore" },
  ),
);

export const subscribeUser = () => {
  const unsubscribe = useUserStore.subscribe((state, prevState) => {
    console.log(state, prevState);
    return state;
  });

  return unsubscribe;
};
