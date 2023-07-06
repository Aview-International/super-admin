/**
 * DottedBorder Component
 *
 * @prop children - Children to be rendered inside the border
 * @prop borderRadius: Radius of the border, defaults to 15px
 *
 * @author Victor Ogunjobi
 *
 */
const DottedBorder = ({ children, borderRadius, classes }) => {
  return (
    <div
      className={`gradient-1 rounded-[${borderRadius}] border-dashed bg-origin-border border-black ${classes}`}
    >
      <div className="rounded-[15px] bg-black w-full h-full">{children}</div>
    </div>
  );
};

export default DottedBorder;
