'use client';
import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';
import { useVariables } from '@gitroom/react/helpers/variable.context';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const { sentryDsn } = useVariables();

  useEffect(() => {
    if (!sentryDsn) {
      return;
    }
    const eventId = Sentry.captureException(error);
    Sentry.showReportDialog({
      eventId,
      title: 'Algo se rompió',
      subtitle: 'Ayudanos a resolverlo contándonos qué pasó.',
      labelComments: 'What happened?',
      labelName: 'Your name',
      labelEmail: 'Your email',
      labelSubmit: 'Send Report',
      lang: 'en',
    });

  }, [error]);
  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
