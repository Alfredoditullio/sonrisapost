export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import {
  LegalLayout,
  Seccion,
} from '@gitroom/frontend/app/(landing)/legal.layout';

export const metadata: Metadata = {
  title: 'SonrisaPost · Términos del servicio',
  description: 'Condiciones de uso de SonrisaPost.',
};

const CONTACTO = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hola@sonrisapost.com';

export default function TermsPage() {
  return (
    <LegalLayout titulo="Términos del servicio" actualizado="17/08/2026">
      <p>
        Al crear una cuenta en SonrisaPost aceptás estas condiciones. Están
        escritas para que se entiendan; si algo no te queda claro, escribinos
        antes de registrarte.
      </p>

      <Seccion titulo="Qué es SonrisaPost">
        <p>
          Una herramienta gratuita que permite a consultorios odontológicos
          programar publicaciones en sus redes sociales desde un solo
          calendario, con plantillas de contenido orientadas a la odontología.
        </p>
        <p>
          Es un producto de la familia DentalCore, pero funciona de forma
          independiente y no requiere contratar ningún otro servicio.
        </p>
      </Seccion>

      <Seccion titulo="Gratuito, y qué implica">
        <p>
          El servicio no tiene costo ni límite de publicaciones. No pedimos
          tarjeta de crédito.
        </p>
        <p>
          Como contrapartida honesta: <strong>se ofrece tal como está</strong>.
          Hacemos lo posible por mantenerlo funcionando, pero no garantizamos
          disponibilidad ininterrumpida ni asumimos responsabilidad por
          publicaciones que no salgan a horario, por caídas del servicio o por
          cambios en las APIs de las redes sociales.
        </p>
        <p>
          Si tu consultorio depende de que una campaña salga en un momento
          exacto, verificá que se haya publicado.
        </p>
      </Seccion>

      <Seccion titulo="Tu cuenta">
        <p>
          Sos responsable de mantener tu contraseña segura y de la actividad que
          ocurra en tu cuenta. Avisanos si detectás un acceso que no reconocés.
        </p>
        <p>
          Tenés que ser mayor de edad y estar habilitado para representar al
          consultorio cuyas redes conectás.
        </p>
      </Seccion>

      <Seccion titulo="Tu contenido y tus responsabilidades">
        <p>
          El contenido que publiques es tuyo y seguís siendo su dueño. Nosotros
          sólo lo almacenamos y lo enviamos a las redes que indicaste.
        </p>
        <p>
          <strong>Sos responsable de lo que publicás.</strong> En particular, y
          por tratarse de un servicio para profesionales de la salud:
        </p>
        <ul className="list-disc ps-[22px] flex flex-col gap-[6px]">
          <li>
            Si publicás imágenes de pacientes, tenés que contar con su
            consentimiento informado, por escrito.
          </li>
          <li>
            La publicidad de servicios odontológicos está regulada. Cumplir con
            el código de ética y las normas de tu colegio profesional y de tu
            jurisdicción es responsabilidad tuya, no nuestra.
          </li>
          <li>
            No podés usar el servicio para difundir contenido ilegal,
            engañoso, difamatorio o que infrinja derechos de terceros.
          </li>
        </ul>
        <p>
          Las plantillas de contenido que ofrecemos son un punto de partida
          editable. Revisalas con criterio profesional antes de publicarlas: no
          constituyen asesoramiento clínico ni legal.
        </p>
      </Seccion>

      <Seccion titulo="Las redes sociales que conectes">
        <p>
          Cada plataforma tiene sus propias condiciones, y al conectarla también
          las aceptás. Si una red suspende tu cuenta o cambia su API, puede
          dejar de funcionar la integración, y eso escapa a nuestro control.
        </p>
        <p>
          Podés desconectar cualquier cuenta cuando quieras desde la
          aplicación.
        </p>
      </Seccion>

      <Seccion titulo="Suspensión">
        <p>
          Podemos suspender cuentas que usen el servicio para enviar spam,
          publicar contenido ilegal, atacar la infraestructura o perjudicar a
          otros usuarios. Cuando sea razonable, avisaremos antes.
        </p>
        <p>
          Vos podés eliminar tu cuenta cuando quieras, sin dar explicaciones.
        </p>
      </Seccion>

      <Seccion titulo="Software libre">
        <p>
          SonrisaPost se distribuye bajo licencia AGPL-3.0 y es un trabajo
          derivado de Postiz. Podés consultar el código fuente, modificarlo y
          alojarlo en tu propio servidor. El enlace al código está publicado
          dentro de la aplicación.
        </p>
        <p>
          Estos términos regulan el servicio que ofrecemos nosotros, no el
          software en sí, cuyos permisos los da la licencia.
        </p>
      </Seccion>

      <Seccion titulo="Cambios">
        <p>
          Si modificamos estas condiciones de forma sustancial, lo avisaremos
          por correo o dentro de la aplicación con antelación razonable.
        </p>
      </Seccion>

      <Seccion titulo="Contacto">
        <p>
          <a href={`mailto:${CONTACTO}`} className="text-[#2DD4BF] underline">
            {CONTACTO}
          </a>
        </p>
      </Seccion>
    </LegalLayout>
  );
}
