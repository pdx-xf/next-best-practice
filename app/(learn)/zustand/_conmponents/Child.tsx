"use client";

import { useUserStore } from "@/stores/useUserStore";
import { memo } from "react";
import { useShallow } from "zustand/shallow";

const Child = () => {
  const { age, setAge } = useUserStore(
    useShallow((state) => ({ age: state.age, setAge: state.setAge })),
  );
  console.log("render");

  return <div onClick={setAge}>{age}</div>;
};

export default memo(Child);
