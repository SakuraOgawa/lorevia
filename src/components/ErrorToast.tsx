type ErrorToastProps = {
  message: string;
};

function ErrorToast(props: ErrorToastProps) {
  return (
    <div className="
      fixed left-1/2 top-5 z-50
      -translate-x-1/2
      rounded-xl bg-red-500
      px-5 py-3 text-white shadow-lg
    ">
      {props.message}
    </div>
  );
}

export default ErrorToast;