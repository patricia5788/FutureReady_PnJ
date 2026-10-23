export default function ReadSignals() {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-bg font-body text-primary">
      <div className="flex w-[34vw] flex-col justify-center bg-primary px-[5vw] py-[8vh] text-bg">
        <h2 className="m-0 font-display text-[4vw] font-bold leading-[1.12] text-bg">
          Read signals with context
        </h2>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-[3vh] px-[5vw] py-[7vh]">
        <div className="border-b-[0.1vw] border-primary/20 pb-[2vh] text-[2vw] leading-[1.4]">
          Radar scores are synthetic examples, not verified labor-market measures
        </div>
        <div className="border-b-[0.1vw] border-primary/20 pb-[2vh] text-[2vw] leading-[1.4]">
          Job listings are individual examples from a delayed public feed, not vacancy totals
        </div>
        <div className="border-b-[0.1vw] border-primary/20 pb-[2vh] text-[2vw] leading-[1.4]">
          Moderate and fast adoption paths are team-defined scenarios, not predictions
        </div>
        <div className="text-[2vw] leading-[1.4]">
          Dated research cards link to their cited sources
        </div>
      </div>
    </div>
  );
}
