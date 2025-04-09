import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';

import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

const UpdateChecker = () => {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleDownload = async (update) => {
        console.log('Stahuji update...');
        setLoading(true);
        toast.current.clear();

        try {
            toast.current.show({ severity: 'info', summary: 'Stahuji...', detail: 'Probíhá aktualizace...', life: 3000 });
            await update.downloadAndInstall();
            await relaunch();
        } catch (error) {
            console.error('Chyba při stahování:', error);
            toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Aktualizace se nezdařila.', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkForUpdates = async () => {
            console.log('Kontroluji aktualizace...');

            try {
                const update = await check();
                console.log('Výsledek kontroly:', update);

                if (update && update.shouldUpdate) {
                    console.log('Je dostupný update:', update.manifest?.version);
                    toast.current.show({
                        sticky: true,
                        severity: 'info',
                        summary: 'Dostupná aktualizace',
                        detail: (
                            <div className="flex flex-column gap-2">
                                <span>Nová verze: <strong>{update.manifest?.version}</strong></span>
                                <Button
                                    label="Stáhnout a nainstalovat"
                                    icon="pi pi-download"
                                    onClick={() => handleDownload(update)}
                                    className="p-button-sm p-button-success"
                                />
                            </div>
                        ),
                        life: 10000
                    });
                } else {
                    // Testovací fallback toast
                    toast.current.show({
                        severity: 'success',
                        summary: 'Aplikace je aktuální',
                        detail: 'Zatím žádná nová verze.',
                        life: 3000
                    });
                }
            } catch (error) {
                console.error('Chyba při kontrole aktualizace:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Chyba',
                    detail: 'Nepodařilo se zkontrolovat aktualizace.',
                    life: 3000
                });
            }
        };

        checkForUpdates();
    }, []);

    return (
        <div>
            <Toast ref={toast} position="bottom-right" />
            {loading && (
                <div style={{ position: 'fixed', bottom: 20, right: 20, width: '200px' }}>
                    <ProgressBar mode="indeterminate" style={{ height: '6px' }} />
                </div>
            )}
        </div>
    );
};

export default UpdateChecker;
