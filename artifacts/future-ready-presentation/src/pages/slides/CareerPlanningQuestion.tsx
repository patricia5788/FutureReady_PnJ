export default function CareerPlanningQuestion() {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-bg font-body text-primary">
      <div className="flex w-[36vw] flex-col justify-center bg-primary px-[6vw] py-[8vh] text-bg">
        <h2 className="m-0 max-w-[28vw] font-display text-[4vw] font-bold leading-[1.12] text-bg">
          The career-planning question
        </h2>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-[4vh] px-[6vw] py-[8vh]">
        <div className="border-b-[0.1vw] border-primary/20 pb-[3vh] text-[2vw] leading-[1.45]">
          Which roles fit the skills I have today?
        </div>
        <div className="border-b-[0.1vw] border-primary/20 pb-[3vh] text-[2vw] leading-[1.45]">
          Which skills could help me move toward a target role?
        </div>
        <div className="text-[2vw] leading-[1.45]">
          How can I compare AI-adoption scenarios without treating them as predictions?
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-[36vw] h-[1vh] w-[64vw] bg-accent" />
    </div>
  );
}
