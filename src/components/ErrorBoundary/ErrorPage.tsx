import ErrorStrike from "../../assets/images/bg-green-gradient.jpg";
const ErrorPage = () => {
  return (
    <>
      <div className="flex justify-center ">
        <img src={ErrorStrike} alt="Went Wrong" height={600} width={500} />
      </div>
      <h3 className="text-center">
        Okay, sometimes this happens. An Error Occurs! Check if you can resolve
        it by reloading the app?
      </h3>
    </>
  );
};

export default ErrorPage;
