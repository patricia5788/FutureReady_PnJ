export default function SafePrototype() {
  return (
    <div className="relative flex h-screen w-screen flex-col justify-center overflow-hidden bg-primary px-[7vw] py-[8vh] font-body text-bg">
      <div className="pointer-events-none absolute inset-[2vh_2vw] border-[0.5vw] border-bg opacity-10" />
      <div className="pointer-events-none absolute inset-[2.8vh_2.8vw] border-[0.1vw] border-bg opacity-20" />
      <div className="relative z-10 max-w-[83vw]">
        <h2 className="mb-[7vh] mt-0 font-display text-[4.4vw] font-bold leading-[1.12] text-bg">
          A safe prototype, with clear next steps
        </h2>
        <div className="flex flex-col gap-[3.5vh]">
          <div className="flex items-start gap-[2vw] border-b-[0.1vw] border-bg/30 pb-[2.5vh]">
            <div className="mt-[1.2vh] h-[0.7vw] w-[0.7vw] shrink-0 rounded-full bg-accent" />
            <p className="m-0 text-[2.2vw] leading-[1.4] text-bg">
              Rule-based career guidance remains available without AI Insights
            </p>
          </div>
          <div className="flex items-start gap-[2vw] border-b-[0.1vw] border-bg/30 pb-[2.5vh]">
            <div className="mt-[1.2vh] h-[0.7vw] w-[0.7vw] shrink-0 rounded-full bg-accent" />
            <p className="m-0 text-[2.2vw] leading-[1.4] text-bg">
              RunPod inference is disabled unless explicitly enabled on the server
            </p>
          </div>
          <div className="flex items-start gap-[2vw]">
            <div className="mt-[1.2vh] h-[0.7vw] w-[0.7vw] shrink-0 rounded-full bg-accent" />
            <p className="m-0 text-[2.2vw] leading-[1.4] text-bg">
              Before enabling AI publicly: add durable usage limits and test with students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
