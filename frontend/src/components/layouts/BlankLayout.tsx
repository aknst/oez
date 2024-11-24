import { Outlet } from "react-router-dom";
import { ModeToggle } from "../common/ModeToggle";

export default function BlankLayout() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center">
      <Outlet />
      <div className="absolute bottom-0 right-0 m-6">
        <ModeToggle />
      </div>
    </div>
  );
}
