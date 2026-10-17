const DateTimeDisplay = ({
  value,
  isDanger,
}: {
  value: number;
  type: string;
  isDanger: boolean;
}) => {
  return (
    <div className="h-12 md:h-14 rounded-lg  flex items-center justify-center 1274">
      <span
        className={`text-base md:text-2xl font-semibold ${
          isDanger ? "text-red-600" : "text-secodarycolor "
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default DateTimeDisplay;
