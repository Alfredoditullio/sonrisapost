import { proxyActivities, sleep } from '@temporalio/workflow';
import { CommentAutomationActivity } from '@gitroom/orchestrator/activities/comment.automation.activity';

const { revisarComentarios } = proxyActivities<CommentAutomationActivity>({
  startToCloseTimeout: '10 minute',
  retry: {
    maximumAttempts: 3,
    backoffCoefficient: 1,
    initialInterval: '1 minute',
  },
});

/**
 * Revisa cada pocos minutos si hay comentarios nuevos que responder.
 *
 * Es un unico flujo para toda la instalacion, no uno por canal: la cantidad
 * de canales crece con los usuarios y tener un flujo por cada uno seria
 * miles de timers para hacer el mismo trabajo. La actividad recorre las
 * automatizaciones activas por su cuenta.
 *
 * El try vacio es a proposito: si una pasada falla, se espera y se vuelve a
 * intentar en la siguiente. Que se caiga el bucle dejaria las respuestas
 * automaticas apagadas sin que nadie se entere.
 */
export async function commentAutomationWorkflow() {
  while (true) {
    try {
      await revisarComentarios();
    } catch (err) {}
    await sleep(600000);
  }
}
