export default function ProfileToPlan() {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-bg px-[6vw] py-[7vh] font-body text-primary">
      <h2 className="mb-[5vh] mt-0 font-display text-[4vw] font-bold leading-[1.12] text-text">
        Turn a profile into a plan
      </h2>
      <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-x-[4vw] gap-y-[3vh]">
        <div className="flex items-center gap-[2vw] border-b-[0.1vw] border-primary/20 pb-[2vh]">
          <div className="h-[1.4vw] w-[1.4vw] shrink-0 rounded-full bg-primary" />
          <p className="m-0 text-[2.15vw] leading-[1.4]">
            Compare profile skills with career-role requirements
          </p>
        </div>
        <div className="flex items-center gap-[2vw] border-b-[0.1vw] border-primary/20 pb-[2vh]">
          <div className="h-[1.4vw] w-[1.4vw] shrink-0 rounded-full bg-accent" />
          <p className="m-0 text-[2.15vw] leading-[1.4]">
            Review match scores and missing skills
          </p>
        </div>
        <div className="flex items-center gap-[2vw]">
          <div className="h-[1.4vw] w-[1.4vw] shrink-0 rounded-full bg-accent" />
          <p className="m-0 text-[2.15vw] leading-[1.4]">
            Follow an ordered roadmap with free or low-cost learning resources
          </p>
        </div>
        <div className="flex items-center gap-[2vw]">
          <div className="h-[1.4vw] w-[1.4vw] shrink-0 rounded-full bg-primary" />
          <p className="m-0 text-[2.15vw] leading-[1.4]">
            Explore relevant SDG mappings for career roles
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 h-[1.2vh] w-[30vw] bg-accent" />
    </div>
  );
}
