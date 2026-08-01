import { useState, useEffect } from 'react';
import { SiteSettings } from '../types';
import { getStoredSettings } from '../data/dataStore';

export function useSiteSettings(): SiteSettings {
  const [settings, setSettings] = useState<SiteSettings>(() => getStoredSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getStoredSettings());
    };

    window.addEventListener('jobshub_data_updated', handleUpdate);
    return () => window.removeEventListener('jobshub_data_updated', handleUpdate);
  }, []);

  return settings;
}
