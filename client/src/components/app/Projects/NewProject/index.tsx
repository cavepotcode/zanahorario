import React from 'react';
import styles from './styles.module.scss';
import useSnackbar from '../../../Snackbar/useSnackbar';
import useHotkey from '../../../../hooks/useHotkey';
import hotkeys from '../../../../hotkeys';
import HotkeyHelp from '../../../ui/HotkeyHelp';
import api from '../../../../utils/api';
import { apiUrls } from '../../../../urls';

export default function NewProject() {
  const [disabled, setDisabled] = React.useState(false);
  const input = React.useRef(null);
  const { addNotification } = useSnackbar();

  useHotkey(hotkeys.project.new, (event: any) => {
    event.preventDefault();
    if (input && input.current) {
      (input.current as any).focus();
    }
  });

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <HotkeyHelp keys={hotkeys.project.new} />
      <input placeholder="New Project" ref={input} disabled={disabled} name="projectName" />
      <button type="submit" disabled={disabled}>
        +
      </button>
    </form>
  );

  async function handleSubmit(event: any) {
    event.preventDefault();
    try {
      const name = event.target.projectName.value;
      setDisabled(true);

      const { meta, data } = await api.post(apiUrls.projects.index, { name });
      if (meta && !meta.code) {
        (input.current as any).value = '';
        addNotification(`El proyecto "${name}" fue creado exitosamente.`);
      } else {
        const message =
          meta.message === 'exists' ? 'El proyecto ya existe' : 'Ha ocurrido un error al crear el proyecto.';
        addNotification(message);
      }
    } catch (error) {
      addNotification('Ha ocurrido un error al crear el proyecto.');
    } finally {
      setDisabled(false);
    }
  }
}
