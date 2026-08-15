/**
 * Firma de marca: SonrisaPost vive en su propio dominio, pero se presenta
 * como parte de DentalCore. Es tambien el puente del embudo hacia el producto
 * principal, asi que el enlace tiene que quedar visible y funcionando.
 *
 * NEXT_PUBLIC_PARENT_BRAND_URL permite apuntarlo a otro lado sin tocar codigo.
 */
export const PARENT_BRAND_URL =
  process.env.NEXT_PUBLIC_PARENT_BRAND_URL || 'https://dentalcore.app';

export const ByDentalCoreComponent = () => {
  return (
    <div className="text-[12px] text-[#8E8E8E] ps-[60px]">
      by{' '}
      <a
        href={PARENT_BRAND_URL}
        target="_blank"
        rel="noreferrer"
        className="text-[#D1D1D1] hover:text-white underline underline-offset-2"
      >
        DentalCore
      </a>
    </div>
  );
};
