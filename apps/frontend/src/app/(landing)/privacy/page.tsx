export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import {
  LegalLayout,
  Seccion,
} from '@gitroom/frontend/app/(landing)/legal.layout';

export const metadata: Metadata = {
  title: 'SonrisaPost · Política de privacidad',
  description:
    'Qué datos recopila SonrisaPost, para qué los usa y cómo eliminarlos.',
};

const CONTACTO = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hola@sonrisapost.com';

export default function PrivacyPage() {
  return (
    <LegalLayout titulo="Política de privacidad" actualizado="17/08/2026">
      <p>
        SonrisaPost es una herramienta gratuita que permite a consultorios
        odontológicos programar y publicar contenido en sus redes sociales. Esta
        política explica qué datos guardamos, por qué, y cómo pedir que los
        borremos.
      </p>

      <Seccion titulo="Qué datos recopilamos">
        <p>
          <strong>De tu cuenta:</strong> dirección de correo electrónico,
          contraseña (almacenada cifrada, nunca en texto plano), nombre del
          consultorio, especialidad odontológica y, opcionalmente, foto de
          perfil.
        </p>
        <p>
          <strong>Técnicos:</strong> dirección IP y navegador desde el que
          iniciás sesión. Los usamos para detectar accesos indebidos a tu
          cuenta.
        </p>
        <p>
          <strong>De tus redes sociales:</strong> cuando conectás una cuenta, la
          plataforma correspondiente nos entrega un token de acceso que
          almacenamos para poder publicar en tu nombre. Guardamos también el
          nombre de usuario y la foto de perfil de esa cuenta, para que puedas
          identificarla dentro de la aplicación.
        </p>
        <p>
          <strong>Tu contenido:</strong> los textos, imágenes y videos que
          cargás, junto con las fechas y horarios en que pediste publicarlos.
        </p>
        <p>
          <strong>Métricas de uso:</strong> registramos si hacés clic en el
          espacio promocional de DentalCore, para saber si esta herramienta
          cumple su función. Es un contador; no construimos perfiles.
        </p>
      </Seccion>

      <Seccion titulo="Qué NO recopilamos">
        <p>
          <strong>Ningún dato de tus pacientes.</strong> SonrisaPost no es un
          sistema de gestión clínica y no tiene historias clínicas, diagnósticos
          ni datos de salud.
        </p>
        <p>
          Si subís fotografías de pacientes como contenido —por ejemplo, casos
          de antes y después—, sos vos quien debe contar con el consentimiento
          informado correspondiente. Nosotros tratamos esas imágenes como
          archivos, sin analizarlas ni asociarlas a persona alguna.
        </p>
        <p>
          Tampoco vendemos, alquilamos ni cedemos tus datos a terceros con fines
          publicitarios.
        </p>
      </Seccion>

      <Seccion titulo="Para qué usamos tus datos">
        <p>
          Únicamente para prestar el servicio: autenticarte, publicar el
          contenido que programaste en las cuentas que conectaste, mostrarte
          estadísticas de tus publicaciones y comunicarnos con vos sobre tu
          cuenta.
        </p>
        <p>
          Los tokens de tus redes sociales se usan sólo para las acciones que
          vos indicás. No leemos tus mensajes privados ni publicamos nada que no
          hayas programado.
        </p>
      </Seccion>

      <Seccion titulo="Con quién los compartimos">
        <p>
          <strong>Las plataformas que conectás</strong> (Instagram, Facebook,
          TikTok, LinkedIn y demás): reciben el contenido que pediste publicar,
          conforme a sus propias políticas.
        </p>
        <p>
          <strong>Proveedores de infraestructura</strong> que hacen funcionar el
          servicio: alojamiento del servidor, almacenamiento de archivos y envío
          de correos. Acceden a los datos sólo en la medida necesaria para
          prestar ese servicio.
        </p>
        <p>
          <strong>Autoridades</strong>, si media una orden judicial que nos
          obligue.
        </p>
      </Seccion>

      <Seccion titulo="Cuánto tiempo los conservamos">
        <p>
          Mientras tengas la cuenta activa. Si la eliminás, borramos tus datos
          personales, tus tokens de acceso y tu contenido dentro de los 30 días.
        </p>
        <p>
          Las publicaciones que ya salieron a tus redes sociales quedan en esas
          plataformas: no podemos borrarlas desde acá, tenés que hacerlo en cada
          red.
        </p>
      </Seccion>

      <Seccion titulo="Tus derechos">
        <p>
          Podés acceder a tus datos, corregirlos, exportarlos o eliminarlos.
          Podés también desconectar cualquier red social en cualquier momento
          desde la aplicación: al hacerlo, borramos el token correspondiente.
        </p>
        <p>
          Para eliminar tu cuenta y todos tus datos, seguí las instrucciones de
          la página <a href="/eliminar-datos" className="text-[#2DD4BF] underline">eliminar mis datos</a>.
        </p>
        <p>
          Si estás en Argentina, la Ley 25.326 de Protección de los Datos
          Personales te ampara, y la Agencia de Acceso a la Información Pública
          es el organismo de control.
        </p>
      </Seccion>

      <Seccion titulo="Seguridad">
        <p>
          Las contraseñas se guardan cifradas. La conexión con el sitio viaja
          por HTTPS. Los tokens de acceso a tus redes se almacenan en nuestra
          base de datos y sólo se usan para las acciones que solicitás.
        </p>
        <p>
          Ningún sistema es infalible. Si detectamos una brecha que afecte tus
          datos, te lo comunicaremos.
        </p>
      </Seccion>

      <Seccion titulo="Código abierto">
        <p>
          SonrisaPost es software libre bajo licencia AGPL-3.0. Podés revisar
          exactamente qué hace el programa con tus datos leyendo su código
          fuente, cuyo enlace está publicado dentro de la aplicación.
        </p>
      </Seccion>

      <Seccion titulo="Contacto">
        <p>
          Por cualquier consulta sobre esta política o sobre tus datos:{' '}
          <a href={`mailto:${CONTACTO}`} className="text-[#2DD4BF] underline">
            {CONTACTO}
          </a>
        </p>
      </Seccion>
    </LegalLayout>
  );
}
