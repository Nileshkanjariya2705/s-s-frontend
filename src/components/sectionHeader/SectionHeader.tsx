interface SectionHeaderProps {
  parentClass?: string;
  text: React.ReactNode;
  textClass?: string;
}
const SectionHeader = (props: SectionHeaderProps) => {
  return (
    <>
      <div className={``}>
        <div className="flex flex-wrap">
          <div className="w-full h-fit relative before:absolute before:w-2 before:rounded-sm before:h-8 before:bg-primarycolor/40  before:content-[''] before:left-0 before:top-0 pl-5 rtl:pr-5 rtl:pl-0 rtl:before:right-0 rtl:before:left-unset">
            <h4
              className={`text-xl md:text-2xl font-semibold text-yellow ${props.textClass ? props.textClass : ""
                }`}
            >
              {props.text}
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
