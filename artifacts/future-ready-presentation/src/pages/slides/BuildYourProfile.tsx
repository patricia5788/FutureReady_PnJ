export default function BuildYourProfile() {
  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-bg px-[6vw] py-[8vh] font-body text-primary">
      <div className="mb-[8vh] flex items-end justify-between">
        <h2 className="m-0 max-w-[70vw] font-display text-[4vw] font-bold leading-[1.12] text-text">
          Build a profile that reflects you
        </h2>
        <div className="mb-[1vh] h-[0.8vw] w-[8vw] bg-accent" />
      </div>
      <div className="grid flex-1 grid-cols-3">
        <div className="flex flex-col justify-center border-r-[0.1vw] border-primary/20 pr-[3vw]">
          <div className="mb-[3vh] h-[0.5vw] w-[4vw] bg-primary" />
          <p className="m-0 text-[2.2vw] leading-[1.45]">
            Add skills and proficiency levels
          </p>
        </div>
        <div className="flex flex-col justify-center bg-primary px-[3vw] text-bg">
          <div className="mb-[3vh] h-[0.5vw] w-[4vw] bg-accent" />
          <p className="m-0 text-[2.2vw] leading-[1.45] text-bg">
            Capture experience, interests, and career goals
          </p>
        </div>
        <div className="flex flex-col justify-center border-l-[0.1vw] border-primary/20 pl-[3vw]">
          <div className="mb-[3vh] h-[0.5vw] w-[4vw] bg-primary" />
          <p className="m-0 text-[2.2vw] leading-[1.45]">
            Save and update a profile to personalize guidance
          </p>
        </div>
      </div>
    </div>
  );
}
