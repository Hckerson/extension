import { useEffect, useState } from 'react';
import { POPUP_TO_BACKGROUND } from '@types/messages';
import { PopupToBackgroundMessageSchema } from '@types/messages';

export default function App() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const message = PopupToBackgroundMessageSchema.parse({
      type: POPUP_TO_BACKGROUND,
      data: { action: 'get_data' },
    });

    const response = await chrome.runtime.sendMessage(message);
    setData(response);
    setLoading(false);
  }

  async function clearData() {
    const message = PopupToBackgroundMessageSchema.parse({
      type: POPUP_TO_BACKGROUND,
      data: { action: 'clear_data' },
    });

    await chrome.runtime.sendMessage(message);
    setData(null);
  }

  return (
    <div style={{ width: 300, padding: 16 }}>
      <h1>Extension Popup</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <button onClick={clearData}>Clear Data</button>
        </>
      )}
    </div>
  );
}
