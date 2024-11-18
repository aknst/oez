import { ModeToggle } from "@/components/common/ModeToggle";
import { Spinner } from "@/components/ui/spinner";

export const FullPageLoader = () => {
  return (
    <div className="relative flex flex-col h-screen items-center justify-center">
      <Spinner />
      <div className="absolute bottom-0 right-0 m-6">
        <ModeToggle />
      </div>
    </div>
  );
};
