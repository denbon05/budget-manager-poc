// https://developers.google.com/drive/api/guides/folder?hl=ru#node.js
import ClientStorage from '@/entities/ClientStorage';
import axios from 'axios';

const GOOGL_DRIVE_FOLDER_NAME = 'budget-manager';

const getAuthToken = () => {
  const googleStored = ClientStorage.getItem('google');

  if (!googleStored) {
    // let Google Unauthorized error popup
    return '';
  }
  const { access_token, token_type } = googleStored;
  return `${token_type} ${access_token}`;
};

/** Check if linked google drive already has created folder for the files */
const checkIsAppFolderCreated = async () => {
  const isGDriveFolderDetected = ClientStorage.getItem(
    'isGDriveFolderDetected',
  );

  if (isGDriveFolderDetected) {
    // prevent unnecessary request
    return true;
  }

  const { data } = await axios.get(
    'https://www.googleapis.com/drive/v3/files',
    {
      headers: { Authorization: getAuthToken() },
      params: {
        q: `mimeType="application/vnd.google-apps.folder" and name="${GOOGL_DRIVE_FOLDER_NAME}" and trashed=false`,
      },
    },
  );

  return data.files.length;
};

/** Creates an app folder in google drive if not exists */
export const initGDriveAppFolder = async () => {
  const isAppFolderCreated = await checkIsAppFolderCreated();

  if (isAppFolderCreated) {
    // prevent folder creation again
    return;
  }

  const authToken = getAuthToken();
  console.log('authToken', authToken);
  const { data: folder } = await axios.post(
    'https://www.googleapis.com/drive/v3/files',
    {
      mimeType: 'application/vnd.google-apps.folder',
      name: GOOGL_DRIVE_FOLDER_NAME,
    },
    {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
    },
  );
  // remember data for further usage
  ClientStorage.setItem('gDriveFolder', {
    id: folder.id,
  });
  ClientStorage.setItem('isGDriveFolderDetected', true);
};

export const goDrive = async () => {
  const authToken = getAuthToken();
  console.log('authToken', authToken);
  await axios
    .get('https://www.googleapis.com/drive/v3/files', {
      headers: {
        Authorization: getAuthToken(),
      },
    })
    .then((res) => {
      console.log('fetch res', res.data);
    })
    .then(console.log);
};
