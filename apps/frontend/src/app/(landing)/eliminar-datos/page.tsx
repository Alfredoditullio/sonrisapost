export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import {
  LegalLayout,
  Seccion,
} from '@gitroom/frontend/app/(landing)/legal.layout';

export const metadata: Metadata = {
  title: 'SonrisaPost · Eliminar mis datos',
  description:
    'Cómo eliminar tu cuenta y todos tus datos de SonrisaPost, incluidos los tokens de tus redes sociales.',
};

const CONTACTO = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hola@sonrisapost.com';

/**
 * Meta exige una URL publica con instrucciones de eliminacion de datos para
 * aprobar el acceso a sus APIs. Tiene que ser accesible sin iniciar sesion.
 */
export default function EliminarDatosPage() {
  return (
    <LegalLayout titulo="Eliminar mis datos" actualizado="17/08/2026">
      <p>
        Podés eliminar tus datos de SonrisaPost en cualquier momento y sin dar
        explicaciones. Hay dos alcances posibles, según lo que necesites.
      </p>

      <Seccion titulo="Opción 1 — Desconectar una red social">
        <p>
          Si sólo querés que dejemos de tener acceso a una cuenta de Instagram,
          Facebook u otra red:
        </p>
        <ol className="list-decimal ps-[22px] flex flex-col gap-[6px]">
          <li>Iniciá sesión en SonrisaPost</li>
          <li>Entrá al calendario y ubicá la cuenta en el panel de canales</li>
          <li>Elegí la opción de eliminar ese canal</li>
        </ol>
        <p>
          Al hacerlo <strong>borramos inmediatamente el token de acceso</strong>{' '}
          de esa cuenta. Desde ese momento no podemos publicar ni leer nada de
          ella.
        </p>
        <p>
          Podés además revocar el permiso desde la propia red social, en la
          sección de aplicaciones conectadas de tu configuración.
        </p>
      </Seccion>

      <Seccion titulo="Opción 2 — Eliminar la cuenta completa">
        <p>
          Escribinos desde la dirección de correo con la que te registraste a{' '}
          <a href={`mailto:${CONTACTO}?subject=Eliminaci%C3%B3n%20de%20cuenta`} className="text-[#2DD4BF] underline">
            {CONTACTO}
          </a>{' '}
          con el asunto <strong>&laquo;Eliminación de cuenta&raquo;</strong>.
        </p>
        <p>
          Pedimos que sea desde ese correo para verificar que sos vos quien lo
          solicita. No hace falta que expliques el motivo.
        </p>
      </Seccion>

      <Seccion titulo="Qué se borra">
        <ul className="list-disc ps-[22px] flex flex-col gap-[6px]">
          <li>Tu usuario, correo y contraseña</li>
          <li>El nombre y la especialidad de tu consultorio</li>
          <li>
            <strong>Todos los tokens de acceso</strong> de las redes sociales
            que hayas conectado
          </li>
          <li>Las publicaciones programadas y su historial</li>
          <li>Las imágenes y videos que hayas subido</li>
          <li>Los registros de IP y navegador asociados a tu cuenta</li>
        </ul>
        <p>
          El proceso se completa dentro de los <strong>30 días</strong> y te lo
          confirmamos por correo.
        </p>
      </Seccion>

      <Seccion titulo="Qué NO podemos borrar">
        <p>
          <strong>Las publicaciones que ya salieron a tus redes sociales.</strong>{' '}
          Una vez publicadas, viven en Instagram, Facebook o donde las hayas
          enviado, y sólo vos podés eliminarlas desde esas plataformas.
        </p>
        <p>
          Borrar tu cuenta de SonrisaPost no borra tu contenido publicado.
        </p>
      </Seccion>

      <Seccion titulo="Sobre tus pacientes">
        <p>
          SonrisaPost no almacena historias clínicas, diagnósticos ni datos de
          salud de ninguna persona. Si publicaste fotografías de pacientes como
          contenido, esas imágenes se eliminan junto con el resto de tu material
          al borrar la cuenta.
        </p>
      </Seccion>
    </LegalLayout>
  );
}
