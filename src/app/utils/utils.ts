import { formatDistance } from 'date-fns';

function accessibleRouteChangeHandler() {
  return window.setTimeout(() => {
    const mainContainer = document.getElementById('primary-app-container');
    if (mainContainer) {
      mainContainer.focus();
    }
  }, 50);
}


const getModalAppendTo = (): HTMLElement | undefined => document.querySelector('#qs-content') as HTMLElement || document.body;

const MAX_SERVICE_REGISTRY_NAME_LENGTH = 32;
const MAX_SERVICE_REGISTRY_DESC_LENGTH = 255;

const statusOptions = [
  { value: 'ready', label: 'Ready' },
  { value: 'failed', label: 'Failed' },
  { value: 'accepted', label: 'Creation pending' },
  { value: 'provisioning', label: 'Creation in progress' },
  { value: 'preparing', label: 'Creation in progress' },
  { value: 'deprovision', label: 'Deletion in progress' },
  { value: 'deleting', label: 'Deletion in progress' },
];

const getFormattedDate = (date: string | Date, translatePostfix: string): string => {
  date = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(date, new Date()) + ' ' + translatePostfix;
};

enum InstanceType {
  eval = 'eval',
  standard = 'standard',
}

export {
  accessibleRouteChangeHandler,
  getModalAppendTo,
  MAX_SERVICE_REGISTRY_NAME_LENGTH,
  MAX_SERVICE_REGISTRY_DESC_LENGTH,
  statusOptions,
  getFormattedDate,
  InstanceType
};