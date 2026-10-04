import Image from 'next/image';

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export default function BrandLogo({
  className = 'h-8 w-auto md:h-9',
  priority = false,
}: BrandLogoProps) {
  return (
    <span className="inline-flex items-center">
      <Image
        src="/brand/logo-light.png"
        alt="Rayida Tech"
        width={419}
        height={120}
        className={`logo-light ${className} object-contain`}
        priority={priority}
      />
      <Image
        src="/brand/logo-dark.png"
        alt="Rayida Tech"
        width={419}
        height={120}
        className={`logo-dark ${className} object-contain`}
        priority={priority}
      />
      <span className="sr-only">Rayida Tech</span>
    </span>
  );
}
