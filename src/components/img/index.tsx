import  { ImgHTMLAttributes } from "react";

interface CustomImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  lazyLoading?: boolean;
  className?: string;
}

export const CustomImage = (props: CustomImageProps) => {
  const { src, width, height, lazyLoading = true,className, ...rest } = props;
  return (
    <>
      <img
        src={src}
        width={width}        
        height={height}
        loading={lazyLoading ? "lazy" : "eager"}
        className={className ? className :"w-32 h-32 object-contain"}
        {...rest}
      />
    </>
  );
};

export default CustomImage;
