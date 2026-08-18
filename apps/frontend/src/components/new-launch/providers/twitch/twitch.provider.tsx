'use client';

import { FC } from 'react';
import {
  PostComment,
  withProvider,
} from '@gitroom/frontend/components/new-launch/providers/high.order.provider';
import { TwitchDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/twitch.dto';
import { useSettings } from '@gitroom/frontend/components/launches/helpers/use.values';
import { Select } from '@gitroom/react/form/select';
import { useWatch } from 'react-hook-form';

const messageTypes = [
  {
    label: 'Mensaje de chat',
    value: 'message',
  },
  {
    label: 'Anuncio',
    value: 'announcement',
  },
];

const announcementColors = [
  {
    label: 'Principal (por defecto)',
    value: 'primary',
  },
  {
    label: 'Azul',
    value: 'blue',
  },
  {
    label: 'Verde',
    value: 'green',
  },
  {
    label: 'Naranja',
    value: 'orange',
  },
  {
    label: 'Violeta',
    value: 'purple',
  },
];

const TwitchSettings: FC = () => {
  const { register, control } = useSettings();
  const messageType = useWatch({
    control,
    name: 'messageType',
  });

  return (
    <div className="flex flex-col">
      <Select
        label="Tipo de mensaje"
        {...register('messageType', {
          value: 'message',
        })}
      >
        {messageTypes.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>
      {messageType === 'announcement' && (
        <Select
          label="Color del anuncio"
          {...register('announcementColor', {
            value: 'primary',
          })}
        >
          {announcementColors.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default withProvider({
  postComment: PostComment.COMMENT,
  comments: 'no-media',
  minimumCharacters: [],
  SettingsComponent: TwitchSettings,
  CustomPreviewComponent: undefined,
  dto: TwitchDto,
  maximumCharacters: 500,
});
