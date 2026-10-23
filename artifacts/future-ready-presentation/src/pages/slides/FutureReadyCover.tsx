export default function FutureReadyCover() {
  return (
    <div className="relative flex h-screen w-screen flex-col justify-between overflow-hidden bg-bg px-[6vw] py-[6vh] font-body text-primary">
      <div className="pointer-events-none absolute inset-[2vh_2vw] border-[0.5vw] border-primary opacity-[0.10]" />
      <div className="pointer-events-none absolute inset-[2.8vh_2.8vw] border-[0.1vw] border-primary opacity-20" />

      <div className="z-10 flex w-full items-start justify-between">
        <div className="flex items-center">
          <div className="flex h-[4vw] w-[4vw] items-center justify-center rounded-full border-[0.2vw] border-primary">
            <div className="h-[2.5vw] w-[2.5vw] rounded-full border-[0.1vw] border-primary" />
          </div>
        </div>
      </div>

      <div className="z-10 flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-[3vh] text-[1.5vw] font-semibold">
          SDC Hackathon 2026
        </div>
        <div className="mb-[4vh] w-[15vw] border-t-[0.1vw] border-primary opacity-30" />
        <h1 className="m-0 max-w-[80vw] font-display text-[6.5vw] font-bold leading-[1.1] tracking-[-0.02em] text-text">
          FutureReady
        </h1>
        <div className="mb-[4vh] mt-[1vh] w-[15vw] border-b-[0.1vw] border-primary opacity-30" />
        <p className="m-0 max-w-[65vw] font-display text-[2.2vw] italic leading-[1.4] text-primary">
          A practical career-planning prototype for the AI era
        </p>
      </div>

      <div className="z-10 h-[4vh] w-full" />
    </div>
  );
}
