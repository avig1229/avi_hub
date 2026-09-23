'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { motionValue } from 'framer-motion';

// Phone tilt for the CORE cards, from the gyroscope (deviceorientation).
// One shared listener feeds two motion values in 0..1 (0.5 = neutral), the
// same shape as the cards' mouse position, so tilt can drive them directly.
//
// iOS only delivers orientation after DeviceOrientationEvent.requestPermission()
// runs inside a tap, hence the 'needs-permission' status. Android fires freely.

export type TiltStatus = 'idle' | 'unsupported' | 'needs-permission' | 'active' | 'denied';

export const tiltX = motionValue(0.5);
export const tiltY = motionValue(0.5);

const RANGE = 25; // degrees of tilt from neutral for a full swing
const RECENTER = 0.004; // how fast neutral follows the way the phone is held (~4s)

let status: TiltStatus = 'idle';
let listening = false;
let neutral: { x: number; y: number } | null = null;
const subscribers = new Set<() => void>();

function setStatus(next: TiltStatus) {
    if (status === next) return;
    status = next;
    subscribers.forEach((fn) => fn());
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

function onOrientation(e: DeviceOrientationEvent) {
    if (e.beta == null || e.gamma == null) return;
    // Map to screen axes, so landscape still tilts the right way.
    const angle = (screen.orientation?.angle ?? 0) % 360;
    const [x, y] =
        angle === 90 ? [e.beta, -e.gamma] : angle === 270 ? [-e.beta, e.gamma] : angle === 180 ? [-e.gamma, -e.beta] : [e.gamma, e.beta];

    if (!neutral) neutral = { x, y };
    neutral.x += (x - neutral.x) * RECENTER;
    neutral.y += (y - neutral.y) * RECENTER;

    tiltX.set(0.5 + clamp((x - neutral.x) / RANGE) / 2);
    tiltY.set(0.5 + clamp((y - neutral.y) / RANGE) / 2);
    setStatus('active');
}

function listen() {
    if (listening) return;
    listening = true;
    window.addEventListener('deviceorientation', onOrientation);
}

type PermissionAPI = { requestPermission?: () => Promise<'granted' | 'denied'> };

// Call from a tap handler (required on iOS).
export async function enableTilt() {
    const api = (window.DeviceOrientationEvent as unknown as PermissionAPI | undefined) ?? {};
    try {
        if (typeof api.requestPermission === 'function') {
            const result = await api.requestPermission();
            if (result !== 'granted') return setStatus('denied');
        }
        listen();
    } catch {
        setStatus('denied');
    }
}

function isTouchOnly() {
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

const subscribe = (fn: () => void) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
};

// Starts tilt where no permission is needed; otherwise reports
// 'needs-permission' so the page can offer a button that calls enableTilt().
export function useDeviceTilt(enabled = true): TiltStatus {
    const current = useSyncExternalStore(subscribe, () => status, () => 'idle' as TiltStatus);

    useEffect(() => {
        if (!enabled || status !== 'idle') return;
        if (!isTouchOnly() || typeof window.DeviceOrientationEvent === 'undefined') {
            setStatus('unsupported');
            return;
        }
        const api = window.DeviceOrientationEvent as unknown as PermissionAPI;
        if (typeof api.requestPermission === 'function') setStatus('needs-permission');
        else listen();
    }, [enabled]);

    return current;
}
