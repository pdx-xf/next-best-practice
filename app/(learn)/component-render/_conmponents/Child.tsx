"use client";

import { useUserStore } from "@/stores/useUserStore";
import { memo, useEffect, useLayoutEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useThemeContext } from "../_context/ThemeContext";

const Child = () => {
  const { theme, switchTheme } = useThemeContext();
  console.log("render111");
  const [childId, setChildId] = useState<string | number>("点击生成ChildId");
  const { age, setAge } = useUserStore(
    useShallow((state) => ({ age: state.age, setAge: state.setAge })),
  );

  console.log("render222");

  useLayoutEffect(() => {
    // 生成新虚拟DOM树，Diff算法更新DOM后，浏览器绘制前 阻塞渲染（同步）
    console.log("mount: useLayoutEffect");
    return () => console.log("unmount: useLayoutEffect");
  }, []);

  useEffect(() => {
    // 浏览器绘制后 不阻塞渲染（异步）
    console.log("mount: useEffect");
    return () => console.log("unmount: useEffect");
  }, []);

  useEffect(() => {
    console.log("mount: useEffect" + childId);
    return () => console.log("unmount: useEffect" + childId);
  }, [childId]);

  useLayoutEffect(() => {
    console.log("mount: useLayoutEffect" + childId);
    return () => console.log("unmount: useLayoutEffect" + childId);
  }, [childId]);

  return (
    <div style={{ border: "1px solid #ccc" }}>
      子组件内容：
      <div onClick={() => setChildId(Date.now)}>{childId}</div>
      <div onClick={setAge}> {age}</div>
    </div>
  );
};

export default memo(Child);
