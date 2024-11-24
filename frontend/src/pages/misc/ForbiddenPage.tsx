export const ForbiddenPage = () => {
  return (
    <div className="relative flex flex-col h-[90dvh] items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        403 Forbidden
      </h1>
      <span className="text-xl">недостаточно прав для просмотра</span>
    </div>
  );
};
