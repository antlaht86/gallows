import "./gallows.css";
type Props = {
  show: number;
  lose: boolean;
};

export default function Gallows({ show, lose }: Props) {
  let personClass = lose ? ["person fadeOutDown"] : ["person"];
  console.log("➡️ show: ", show);
  console.log("➡️ show <= 1: ", show <= 1);

  return (
    <div className="gallows-root">
      <Part name="rope" show={show < 4} showSkeleton={false} />
      <div className="person-wrapper">
        <div className={personClass.join(" ")}>
          <Part name="head" show={show < 5} showSkeleton={true} />
          <Part name="body" show={show < 6} showSkeleton={true} />
          <Part name="limb-left-top" show={show < 7} showSkeleton={true} />
          <Part name="limb-right-top" show={show < 8} showSkeleton={true} />
          <Part name="limb-left-bottom" show={show < 9} showSkeleton={true} />
          <Part
            name="limb-right-bottom move-leg "
            show={show < 10}
            showSkeleton={true}
          />
        </div>
      </div>
      {/* <Part name="du" show={show < 1} showSkeleton={false} /> */}
      <Part name="pillar" show={show < 2} showSkeleton={false} />
      <Part name="cover" show={show < 3} showSkeleton={false} />
      <Part name="leg" show={show < 1} showSkeleton={false} />
      <Part name="well" show={show < 11} showSkeleton={false} />
    </div>
  );
}

type PartProps = {
  name: string;
  show: boolean;
  showSkeleton: boolean;
};

function Part({ name, show, showSkeleton }: PartProps) {
  if (showSkeleton) {
    const className = show ? [name, "skel"] : [name];
    return <div className={className.join(" ")}> </div>;
  }

  const className = show ? [name, "show"] : [name];
  return <div className={className.join(" ")}> </div>;
}
